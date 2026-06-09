/* =========================================================================
   Public RSVP form (index.html): attendance, optional plus one, dietary
   restrictions, localStorage persistence, confirmation, print & download,
   saved-RSVP list.

   Dinner is served from stations, so there are no meal choices — just an
   optional dietary-restrictions box (one for you, one for your plus one).

   BACKEND INTEGRATION: this form saves to this browser's localStorage only.
   Invited guests normally RSVP through their personal QR link (rsvp.html),
   which writes to the real database. To wire THIS form to the database too,
   replace saveRsvp() / loadRsvps() below.
   ========================================================================= */

(function () {
  "use strict";

  var STORAGE_KEY = "robin-andy-rsvps";
  var V = window.RsvpValidate;

  var form = document.getElementById("rsvp-form");
  if (!form) return;

  var els = {
    name: document.getElementById("rsvp-name"),
    email: document.getElementById("rsvp-email"),
    dietary: document.getElementById("rsvp-dietary"),
    dietaryRow: document.getElementById("dietary-row"),
    hasPlusOne: document.getElementById("rsvp-has-plus-one"),
    plusOneFieldset: document.getElementById("plus-one-fieldset"),
    plusOneFields: document.getElementById("plus-one-fields"),
    plusOneName: document.getElementById("rsvp-plus-one-name"),
    plusOneDietary: document.getElementById("rsvp-plus-one-dietary"),
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

  /* ---------------- show/hide follow-up fields -------------------------- */

  function isAttending() {
    return form.querySelector('input[name="attending"]:checked').value === "yes";
  }

  function togglePlusOneFields() {
    els.plusOneFields.hidden = !els.hasPlusOne.checked;
    if (els.hasPlusOne.checked) els.plusOneName.focus();
  }

  function toggleAttendingFields() {
    var attending = isAttending();
    els.dietaryRow.hidden = !attending;
    els.plusOneFieldset.hidden = !attending;
  }

  /* ---------------- validation UI -------------------------------------- */

  function showErrors(errors) {
    setError("err-name", errors.name);
    setError("err-email", errors.email);
    setError("err-plus-one", errors.plusOneName);
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

  function partyLines(rsvp) {
    var lines = [rsvp.name + (rsvp.dietary ? " — dietary: " + rsvp.dietary : "")];
    if (rsvp.hasPlusOne && rsvp.plusOneName) {
      lines.push(rsvp.plusOneName +
        (rsvp.plusOneDietary ? " — dietary: " + rsvp.plusOneDietary : "") + " (plus one)");
    }
    return lines;
  }

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
      partyLines(rsvp).forEach(function (line) { lines.push("  " + line); });
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
      partyLines(rsvp).forEach(function (line) {
        html += "<li>" + escapeHtml(line) + "</li>";
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
        r.name + " — " +
        (r.attending === "yes"
          ? "attending" + (r.hasPlusOne && r.plusOneName ? " +1" : "")
          : "declined");
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
    els.dietary.value = rsvp.dietary || "";
    els.hasPlusOne.checked = !!rsvp.hasPlusOne;
    els.plusOneName.value = rsvp.plusOneName || "";
    els.plusOneDietary.value = rsvp.plusOneDietary || "";
    els.message.value = rsvp.message || "";
    toggleAttendingFields();
    els.plusOneFields.hidden = !rsvp.hasPlusOne;
    form.scrollIntoView({ behavior: "smooth" });
    els.name.focus();
  }

  function resetForm() {
    editingId = null;
    form.reset();
    toggleAttendingFields();
    togglePlusOneFields();
    els.resetBtn.hidden = true;
    ["err-name", "err-email", "err-plus-one"].forEach(function (id) { setError(id, ""); });
  }

  /* ---------------- wire it up ------------------------------------------ */

  renderSavedList();

  els.hasPlusOne.addEventListener("change", togglePlusOneFields);
  form.querySelectorAll('input[name="attending"]').forEach(function (radio) {
    radio.addEventListener("change", toggleAttendingFields);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var rsvp = {
      id: editingId,
      attending: form.querySelector('input[name="attending"]:checked').value,
      name: els.name.value,
      email: els.email.value,
      hasPlusOne: isAttending() && els.hasPlusOne.checked,
      plusOneName: els.plusOneName.value,
      dietary: els.dietary.value.trim(),
      plusOneDietary: els.plusOneDietary.value.trim(),
      message: els.message.value.trim(),
      savedAt: new Date().toISOString(),
    };
    var result = V.validateRsvp(rsvp);
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

  toggleAttendingFields();
})();
