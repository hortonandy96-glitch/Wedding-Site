/* =========================================================================
   RSVP form behavior: dynamic guest rows, validation, localStorage
   persistence, confirmation, print & download, saved-RSVP list.

   BACKEND INTEGRATION: there is no server. RSVPs live in this browser's
   localStorage only. To collect RSVPs for real, replace saveRsvp() /
   loadRsvps() with fetch() calls to your API — they are the only two
   functions that touch storage.
   ========================================================================= */

(function () {
  "use strict";

  var STORAGE_KEY = "robin-andy-rsvps";
  var V = window.RsvpValidate;
  var CONTENT = window.SITE_CONTENT;

  var form = document.getElementById("rsvp-form");
  if (!form) return;

  var els = {
    name: document.getElementById("rsvp-name"),
    email: document.getElementById("rsvp-email"),
    party: document.getElementById("rsvp-party"),
    mealRows: document.getElementById("meal-rows"),
    mealFieldset: document.getElementById("meal-fieldset"),
    message: document.getElementById("rsvp-message"),
    confirmation: document.getElementById("rsvp-confirmation"),
    confirmationBody: document.getElementById("confirmation-body"),
    savedWrap: document.getElementById("rsvp-saved"),
    savedList: document.getElementById("rsvp-saved-list"),
    resetBtn: document.getElementById("rsvp-reset"),
  };

  var editingId = null; // id of the RSVP being edited, if any

  /* ---------------- storage (swap these two for a real backend) -------- */

  function loadRsvps() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveRsvp(rsvp) {
    // Simulates a successful API response; returns the saved record.
    var all = loadRsvps();
    if (rsvp.id) {
      all = all.map(function (r) { return r.id === rsvp.id ? rsvp : r; });
    } else {
      rsvp.id = "rsvp-" + Date.now();
      all.push(rsvp);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return rsvp;
  }

  function deleteRsvp(id) {
    var all = loadRsvps().filter(function (r) { return r.id !== id; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  /* ---------------- dynamic form pieces -------------------------------- */

  function populatePartySelect() {
    for (var i = 1; i <= V.MAX_PARTY_SIZE; i++) {
      var opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = i === 1 ? "Just me" : i + " people";
      els.party.appendChild(opt);
    }
  }

  function mealSelectHtml(idx, selected) {
    var opts = CONTENT.mealOptions.map(function (m) {
      var sel = m === selected ? " selected" : "";
      return '<option value="' + escapeHtml(m) + '"' + sel + ">" + escapeHtml(m) + "</option>";
    });
    return (
      '<select id="meal-' + idx + '" name="meal-' + idx + '" aria-label="Dinner choice for guest ' + (idx + 1) + '">' +
      '<option value="">Choose a dinner…</option>' + opts.join("") + "</select>"
    );
  }

  /** Render one name+meal row per guest, keeping any values already typed. */
  function renderMealRows() {
    var count = Number(els.party.value) || 1;
    var previous = readGuestRows();
    els.mealRows.innerHTML = "";

    for (var i = 0; i < count; i++) {
      var row = document.createElement("div");
      row.className = "guest-row";
      var prev = previous[i] || {};
      var nameField =
        i === 0
          ? '<span class="guest-label">You</span>'
          : '<input type="text" id="guest-name-' + i + '" placeholder="Guest ' + (i + 1) + " name\" " +
            'aria-label="Name of guest ' + (i + 1) + '" value="' + escapeHtml(prev.name || "") + '" />';
      row.innerHTML = nameField + mealSelectHtml(i, prev.meal || "");
      els.mealRows.appendChild(row);
    }
  }

  function readGuestRows() {
    var guests = [];
    var rows = els.mealRows.querySelectorAll(".guest-row");
    rows.forEach(function (row, i) {
      var nameInput = row.querySelector('input[type="text"]');
      var meal = row.querySelector("select");
      guests.push({
        name: i === 0 ? els.name.value : (nameInput ? nameInput.value : ""),
        meal: meal ? meal.value : "",
      });
    });
    return guests;
  }

  /* ---------------- validation UI -------------------------------------- */

  function showErrors(errors) {
    setError("err-name", errors.name);
    setError("err-email", errors.email);
    setError("err-party", errors.partySize);
    setError("err-meals", errors.meals);
    var firstError = document.querySelector(".field-error:not(:empty)");
    if (firstError) {
      var field = firstError.parentElement.querySelector("input, select");
      if (field) field.focus();
    }
  }

  function setError(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg || "";
  }

  /* ---------------- confirmation / print / download --------------------- */

  function buildSummaryText(rsvp) {
    var lines = [
      "RSVP — Robin & Andy's Wedding",
      "May 21, 2027 · Salvage One · Chicago, IL",
      "----------------------------------------",
      "Name:   " + rsvp.name,
      "Email:  " + rsvp.email,
      "Status: " + (rsvp.attending === "yes" ? "Joyfully accepts" : "Regretfully declines"),
    ];
    if (rsvp.attending === "yes") {
      lines.push("Party:  " + rsvp.partySize);
      rsvp.guests.forEach(function (g, i) {
        lines.push("  Guest " + (i + 1) + ": " + (g.name || rsvp.name) + " — " + g.meal);
      });
    }
    if (rsvp.message) lines.push("Note:   " + rsvp.message);
    lines.push("----------------------------------------");
    lines.push("Saved " + new Date(rsvp.savedAt).toLocaleString());
    return lines.join("\n");
  }

  function showConfirmation(rsvp) {
    var html = "";
    if (rsvp.attending === "yes") {
      html += "<p>Can't wait to see you, <strong>" + escapeHtml(rsvp.name) + "</strong>! Here's what we have:</p><ul>";
      rsvp.guests.forEach(function (g, i) {
        html += "<li>" + escapeHtml(g.name || rsvp.name) + " — " + escapeHtml(g.meal) + "</li>";
      });
      html += "</ul>";
      if (rsvp.message) html += "<p>Your note: “" + escapeHtml(rsvp.message) + "”</p>";
      html += "<p>Need to change something? Edit any time before April 21, 2027.</p>";
    } else {
      html += "<p>We'll miss you, <strong>" + escapeHtml(rsvp.name) + "</strong> — thanks for letting us know. 💚</p>";
    }
    els.confirmationBody.innerHTML = html;
    els.confirmation.hidden = false;
    form.hidden = true;
    els.confirmation.focus();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- saved list ------------------------------------------ */

  function renderSavedList() {
    var all = loadRsvps();
    els.savedWrap.hidden = all.length === 0;
    els.savedList.innerHTML = "";
    all.forEach(function (r) {
      var li = document.createElement("li");
      var label = document.createElement("span");
      label.textContent =
        r.name + " — " + (r.attending === "yes" ? "attending, party of " + r.partySize : "declined");
      var edit = document.createElement("button");
      edit.type = "button";
      edit.className = "btn btn-small";
      edit.textContent = "Edit";
      edit.setAttribute("aria-label", "Edit RSVP for " + r.name);
      edit.addEventListener("click", function () { startEdit(r); });
      var del = document.createElement("button");
      del.type = "button";
      del.className = "btn btn-small btn-danger";
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete RSVP for " + r.name);
      del.addEventListener("click", function () {
        if (confirm("Delete the RSVP for " + r.name + "?")) {
          deleteRsvp(r.id);
          renderSavedList();
        }
      });
      li.append(label, edit, del);
      els.savedList.appendChild(li);
    });
  }

  function startEdit(rsvp) {
    editingId = rsvp.id;
    form.hidden = false;
    els.confirmation.hidden = true;
    els.resetBtn.hidden = false;
    form.querySelector('input[name="attending"][value="' + rsvp.attending + '"]').checked = true;
    els.name.value = rsvp.name;
    els.email.value = rsvp.email;
    els.party.value = String(rsvp.partySize || 1);
    renderMealRows();
    (rsvp.guests || []).forEach(function (g, i) {
      var row = els.mealRows.querySelectorAll(".guest-row")[i];
      if (!row) return;
      var nameInput = row.querySelector('input[type="text"]');
      if (nameInput) nameInput.value = g.name || "";
      row.querySelector("select").value = g.meal || "";
    });
    els.message.value = rsvp.message || "";
    toggleMealVisibility();
    form.scrollIntoView({ behavior: "smooth" });
    els.name.focus();
  }

  function resetForm() {
    editingId = null;
    form.reset();
    els.party.value = "1";
    renderMealRows();
    toggleMealVisibility();
    els.resetBtn.hidden = true;
    ["err-name", "err-email", "err-party", "err-meals"].forEach(function (id) { setError(id, ""); });
  }

  function toggleMealVisibility() {
    var attending = form.querySelector('input[name="attending"]:checked').value === "yes";
    els.mealFieldset.hidden = !attending;
    els.party.closest(".form-row").hidden = !attending;
  }

  /* ---------------- wire it up ------------------------------------------ */

  populatePartySelect();
  renderMealRows();
  renderSavedList();

  els.party.addEventListener("change", renderMealRows);
  form.querySelectorAll('input[name="attending"]').forEach(function (radio) {
    radio.addEventListener("change", toggleMealVisibility);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var rsvp = {
      id: editingId,
      attending: form.querySelector('input[name="attending"]:checked').value,
      name: els.name.value,
      email: els.email.value,
      partySize: Number(els.party.value),
      guests: readGuestRows(),
      message: els.message.value.trim(),
      savedAt: new Date().toISOString(),
    };
    var result = V.validateRsvp(rsvp, CONTENT.mealOptions);
    showErrors(result.errors);
    if (!result.valid) return;

    var saved = saveRsvp(rsvp);
    editingId = null;
    renderSavedList();
    showConfirmation(saved);
    window.__lastRsvp = saved; // used by print/download buttons
  });

  els.resetBtn.addEventListener("click", resetForm);

  document.getElementById("rsvp-edit").addEventListener("click", function () {
    if (window.__lastRsvp) startEdit(window.__lastRsvp);
  });

  document.getElementById("rsvp-print").addEventListener("click", function () {
    document.body.classList.add("print-rsvp");
    window.print();
  });
  window.addEventListener("afterprint", function () {
    document.body.classList.remove("print-rsvp");
  });

  document.getElementById("rsvp-download").addEventListener("click", function () {
    if (!window.__lastRsvp) return;
    var blob = new Blob([buildSummaryText(window.__lastRsvp)], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rsvp-robin-and-andy.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  });

  toggleMealVisibility();
})();
