/* =========================================================================
   Admin: Budget tab.

   Three pieces, mirroring the "Simple Budget" + "Payment Schedule" sheets:
     - Wedding funds: goal + contributions (stored as settings)
     - Budget items: each with an ESTIMATE; what's actually spent is always
       COMPUTED from the expense log, so totals can never drift
     - Expense log: status 'paid' = money spent; status 'planned' = an
       upcoming payment with a due date (this replaces the spreadsheet's
       Payment Schedule tab — "mark paid" when the check clears)
   ========================================================================= */

(function () {
  "use strict";

  var app = window.AdminApp;
  var store = app.store;
  var esc = app.escapeHtml;

  var items = [];
  var expenses = [];
  var settings = {};
  var editingItem = null;
  var editingExpense = null;

  var fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  function money(n) { return fmt.format(Number(n) || 0); }
  function num(v) { return Number(v) || 0; }

  function loadBudget() {
    store.budgetFetch().then(function (res) {
      items = res.items || [];
      expenses = res.expenses || [];
      settings = {};
      (res.settings || []).forEach(function (s) { settings[s.key] = s.value; });
      document.getElementById("budget-error").textContent = "";
      renderBudget();
    }).catch(function (err) {
      document.getElementById("budget-error").textContent =
        "Couldn't load the budget: " + err.message +
        " — has supabase/migration-003-planning.sql been run?";
    });
  }

  /* ---------------- computations ----------------------------------------- */

  function sumFor(itemId, status) {
    return expenses.reduce(function (sum, e) {
      return sum + ((e.budget_item_id === itemId && e.status === status) ? num(e.amount) : 0);
    }, 0);
  }
  function totalBy(status) {
    return expenses.reduce(function (sum, e) {
      return sum + (e.status === status ? num(e.amount) : 0);
    }, 0);
  }
  function totalFunds() {
    return num(settings.monthly_contribution) * num(settings.months_until || 0) +
      num(settings.family_contribution) + num(settings.savings_contribution);
  }

  /* ---------------- rendering -------------------------------------------- */

  var FUND_FIELDS = [
    { key: "budget_goal", label: "Budget goal ($)" },
    { key: "family_contribution", label: "Family contribution ($)" },
    { key: "savings_contribution", label: "Savings contribution ($)" },
    { key: "monthly_contribution", label: "Monthly contribution ($)" },
    { key: "months_until", label: "Months until wedding" },
  ];

  function renderBudget() {
    // funds inputs
    document.getElementById("funds-grid").innerHTML = FUND_FIELDS.map(function (f) {
      return '<div class="form-row"><label for="fund-' + f.key + '">' + esc(f.label) + "</label>" +
        '<input type="number" min="0" step="0.01" id="fund-' + f.key +
        '" data-setting="' + f.key + '" value="' + esc(settings[f.key] || 0) + '"></div>';
    }).join("") +
      '<p class="funds-total">Total funds: <strong>' + money(totalFunds()) + "</strong></p>";

    // headline totals
    var estimated = items.reduce(function (s, i) { return s + num(i.estimated); }, 0);
    var paid = totalBy("paid");
    var planned = totalBy("planned");
    var goal = num(settings.budget_goal);
    var left = goal - paid - planned;
    document.getElementById("budget-summary").innerHTML =
      card(money(estimated), "Estimated", "all budget items") +
      card(money(paid), "Spent", expenses.filter(function (e) { return e.status === "paid"; }).length + " expenses logged") +
      card(money(planned), "Upcoming", "planned payments") +
      card(money(left), "Left vs goal", "goal " + money(goal) +
        (left < 0 ? " — over! 😅" : ""));

    renderUpcoming();
    renderItems();
    renderExpenses();
  }

  function card(n, label, detail) {
    return '<div class="card summary-card"><p class="summary-number">' + n +
      '</p><p class="summary-label">' + esc(label) +
      '</p><p class="summary-detail">' + esc(detail) + "</p></div>";
  }

  function itemName(id) {
    var it = items.find(function (i) { return i.id === id; });
    return it ? it.name : "—";
  }

  function renderUpcoming() {
    var upcoming = expenses
      .filter(function (e) { return e.status === "planned"; })
      .sort(function (a, b) { return String(a.due_date || "9999").localeCompare(String(b.due_date || "9999")); });
    var el = document.getElementById("upcoming-payments");
    if (upcoming.length === 0) {
      el.innerHTML = "<p><em>No planned payments. Log an expense with status “Planned” to build your payment schedule.</em></p>";
      return;
    }
    el.innerHTML = '<div class="table-scroll"><table class="report-table"><thead><tr>' +
      "<th>Due</th><th>Description</th><th>Budget item</th><th>Vendor</th>" +
      '<th class="num">Amount</th><th></th></tr></thead><tbody>' +
      upcoming.map(function (e) {
        return '<tr data-expense="' + esc(e.id) + '"><td>' + esc(e.due_date || "TBD") +
          "</td><td>" + esc(e.description) + "</td><td>" + esc(itemName(e.budget_item_id)) +
          "</td><td>" + esc(e.vendor || "—") + '</td><td class="num">' + money(e.amount) +
          '</td><td class="row-actions"><button type="button" class="btn btn-small" data-mark-paid>Mark paid</button></td></tr>';
      }).join("") + "</tbody></table></div>";
  }

  function renderItems() {
    var tbody = document.querySelector("#budget-items-table tbody");
    tbody.innerHTML = items.map(function (i) {
      var paid = sumFor(i.id, "paid");
      var planned = sumFor(i.id, "planned");
      var left = num(i.estimated) - paid - planned;
      return '<tr data-item="' + esc(i.id) + '"><td>' + esc(i.name) +
        '</td><td class="num">' + money(i.estimated) +
        '</td><td class="num">' + money(paid) +
        '</td><td class="num">' + money(planned) +
        '</td><td class="num' + (left < 0 ? " over" : "") + '">' + money(left) +
        "</td><td>" + esc(i.notes || "") +
        '</td><td class="row-actions">' +
        '<button type="button" class="btn btn-small" data-item-expense>+ Expense</button>' +
        '<button type="button" class="btn btn-small" data-item-edit>Edit</button>' +
        '<button type="button" class="btn btn-small btn-danger" data-item-delete aria-label="Delete item">✕</button>' +
        "</td></tr>";
    }).join("");
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7"><em>No budget items yet — add one, or run supabase/import-planning.sql to load the spreadsheet.</em></td></tr>';
    }
  }

  function renderExpenses() {
    var tbody = document.querySelector("#expenses-table tbody");
    tbody.innerHTML = expenses.map(function (e) {
      var status = e.status === "paid"
        ? "Paid" + (e.paid_date ? " " + e.paid_date : "")
        : "Planned" + (e.due_date ? " — due " + e.due_date : "");
      return '<tr data-expense="' + esc(e.id) + '"><td>' + esc(e.description) +
        "</td><td>" + esc(itemName(e.budget_item_id)) +
        "</td><td>" + esc(e.vendor || "—") +
        '</td><td class="num">' + money(e.amount) +
        '</td><td><span class="status status-' + (e.status === "paid" ? "yes" : "pending") + '">' +
        esc(status) + "</span></td><td>" + esc(e.paid_by || "—") +
        '</td><td class="row-actions">' +
        '<button type="button" class="btn btn-small" data-expense-edit>Edit</button>' +
        '<button type="button" class="btn btn-small btn-danger" data-expense-delete aria-label="Delete expense">✕</button>' +
        "</td></tr>";
    }).join("") ||
      '<tr><td colspan="7"><em>No expenses logged yet.</em></td></tr>';
  }

  /* ---------------- funds: save on change -------------------------------- */

  document.getElementById("funds-grid").addEventListener("change", function (e) {
    var key = e.target.dataset.setting;
    if (!key) return;
    settings[key] = e.target.value;
    store.settingSave(key, e.target.value).then(renderBudget)
      .catch(function (err) { alert("Couldn't save: " + err.message); });
  });

  /* ---------------- budget item dialog ----------------------------------- */

  function openItemDialog(item) {
    editingItem = item || null;
    document.getElementById("budget-item-dialog-title").textContent =
      item ? "Edit budget item" : "Add budget item";
    document.getElementById("bi-name").value = item ? item.name : "";
    document.getElementById("bi-estimated").value = item ? item.estimated : "";
    document.getElementById("bi-notes").value = item ? item.notes || "" : "";
    document.getElementById("budget-item-dialog").showModal();
  }

  document.getElementById("budget-item-form").addEventListener("submit", function () {
    var item = {
      id: editingItem ? editingItem.id : undefined,
      name: document.getElementById("bi-name").value.trim(),
      estimated: num(document.getElementById("bi-estimated").value),
      notes: document.getElementById("bi-notes").value.trim(),
      position: editingItem ? editingItem.position
        : (items.length ? Math.max.apply(null, items.map(function (i) { return num(i.position); })) + 10 : 10),
    };
    if (!item.name) return;
    store.budgetSaveItem(item).then(loadBudget)
      .catch(function (err) { alert("Couldn't save: " + err.message); });
  });

  /* ---------------- expense dialog ---------------------------------------- */

  function openExpenseDialog(expense, presetItemId) {
    editingExpense = expense || null;
    document.getElementById("expense-dialog-title").textContent =
      expense ? "Edit expense" : "Log expense";
    var sel = document.getElementById("ex-item");
    sel.innerHTML = '<option value="">— none —</option>' + items.map(function (i) {
      return '<option value="' + esc(i.id) + '">' + esc(i.name) + "</option>";
    }).join("");
    sel.value = expense ? (expense.budget_item_id || "") : (presetItemId || "");
    document.getElementById("ex-description").value = expense ? expense.description : "";
    document.getElementById("ex-vendor").value = expense ? expense.vendor || "" : "";
    document.getElementById("ex-amount").value = expense ? expense.amount : "";
    var status = expense ? expense.status : "paid";
    document.querySelector('input[name="ex-status"][value="' + status + '"]').checked = true;
    document.getElementById("ex-paid-date").value =
      expense ? expense.paid_date || "" : new Date().toISOString().slice(0, 10);
    document.getElementById("ex-due-date").value = expense ? expense.due_date || "" : "";
    document.getElementById("ex-paid-by").value = expense ? expense.paid_by || "" : "";
    document.getElementById("ex-notes").value = expense ? expense.notes || "" : "";
    toggleExpenseDates(status);
    document.getElementById("expense-dialog").showModal();
  }

  function toggleExpenseDates(status) {
    document.getElementById("ex-paid-date-row").hidden = status !== "paid";
    document.getElementById("ex-due-date-row").hidden = status !== "planned";
  }

  document.querySelectorAll('input[name="ex-status"]').forEach(function (radio) {
    radio.addEventListener("change", function () { toggleExpenseDates(radio.value); });
  });

  document.getElementById("expense-form").addEventListener("submit", function () {
    var status = document.querySelector('input[name="ex-status"]:checked').value;
    var e = {
      id: editingExpense ? editingExpense.id : undefined,
      budget_item_id: document.getElementById("ex-item").value || null,
      description: document.getElementById("ex-description").value.trim(),
      vendor: document.getElementById("ex-vendor").value.trim(),
      amount: num(document.getElementById("ex-amount").value),
      status: status,
      paid_date: status === "paid" ? document.getElementById("ex-paid-date").value || null : null,
      due_date: status === "planned" ? document.getElementById("ex-due-date").value || null : null,
      paid_by: document.getElementById("ex-paid-by").value.trim(),
      notes: document.getElementById("ex-notes").value.trim(),
    };
    if (!e.description || !e.amount) return;
    store.expenseSave(e).then(loadBudget)
      .catch(function (err) { alert("Couldn't save: " + err.message); });
  });

  /* ---------------- table actions ----------------------------------------- */

  document.getElementById("add-budget-item").addEventListener("click", function () {
    openItemDialog(null);
  });
  document.getElementById("log-expense").addEventListener("click", function () {
    openExpenseDialog(null);
  });

  document.getElementById("budget-items-table").addEventListener("click", function (e) {
    var tr = e.target.closest("tr[data-item]");
    if (!tr) return;
    var item = items.find(function (i) { return i.id === tr.dataset.item; });
    if (e.target.closest("[data-item-expense]")) openExpenseDialog(null, item.id);
    else if (e.target.closest("[data-item-edit]")) openItemDialog(item);
    else if (e.target.closest("[data-item-delete]")) {
      if (confirm("Delete “" + item.name + "”? Its logged expenses are kept (unlinked).")) {
        store.budgetDeleteItem(item.id).then(loadBudget)
          .catch(function (err) { alert("Couldn't delete: " + err.message); });
      }
    }
  });

  document.getElementById("expenses-table").addEventListener("click", function (e) {
    var tr = e.target.closest("tr[data-expense]");
    if (!tr) return;
    var expense = expenses.find(function (x) { return x.id === tr.dataset.expense; });
    if (e.target.closest("[data-expense-edit]")) openExpenseDialog(expense);
    else if (e.target.closest("[data-expense-delete]")) {
      if (confirm("Delete this expense?")) {
        store.expenseDelete(expense.id).then(loadBudget)
          .catch(function (err) { alert("Couldn't delete: " + err.message); });
      }
    }
  });

  // "Mark paid" on an upcoming payment: planned -> paid, stamped today.
  document.getElementById("upcoming-payments").addEventListener("click", function (e) {
    if (!e.target.closest("[data-mark-paid]")) return;
    var tr = e.target.closest("tr[data-expense]");
    var expense = expenses.find(function (x) { return x.id === tr.dataset.expense; });
    expense.status = "paid";
    expense.paid_date = new Date().toISOString().slice(0, 10);
    store.expenseSave(expense).then(loadBudget)
      .catch(function (err) { alert("Couldn't save: " + err.message); });
  });

  app.tabHooks.budget = loadBudget;
})();
