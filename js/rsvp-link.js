/* =========================================================================
   Personal RSVP page (rsvp.html?code=XXXX).

   Flow: read the invite code from the link → look up the household →
   show one yes/no block per guest (with optional dietary restrictions) →
   optional plus one if the household is allowed one → submit → done.

   Dinner is served from stations, so there are no meal choices.

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

  var UNMATCHED_KEY = "demo-unmatched-rsvps";

  var DemoGuestStore = {
    mode: "demo",
    search: function (query) {
      var q = String(query || "").trim().toLowerCase();
      if (q.length < 2) return Promise.resolve([]);
      var results = [];
      window.DemoData.load().forEach(function (h) {
        (h.guests || []).forEach(function (g) {
          if (results.length < 8 && g.name.toLowerCase().indexOf(q) !== -1) {
            results.push({ guest_name: g.name, household_name: h.name, code: h.code });
          }
        });
      });
      return Promise.resolve(results);
    },
    submitUnmatched: function (data) {
      var all = [];
      try { all = JSON.parse(localStorage.getItem(UNMATCHED_KEY)) || []; } catch (e) {}
      data.id = "um-" + Date.now();
      data.created_at = new Date().toISOString();
      all.push(data);
      localStorage.setItem(UNMATCHED_KEY, JSON.stringify(all));
      return Promise.resolve(true);
    },
    lookup: function (code) {
      var hh = window.DemoData.load().find(function (h) {
        return h.code === String(code).trim().toLowerCase();
      });
      if (!hh) return Promise.resolve(null);
      return Promise.resolve({
        household_name: hh.name,
        responded_at: hh.responded_at,
        rsvp_message: hh.rsvp_message,
        plus_one_allowed: !!hh.plus_one_allowed,
        has_plus_one: (hh.guests || []).some(function (g) { return g.is_plus_one; }),
        guests: hh.guests.map(function (g) {
          return {
            id: g.id, name: g.name, rsvp_status: g.rsvp_status,
            dietary: g.dietary || "", is_plus_one: !!g.is_plus_one,
          };
        }),
      });
    },
    submit: function (code, responses, message, plusOne) {
      var data = window.DemoData.load();
      var hh = data.find(function (h) { return h.code === code; });
      if (!hh) return Promise.resolve(false);
      responses.forEach(function (r) {
        hh.guests.forEach(function (g) {
          if (g.id === r.id) {
            g.rsvp_status = r.rsvp_status;
            g.dietary = r.dietary || "";
          }
        });
      });
      var alreadyHasPlusOne = hh.guests.some(function (g) { return g.is_plus_one; });
      if (plusOne && hh.plus_one_allowed && !alreadyHasPlusOne) {
        hh.guests.push({
          id: "g-" + Date.now(), household_id: hh.id, name: plusOne.name,
          rsvp_status: "yes", dietary: plusOne.dietary || "",
          notes: "", is_plus_one: true,
        });
      }
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
      search: function (query) {
        return client.rpc("rsvp_search", { query: query }).then(function (res) {
          if (res.error) throw new Error(res.error.message);
          return res.data || [];
        });
      },
      submitUnmatched: function (data) {
        return client
          .rpc("rsvp_submit_unmatched", {
            guest_name: data.name,
            email: data.email || null,
            attending: data.attending,
            party_names: data.party_names || null,
            dietary: data.dietary || null,
            message: data.message || null,
          })
          .then(function (res) {
            if (res.error) throw new Error(res.error.message);
            return res.data === true;
          });
      },
      lookup: function (code) {
        return client.rpc("rsvp_lookup", { invite_code: code }).then(function (res) {
          if (res.error) throw new Error(res.error.message);
          return res.data; // null when the code doesn't match anything
        });
      },
      submit: function (code, responses, message, plusOne) {
        return client
          .rpc("rsvp_submit", {
            invite_code: code,
            responses: responses,
            message: message || null,
            plus_one: plusOne || null,
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

  var views = ["loading-view", "search-view", "unmatched-view", "form-view", "done-view"];
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
      var yesId = "yes-" + i, noId = "no-" + i, dietId = "diet-" + i;
      block.innerHTML =
        "<legend>" + escapeHtml(g.name) + (g.is_plus_one ? " <em>(plus one)</em>" : "") + "</legend>" +
        '<div class="radio-row">' +
        '<label class="radio-pill"><input type="radio" name="att-' + i + '" id="' + yesId + '" value="yes"' +
        (g.rsvp_status === "yes" ? " checked" : "") + " /> Joyfully accepts</label>" +
        '<label class="radio-pill"><input type="radio" name="att-' + i + '" id="' + noId + '" value="no"' +
        (g.rsvp_status === "no" ? " checked" : "") + " /> Regretfully declines</label>" +
        "</div>" +
        '<div class="form-row dietary-row"' + (g.rsvp_status === "yes" ? "" : " hidden") + ">" +
        '<label for="' + dietId + '">' + escapeHtml(CONTENT.dietaryPrompt) + "</label>" +
        '<input type="text" id="' + dietId + '" value="' + escapeHtml(g.dietary || "") +
        '" placeholder="' + escapeHtml(CONTENT.dietaryPlaceholder) + '" />' +
        "</div>" +
        '<p class="field-error" aria-live="polite"></p>';
      rows.appendChild(block);
    });

    // Plus one: offered only when the admin allowed it for this household
    // and one hasn't been added yet (added plus ones show as normal guests).
    var plusOneWrap = document.getElementById("plus-one-wrap");
    plusOneWrap.hidden = !(hh.plus_one_allowed && !hh.has_plus_one);
    document.getElementById("link-has-plus-one").checked = false;
    document.getElementById("link-plus-one-fields").hidden = true;
    document.getElementById("link-plus-one-name").value = "";
    document.getElementById("link-plus-one-dietary").value = "";

    document.getElementById("party-message").value = hh.rsvp_message || "";
    show("form-view");
  }

  // Show/hide each guest's dietary box as they toggle yes/no
  document.getElementById("party-rows").addEventListener("change", function (e) {
    if (e.target.type !== "radio") return;
    var block = e.target.closest(".guest-block");
    block.querySelector(".dietary-row").hidden = e.target.value !== "yes";
  });

  document.getElementById("link-has-plus-one").addEventListener("change", function (e) {
    document.getElementById("link-plus-one-fields").hidden = !e.target.checked;
    if (e.target.checked) document.getElementById("link-plus-one-name").focus();
  });

  /* ---------------- submit ----------------------------------------------- */

  function readResponses() {
    var responses = [];
    document.querySelectorAll(".guest-block").forEach(function (block) {
      var checked = block.querySelector("input[type=radio]:checked");
      responses.push({
        id: block.dataset.guest,
        rsvp_status: checked ? checked.value : "pending",
        dietary: checked && checked.value === "yes"
          ? block.querySelector(".dietary-row input").value.trim()
          : "",
      });
    });
    return responses;
  }

  function readPlusOne() {
    if (document.getElementById("plus-one-wrap").hidden) return null;
    if (!document.getElementById("link-has-plus-one").checked) return null;
    return {
      name: document.getElementById("link-plus-one-name").value.trim(),
      dietary: document.getElementById("link-plus-one-dietary").value.trim(),
    };
  }

  document.getElementById("party-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var responses = readResponses();
    var plusOne = readPlusOne();
    var result = V.validateHouseholdResponses(responses, plusOne);

    // Show per-guest errors next to the guest they belong to
    document.querySelectorAll(".guest-block").forEach(function (block) {
      block.querySelector(".field-error").textContent =
        result.errors[block.dataset.guest] || "";
    });
    document.getElementById("plus-one-error").textContent = result.errors.plusOne || "";
    if (!result.valid) {
      document.getElementById("party-error").textContent =
        "Almost there — check the highlighted spots above.";
      return;
    }
    document.getElementById("party-error").textContent = "";

    var btn = document.getElementById("party-submit");
    btn.disabled = true;
    btn.textContent = "Sending…";

    store
      .submit(currentCode, responses, document.getElementById("party-message").value.trim(), plusOne)
      .then(function (ok) {
        if (!ok) throw new Error("That invite code stopped working — try the link again?");
        renderDone(responses, plusOne);
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

  function renderDone(responses, plusOne) {
    var byId = {};
    currentHousehold.guests.forEach(function (g) { byId[g.id] = g.name; });
    var anyYes = plusOne || responses.some(function (r) { return r.rsvp_status === "yes"; });

    var html = anyYes
      ? "<p>We can't wait to see you on <strong>May 21, 2027</strong>! Here's what we have:</p>"
      : "<p>We'll miss you — thank you so much for letting us know.</p>";
    html += "<ul>";
    responses.forEach(function (r) {
      html += "<li><strong>" + escapeHtml(byId[r.id]) + "</strong> — " +
        (r.rsvp_status === "yes"
          ? "attending" + (r.dietary ? " · " + escapeHtml(r.dietary) : "")
          : "declined") + "</li>";
    });
    if (plusOne) {
      html += "<li><strong>" + escapeHtml(plusOne.name) + "</strong> — attending (plus one)" +
        (plusOne.dietary ? " · " + escapeHtml(plusOne.dietary) : "") + "</li>";
    }
    html += "</ul><p>Dinner is served from food stations — there will be plenty for everyone, vegetarians very much included.</p>" +
      "<p>Plans change? Scan your QR code again any time before April 21, 2027 to update this.</p>";

    document.getElementById("done-body").innerHTML = html;
    show("done-view");
    document.getElementById("done-view").focus();
  }

  document.getElementById("change-answer").addEventListener("click", function () {
    loadCode(currentCode);
  });

  /* ---------------- guided fill box (name search) ------------------------ */
  /* An accessible combobox: as the guest types, store.search() suggests
     matching names from the guest list; choosing one opens that
     household's RSVP form. */

  var searchInput = document.getElementById("search-input");
  var resultsList = document.getElementById("search-results");
  var searchTimer = null;
  var activeIndex = -1;
  var currentResults = [];

  function renderResults(results) {
    currentResults = results;
    activeIndex = -1;
    resultsList.innerHTML = "";
    if (results.length === 0) {
      closeResults();
      if (searchInput.value.trim().length >= 2) {
        document.getElementById("search-error").textContent =
          "No match yet — check the spelling, or use the link below.";
      }
      return;
    }
    document.getElementById("search-error").textContent = "";
    results.forEach(function (r, i) {
      var li = document.createElement("li");
      li.id = "search-option-" + i;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      li.innerHTML =
        "<strong>" + escapeHtml(r.guest_name) + "</strong>" +
        '<span class="search-household">' + escapeHtml(r.household_name) + "</span>";
      li.addEventListener("mousedown", function (e) {
        e.preventDefault(); // fires before the input loses focus
        pickResult(i);
      });
      resultsList.appendChild(li);
    });
    resultsList.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  }

  function closeResults() {
    resultsList.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
  }

  function pickResult(i) {
    var r = currentResults[i];
    if (!r) return;
    closeResults();
    searchInput.value = r.guest_name;
    loadCode(r.code);
  }

  function setActive(i) {
    var options = resultsList.querySelectorAll("[role=option]");
    if (options.length === 0) return;
    activeIndex = (i + options.length) % options.length;
    options.forEach(function (opt, idx) {
      var active = idx === activeIndex;
      opt.setAttribute("aria-selected", String(active));
      opt.classList.toggle("active", active);
    });
    searchInput.setAttribute("aria-activedescendant", "search-option-" + activeIndex);
  }

  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);
    var q = searchInput.value;
    if (q.trim().length < 2) {
      closeResults();
      document.getElementById("search-error").textContent = "";
      return;
    }
    // Debounce: wait until the guest pauses typing before searching
    searchTimer = setTimeout(function () {
      store.search(q).then(renderResults).catch(function (err) {
        document.getElementById("search-error").textContent =
          "Search hiccup: " + err.message;
      });
    }, 250);
  });

  searchInput.addEventListener("keydown", function (e) {
    if (resultsList.hidden) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(activeIndex + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(activeIndex - 1); }
    else if (e.key === "Enter") {
      e.preventDefault();
      pickResult(activeIndex === -1 ? 0 : activeIndex);
    }
    else if (e.key === "Escape") { closeResults(); }
  });

  searchInput.addEventListener("blur", function () {
    setTimeout(closeResults, 150);
  });

  /* ---------------- unmatched RSVP fallback ------------------------------ */

  document.getElementById("show-unmatched").addEventListener("click", function () {
    document.getElementById("um-name").value = searchInput.value.trim();
    show("unmatched-view");
    document.getElementById("um-name").focus();
  });

  document.getElementById("um-back").addEventListener("click", function () {
    show("search-view");
    searchInput.focus();
  });

  document.getElementById("unmatched-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var data = {
      name: document.getElementById("um-name").value.trim(),
      email: document.getElementById("um-email").value.trim(),
      attending: document.querySelector('input[name="um-attending"]:checked').value,
      party_names: document.getElementById("um-party").value.trim(),
      dietary: document.getElementById("um-dietary").value.trim(),
      message: document.getElementById("um-message").value.trim(),
    };
    var ok = true;
    if (!V.validateName(data.name)) {
      document.getElementById("um-name-error").textContent = "Please enter your full name.";
      ok = false;
    } else {
      document.getElementById("um-name-error").textContent = "";
    }
    if (data.email && !V.validateEmail(data.email)) {
      document.getElementById("um-email-error").textContent =
        "That email doesn't look right — mind double-checking?";
      ok = false;
    } else {
      document.getElementById("um-email-error").textContent = "";
    }
    if (!ok) return;

    var btn = document.getElementById("um-submit");
    btn.disabled = true;
    btn.textContent = "Sending…";
    store
      .submitUnmatched(data)
      .then(function (sent) {
        if (!sent) throw new Error("the server said no — try once more?");
        document.getElementById("done-body").innerHTML =
          data.attending === "yes"
            ? "<p>Thank you, <strong>" + escapeHtml(data.name) + "</strong>! Robin &amp; Andy " +
              "got your RSVP and will match it to the guest list — if anything needs " +
              "clarifying they'll reach out" + (data.email ? " at " + escapeHtml(data.email) : "") + ".</p>"
            : "<p>We'll miss you, <strong>" + escapeHtml(data.name) + "</strong> — thank you for letting us know.</p>";
        show("done-view");
        document.getElementById("done-view").focus();
      })
      .catch(function (err) {
        document.getElementById("um-error").textContent =
          "Couldn't send your RSVP: " + err.message;
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = "Send RSVP";
      });
  });

  /* ---------------- boot: QR links carry ?code=, others search by name --- */

  function loadCode(code) {
    currentCode = String(code || "").trim().toLowerCase();
    show("loading-view");
    store
      .lookup(currentCode)
      .then(function (hh) {
        if (hh) {
          renderForm(hh);
        } else {
          document.getElementById("search-message").textContent =
            "That invite link didn't match — but no worries, just type your name instead.";
          show("search-view");
          searchInput.focus();
        }
      })
      .catch(function (err) {
        document.getElementById("search-error").textContent =
          "Something went wrong: " + err.message;
        show("search-view");
      });
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("code")) {
    loadCode(params.get("code"));
  } else {
    show("search-view");
  }
})();
