/* =========================================================================
   Admin: Vendor HQ tab.

   A read-at-a-glance dashboard of every wedding vendor relationship:
   contract, deposit, balance, who owes the next reply, the action for this
   week, and any red flag. Color-coded green / yellow / red.

   EDIT-ME: the VENDOR_HQ object below is the single source of truth for this
   tab. It's plain data — change a status, amount, or action and the dashboard
   updates. (Outside the site, the "wedding-vendor-hq-weekly" assistant task
   refreshes this same picture from Gmail every Monday; paste its updates here
   to keep the website in sync.)
   ========================================================================= */

window.VENDOR_HQ = {
  updated: "July 25, 2026 — caterer contract requested (Matt OOO til Mon); hotel + DJ outreach started",
  summary: [
    { n: "2", label: "Vendors fully locked (signed + deposit paid)" },
    { n: "2", label: "Deposits paid (venue + coordinator)" },
    { n: "$2,000", label: "Caterer deposit on hold until the contract is signed (Matt OOO until Mon)" },
    { n: "Reply to Lula", label: "Biggest thing to do this week" },
  ],
  vendors: [
    {
      status: "green",
      name: "Salvage One", who: "Colleen", category: "Venue",
      contract: "Signed", contractClass: "green",
      deposit: "Paid", depositClass: "green",
      balance: "Final balance per agreement (later)",
      last: "Feb 18, 2026", court: "—",
      action: "Confirm final-payment date; chase the floor plan Robin asked for",
      flag: "",
    },
    {
      status: "green",
      name: "Elegante Weddings & Events", who: "Lisa Jaroscak", category: "Coordinator",
      contract: "Signed", contractClass: "green",
      deposit: "Paid", depositClass: "green",
      balance: "Per agreement",
      last: "Jul 16, 2026", court: "You",
      action: "Send Lisa your guest list + signed vendor contracts she's expecting",
      flag: "",
    },
    {
      status: "yellow",
      name: "Catered by Design", who: "Matt / Nicole / Accounting", category: "Caterer (leading)",
      contract: "Requested", contractClass: "yellow",
      deposit: "$2,000 — hold until signed", depositClass: "yellow",
      balance: "Full catering TBD",
      last: "Jul 20, 2026 (Matt OOO until Mon)", court: "Them",
      action: "Waiting on the contract — follow up Monday when Matt's back, then sign & pay the deposit",
      flag: "Awaiting contract",
    },
    {
      status: "red",
      name: "Lula Cafe", who: "Anna Heerwagen", category: "Caterer (alternative)",
      contract: "Not sent", contractClass: "grey",
      deposit: "Not yet due", depositClass: "grey",
      balance: "Proposal on file",
      last: "Jul 1, 2026", court: "You",
      action: "Reply to Anna — book a tasting or politely pass (silent 24 days)",
      flag: "Going cold",
    },
    {
      status: "red",
      name: "Photographer", who: "none contacted yet", category: "Photographer",
      contract: "Not started", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "—",
      last: "—", court: "You",
      action: "Start outreach now — most overdue vendor on your timeline",
      flag: "Missing",
    },
    {
      status: "yellow",
      name: "Florist · DJ/Band · Hair & Makeup · Cake · Rentals", who: "", category: "Not started",
      contract: "—", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "—",
      last: "—", court: "You",
      action: "On the timeline for the next 2–3 months; no action this week",
      flag: "Upcoming",
    },
  ],
  dormant:
    "Dormant / closed catering bids on file: True Cuisine–SBR (quote expired Mar 12), " +
    "Beyond Catering, J&L / JFOD, Maison Cuisine, Cocina Fusion, Blue Plate. " +
    "Declined: The Wellsley (Boka). Alt venue closed: Ignite Glass Studios.",
  actions: [
    {
      level: "red",
      title: "1 · Reply to Lula Cafe before the lead goes cold",
      note: "Anna has been waiting since Jul 1. Decide: tasting, or a polite pass.",
      draft:
        "Hi Anna, so sorry for the slow reply — planning caught up with us! We loved the " +
        "proposal and would like to come in for a tasting. Are any of your Tuesday–Thursday " +
        "slots open in the next couple of weeks? Also, roughly what would the all-in per-head " +
        "land at for ~180 guests at Salvage One? Thanks so much! — Andy & Robin",
    },
    {
      level: "yellow",
      title: "2 · Follow up with Catered by Design on Monday",
      note: "You've asked for the full contract before paying the $2,000 deposit — good. Matt is out until Monday, so this is on hold with the ball in their court. Nudge him Monday if you haven't heard back, then sign and pay.",
      draft: "",
    },
    {
      level: "yellow",
      title: "3 · Send Elegante what Lisa is waiting on",
      note: "You're booked with Lisa; she's expecting your guest list and copies of signed vendor contracts to start coordinating. Not urgent, but clears the ball out of your court.",
      draft: "",
    },
    {
      level: "yellow",
      title: "4 · Kick off photographer outreach",
      note: "No photographer contacted yet and you're ~10 months out. Pull Robin's top-5 list and send the same quote request you used for caterers. Most time-sensitive gap.",
      draft: "",
    },
  ],
  risks: [
    { head: "Catered by Design — waiting on the contract.", body: "You've rightly held the $2,000 deposit until you can sign a full contract; Matt is OOO until Monday, so keep this warm and close it out early next week." },
    { head: "Lula Cafe — your best alternative is cooling.", body: "They've waited 24 days for a reply; warm caterers move on and you lose both a great option and negotiating leverage." },
    { head: "Photographer — nothing booked.", body: "With ~10 months to go this is your most overdue category, and the affordable-but-excellent photographers fill their weekends first." },
  ],
  hotels: [
    { name: "Palmer House Hilton", area: "The Loop", rate: "~$180–260", status: "Draft ready to send", statusClass: "yellow", contact: "CHIPH-salesadm@hilton.com", note: "Outreach drafted 7/25 — hit send (Tue–Thu)" },
    { name: "Kimpton Gray Hotel", area: "The Loop", rate: "~$220–300", status: "Draft ready to send", statusClass: "yellow", contact: "sales@grayhotelchicago.com", note: "Outreach drafted 7/25 — hit send (Tue–Thu)" },
    { name: "Hyatt House West Loop", area: "Fulton Mkt (closest to venue)", rate: "~$180–250", status: "Needs recipient", statusClass: "red", contact: "group sales 1-800-906-2871", note: "Draft ready; get sales email, then send" },
    { name: "Westin River North", area: "River North", rate: "~$200–300", status: "Needs recipient", statusClass: "red", contact: "call hotel — catering sales", note: "Draft ready; vet block terms (a review flagged their handling)" },
    { name: "Crowne Plaza West Loop", area: "Greektown", rate: "~$160–220", status: "Needs recipient", statusClass: "red", contact: "group sales 1-800-906-2871", note: "Draft ready; get sales email, then send" },
  ],
  hotelsNote:
    "Engine (Groups) — signed up 7/25 to source hotel-block proposals. Account not finished yet; " +
    "complete it at engine.com to start receiving hand-picked proposals. Manage/support: groups@engine.com. " +
    "No proposals received yet — watch for them.",
  djs: [
    { name: "Toast & Jam", frontrunner: true, skill: "Curator / seamless transitions", rate: "from ~$2,850", status: "Draft ready to send", statusClass: "yellow", contact: "info@toastandjamdjs.com", next: "Front-runner. Ready to send — press on how much they mix LIVE vs. preset playlist" },
    { name: "Hot Mix Entertainment", skill: "Live mixing (Hot Mix 5 pedigree)", rate: "~$1,995+ (photobooth add-on)", status: "Draft ready to send", statusClass: "yellow", contact: "scott@hotmixentertainment.com", next: "Ready to send — confirm Scott is your DJ + real print booth cost" },
    { name: "Love Ent by Milk Majer", skill: "Open-format touring artist", rate: "~$1,995+", status: "Needs recipient", statusClass: "red", contact: "773-206-8513 / loveentweddings.com", next: "Get email from site, then send" },
    { name: "DJ-Chicago", skill: "Seamless mixes + song edits", rate: "$$ (reasonable)", status: "Needs recipient", statusClass: "red", contact: "dj-chicago.com contact form", next: "Submit form; ask who's assigned + a mix demo" },
    { name: "Fig Media", skill: "Premium, reads the room", rate: "premium (top of budget)", status: "Needs recipient", statusClass: "red", contact: "figmedia.com contact form", next: "Submit form; confirm price + whether booth is enclosed/print" },
  ],
  djsNote:
    "Budget ~$3,500. Priority is real live mixing, not playlist DJs; an enclosed print photobooth is a nice-to-have, not required. " +
    "All five drafted 7/25 — Toast & Jam and Hot Mix are ready to send; Milk Majer, DJ-Chicago and Fig Media need a recipient.",
};

