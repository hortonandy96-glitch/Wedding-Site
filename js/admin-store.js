/* =========================================================================
   Data layer for the admin dashboard.

   The dashboard UI (admin.js) never talks to Supabase or localStorage
   directly — it talks to a "store" object with a fixed set of methods.
   There are two interchangeable stores:

     DemoStore     — sample data in your browser's localStorage, so you can
                     try the dashboard before creating a Supabase account.
     SupabaseStore — the real thing, used automatically once
                     js/supabase-config.js is filled in.

   Both implement the same methods:
     mode                          "demo" | "live"
     hasSession()  -> Promise<bool>   is the admin signed in?
     signIn(email, password)          throws Error with friendly message
     signOut()
     fetchAll()    -> Promise<[household, …]> each with .guests array
     saveHousehold(obj)               insert (no id) or update (with id)
     deleteHousehold(id)
     saveGuest(obj)                   insert (no id) or update (with id)
     deleteGuest(id)
   ========================================================================= */

(function () {
  "use strict";

  function isConfigured() {
    var c = window.SUPABASE_CONFIG || {};
    return c.url && c.url.indexOf("supabase.co") !== -1 && c.anonKey && c.anonKey.length > 40;
  }

  /* ---------------- demo store (localStorage) --------------------------- */
  /* Sample data lives in js/demo-data.js, shared with the guest RSVP page */

  function demoLoad() { return window.DemoData.load(); }
  function demoSave(data) { window.DemoData.save(data); }
  function newId(prefix) { return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 1e4); }

  var DemoStore = {
    mode: "demo",
    hasSession: function () {
      return Promise.resolve(sessionStorage.getItem("demo-admin") === "1");
    },
    signIn: function () {
      // Demo mode: any credentials work; session lasts until the tab closes.
      sessionStorage.setItem("demo-admin", "1");
      return Promise.resolve();
    },
    signOut: function () {
      sessionStorage.removeItem("demo-admin");
      return Promise.resolve();
    },
    fetchAll: function () { return Promise.resolve(demoLoad()); },
    saveHousehold: function (obj) {
      var data = demoLoad();
      if (obj.id) {
        data = data.map(function (h) {
          return h.id === obj.id ? Object.assign({}, h, obj) : h;
        });
      } else {
        obj.id = newId("hh");
        obj.code = "demo" + Math.random().toString(36).slice(2, 8);
        obj.guests = [];
        data.push(obj);
      }
      demoSave(data);
      return Promise.resolve(obj);
    },
    deleteHousehold: function (id) {
      demoSave(demoLoad().filter(function (h) { return h.id !== id; }));
      return Promise.resolve();
    },
    saveGuest: function (obj) {
      var data = demoLoad();
      data.forEach(function (h) {
        if (h.id !== obj.household_id) return;
        if (obj.id) {
          h.guests = h.guests.map(function (g) {
            return g.id === obj.id ? Object.assign({}, g, obj) : g;
          });
        } else {
          obj.id = newId("g");
          h.guests.push(obj);
        }
      });
      demoSave(data);
      return Promise.resolve(obj);
    },
    deleteGuest: function (id) {
      var data = demoLoad();
      data.forEach(function (h) {
        h.guests = h.guests.filter(function (g) { return g.id !== id; });
      });
      demoSave(data);
      return Promise.resolve();
    },
    sendReminders: function (messages) {
      // Demo mode: pretend the emails went out and stamp reminder_sent_at.
      var data = demoLoad();
      var now = new Date().toISOString();
      messages.forEach(function (m) {
        data.forEach(function (h) {
          if (h.id === m.household_id) h.reminder_sent_at = now;
        });
      });
      demoSave(data);
      return Promise.resolve({
        sent: messages.length,
        failed: 0,
        demo: true,
      });
    },
  };

  /* ---------------- live store (Supabase) ------------------------------- */

  function makeSupabaseStore() {
    var client = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );

    // Supabase returns { data, error }; this raises errors instead so the
    // UI can catch them in one place.
    function unwrap(promise) {
      return promise.then(function (res) {
        if (res.error) throw new Error(res.error.message);
        return res.data;
      });
    }

    return {
      mode: "live",
      client: client,
      hasSession: function () {
        return client.auth.getSession().then(function (res) {
          return !!(res.data && res.data.session);
        });
      },
      signIn: function (email, password) {
        return client.auth
          .signInWithPassword({ email: email, password: password })
          .then(function (res) {
            if (res.error) {
              throw new Error(
                res.error.message === "Invalid login credentials"
                  ? "Email or password didn't match. Try again?"
                  : res.error.message
              );
            }
          });
      },
      signOut: function () { return client.auth.signOut(); },
      fetchAll: function () {
        return unwrap(
          client
            .from("households")
            .select("*, guests(*)")
            .order("name")
            .order("created_at", { referencedTable: "guests" })
        );
      },
      saveHousehold: function (obj) {
        var row = {
          name: obj.name, email: obj.email, phone: obj.phone, notes: obj.notes,
          plus_one_allowed: !!obj.plus_one_allowed,
        };
        if (obj.id) {
          return unwrap(client.from("households").update(row).eq("id", obj.id).select());
        }
        return unwrap(client.from("households").insert(row).select());
      },
      deleteHousehold: function (id) {
        // Deleting a household also deletes its guests ("on delete cascade")
        return unwrap(client.from("households").delete().eq("id", id));
      },
      saveGuest: function (obj) {
        var row = {
          household_id: obj.household_id, name: obj.name,
          rsvp_status: obj.rsvp_status || "pending",
          dietary: obj.dietary || null, notes: obj.notes || null,
        };
        if (obj.id) {
          return unwrap(client.from("guests").update(row).eq("id", obj.id).select());
        }
        return unwrap(client.from("guests").insert(row).select());
      },
      deleteGuest: function (id) {
        return unwrap(client.from("guests").delete().eq("id", id));
      },
      sendReminders: function (messages) {
        // Calls the Supabase Edge Function (supabase/functions/send-reminders),
        // which holds the Resend API key as a server-side secret. supabase-js
        // automatically attaches your signed-in session token, which the
        // function verifies before sending anything.
        return client.functions
          .invoke("send-reminders", { body: { messages: messages } })
          .then(function (res) {
            if (res.error) throw new Error(res.error.message || "Reminder service failed");
            return res.data;
          });
      },
    };
  }

  window.AdminStore = {
    create: function () {
      if (isConfigured() && window.supabase) return makeSupabaseStore();
      return DemoStore;
    },
  };
})();
