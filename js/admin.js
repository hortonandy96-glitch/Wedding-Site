/* =========================================================================
   Admin dashboard UI. All data access goes through the store created by
   js/admin-store.js (demo or live — this file doesn't care which).
   ========================================================================= */

(function () {
  "use strict";

  var store = window.AdminStore.create();

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

    // Dinner is stations, so instead of meal counts we surface every
    // dietary restriction the caterer needs to know about.
    var dietaryLines = yes
      .filter(function (g) { return g.dietary && g.dietary.trim(); })
      .map(function (g) {
        return escapeHtml(g.name) + ": <strong>" + escapeHtml(g.dietary) + "</strong>";
      })
      .join("<br>") || "<em>No dietary restrictions reported yet</em>";

    els.summary.innerHTML =
      summaryCard("Invited", guests.length, households.length + " households") +
      summaryCard("Attending", yes.length, "🎉") +
      summaryCard("Declined", no.length, "") +
      summaryCard("Awaiting reply", pending, respondedHouseholds + "/" + households.length + " households responded") +
      '<div class="card summary-card summary-meals"><p class="summary-label">Dietary restrictions (attending)</p><p class="summary-detail">' + dietaryLines + "</p></div>";
  }

  function summaryCard(label, n, detail) {
    return '<div class="card summary-card"><p class="summary-number">' + n +
      '</p><p class="summary-label">' + escapeHtml(label) +
      '</p><p class="summary-detail">' + detail + "</p></div>";
  }

  /* ---------------- invite links & QR codes ------------------------------ */

  // Personal RSVP link for a household, based on where this site is hosted.
  // Works the same on GitHub Pages, Netlify, or a custom domain.
  function inviteUrl(code) {
    return new URL("rsvp.html?code=" + encodeURIComponent(code), window.location.href).href;
  }

  /**
   * Render a QR code to a PNG data URL.
   * The vendored library computes the QR matrix; we paint it onto a canvas
   * with a 4-module quiet zone (the white border scanners need), sized for
   * crisp printing (~1000px).
   */
  function qrPngDataUrl(text) {
    var qr = window.qrcode(0, "M"); // type 0 = auto-size, M = 15% error correction
    qr.addData(text);
    qr.make();
    var count = qr.getModuleCount();
    var quiet = 4;
    var scale = Math.max(4, Math.round(1000 / (count + quiet * 2)));
    var size = (count + quiet * 2) * scale;

    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#11301f"; // forest green still scans fine on white
    for (var r = 0; r < count; r++) {
      for (var c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
        }
      }
    }
    return canvas.toDataURL("image/png");
  }

  function downloadQr(household) {
    var slug = household.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    var a = document.createElement("a");
    a.href = qrPngDataUrl(inviteUrl(household.code));
    a.download = "qr-" + (slug || "household") + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // General-purpose QR: points at the RSVP page with no code, where guests
  // find themselves by name. Same code printable on every invitation.
  document.getElementById("download-generic-qr").addEventListener("click", function () {
    var a = document.createElement("a");
    a.href = qrPngDataUrl(new URL("rsvp.html", window.location.href).href);
    a.download = "qr-rsvp-general.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  function copyText(text, btn) {
    function done(ok) {
      var original = btn.textContent;
      btn.textContent = ok ? "Copied!" : "Copy failed";
      setTimeout(function () { btn.textContent = original; }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
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
      if (!h.responded_at && h.reminder_sent_at) {
        respondedTag += ' <span class="badge">reminded ' +
          new Date(h.reminder_sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
          "</span>";
      }
      if (h.plus_one_allowed) respondedTag += ' <span class="badge">+1 invited</span>';

      var rows = (h.guests || []).map(function (g) {
        return (
          '<div class="guest-line" data-guest="' + g.id + '">' +
          '<span class="guest-name">' + escapeHtml(g.name) +
          (g.is_plus_one ? ' <span class="badge">+1</span>' : "") + "</span>" +
          '<span class="status status-' + g.rsvp_status + '">' + STATUS_LABEL[g.rsvp_status] + "</span>" +
          '<span class="guest-meal">' + escapeHtml(g.dietary || "—") + "</span>" +
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
        '<div class="invite-row">' +
        '<span class="invite-label">Invite link:</span>' +
        '<code class="invite-link">' + escapeHtml(inviteUrl(h.code)) + "</code>" +
        '<button type="button" class="btn btn-small" data-action="copy-link">Copy link</button>' +
        '<button type="button" class="btn btn-small" data-action="download-qr">Download QR</button>' +
        "</div>" +
        (h.notes ? '<p class="household-notes">📝 ' + escapeHtml(h.notes) + "</p>" : "") +
        (h.rsvp_message ? '<p class="household-message">💌 “' + escapeHtml(h.rsvp_message) + "”</p>" : "") +
        '<div class="guest-table" role="list">' +
        '<div class="guest-line guest-line-head" aria-hidden="true">' +
        "<span>Name</span><span>RSVP</span><span>Dietary restrictions</span><span>Notes</span><span></span></div>" +
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
    document.getElementById("hh-plus-one").checked = h ? !!h.plus_one_allowed : false;
    els.hhDialog.showModal();
  }

  function openGuestDialog(householdId, g) {
    editingGuest = g ? Object.assign({}, g) : { household_id: householdId };
    document.getElementById("guest-dialog-title").textContent = g ? "Edit guest" : "Add guest";
    document.getElementById("g-name").value = g ? g.name : "";
    document.getElementById("g-status").value = g ? g.rsvp_status : "pending";
    document.getElementById("g-dietary").value = g ? g.dietary || "" : "";
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
      plus_one_allowed: document.getElementById("hh-plus-one").checked,
    };
    if (!obj.name) return;
    store.saveHousehold(obj).then(refresh).catch(alertError);
  });

  els.gForm.addEventListener("submit", function () {
    var obj = Object.assign({}, editingGuest, {
      name: document.getElementById("g-name").value.trim(),
      rsvp_status: document.getElementById("g-status").value,
      dietary: document.getElementById("g-dietary").value.trim(),
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
      case "copy-link": copyText(inviteUrl(household.code), btn); break;
      case "download-qr": downloadQr(household); break;
      case "edit-household": openHouseholdDialog(household); break;
      case "delete-household":
        if (confirm("Delete “" + household.name + "” and all its guests? This can't be undone.")) {
          store.deleteHousehold(hhId).then(refresh).catch(alertError);
        }
        break;
    }
  });

  /* ---------------- RSVP reminders (Phase 3) ----------------------------- */

  var DEFAULT_SUBJECT = "Robin & Andy — can you make it? 💌";
  var DEFAULT_BODY =
    "Hi {{name}},\n\n" +
    "Just a friendly nudge from Robin & Andy — we're finalizing numbers for\n" +
    "May 21, 2027 at Salvage One in Chicago, and we'd love to know if you can\n" +
    "make it. It takes about a minute:\n\n" +
    "{{link}}\n\n" +
    "(That's your household's personal link — it already knows your party.)\n\n" +
    "Can't wait to celebrate,\n" +
    "Robin & Andy";

  function fillTemplate(template, h) {
    return template
      .replace(/\{\{name\}\}/g, h.name)
      .replace(/\{\{link\}\}/g, inviteUrl(h.code));
  }

  function reminderCandidates() {
    return households.filter(function (h) {
      return !h.responded_at && h.email && h.email.trim();
    });
  }

  function openReminderDialog() {
    var candidates = reminderCandidates();
    var wrap = document.getElementById("reminder-recipients");
    if (candidates.length === 0) {
      wrap.innerHTML = "<p><em>Everyone with an email on file has already responded — nothing to send! 🎉</em></p>";
    } else {
      wrap.innerHTML = candidates.map(function (h) {
        var reminded = h.reminder_sent_at
          ? ' <span class="badge">last reminded ' +
            new Date(h.reminder_sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + "</span>"
          : "";
        return '<label class="reminder-recipient">' +
          '<input type="checkbox" checked value="' + escapeHtml(h.id) + '" /> ' +
          escapeHtml(h.name) + " &lt;" + escapeHtml(h.email) + "&gt;" + reminded +
          "</label>";
      }).join("");
    }
    document.getElementById("reminder-subject").value = DEFAULT_SUBJECT;
    document.getElementById("reminder-body").value = DEFAULT_BODY;
    document.getElementById("reminder-error").textContent = "";
    document.getElementById("reminder-send").disabled = candidates.length === 0;
    updateReminderPreview();
    document.getElementById("reminder-dialog").showModal();
  }

  function selectedReminderHouseholds() {
    var ids = Array.prototype.map.call(
      document.querySelectorAll("#reminder-recipients input:checked"),
      function (cb) { return cb.value; }
    );
    return households.filter(function (h) { return ids.indexOf(h.id) !== -1; });
  }

  // Preview always shows the email exactly as the FIRST selected household
  // will receive it, so you see real names and a real link before sending.
  function updateReminderPreview() {
    var selected = selectedReminderHouseholds();
    var preview = document.getElementById("reminder-preview");
    if (selected.length === 0) {
      preview.innerHTML = "<em>No recipients selected.</em>";
      document.getElementById("reminder-send").disabled = true;
      return;
    }
    document.getElementById("reminder-send").disabled = false;
    var h = selected[0];
    preview.innerHTML =
      "<p><strong>To:</strong> " + escapeHtml(h.name) + " &lt;" + escapeHtml(h.email) + "&gt;" +
      (selected.length > 1 ? " <em>(+" + (selected.length - 1) + " more, each with their own link)</em>" : "") + "</p>" +
      "<p><strong>Subject:</strong> " + escapeHtml(document.getElementById("reminder-subject").value) + "</p>" +
      "<pre>" + escapeHtml(fillTemplate(document.getElementById("reminder-body").value, h)) + "</pre>";
  }

  document.getElementById("send-reminders").addEventListener("click", openReminderDialog);
  document.getElementById("reminder-recipients").addEventListener("change", updateReminderPreview);
  document.getElementById("reminder-subject").addEventListener("input", updateReminderPreview);
  document.getElementById("reminder-body").addEventListener("input", updateReminderPreview);

  document.getElementById("reminder-form").addEventListener("submit", function (e) {
    var selected = selectedReminderHouseholds();
    if (selected.length === 0) return;

    var subject = document.getElementById("reminder-subject").value.trim();
    var bodyTemplate = document.getElementById("reminder-body").value;
    if (!subject || !bodyTemplate.trim()) {
      e.preventDefault();
      document.getElementById("reminder-error").textContent = "Subject and message can't be empty.";
      return;
    }

    var messages = selected.map(function (h) {
      var text = fillTemplate(bodyTemplate, h);
      return {
        household_id: h.id,
        to: h.email,
        subject: subject,
        text: text,
        // Simple HTML version: same text with clickable link + line breaks
        html: escapeHtml(text)
          .replace(new RegExp(escapeHtml(inviteUrl(h.code)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
            '<a href="' + escapeHtml(inviteUrl(h.code)) + '">' + escapeHtml(inviteUrl(h.code)) + "</a>")
          .replace(/\n/g, "<br>"),
      };
    });

    var btn = document.getElementById("reminder-send");
    btn.disabled = true;
    btn.textContent = "Sending…";
    store.sendReminders(messages)
      .then(function (result) {
        refresh();
        var note = result.demo
          ? "Demo mode: pretended to send " + result.sent + " reminder(s) — with Supabase + Resend connected these would be real emails."
          : "Sent " + result.sent + " reminder(s)" + (result.failed ? ", " + result.failed + " failed — check the dashboard badges." : ".");
        alert(note);
      })
      .catch(function (err) {
        alert("Couldn't send reminders: " + err.message);
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = "Send";
      });
  });

  /* ---------------- RSVP report ------------------------------------------ */

  var STATUS_WORD = { yes: "Yes", no: "No", pending: "Awaiting" };

  function openReport() {
    store.fetchUnmatched().then(function (unmatched) {
      renderReport(unmatched || []);
      els.dashView.hidden = true;
      document.getElementById("report-view").hidden = false;
      window.scrollTo(0, 0);
    }).catch(function (err) {
      // Table missing (migration not run yet)? Still show the rest.
      renderReport([], "Couldn't load unmatched RSVPs: " + err.message);
      els.dashView.hidden = true;
      document.getElementById("report-view").hidden = false;
    });
  }

  function renderReport(unmatched, unmatchedError) {
    var guests = households.flatMap(function (h) { return h.guests || []; });
    var yes = guests.filter(function (g) { return g.rsvp_status === "yes"; });
    var no = guests.filter(function (g) { return g.rsvp_status === "no"; });
    var pending = guests.filter(function (g) { return g.rsvp_status === "pending"; });
    var responded = households.filter(function (h) { return h.responded_at; });
    var awaiting = households.filter(function (h) { return !h.responded_at; });

    document.getElementById("report-date").textContent =
      "Generated " + new Date().toLocaleString("en-US", {
        dateStyle: "long", timeStyle: "short",
      });

    var html = "";

    /* --- totals --- */
    html += '<div class="report-section"><h2>Totals</h2><table class="report-table"><tbody>' +
      reportRow("Households invited", households.length) +
      reportRow("Households responded", responded.length + " (" +
        (households.length ? Math.round((responded.length / households.length) * 100) : 0) + "%)") +
      reportRow("Households awaiting reply", awaiting.length) +
      reportRow("Guests invited", guests.length) +
      reportRow("Guests attending", yes.length) +
      reportRow("Guests declined", no.length) +
      reportRow("Guests undecided", pending.length) +
      reportRow("Unmatched RSVPs", unmatched.length) +
      "</tbody></table></div>";

    /* --- who hasn't RSVPed --- */
    html += '<div class="report-section"><h2>Not yet RSVPed (' + awaiting.length + " households)</h2>";
    if (awaiting.length === 0) {
      html += "<p><em>Everyone has responded! 🎉</em></p>";
    } else {
      html += '<table class="report-table"><thead><tr><th>Household</th><th>Guests</th><th>Contact</th><th>Reminded</th></tr></thead><tbody>';
      awaiting.forEach(function (h) {
        html += "<tr><td>" + escapeHtml(h.name) + "</td><td>" +
          (h.guests || []).map(function (g) { return escapeHtml(g.name); }).join(", ") +
          "</td><td>" + escapeHtml([h.email, h.phone].filter(Boolean).join(" · ") || "—") +
          "</td><td>" + (h.reminder_sent_at
            ? new Date(h.reminder_sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : "—") + "</td></tr>";
      });
      html += "</tbody></table></div>";
    }

    /* --- RSVPs received --- */
    html += '<div class="report-section"><h2>RSVPs received (' + responded.length + " households)</h2>";
    if (responded.length === 0) {
      html += "<p><em>No responses yet.</em></p>";
    } else {
      html += '<table class="report-table"><thead><tr><th>Household</th><th>Guest</th><th>RSVP</th><th>Dietary</th><th>Note</th></tr></thead><tbody>';
      responded.forEach(function (h) {
        (h.guests || []).forEach(function (g, i) {
          html += "<tr><td>" + (i === 0 ? escapeHtml(h.name) : "") + "</td><td>" +
            escapeHtml(g.name) + (g.is_plus_one ? " (+1)" : "") + "</td><td>" +
            STATUS_WORD[g.rsvp_status] + "</td><td>" + escapeHtml(g.dietary || "—") +
            "</td><td>" + (i === 0 && h.rsvp_message ? "“" + escapeHtml(h.rsvp_message) + "”" : "") +
            "</td></tr>";
        });
      });
      html += "</tbody></table></div>";
    }

    /* --- unmatched RSVPs --- */
    html += '<div class="report-section"><h2>Unmatched RSVPs (' + unmatched.length + ")</h2>" +
      "<p>People who RSVPed under a name the guest list didn't recognize. " +
      "Match them to a household by hand (edit the guest's name in the dashboard " +
      "or add them), then delete the entry here.</p>";
    if (unmatchedError) {
      html += '<p class="field-error">' + escapeHtml(unmatchedError) + "</p>";
    } else if (unmatched.length === 0) {
      html += "<p><em>None — every RSVP matched the guest list.</em></p>";
    } else {
      html += '<table class="report-table"><thead><tr><th>Name</th><th>Attending</th><th>Party</th><th>Email</th><th>Dietary</th><th>Note</th><th>When</th><th class="no-print"></th></tr></thead><tbody>';
      unmatched.forEach(function (u) {
        html += '<tr><td>' + escapeHtml(u.name) + "</td><td>" + escapeHtml(u.attending) +
          "</td><td>" + escapeHtml(u.party_names || "—") +
          "</td><td>" + escapeHtml(u.email || "—") +
          "</td><td>" + escapeHtml(u.dietary || "—") +
          "</td><td>" + escapeHtml(u.message || "—") +
          "</td><td>" + new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
          '</td><td class="no-print"><button type="button" class="btn btn-small btn-danger" data-unmatched="' +
          escapeHtml(u.id) + '">Resolved</button></td></tr>';
      });
      html += "</tbody></table>";
    }
    html += "</div>";

    document.getElementById("report-body").innerHTML = html;
  }

  function reportRow(label, value) {
    return "<tr><td>" + label + "</td><td><strong>" + value + "</strong></td></tr>";
  }

  document.getElementById("open-report").addEventListener("click", openReport);
  document.getElementById("report-back").addEventListener("click", function () {
    document.getElementById("report-view").hidden = true;
    els.dashView.hidden = false;
  });
  document.getElementById("report-print").addEventListener("click", function () {
    window.print();
  });
  document.getElementById("report-body").addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-unmatched]");
    if (!btn) return;
    if (confirm("Mark this unmatched RSVP as resolved and remove it?")) {
      store.deleteUnmatched(btn.dataset.unmatched).then(openReport).catch(alertError);
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
