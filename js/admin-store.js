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
    // Unmatched RSVPs share storage with the guest page's demo mode
    fetchUnmatched: function () {
      try {
        return Promise.resolve(JSON.parse(localStorage.getItem("demo-unmatched-rsvps")) || []);
      } catch (e) {
        return Promise.resolve([]);
      }
    },
    deleteUnmatched: function (id) {
      var all = [];
      try { all = JSON.parse(localStorage.getItem("demo-unmatched-rsvps")) || []; } catch (e) {}
      localStorage.setItem(
        "demo-unmatched-rsvps",
        JSON.stringify(all.filter(function (u) { return u.id !== id; }))
      );
      return Promise.resolve();
    },
  };

  /* ---------------- demo planning suite (localStorage tables) ----------- */
  /* The planning tabs use the same small set of operations on four
     "tables"; in demo mode each table is one localStorage key. */

  function demoTable(key, seed) {
    function load() {
      try {
        var d = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(d)) return d;
      } catch (e) { /* reseed below */ }
      localStorage.setItem(key, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
    function save(rows) { localStorage.setItem(key, JSON.stringify(rows)); }
    return { load: load, save: save };
  }

  var demoPlanning = demoTable("demo-planning-rows", [
    { id: "pr-1", sheet: "checklist", position: 10, data: { done: true, task: "CELEBRATE! YOU'RE ENGAGED!", phase: "12+ Months" } },
    { id: "pr-2", sheet: "checklist", position: 20, data: { done: false, task: "Book your venue", phase: "9-12 Months" } },
    { id: "pr-3", sheet: "priorities", position: 10, data: { item: "Alcohol", rank: "5 - ABSOLUTELY", notes: "Open bar matters" } },
    { id: "pr-4", sheet: "wedding_party", position: 10, data: { group: "Couple", slot: "Partner #1", name: "Robin Beattie", role: "BRIDE!!" } },
    { id: "pr-5", sheet: "timeline", position: 10, data: { time: "4:00 PM", item: "Ceremony", vendors: "ALL" } },
    { id: "pr-6", sheet: "packing", position: 10, data: { category: "Personal Items", item: "Rings!", packed: false } },
    { id: "pr-7", sheet: "vendors", position: 10, data: { vendor_type: "Venue", company: "Salvage One", email: "events@example.com" } },
  ]);
  var demoBudgetItems = demoTable("demo-budget-items", [
    { id: "bi-1", name: "Wedding Venue", estimated: 7750, notes: "", position: 10 },
    { id: "bi-2", name: "Catering", estimated: 14700, notes: "", position: 20 },
    { id: "bi-3", name: "Photographer", estimated: 4278, notes: "", position: 30 },
  ]);
  var demoExpenses = demoTable("demo-expenses", [
    { id: "ex-1", budget_item_id: "bi-1", description: "Venue deposit", vendor: "Salvage One", amount: 2500, status: "paid", paid_date: "2026-05-01", paid_by: "Us", created_at: "2026-05-01T12:00:00Z" },
    { id: "ex-2", budget_item_id: "bi-1", description: "Venue balance", vendor: "Salvage One", amount: 5250, status: "planned", due_date: "2027-04-21", created_at: "2026-05-01T12:00:00Z" },
  ]);
  var demoSettings = demoTable("demo-settings", [
    { key: "budget_goal", value: "60000" },
    { key: "family_contribution", value: "60000" },
    { key: "monthly_contribution", value: "0" },
    { key: "savings_contribution", value: "0" },
  ]);

  function demoUpsert(table, row, prefix) {
    var rows = table.load();
    if (row.id) {
      rows = rows.map(function (r) { return r.id === row.id ? Object.assign({}, r, row) : r; });
    } else {
      row.id = prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 1e4);
      row.created_at = new Date().toISOString();
      rows.push(row);
    }
    table.save(rows);
    return Promise.resolve(row);
  }
  function demoDelete(table, id) {
    table.save(table.load().filter(function (r) { return r.id !== id; }));
    return Promise.resolve();
  }

  Object.assign(DemoStore, {
    planningFetch: function (sheet) {
      return Promise.resolve(
        demoPlanning.load()
          .filter(function (r) { return r.sheet === sheet; })
          .sort(function (a, b) { return a.position - b.position; })
      );
    },
    planningSave: function (row) { return demoUpsert(demoPlanning, row, "pr"); },
    planningDelete: function (id) { return demoDelete(demoPlanning, id); },
    budgetFetch: function () {
      return Promise.resolve({
        items: demoBudgetItems.load().sort(function (a, b) { return a.position - b.position; }),
        expenses: demoExpenses.load(),
        settings: demoSettings.load(),
      });
    },
    budgetSaveItem: function (item) { return demoUpsert(demoBudgetItems, item, "bi"); },
    budgetDeleteItem: function (id) { return demoDelete(demoBudgetItems, id); },
    expenseSave: function (e) { return demoUpsert(demoExpenses, e, "ex"); },
    expenseDelete: function (id) { return demoDelete(demoExpenses, id); },
    settingSave: function (key, value) {
      var rows = demoSettings.load().filter(function (r) { return r.key !== key; });
      rows.push({ key: key, value: String(value) });
      demoSettings.save(rows);
      return Promise.resolve();
    },
  });

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
      fetchUnmatched: function () {
        return unwrap(
          client.from("unmatched_rsvps").select("*").order("created_at", { ascending: false })
        );
      },
      deleteUnmatched: function (id) {
        return unwrap(client.from("unmatched_rsvps").delete().eq("id", id));
      },

      /* ---- planning suite (run migration-003 to create these tables) ---- */
      planningFetch: function (sheet) {
        return unwrap(
          client.from("planning_rows").select("*").eq("sheet", sheet).order("position")
        );
      },
      planningSave: function (row) {
        var record = { sheet: row.sheet, position: row.position, data: row.data };
        if (row.id) {
          return unwrap(client.from("planning_rows").update(record).eq("id", row.id).select());
        }
        return unwrap(client.from("planning_rows").insert(record).select());
      },
      planningDelete: function (id) {
        return unwrap(client.from("planning_rows").delete().eq("id", id));
      },
      budgetFetch: function () {
        return Promise.all([
          unwrap(client.from("budget_items").select("*").order("position")),
          unwrap(client.from("expenses").select("*").order("created_at", { ascending: false })),
          unwrap(client.from("planning_settings").select("*")),
        ]).then(function (res) {
          return { items: res[0], expenses: res[1], settings: res[2] };
        });
      },
      budgetSaveItem: function (item) {
        var record = {
          name: item.name, estimated: item.estimated || 0,
          notes: item.notes || null, position: item.position || 0,
        };
        if (item.id) {
          return unwrap(client.from("budget_items").update(record).eq("id", item.id).select());
        }
        return unwrap(client.from("budget_items").insert(record).select());
      },
      budgetDeleteItem: function (id) {
        return unwrap(client.from("budget_items").delete().eq("id", id));
      },
      expenseSave: function (e) {
        var record = {
          budget_item_id: e.budget_item_id || null,
          description: e.description, vendor: e.vendor || null,
          amount: e.amount || 0, status: e.status,
          due_date: e.due_date || null, paid_date: e.paid_date || null,
          paid_by: e.paid_by || null, notes: e.notes || null,
        };
        if (e.id) {
          return unwrap(client.from("expenses").update(record).eq("id", e.id).select());
        }
        return unwrap(client.from("expenses").insert(record).select());
      },
      expenseDelete: function (id) {
        return unwrap(client.from("expenses").delete().eq("id", id));
      },
      settingSave: function (key, value) {
        return unwrap(
          client.from("planning_settings").upsert({ key: key, value: String(value) }).select()
        );
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
