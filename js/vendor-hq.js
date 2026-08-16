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
  updated: "August 2, 2026 — 3 photographers confirmed available; Palmer House hotel offer in hand (expires Aug 3); Engine proposals now flowing; Kimpton Gray declined",
  summary: [
    { n: "2", label: "Vendors fully locked (signed + deposit paid)" },
    { n: "3", label: "Photographers replied — all 3 confirmed available for your date" },
    { n: "$2,000", label: "Caterer deposit on hold until the contract is signed (Matt back Mon)" },
    { n: "Palmer House", label: "Hotel offer in hand — $329 rate expires Aug 3" },
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
      last: "Jul 28, 2026 (auto-reply; Matt back Jul 27)", court: "Them",
      action: "Waiting on the contract — follow up now that Matt's back, then sign & pay the deposit",
      flag: "Awaiting contract",
    },
    {
      status: "red",
      name: "Lula Cafe", who: "Anna Heerwagen", category: "Caterer (alternative)",
      contract: "Not sent", contractClass: "grey",
      deposit: "Not yet due", depositClass: "grey",
      balance: "Proposal on file",
      last: "Jul 1, 2026", court: "You",
      action: "Reply to Anna — book a tasting or politely pass (silent 32 days)",
      flag: "Going cold",
    },
    {
      status: "yellow",
      name: "Afterglow Studio", who: "Hanako", category: "Photographer",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Pricing guide sent",
      last: "Jul 27, 2026", court: "You",
      action: "Confirmed available 5/21/27 & loves Salvage One. Review her pricing guide + book the intro call she offered",
      flag: "Available",
    },
    {
      status: "yellow",
      name: "Allie Idrac", who: "hello@allieidrac.com", category: "Photographer",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Package guide sent",
      last: "Jul 27, 2026", court: "You",
      action: "Confirmed available & sent 2 sample galleries + package guide. Review and reply",
      flag: "Available",
    },
    {
      status: "yellow",
      name: "Genuinely Jo Photography", who: "Jordan McDonnell", category: "Photographer",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "2027 Wedding Handbook",
      last: "Jul 29, 2026", court: "You",
      action: "Confirmed available 5/21/27. Sent handbook + offers a free engagement session & discovery call. Review and book the call",
      flag: "Available",
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
    "Declined: The Wellsley (Boka). Alt venue closed: Ignite Glass Studios. " +
    "Hotel declined: Kimpton Gray (citywide event on your dates — no reply planned).",
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
      title: "2 · Decide on Palmer House before Aug 3",
      note: "Palmer House Hilton replied with a real offer: 19 rooms at $329/night (+ 1 suite at $659) for Thu 5/20–Sun 5/23/27, as a courtesy block with no financial liability on you (3-night minimum). The rate is only held through Aug 3, so reply to Jordan Samson to accept, ask a question, or request an extension. Kimpton Gray declined (citywide event) and needs no reply.",
      draft: "",
    },
    {
      level: "yellow",
      title: "3 · Compare your three available photographers",
      note: "All three confirmed 5/21/27 is open and each has the ball in your court: Afterglow Studio (Hanako) sent a pricing guide + intro-call link, Allie Idrac sent a package guide + two sample galleries, and Genuinely Jo (Jordan McDonnell) sent her 2027 Wedding Handbook plus a free engagement session and discovery call offer. Compare against budget and book a call with your favorite.",
      draft: "",
    },
    {
      level: "yellow",
      title: "4 · Follow up with Catered by Design",
      note: "You've asked for the full contract before paying the $2,000 deposit — good. Matt was out until Jul 27, so nudge him this week, then sign and pay.",
      draft: "",
    },
    {
      level: "yellow",
      title: "5 · Send Elegante what Lisa is waiting on",
      note: "You're booked with Lisa; she's expecting your guest list and copies of signed vendor contracts to start coordinating. Not urgent, but clears the ball out of your court.",
      draft: "",
    },
  ],
  risks: [
    { head: "Palmer House — the offer expires Aug 3.", body: "A no-liability courtesy block at $329/night is a strong result; if you like it, reply before the rate lapses or ask Jordan to extend it." },
    { head: "Catered by Design — waiting on the contract.", body: "You've rightly held the $2,000 deposit until you can sign a full contract; Matt is back from leave, so keep this warm and close it out this week." },
    { head: "Lula Cafe — your best alternative is cooling.", body: "They've waited 32 days for a reply; warm caterers move on and you lose both a great option and negotiating leverage." },
  ],
  hotels: [
    { name: "Palmer House Hilton", area: "The Loop", rate: "$329 (suite $659) + tax/fees", status: "Offer received", statusClass: "green", contact: "Jordan Samson · Jordan.Samson@hilton.com", note: "Courtesy block, no liability, 3-night min. Reply to accept — rate held through Aug 3" },
    { name: "Hyatt House West Loop", area: "Fulton Mkt (closest to venue)", rate: "~$180–250", status: "Needs recipient", statusClass: "red", contact: "group sales 1-800-906-2871", note: "Draft ready; get sales email, then send (Engine hasn't sourced this one)" },
    { name: "Westin River North", area: "River North", rate: "from $312 (via Engine)", status: "Engine proposal", statusClass: "yellow", contact: "Engine account HE-258133", note: "Engine already sourced this — review in Engine; manual draft likely redundant. Expires Aug 13" },
    { name: "Crowne Plaza West Loop", area: "Greektown", rate: "from $259 (via Engine)", status: "Engine proposal", statusClass: "yellow", contact: "Engine account HE-258133", note: "Engine already sourced this — review in Engine; expires Aug 3" },
  ],
  hotelsNote:
    "Engine (Groups) — account is now finished and proposals are flowing (rep: Peter Fanous, account HE-258133). " +
    "Received so far: Hotel Chicago Downtown/Autograph (from $199), Crowne Plaza West Loop ($259), Royal Sonesta River North ($269), " +
    "Westin River North ($312), The Gwen ($339), Godfrey ($399). Several expire Aug 3–4 — review at engine.com. " +
    "Kimpton Gray removed: declined due to a citywide event on your dates (offered sister properties voco Downtown / InterContinental Mag Mile); you're not replying.",
  djs: [
    { name: "Hot Mix Entertainment", frontrunner: true, skill: "Live mixing (Hot Mix 5 pedigree)", rate: "$3,500 DJ + $1,295 photo booth + $550 ceremony", status: "Quoted — your reply due", statusClass: "yellow", contact: "scott@hotmixentertainment.com", next: "Scott confirmed available & sent pricing 7/27. Decide on photo booth / ceremony add-ons and reply" },
    { name: "Toast & Jam", skill: "Curator / seamless transitions", rate: "from ~$2,850", status: "Email bounced", statusClass: "red", contact: "info@toastandjamdjs.com (invalid)", next: "Address not found — find a working email or contact form on their site" },
    { name: "Love Ent by Milk Majer", skill: "Open-format touring artist", rate: "~$1,995+", status: "Needs recipient", statusClass: "red", contact: "773-206-8513 / loveentweddings.com", next: "Get email from site, then send" },
    { name: "DJ-Chicago", skill: "Seamless mixes + song edits", rate: "$$ (reasonable)", status: "Needs recipient", statusClass: "red", contact: "dj-chicago.com contact form", next: "Submit form; ask who's assigned + a mix demo" },
    { name: "Fig Media", skill: "Premium, reads the room", rate: "premium (top of budget)", status: "Needs recipient", statusClass: "red", contact: "figmedia.com contact form", next: "Submit form; confirm price + whether booth is enclosed/print" },
  ],
  djsNote:
    "Budget ~$3,500. Priority is real live mixing, not playlist DJs; an enclosed print photobooth is a nice-to-have, not required. " +
    "Hot Mix (Scott) confirmed available and quoted 7/27. Toast & Jam's email bounced. Milk Majer, DJ-Chicago and Fig Media still need a recipient.",
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
