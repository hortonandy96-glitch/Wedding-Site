/* =========================================================================
   Admin dashboard UI. All data access goes through the store created by
   js/admin-store.js (demo or live — this file doesn't care which).
   ========================================================================= */

(function () {
  "use strict";

  var store = window.AdminStore.create();
  var CONTENT = window.SITE_CONTENT;

  var els = {
    loginView: document.getElementById("login-view"),
    dashView: document.getElementById("dashboard-view"),
    loginForm: document.getElementById("login-form"),
    loginError: document.getElementById("login-error"),
    demoHint: document.getElementById("demo-hint"),
    modeBadge: document.getElementById("mode-badge"),
    signOut: document.getElementById("sign-out"),
    summary: document.getElementById("summary-grid"),
    list: document.getElementById("household-list"),
    hhDialog: document.getElementById("household-dialog"),
    hhForm: document.getElementById("household-form"),
    gDialog: document.getElementById("guest-dialog"),
    gForm: document.getElementById("guest-form"),
  };

  var households = [];      // current data, refreshed after every change
  var editingHousehold = null;
  var editingGuest = null;

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- views ---------------------------------------------- */

  function showLogin() {
    els.loginView.hidden = false;
    els.dashView.hidden = true;
    els.signOut.hidden = true;
    document.getElementById("login-email").focus();
  }

  function showDashboard() {
    els.loginView.hidden = true;
    els.dashView.hidden = false;
    els.signOut.hidden = false;
    refresh();
  }

  function refresh() {
    store.fetchAll().then(function (data) {
      households = data || [];
      renderSummary();
      renderHouseholds();
    }).catch(function (err) {
      alert("Couldn't load the guest list: " + err.message);
    });
  }

  /* ---------------- summary cards --------------------------------------- */

  function renderSummary() {
    var guests = households.flatMap(function (h) { return h.guests || []; });
    var yes = guests.filter(function (g) { return g.rsvp_status === "yes"; });
    var no = guests.filter(function (g) { return g.rsvp_status === "no"; });
    var pending = guests.length - yes.length - no.length;
    var respondedHouseholds = households.filter(function (h) { return h.responded_at; }).length;

    var meals = {};
    yes.forEach(function (g) {
      if (g.meal) meals[g.meal] = (meals[g.meal] || 0) + 1;
    });
    var mealLines = Object.keys(meals).map(function (m) {
      return escapeHtml(m) + ": <strong>" + meals[m] + "</strong>";
    }).join("<br>") || "<em>No meals chosen yet</em>";

    els.summary.innerHTML =
      summaryCard("Invited", guests.length, households.length + " households") +
      summaryCard("Attending", yes.length, "🎉") +
      summaryCard("Declined", no.length, "") +
      summaryCard("Awaiting reply", pending, respondedHouseholds + "/" + households.length + " households responded") +
      '<div class="card summary-card summary-meals"><p class="summary-label">Meal counts</p><p class="summary-detail">' + mealLines + "</p></div>";
  }

  function summaryCard(label, n, detail) {
    return '<div class="card summary-card"><p class="summary-number">' + n +
      '</p><p class="summary-label">' + escapeHtml(label) +
      '</p><p class="summary-detail">' + detail + "</p></div>";
  }

  /* ---------------- household cards -------------------------------------- */

  var STATUS_LABEL = { pending: "Pending", yes: "Yes", no: "No" };

  function renderHouseholds() {
    els.list.innerHTML = "";
    if (households.length === 0) {
      els.list.innerHTML = '<p class="empty-note">No households yet — add your first one above.</p>';
      return;
    }
    households.forEach(function (h) {
      var card = document.createElement("article");
      card.className = "card household-card";

      var contact = [h.email, h.phone].filter(Boolean).map(escapeHtml).join(" · ");
      var respondedTag = h.responded_at
        ? '<span class="badge badge-green">responded</span>'
        : '<span class="badge">no reply yet</span>';

      var rows = (h.guests || []).map(function (g) {
        return (
          '<div class="guest-line" data-guest="' + g.id + '">' +
          '<span class="guest-name">' + escapeHtml(g.name) + "</span>" +
          '<span class="status status-' + g.rsvp_status + '">' + STATUS_LABEL[g.rsvp_status] + "</span>" +
          '<span class="guest-meal">' + escapeHtml(g.meal || "—") + "</span>" +
          '<span class="guest-notes">' + escapeHtml(g.notes || "") + "</span>" +
          '<span class="guest-actions">' +
          '<button type="button" class="btn btn-small" data-action="edit-guest" aria-label="Edit ' + escapeHtml(g.name) + '">Edit</button>' +
          '<button type="button" class="btn btn-small btn-danger" data-action="delete-guest" aria-label="Delete ' + escapeHtml(g.name) + '">✕</button>' +
          "</span></div>"
        );
      }).join("");

      card.innerHTML =
        '<div class="household-head">' +
        "<h2>" + escapeHtml(h.name) + " " + respondedTag + "</h2>" +
        '<div class="household-actions">' +
        '<button type="button" class="btn btn-small" data-action="add-guest">+ Guest</button>' +
        '<button type="button" class="btn btn-small" data-action="edit-household">Edit</button>' +
        '<button type="button" class="btn btn-small btn-danger" data-action="delete-household">Delete</button>' +
        "</div></div>" +
        (contact ? '<p class="household-contact">' + contact + "</p>" : "") +
        (h.notes ? '<p class="household-notes">📝 ' + escapeHtml(h.notes) + "</p>" : "") +
        (h.rsvp_message ? '<p class="household-message">💌 “' + escapeHtml(h.rsvp_message) + "”</p>" : "") +
        '<div class="guest-table" role="list">' +
        '<div class="guest-line guest-line-head" aria-hidden="true">' +
        "<span>Name</span><span>RSVP</span><span>Meal</span><span>Notes</span><span></span></div>" +
        rows + "</div>";

      card.dataset.household = h.id;
      els.list.appendChild(card);
    });
  }

  /* ---------------- dialogs --------------------------------------------- */

  function openHouseholdDialog(h) {
    editingHousehold = h || null;
    document.getElementById("household-dialog-title").textContent = h ? "Edit household" : "Add household";
    document.getElementById("hh-name").value = h ? h.name : "";
    document.getElementById("hh-email").value = h ? h.email || "" : "";
    document.getElementById("hh-phone").value = h ? h.phone || "" : "";
    document.getElementById("hh-notes").value = h ? h.notes || "" : "";
    els.hhDialog.showModal();
  }

  function openGuestDialog(householdId, g) {
    editingGuest = g ? Object.assign({}, g) : { household_id: householdId };
    document.getElementById("guest-dialog-title").textContent = g ? "Edit guest" : "Add guest";
    // Meal options come from js/content.js so the admin page and the public
    // RSVP form always offer the same menu.
    var mealSel = document.getElementById("g-meal");
    mealSel.innerHTML = '<option value="">—</option>' + CONTENT.mealOptions.map(function (m) {
      return '<option value="' + escapeHtml(m) + '">' + escapeHtml(m) + "</option>";
    }).join("");
    document.getElementById("g-name").value = g ? g.name : "";
    document.getElementById("g-status").value = g ? g.rsvp_status : "pending";
    mealSel.value = g ? g.meal || "" : "";
    document.getElementById("g-notes").value = g ? g.notes || "" : "";
    els.gDialog.showModal();
  }

  els.hhForm.addEventListener("submit", function () {
    var obj = {
      id: editingHousehold ? editingHousehold.id : undefined,
      name: document.getElementById("hh-name").value.trim(),
      email: document.getElementById("hh-email").value.trim(),
      phone: document.getElementById("hh-phone").value.trim(),
      notes: document.getElementById("hh-notes").value.trim(),
    };
    if (!obj.name) return;
    store.saveHousehold(obj).then(refresh).catch(alertError);
  });

  els.gForm.addEventListener("submit", function () {
    var obj = Object.assign({}, editingGuest, {
      name: document.getElementById("g-name").value.trim(),
      rsvp_status: document.getElementById("g-status").value,
      meal: document.getElementById("g-meal").value,
      notes: document.getElementById("g-notes").value.trim(),
    });
    if (!obj.name) return;
    store.saveGuest(obj).then(refresh).catch(alertError);
  });

  document.querySelectorAll(".dialog-cancel").forEach(function (btn) {
    btn.addEventListener("click", function () { btn.closest("dialog").close(); });
  });

  function alertError(err) { alert("That didn't save: " + err.message); }

  /* ---------------- list actions (event delegation) ---------------------- */

  els.list.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var hhId = btn.closest(".household-card").dataset.household;
    var household = households.find(function (h) { return h.id === hhId; });
    var guestLine = btn.closest(".guest-line");
    var guest = guestLine &&
      (household.guests || []).find(function (g) { return g.id === guestLine.dataset.guest; });

    switch (btn.dataset.action) {
      case "add-guest": openGuestDialog(hhId, null); break;
      case "edit-guest": openGuestDialog(hhId, guest); break;
      case "delete-guest":
        if (confirm("Delete " + guest.name + "?")) {
          store.deleteGuest(guest.id).then(refresh).catch(alertError);
        }
        break;
      case "edit-household": openHouseholdDialog(household); break;
      case "delete-household":
        if (confirm("Delete “" + household.name + "” and all its guests? This can't be undone.")) {
          store.deleteHousehold(hhId).then(refresh).catch(alertError);
        }
        break;
    }
  });

  /* ---------------- auth ------------------------------------------------- */

  document.getElementById("add-household").addEventListener("click", function () {
    openHouseholdDialog(null);
  });

  els.loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    els.loginError.textContent = "";
    store
      .signIn(
        document.getElementById("login-email").value,
        document.getElementById("login-password").value
      )
      .then(showDashboard)
      .catch(function (err) { els.loginError.textContent = err.message; });
  });

  els.signOut.addEventListener("click", function () {
    store.signOut().then(showLogin);
  });

  /* ---------------- boot ------------------------------------------------- */

  if (store.mode === "demo") {
    els.demoHint.hidden = false;
    els.modeBadge.hidden = false;
  }

  store.hasSession().then(function (signedIn) {
    if (signedIn) showDashboard();
    else showLogin();
  });
})();