(function () {
  "use strict";

  var app = window.AdminApp;
  var esc = app.escapeHtml;

  function tag(text, cls) {
    return '<span class="vhq-tag vhq-' + cls + '">' + esc(text) + "</span>";
  }

  function render() {
    var d = window.VENDOR_HQ;
    var html = "";

    html +=
      '<p class="vhq-sub">Snapshot as of ' + esc(d.updated) +
      ". Refreshes each Monday via the assistant's weekly Gmail scan. " +
      'Edit <code>js/vendor-hq.js</code> to update by hand.</p>';

    // summary cards
    html += '<div class="vhq-cards">';
    d.summary.forEach(function (c) {
      html += '<div class="vhq-card"><div class="vhq-n">' + esc(c.n) +
        '</div><div class="vhq-l">' + esc(c.label) + "</div></div>";
    });
    html += "</div>";

    // vendor table
    html += '<div class="table-scroll"><table class="report-table vhq-table"><thead><tr>' +
      "<th>Vendor</th><th>Category</th><th>Contract</th><th>Deposit</th><th>Balance</th>" +
      "<th>Last msg</th><th>Ball in whose court</th><th>Action this week</th><th>Flag</th>" +
      "</tr></thead><tbody>";
    d.vendors.forEach(function (v) {
      var name = "<strong>" + esc(v.name) + "</strong>" +
        (v.who ? '<span class="vhq-who">' + esc(v.who) + "</span>" : "");
      html += '<tr class="vhq-row-' + v.status + '">' +
        "<td>" + name + "</td>" +
        "<td>" + esc(v.category) + "</td>" +
        "<td>" + tag(v.contract, v.contractClass) + "</td>" +
        "<td>" + tag(v.deposit, v.depositClass) + "</td>" +
        "<td>" + esc(v.balance) + "</td>" +
        "<td>" + esc(v.last) + "</td>" +
        "<td>" + esc(v.court) + "</td>" +
        "<td>" + esc(v.action) + "</td>" +
        "<td>" + (v.flag ? tag(v.flag, v.status) : "—") + "</td>" +
        "</tr>";
    });
    html += "</tbody></table></div>";
    html += '<p class="toolbar-hint">' + esc(d.dormant) + "</p>";

    // action list
    html += "<h2>This week's action list</h2>";
    d.actions.forEach(function (a) {
      html += '<div class="vhq-action vhq-action-' + a.level + '">' +
        "<h3>" + esc(a.title) + "</h3>" +
        '<p class="vhq-do">' + esc(a.note) + "</p>" +
        (a.draft ? '<div class="vhq-draft">' + esc(a.draft) + "</div>" : "") +
        "</div>";
    });

    // at-risk
    html += "<h2>Three relationships most at risk</h2>";
    d.risks.forEach(function (r) {
      html += '<div class="vhq-risk"><strong>' + esc(r.head) + "</strong> " +
        esc(r.body) + "</div>";
    });

    // hotel room blocks
    if (d.hotels && d.hotels.length) {
      html += "<h2>Hotel room blocks</h2>";
      html += '<div class="table-scroll"><table class="report-table vhq-table"><thead><tr>' +
        "<th>Hotel</th><th>Area</th><th>Est. rate/night</th><th>Status</th><th>Contact</th><th>Next step</th>" +
        "</tr></thead><tbody>";
      d.hotels.forEach(function (h) {
        html += '<tr class="vhq-row-' + h.statusClass + '">' +
          "<td><strong>" + esc(h.name) + "</strong></td>" +
          "<td>" + esc(h.area) + "</td>" +
          "<td>" + esc(h.rate) + "</td>" +
          "<td>" + tag(h.status, h.statusClass) + "</td>" +
          "<td>" + esc(h.contact) + "</td>" +
          "<td>" + esc(h.note) + "</td>" +
          "</tr>";
      });
      html += "</tbody></table></div>";
      if (d.hotelsNote) html += '<p class="toolbar-hint">' + esc(d.hotelsNote) + "</p>";
    }

    // DJ leads
    if (d.djs && d.djs.length) {
      html += "<h2>DJ leads</h2>";
      html += '<div class="table-scroll"><table class="report-table vhq-table"><thead><tr>' +
        "<th>DJ</th><th>Style / skill</th><th>Est. price</th><th>Status</th><th>Contact</th><th>Next step</th>" +
        "</tr></thead><tbody>";
      d.djs.forEach(function (dj) {
        var rowcls = dj.frontrunner ? "vhq-frontrunner" : ("vhq-row-" + dj.statusClass);
        var nm = "<strong>" + esc(dj.name) + "</strong>";
        if (dj.frontrunner) nm += ' <span class="vhq-star">\u2605 FRONT-RUNNER</span>';
        html += '<tr class="' + rowcls + '">' +
          "<td>" + nm + "</td>" +
          "<td>" + esc(dj.skill) + "</td>" +
          "<td>" + esc(dj.rate) + "</td>" +
          "<td>" + tag(dj.status, dj.statusClass) + "</td>" +
          "<td>" + esc(dj.contact) + "</td>" +
          "<td>" + esc(dj.next) + "</td>" +
          "</tr>";
      });
      html += "</tbody></table></div>";
      if (d.djsNote) html += '<p class="toolbar-hint">' + esc(d.djsNote) + "</p>";
    }

    document.getElementById("vendorhq-sheet").innerHTML = html;
  }

  app.tabHooks.vendorhq = render;
})();
