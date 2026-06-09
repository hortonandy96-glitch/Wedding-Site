/* =========================================================================
   Personal RSVP page (rsvp.html?code=XXXX).

   Flow: read the invite code from the link → look up the household →
   show one yes/no + meal block per guest → submit → done.

   Like the admin page, this talks to a small "guest store" with two
   interchangeable implementations:
     demo — reads/writes the shared sample data (js/demo-data.js), so a
            demo RSVP shows up in the demo admin dashboard
     live — calls the two database functions created in supabase/setup.sql
            (rsvp_lookup / rsvp_submit). Those functions are the ONLY thing
            an anonymous visitor can do, and both require a valid code.
   ========================================================================= */

(function () {
  "use strict";

  var CONTENT = window.SITE_CONTENT;
  var V = window.RsvpValidate;

  /* ---------------- guest store ----------------------------------------- */

  function isConfigured() {
    var c = window.SUPABASE_CONFIG || {};
    return c.url && c.url.indexOf("supabase.co") !== -1 && c.anonKey && c.anonKey.length > 40;
  }

  var DemoGuestStore = {
    mode: "demo",
    lookup: function (code) {
      var hh = window.DemoData.load().find(function (h) {
        return h.code === String(code).trim().toLowerCase();
      });
      if (!hh) return Promise.resolve(null);
      return Promise.resolve({
        household_name: hh.name,
        responded_at: hh.responded_at,
        rsvp_message: hh.rsvp_message,
        guests: hh.guests.map(function (g) {
          return { id: g.id, name: g.name, rsvp_status: g.rsvp_status, meal: g.meal };
        }),
      });
    },
    submit: function (code, responses, message) {
      var data = window.DemoData.load();
      var hh = data.find(function (h) { return h.code === code; });
      if (!hh) return Promise.resolve(false);
      responses.forEach(function (r) {
        hh.guests.forEach(function (g) {
          if (g.id === r.id) {
            g.rsvp_status = r.rsvp_status;
            g.meal = r.meal || "";
          }
        });
      });
      hh.responded_at = new Date().toISOString();
      if (message) hh.rsvp_message = message;
      window.DemoData.save(data);
      return Promise.resolve(true);
    },
  };

  function makeLiveGuestStore() {
    var client = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );
    return {
      mode: "live",
      lookup: function (code) {
        return client.rpc("rsvp_lookup", { invite_code: code }).then(function (res) {
          if (res.error) throw new Error(res.error.message);
          return res.data; // null when the code doesn't match anything
        });
      },
      submit: function (code, responses, message) {
        return client
          .rpc("rsvp_submit", {
            invite_code: code,
            responses: responses,
            message: message || null,
          })
          .then(function (res) {
            if (res.error) throw new Error(res.error.message);
            return res.data === true;
          });
      },
    };
  }

  var store = isConfigured() && window.supabase ? makeLiveGuestStore() : DemoGuestStore;

  /* ---------------- view helpers ----------------------------------------- */

  var views = ["loading-view", "code-view", "form-view", "done-view"];
  function show(id) {
    views.forEach(function (v) {
      document.getElementById(v).hidden = v !== id;
    });
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var currentCode = null;
  var currentHousehold = null;

  /* ---------------- form rendering --------------------------------------- */

  function mealOptionsHtml(selected) {
    return CONTENT.mealOptions.map(function (m) {
      return '<option value="' + escapeHtml(m) + '"' + (m === selected ? " selected" : "") + ">" +
        escapeHtml(m) + "</option>";
    }).join("");
  }

  function renderForm(hh) {
    currentHousehold = hh;
    document.getElementById("household-name").textContent = hh.household_name;

    var note = document.getElementById("updated-note");
    if (hh.responded_at) {
      note.hidden = false;
      note.textContent = "You already replied on " +
        new Date(hh.responded_at).toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
        " — feel free to update your answer below.";
    } else {
      note.hidden = true;
    }

    var rows = document.getElementById("party-rows");
    rows.innerHTML = "";
    hh.guests.forEach(function (g, i) {
      var block = document.createElement("fieldset");
      block.className = "guest-block";
      block.dataset.guest = g.id;
      var yesId = "yes-" + i, noId = "no-" + i, mealId = "meal-" + i;
      block.innerHTML =
        "<legend>" + escapeHtml(g.name) + "</legend>" +
        '<div class="radio-row">' +
        '<label class="radio-pill"><input type="radio" name="att-' + i + '" id="' + yesId + '" value="yes"' +
        (g.rsvp_status === "yes" ? " checked" : "") + " /> Joyfully accepts</label>" +
        '<label class="radio-pill"><input type="radio" name="att-' + i + '" id="' + noId + '" value="no"' +
        (g.rsvp_status === "no" ? " checked" : "") + " /> Regretfully declines</label>" +
        "</div>" +
        '<div class="form-row meal-row"' + (g.rsvp_status === "yes" ? "" : " hidden") + ">" +
        '<label for="' + mealId + '">Dinner choice</label>' +
        '<select id="' + mealId + '"><option value="">Choose a dinner…</option>' +
        mealOptionsHtml(g.meal) + "</select></div>" +
        '<p class="field-error" aria-live="polite"></p>';
      rows.appendChild(block);
    });

    document.getElementById("party-message").value = hh.rsvp_message || "";
    show("form-view");
  }

  // Show/hide the meal picker as guests toggle yes/no
  document.getElementById("party-rows").addEventListener("change", function (e) {
    if (e.target.type !== "radio") return;
    var block = e.target.closest(".guest-block");
    block.querySelector(".meal-row").hidden = e.target.value !== "yes";
  });

  /* ---------------- submit ----------------------------------------------- */

  function readResponses() {
    var responses = [];
    document.querySelectorAll(".guest-block").forEach(function (block) {
      var checked = block.querySelector("input[type=radio]:checked");
      responses.push({
        id: block.dataset.guest,
        rsvp_status: checked ? checked.value : "pending",
        meal: checked && checked.value === "yes" ? block.querySelector("select").value : "",
      });
    });
    return responses;
  }

  document.getElementById("party-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var responses = readResponses();
    var result = V.validateHouseholdResponses(responses, CONTENT.mealOptions);

    // Show per-guest errors next to the guest they belong to
    document.querySelectorAll(".guest-block").forEach(function (block) {
      block.querySelector(".field-error").textContent =
        result.errors[block.dataset.guest] || "";
    });
    if (!result.valid) {
      document.getElementById("party-error").textContent =
        "Almost there — check the highlighted guests above.";
      return;
    }
    document.getElementById("party-error").textContent = "";

    var btn = document.getElementById("party-submit");
    btn.disabled = true;
    btn.textContent = "Sending…";

    store
      .submit(currentCode, responses, document.getElementById("party-message").value.trim())
      .then(function (ok) {
        if (!ok) throw new Error("That invite code stopped working — try the link again?");
        renderDone(responses);
      })
      .catch(function (err) {
        document.getElementById("party-error").textContent =
          "Couldn't send your RSVP: " + err.message;
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = "Send RSVP";
      });
  });

  function renderDone(responses) {
    var byId = {};
    currentHousehold.guests.forEach(function (g) { byId[g.id] = g.name; });
    var anyYes = responses.some(function (r) { return r.rsvp_status === "yes"; });

    var html = anyYes
      ? "<p>We can't wait to see you on <strong>May 21, 2027</strong>! Here's what we have:</p>"
      : "<p>We'll miss you — thank you so much for letting us know.</p>";
    html += "<ul>";
    responses.forEach(function (r) {
      html += "<li><strong>" + escapeHtml(byId[r.id]) + "</strong> — " +
        (r.rsvp_status === "yes" ? "attending · " + escapeHtml(r.meal) : "declined") + "</li>";
    });
    html += "</ul><p>Plans change? Scan your QR code again any time before April 21, 2027 to update this.</p>";

    document.getElementById("done-body").innerHTML = html;
    show("done-view");
    document.getElementById("done-view").focus();
  }

  document.getElementById("change-answer").addEventListener("click", function () {
    loadCode(currentCode);
  });

  /* ---------------- boot: read code from the link ------------------------ */

  function loadCode(code) {
    currentCode = String(code || "").trim().toLowerCase();
    show("loading-view");
    store
      .lookup(currentCode)
      .then(function (hh) {
        if (hh) {
          renderForm(hh);
        } else {
          document.getElementById("code-message").textContent =
            "Hmm, we couldn't find that invite. Double-check the code on your invitation and try again.";
          show("code-view");
          document.getElementById("code-input").focus();
        }
      })
      .catch(function (err) {
        document.getElementById("code-error").textContent =
          "Something went wrong: " + err.message;
        show("code-view");
      });
  }

  document.getElementById("code-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var code = document.getElementById("code-input").value;
    if (!code.trim()) {
      document.getElementById("code-error").textContent = "Please enter your invite code.";
      return;
    }
    document.getElementById("code-error").textContent = "";
    loadCode(code);
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get("code")) {
    loadCode(params.get("code"));
  } else {
    show("code-view");
  }
})();
