/* =========================================================================
   Admin: Guest List tab + the generic "planning sheet" engine that powers
   the Vendors tab and every list on the Planning tab.

   A "sheet" is a flat editable table. Columns are configured below; rows
   are stored as flexible JSON via the store (planning_rows table in live
   mode). One engine = identical add/edit/delete behavior everywhere.
   ========================================================================= */

(function () {
  "use strict";

  var app = window.AdminApp;
  var store = app.store;
  var esc = app.escapeHtml;

  /* ================= GUEST LIST TAB ===================================== */

  var STATUS_LABEL = { pending: "Pending", yes: "Yes", no: "No" };

  function flatGuests() {
    var rows = [];
    app.getHouseholds().forEach(function (h) {
      (h.guests || []).forEach(function (g) {
        rows.push({
          guest: g.name + (g.is_plus_one ? " (+1)" : ""),
          household: h.name,
          rsvp: STATUS_LABEL[g.rsvp_status] || g.rsvp_status,
          dietary: g.dietary || "",
          email: h.email || "",
          phone: h.phone || "",
          address: h.notes || "",   // import stored mailing addresses here
          notes: g.notes || "",
        });
      });
    });
    return rows;
  }

  function renderGuestlist() {
    var filter = document.getElementById("guestlist-filter").value.trim().toLowerCase();
    var rows = flatGuests().filter(function (r) {
      if (!filter) return true;
      return Object.keys(r).some(function (k) {
        return String(r[k]).toLowerCase().indexOf(filter) !== -1;
      });
    });
    var tbody = document.querySelector("#guestlist-table tbody");
    tbody.innerHTML = rows.map(function (r) {
      return "<tr><td>" + [r.guest, r.household, r.rsvp, r.dietary, r.email,
        r.phone, r.address, r.notes].map(esc).join("</td><td>") + "</td></tr>";
    }).join("");
    document.getElementById("guestlist-count").textContent =
      rows.length + " of " + flatGuests().length + " guests";
  }

  document.getElementById("guestlist-filter").addEventListener("input", renderGuestlist);

  document.getElementById("guestlist-csv").addEventListener("click", function () {
    var head = ["Guest", "Household", "RSVP", "Dietary", "Email", "Phone", "Address", "Notes"];
    var lines = [head].concat(flatGuests().map(function (r) {
      return [r.guest, r.household, r.rsvp, r.dietary, r.email, r.phone, r.address, r.notes];
    })).map(function (cells) {
      return cells.map(function (c) {
        return '"' + String(c).replace(/"/g, '""') + '"';
      }).join(",");
    });
    var blob = new Blob([lines.join("\n")], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "guest-list.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  });

  app.tabHooks.guestlist = renderGuestlist;

  /* ================= GENERIC SHEET ENGINE ================================ */

  var CHECKLIST_PHASES = ["12+ Months", "9-12 Months", "6-9 Months", "4-6 Months",
    "2-4 Months", "1-2 Months", "2-4 Weeks", "1 Week", "Day Before", "Day Of", "After"];

  var SHEETS = {
    vendors: {
      title: "Vendor contacts",
      addLabel: "+ Add vendor",
      columns: [
        { key: "vendor_type", label: "Vendor type" },
        { key: "company", label: "Company" },
        { key: "contact", label: "Main contact" },
        { key: "instagram", label: "Instagram" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "arrival_time", label: "Arrival time" },
        { key: "meals", label: "Meals" },
        { key: "notes", label: "Notes" },
      ],
    },
    checklist: {
      title: "Planning checklist",
      addLabel: "+ Add task",
      groupBy: "phase",
      groupOrder: CHECKLIST_PHASES,
      progress: "done",
      columns: [
        { key: "done", label: "Done", type: "check" },
        { key: "task", label: "Task" },
        { key: "phase", label: "Phase", type: "select", options: CHECKLIST_PHASES },
        { key: "assigned", label: "Assigned to" },
        { key: "completed", label: "Completed on" },
        { key: "notes", label: "Notes" },
      ],
    },
    priorities: {
      title: "Priorities (rank with your partner: 1 = skip, 5 = absolutely)",
      addLabel: "+ Add item",
      columns: [
        { key: "item", label: "Item" },
        { key: "rank", label: "Rank", type: "select",
          options: ["1 - SKIP", "2", "3", "4", "5 - ABSOLUTELY"] },
        { key: "notes", label: "Notes" },
      ],
    },
    wedding_party: {
      title: "Wedding party contacts",
      addLabel: "+ Add person",
      groupBy: "group",
      columns: [
        { key: "group", label: "Group" },
        { key: "slot", label: "Slot" },
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "notes", label: "Notes" },
        { key: "gifts", label: "Gift(s)" },
      ],
    },
    timeline: {
      title: "Rough draft timeline",
      addLabel: "+ Add entry",
      columns: [
        { key: "time", label: "Time" },
        { key: "item", label: "Timeline item" },
        { key: "vendors", label: "Vendors involved" },
        { key: "notes", label: "Notes" },
      ],
    },
    packing: {
      title: "Day-of packing list",
      addLabel: "+ Add item",
      groupBy: "category",
      progress: "packed",
      columns: [
        { key: "packed", label: "Packed", type: "check" },
        { key: "category", label: "Category" },
        { key: "item", label: "Item" },
        { key: "notes", label: "Notes" },
      ],
    },
  };

  var currentSheet = null;       // sheet key being displayed
  var currentRows = [];          // its rows
  var editingRow = null;         // row being edited in the dialog

  function sheetContainer(sheetKey) {
    return document.getElementById(sheetKey === "vendors" ? "vendors-sheet" : "planning-sheet");
  }

  function loadSheet(sheetKey) {
    currentSheet = sheetKey;
    store.planningFetch(sheetKey).then(function (rows) {
      currentRows = rows || [];
      renderSheet();
    }).catch(function (err) {
      sheetContainer(sheetKey).innerHTML =
        '<p class="field-error">Couldn\'t load: ' + esc(err.message) +
        " — has supabase/migration-003-planning.sql been run?</p>";
    });
  }

  function renderSheet() {
    var cfg = SHEETS[currentSheet];
    var container = sheetContainer(currentSheet);

    var html = '<div class="admin-toolbar"><h2 class="sheet-title">' + esc(cfg.title) + "</h2>" +
      '<button type="button" class="btn btn-primary" data-sheet-add>' + cfg.addLabel + "</button>";
    if (cfg.progress) {
      var doneCount = currentRows.filter(function (r) { return r.data[cfg.progress]; }).length;
      html += '<p class="toolbar-hint">' + doneCount + " / " + currentRows.length + " done</p>";
    }
    html += "</div>";

    // group rows when configured (checklist by phase, packing by category…)
    var groups = [];
    if (cfg.groupBy) {
      var seen = {};
      var order = (cfg.groupOrder || []).slice();
      currentRows.forEach(function (r) {
        var g = r.data[cfg.groupBy] || "Other";
        if (!seen[g]) {
          seen[g] = true;
          if (order.indexOf(g) === -1) order.push(g);
        }
      });
      order.forEach(function (g) {
        var rows = currentRows.filter(function (r) { return (r.data[cfg.groupBy] || "Other") === g; });
        if (rows.length) groups.push({ label: g, rows: rows });
      });
    } else {
      groups.push({ label: null, rows: currentRows });
    }

    html += '<div class="table-scroll"><table class="report-table sheet-table"><thead><tr>' +
      cfg.columns.map(function (c) { return "<th>" + esc(c.label) + "</th>"; }).join("") +
      "<th></th></tr></thead><tbody>";

    groups.forEach(function (group) {
      if (group.label !== null) {
        html += '<tr class="sheet-group"><td colspan="' + (cfg.columns.length + 1) + '">' +
          esc(group.label) + "</td></tr>";
      }
      group.rows.forEach(function (r) {
        html += '<tr data-row="' + esc(r.id) + '">';
        cfg.columns.forEach(function (c) {
          var v = r.data[c.key];
          if (c.type === "check") {
            html += '<td class="check-cell"><input type="checkbox" data-check="' + esc(c.key) +
              '" aria-label="' + esc(c.label) + '"' + (v ? " checked" : "") + "></td>";
          } else {
            html += "<td>" + esc(v == null ? "" : v) + "</td>";
          }
        });
        html += '<td class="row-actions"><button type="button" class="btn btn-small" data-edit>Edit</button>' +
          '<button type="button" class="btn btn-small btn-danger" data-delete aria-label="Delete row">✕</button></td></tr>';
      });
    });
    html += "</tbody></table></div>";
    if (currentRows.length === 0) {
      html += '<p class="empty-note">Nothing here yet — add the first row, or run ' +
        "supabase/import-planning.sql to load the spreadsheet content.</p>";
    }
    container.innerHTML = html;
  }

  /* ---- row dialog: fields generated from the sheet's column config ----- */

  function openRowDialog(row) {
    var cfg = SHEETS[currentSheet];
    editingRow = row || null;
    document.getElementById("row-dialog-title").textContent =
      (row ? "Edit — " : "Add — ") + cfg.title;
    var fields = document.getElementById("row-fields");
    fields.innerHTML = cfg.columns.map(function (c) {
      var v = row ? row.data[c.key] : "";
      var id = "rf-" + c.key;
      if (c.type === "check") {
        return '<div class="form-row"><label class="radio-pill checkbox-pill">' +
          '<input type="checkbox" id="' + id + '"' + (v ? " checked" : "") + "> " +
          esc(c.label) + "</label></div>";
      }
      if (c.type === "select") {
        return '<div class="form-row"><label for="' + id + '">' + esc(c.label) + "</label>" +
          '<select id="' + id + '"><option value=""></option>' +
          c.options.map(function (o) {
            return '<option' + (o === v ? " selected" : "") + ">" + esc(o) + "</option>";
          }).join("") + "</select></div>";
      }
      return '<div class="form-row"><label for="' + id + '">' + esc(c.label) + "</label>" +
        '<input type="text" id="' + id + '" value="' + esc(v == null ? "" : v) + '"></div>';
    }).join("");
    document.getElementById("row-dialog").showModal();
  }

  document.getElementById("row-form").addEventListener("submit", function () {
    var cfg = SHEETS[currentSheet];
    var data = {};
    cfg.columns.forEach(function (c) {
      var el = document.getElementById("rf-" + c.key);
      data[c.key] = c.type === "check" ? el.checked : el.value.trim();
    });
    var row = {
      id: editingRow ? editingRow.id : undefined,
      sheet: currentSheet,
      position: editingRow ? editingRow.position
        : (currentRows.length ? Math.max.apply(null, currentRows.map(function (r) { return r.position; })) + 10 : 10),
      data: editingRow ? Object.assign({}, editingRow.data, data) : data,
    };
    store.planningSave(row).then(function () { loadSheet(currentSheet); })
      .catch(function (err) { alert("Couldn't save: " + err.message); });
  });

  /* ---- table interactions (shared by both containers) ------------------ */

  function handleSheetClick(e) {
    if (e.target.closest("[data-sheet-add]")) { openRowDialog(null); return; }
    var tr = e.target.closest("tr[data-row]");
    if (!tr) return;
    var row = currentRows.find(function (r) { return r.id === tr.dataset.row; });
    if (e.target.closest("[data-edit]")) {
      openRowDialog(row);
    } else if (e.target.closest("[data-delete]")) {
      if (confirm("Delete this row?")) {
        store.planningDelete(row.id).then(function () { loadSheet(currentSheet); })
          .catch(function (err) { alert("Couldn't delete: " + err.message); });
      }
    }
  }

  // Checkbox cells save immediately — no dialog needed to tick a task off.
  function handleSheetChange(e) {
    var key = e.target.dataset.check;
    if (!key) return;
    var tr = e.target.closest("tr[data-row]");
    var row = currentRows.find(function (r) { return r.id === tr.dataset.row; });
    row.data[key] = e.target.checked;
    store.planningSave(row).then(function () { renderSheet(); })
      .catch(function (err) { alert("Couldn't save: " + err.message); });
  }

  ["vendors-sheet", "planning-sheet"].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("click", handleSheetClick);
    el.addEventListener("change", handleSheetChange);
  });

  document.getElementById("planning-sheet-select").addEventListener("change", function (e) {
    loadSheet(e.target.value);
  });

  app.tabHooks.vendors = function () { loadSheet("vendors"); };
  app.tabHooks.planning = function () {
    loadSheet(document.getElementById("planning-sheet-select").value);
  };
})();
