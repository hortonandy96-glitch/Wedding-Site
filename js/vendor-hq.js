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
  updated: "August 16, 2026 — caterer signed & deposit paid; Engine room block fully executed; photographer decision due Friday Aug 21 (Afterglow quote expires Aug 17); after-party quote in hand",
  summary: [
    { n: "3", label: "Vendors fully locked (signed + deposit paid)" },
    { n: "20 rooms", label: "Room block signed — Engine LOI fully executed Aug 16" },
    { n: "Aug 17", label: "Afterglow photography quote expires — tomorrow" },
    { n: "Aug 21", label: "Your self-set deadline to pick a photographer" },
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
      status: "yellow",
      name: "Elegante Weddings & Events", who: "Lisa Jaroscak", category: "Coordinator",
      contract: "Signed", contractClass: "green",
      deposit: "Paid", depositClass: "green",
      balance: "Per agreement",
      last: "Jul 16, 2026", court: "You",
      action: "Send Lisa the guest list + the now-signed Catered by Design contract she's been waiting on",
      flag: "You owe her",
    },
    {
      status: "green",
      name: "Catered by Design", who: "Matt Grosso", category: "Caterer — BOOKED",
      contract: "Signed Aug 3", contractClass: "green",
      deposit: "$2,000 paid Aug 2", depositClass: "green",
      balance: "Full catering balance TBD",
      last: "Aug 3, 2026", court: "—",
      action: "Done for now — send a copy to Lisa, then ask Matt about tasting + menu timeline",
      flag: "",
    },
    {
      status: "red",
      name: "Afterglow Studio", who: "Hanako", category: "Photographer",
      contract: "Quote #1046 issued", contractClass: "yellow",
      deposit: "—", depositClass: "grey",
      balance: "Quote expires Aug 17, 2026",
      last: "Aug 16, 2026 (you)", court: "You",
      action: "Quote expires TOMORROW but you told her you'd decide Friday — ask her to extend the soft hold to Aug 21",
      flag: "Expires tomorrow",
    },
    {
      status: "yellow",
      name: "Genuinely Jo Photography", who: "Jordan McDonnell", category: "Photographer",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "2027 Wedding Handbook sent",
      last: "Aug 3, 2026", court: "Scheduled",
      action: "Discovery call booked Wed Aug 19, 5:00pm CDT — this is the last of the three",
      flag: "Call Aug 19",
    },
    {
      status: "yellow",
      name: "Allie Idrac", who: "hello@allieidrac.com", category: "Photographer",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Package guide sent",
      last: "Aug 2, 2026", court: "You",
      action: "Call happened Wed Aug 5 — no follow-up since. Include her in Friday's decision and reply either way",
      flag: "Silent 14 days",
    },
    {
      status: "yellow",
      name: "Friends of Friends", who: "Abe Vucekovich", category: "After-party bar",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "~$7,500 all-in (full buyout)",
      last: "Aug 9, 2026", court: "You",
      action: "Abe confirmed $6k + 25% gratuity ≈ $7,500 for 11pm–2am. You said you'd discuss with Robin — decide or ask to hold",
      flag: "Silent 7 days",
    },
    {
      status: "yellow",
      name: "Florist · Hair & Makeup · Cake · Rentals", who: "", category: "Not started",
      contract: "—", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "—",
      last: "—", court: "You",
      action: "On the timeline for the next 2–3 months; no action this week",
      flag: "Upcoming",
    },
  ],
  dormant:
    "Closed since the last refresh: Lula Cafe (you passed Aug 2, kindly), Palmer House Hilton " +
    "(you declined Aug 2 in favour of the Engine block; Jordan acknowledged Aug 3), and Kimpton Gray " +
    "(declined — citywide event on your dates). Older dormant catering bids: True Cuisine–SBR (quote expired Mar 12), " +
    "Beyond Catering, J&L / JFOD, Maison Cuisine, Cocina Fusion, Blue Plate. Declined: The Wellsley (Boka). " +
    "Alt venue closed: Ignite Glass Studios.",
  actions: [
    {
      level: "red",
      title: "1 · Ask Afterglow to extend the quote past Friday",
      note: "Hanako's Quote #1046 expires Aug 17 (tomorrow) and her soft hold on 5/21/27 goes with it. You told her on Aug 16 you'd decide by Friday Aug 21 — but you didn't ask her to extend the quote, so those two dates collide. One short email fixes it.",
      draft:
        "Hi Hanako, thanks again for your patience! I realised your proposal expires tomorrow (Aug 17), " +
        "but our last photographer call is Wednesday and we're deciding Friday the 21st. " +
        "Would you be able to extend the quote and the soft hold through Friday? " +
        "We don't want the date to slip just on timing. Thanks so much! — Andy & Robin",
    },
    {
      level: "yellow",
      title: "2 · Genuinely Jo discovery call — Wed Aug 19, 5:00pm CDT",
      note: "Your third and final photographer conversation. Worth having your questions ready: total coverage hours, second shooter, engagement session (she offered one free), delivery timeline, and what the all-in number actually is versus Afterglow and Allie.",
      draft: "",
    },
    {
      level: "yellow",
      title: "3 · Decide the photographer by Friday Aug 21",
      note: "All three are available and all three are now waiting on you: Afterglow (call done Aug 3, quote live), Allie Idrac (call done Aug 5, silent 14 days), Genuinely Jo (call Aug 19). Whoever you pick, send the other two a short no — they've all been quick and kind with you.",
      draft: "",
    },
    {
      level: "yellow",
      title: "4 · Send Lisa the guest list and the signed catering contract",
      note: "This has been on the list since July 16 and is now easier: the Catered by Design contract was fully signed Aug 3, so you can send it along with the guest list. Clearing this lets your coordinator actually start coordinating.",
      draft: "",
    },
    {
      level: "yellow",
      title: "5 · Two DJ decisions are sitting open",
      note: "Hot Mix (Scott) quoted $3,500 + $1,295 booth + $550 ceremony on Jul 27 and has heard nothing for 20 days. Groove is in the Heart quoted $2,450 flat all-in on Aug 10 — cheaper, includes ceremony and mics, no photo booth (they recommend GlitterGuts) — and offered a call with DJ Clare. That quote is good for 30 days, so roughly Sep 9.",
      draft: "",
    },
    {
      level: "yellow",
      title: "6 · Friends of Friends after-party — $7,500 confirmed",
      note: "Abe confirmed on Aug 9 that $6k + tax + 25% auto-gratuity ≈ $7,500 buys the full bar 11pm–2am. He won't do a cash bar. You said you'd talk it over with Robin and haven't replied in 7 days; he also warned that late semi-private bookings are hard in patio season.",
      draft: "",
    },
  ],
  risks: [
    { head: "Afterglow's quote expires tomorrow — and with it the soft hold on your date.", body: "You've already told her you're deciding Friday, so this is purely an admin mismatch. Ask for the extension today rather than letting a photographer you like lapse on a technicality." },
    { head: "Hot Mix has been waiting 20 days for a reply.", body: "Scott turned around a quote in under 48 hours and has heard nothing since Jul 27. He was your front-runner on skill; either re-engage or let him go, but don't leave him hanging while you weigh the cheaper Groove quote." },
    { head: "Allie Idrac has gone quiet for 14 days after her call.", body: "The Aug 5 call happened and neither side followed up. If she's still a contender, say so before Friday; a silent fortnight after a good call reads as a no." },
  ],
  hotels: [
    { name: "Residence Inn Chicago Downtown/Loop", area: "Downtown / The Loop (via Engine)", rate: "From $304/night", status: "SIGNED Aug 16", statusClass: "green", contact: "Peter Fanous · Engine HE-261848", note: "LOI fully executed Aug 16 via Conga Sign — 20 rooms / 60 room nights, Thu 5/20–Sun 5/23/27. Now live on the public site. Still to come: the guest booking link. Send a copy to Lisa" },
    { name: "Second block — sourcing", area: "Chicago", rate: "Max $291/night requested", status: "Request submitted Aug 16", statusClass: "yellow", contact: "Engine (new request)", note: "You submitted a fresh Engine request Aug 16 for 40 double rooms, 3 stars or above, 5/20–5/23/27. Proposals expected within 4–6 hours — review as they land" },
    { name: "Palmer House Hilton", area: "The Loop", rate: "$329 (suite $659)", status: "You declined", statusClass: "grey", contact: "Jordan Samson · Hilton", note: "Declined Aug 2 in favour of the Engine block; Jordan acknowledged Aug 3. Closed — no action" },
    { name: "Kimpton Gray", area: "The Loop", rate: "—", status: "They declined", statusClass: "grey", contact: "Corey Jones", note: "Citywide event on your dates. You closed the loop Aug 2. No action" },
  ],
  hotelsNote:
    "Engine (Groups), rep Peter Fanous. The original account HE-258133 has been superseded by HE-261848. " +
    "Note the date fix: the first request went in as 5/27–5/30/27 and was corrected to 5/20–5/23/27 on Aug 3 — worth double-checking " +
    "the executed LOI shows the right dates. Accepting one Engine proposal closes the others, which is why the second block " +
    "is a separate request. Proposals seen and now lapsed: Crowne Plaza West Loop ($259), Royal Sonesta River North ($269), " +
    "Residence Inn Loop ($304), Westin River North ($312), Godfrey ($329), Marriott Mag Mile ($468), The Gwen ($748–763).",
  djs: [
    { name: "Groove is in the Heart", frontrunner: true, skill: "DJ Clare — full service, ceremony included", rate: "$2,450 flat (6 hrs; +$200 per extra 30 min)", status: "Quoted Aug 10 — your reply due", statusClass: "yellow", contact: "info@grooveisintheheartdjs.com", next: "Best value: flat fee covers ceremony services, wireless mics and extra speakers. No photo booth (they recommend GlitterGuts). Offered a Zoom/phone meet with Clare — quote valid ~30 days, so about Sep 9" },
    { name: "Hot Mix Entertainment", skill: "Live mixing (Hot Mix 5 pedigree)", rate: "$3,500 DJ + $1,295 photo booth + $550 ceremony", status: "Silent 20 days — you owe a reply", statusClass: "red", contact: "scott@hotmixentertainment.com", next: "Scott quoted Jul 27 and has heard nothing since. Comparable scope is $4,050 vs Groove's $2,450 — re-engage or send a polite pass" },
    { name: "Toast & Jam", skill: "Curator / seamless transitions", rate: "from ~$2,850", status: "Email bounced", statusClass: "red", contact: "info@toastandjamdjs.com (invalid)", next: "Address not found — find a working email or contact form on their site" },
    { name: "Love Ent by Milk Majer", skill: "Open-format touring artist", rate: "~$1,995+", status: "Needs recipient", statusClass: "red", contact: "773-206-8513 / loveentweddings.com", next: "Get email from site, then send" },
    { name: "DJ-Chicago", skill: "Seamless mixes + song edits", rate: "$$ (reasonable)", status: "Needs recipient", statusClass: "red", contact: "dj-chicago.com contact form", next: "Submit form; ask who's assigned + a mix demo" },
    { name: "Fig Media", skill: "Premium, reads the room", rate: "premium (top of budget)", status: "Needs recipient", statusClass: "red", contact: "figmedia.com contact form", next: "Submit form; confirm price + whether booth is enclosed/print" },
  ],
  djsNote:
    "Budget ~$3,500. Priority is real live mixing, not playlist DJs; an enclosed print photobooth is a nice-to-have, not required. " +
    "Two live quotes now: Groove is in the Heart at $2,450 all-in (ceremony included, no booth) and Hot Mix at $3,500 + add-ons. " +
    "If the photo booth matters, GlitterGuts is the recommended standalone pairing with Groove. Toast & Jam's email bounced; " +
    "Milk Majer, DJ-Chicago and Fig Media still need a recipient.",
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
