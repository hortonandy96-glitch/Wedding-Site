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
  updated: "September 14, 2026 — the DJ is done. You sent the $1,397.50 retainer by Zelle on Sep 9, Toast & Jam confirmed it on Sep 10, and they've already assigned you a DJ. That's five vendors fully locked and, for the first time since July, nothing with a hard deadline this week. One correction to last week's board: the Residence Inn booking link never actually arrived. It is still missing, eleven days after Gracie said it was coming, and it is the thing holding up your save-the-dates",
  summary: [
    { n: "5", label: "Vendors fully locked (signed + deposit paid)" },
    { n: "$5,897.50", label: "Deposits paid to date with amounts on record" },
    { n: "0", label: "Hard deadlines this week — first time since July" },
    { n: "6", label: "Vendors waiting on a reply from you" },
  ],
  vendors: [
    {
      status: "red",
      name: "Engine / Residence Inn booking link", who: "Peter Fanous · Gracie Larey", category: "Hotels — link still missing",
      contract: "LOI executed Aug 16", contractClass: "green",
      deposit: "None required (courtesy block)", depositClass: "green",
      balance: "20 rooms / 60 room nights, Thu 5/20–Sun 5/23/27",
      last: "Sep 13, 2026 (Peter)", court: "Both",
      action: "Correcting last week's board: the booking link has never arrived. Gracie said on Sep 3 that her events team would send it 'soon' and nothing has come in the eleven days since. Reply on the existing thread and ask Gracie and Peter for the URL directly — and separately answer Peter, who has now chased you twice about the budget-hotel proposals",
      flag: "11 days, no link",
    },
    {
      status: "red",
      name: "Emporium Arcade Bar", who: "Raven Williams", category: "Welcome party — Thu May 20",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Reserved section, ~150 guests, two-drink-ticket package",
      last: "Aug 24, 2026 (you)", court: "Raven",
      action: "Three weeks of silence since you asked about a reserved section rather than a full buyout. One short nudge is worth sending, but this is the point to line up a second welcome-party option rather than keep waiting",
      flag: "Silent 21 days",
    },
    {
      status: "yellow",
      name: "Elegante Weddings & Events", who: "Lisa Jaroscak", category: "Coordinator",
      contract: "Signed", contractClass: "green",
      deposit: "Paid", depositClass: "green",
      balance: "Per agreement",
      last: "Jul 16, 2026", court: "You",
      action: "60 days since you promised her the guest list and signed vendor contracts. You now have all five — venue, coordinator, caterer, photographer, DJ — plus an executed room-block LOI. Send the bundle in one email and let her start doing the job you hired her for",
      flag: "You owe her — 60 days",
    },
    {
      status: "yellow",
      name: "Catered by Design", who: "Matt Gray", category: "Caterer — BOOKED",
      contract: "Signed Aug 3", contractClass: "green",
      deposit: "$2,000 paid Aug 2", depositClass: "green",
      balance: "Revised quote sent Aug 24 (150 guests + ceremony chairs) — awaiting your yes",
      last: "Aug 24, 2026", court: "You",
      action: "Three weeks on, Matt's revised pricing with the white padded garden chairs is still unanswered. This is the biggest single number in your budget and Lisa needs it. Confirm the guest count, then ask about the payment schedule and a tasting date",
      flag: "You owe — 21 days",
    },
    {
      status: "yellow",
      name: "Toast & Jam", who: "Melissa Riddle · DJ Chris Gemerchak", category: "DJ — BOOKED",
      contract: "Signed Sep 2", contractClass: "green",
      deposit: "$1,397.50 paid Sep 9 (Zelle, no fee)", depositClass: "green",
      balance: "Total fee $2,795.00 — remaining balance $1,397.50",
      last: "Sep 10, 2026", court: "You",
      action: "Locked. The Zelle went out Sep 9 and avoided the 4% card fee, saving about $56. On Sep 10 they introduced Chris Gemerchak as your DJ — send him a short hello and ask when the planning calls start and when the remaining $1,397.50 is due",
      flag: "Say hi to Chris",
    },
    {
      status: "yellow",
      name: "Friends of Friends", who: "Abe Vucekovich", category: "After-party bar",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "~$7,500 all-in ($6,000 open bar + 25% gratuity), 11pm–2am buyout",
      last: "Aug 9, 2026", court: "You",
      action: "Abe confirmed the $7,500 figure on Aug 9 and has heard nothing for over five weeks. He warned up front that late semi-private bookings get hard once patio season starts. Either commit, ask him to hold the date, or release it",
      flag: "You owe — 36 days",
    },
    {
      status: "yellow",
      name: "Garfield's Beverage", who: "Danielle Woller", category: "Alcohol supply",
      contract: "Mock quote only", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Sample quote for 100 guests — real quote needs your answers",
      last: "Aug 17, 2026", court: "You",
      action: "She needs six answers before she can quote: venue, caterer, wine with dinner or bar only, champagne toast, signature cocktails, end-of-event pickup. Ten minutes of work that has now been waiting four weeks",
      flag: "You owe — 28 days",
    },
    {
      status: "yellow",
      name: "DJ runners-up", who: "Nick at DJ-Chicago · Clare at Groove", category: "DJ — owed a polite no",
      contract: "—", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Groove $2,450 flat (quote lapsed ~Sep 9) · DJ-Chicago no quote requested",
      last: "Sep 1, 2026", court: "You",
      action: "Toast & Jam is signed and paid, so there is nothing left to weigh. Nick has followed up three times (Aug 17, Aug 25, Sep 1) and deserves a real answer; Clare quoted on Aug 10 and her quote has now lapsed. One warm line each and both are closed properly",
      flag: "Send two short notes",
    },
    {
      status: "green",
      name: "Salvage One", who: "Colleen", category: "Venue",
      contract: "Signed", contractClass: "green",
      deposit: "Paid", depositClass: "green",
      balance: "Final balance per agreement (later)",
      last: "Aug 18, 2026", court: "—",
      action: "Nothing owed. She confirmed on Aug 18 that caterers handle ceremony chairs — usually through Tablescapes",
      flag: "",
    },
    {
      status: "green",
      name: "Allie Idrac", who: "hello@allieidrac.com", category: "Photographer — BOOKED",
      contract: "Signed Aug 30", contractClass: "green",
      deposit: "$2,500 paid Aug 31", depositClass: "green",
      balance: "6-hour wedding package — remaining balance per Dubsado contract",
      last: "Sep 1, 2026", court: "—",
      action: "Done. She confirmed on Sep 1 that you're all set on her end. Next natural step, whenever you feel like it, is putting an engagement session on the calendar",
      flag: "",
    },
    {
      status: "yellow",
      name: "Florist · Hair & Makeup · Cake", who: "", category: "Not started",
      contract: "—", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "—",
      last: "—", court: "You",
      action: "With the DJ fully closed out, florist is the sensible next search, then hair & makeup, then cake. Rentals is partly solved already — ceremony chairs come through the caterer. Eight months out, florist is the one with real availability pressure",
      flag: "Start florist",
    },
  ],
  dormant:
    "The DJ search is closed and paid. Fig Media is done — you sent Brent a polite no on Sep 2 and he replied warmly the same day; Hot Mix has been silent since Aug 16 and needs nothing. Photography closed earlier: Afterglow Studio (Hanako closed her own lead Aug 27) and Genuinely Jo (Robin sent Jordan a warm no Aug 25; Jordan replied graciously Aug 27). Previously closed: Lula Cafe (you passed Aug 2), Palmer House Hilton (declined Aug 2), Kimpton Gray (they declined — citywide event). Dormant catering bids: True Cuisine–SBR, Beyond Catering, J&L / JFOD, Maison Cuisine, Cocina Fusion, Blue Plate. Declined: The Wellsley (Boka). Alt venue closed: Ignite Glass Studios. DJ leads never contacted: Love Ent by Milk Majer.",
  actions: [
    {
      level: "red",
      title: "1 · Chase the Residence Inn booking link — it never arrived",
      note: "Last week's board said this link had been delivered on Sep 3. It hadn't, and it still hasn't. What actually happened on Sep 3 is that Gracie apologised for having the wrong Engine contact in her system and said her events team 'should be sending it over soon' — and then nothing. The block itself has been signed since Aug 16 and 20 rooms are being held, but not one guest can book into it without a URL, which means save-the-dates stay parked. Reply on the existing 'Block Booking link' thread so Gracie and Peter both see it.",
      draft:
        "Hi Gracie, following up on your Sep 3 note — we still haven't received the booking link for our " +
        "block at the Residence Inn Chicago Downtown/Loop (May 20–23, 2027, under Horton/Beattie). " +
        "Could you or your events team send the URL this week? We're ready to put it on our wedding " +
        "website and start sending save-the-dates, and it's the last thing we're waiting on. " +
        "Peter — copying you in case it's easier to pull from your side. Thank you both. — Andy",
    },
    {
      level: "red",
      title: "2 · Reply to Peter — both budget proposals expired unanswered",
      note: "Freehand Chicago at $239 expired on Sep 13 and Holiday Inn Express at $359 expired on Sep 11, both without an answer. Peter has now chased twice, on Sep 10 and again on Sep 13 marked urgent, and he still owes you the promised update on The Gwen from Sep 2. Nothing is lost — proposals can be re-requested — but the honest read is that a $154 cap will keep coming back empty for a Thursday-to-Sunday downtown in May. Peter's own advice was to shrink the ask to 10–20 rooms so it stays a courtesy block.",
      draft:
        "Hi Peter, sorry for the slow reply — the Freehand and Holiday Inn proposals lapsed before we got " +
        "to them. Could you re-request Freehand at around $240 a night, but for 10–20 rooms rather than " +
        "35 so it stays a courtesy block? Also, any word from The Gwen? And we're still waiting on the " +
        "Residence Inn booking link from Gracie's events team — any help chasing that is appreciated. " +
        "Thanks, Andy",
    },
    {
      level: "yellow",
      title: "3 · Send Lisa the guest list and the signed contracts",
      note: "Open since Jul 16 — 60 days, and by a distance the oldest thing on this board. You now have five signed vendor agreements (venue, coordinator, caterer, photographer, DJ) and an executed room-block LOI. Every week this sits is a week your coordinator can't coordinate, and she has waited politely since the day she was hired.",
      draft: "",
    },
    {
      level: "yellow",
      title: "4 · Reply to Matt on the revised catering quote",
      note: "Matt sent updated pricing on Aug 24 for 150 guests plus white padded garden chairs for the outdoor ceremony — the chair question the venue bounced back to catering. Three weeks later he's still waiting. Confirming it gives you a final catering number for Lisa's bundle, and it's the natural moment to ask about the payment schedule and the tasting.",
      draft: "",
    },
    {
      level: "yellow",
      title: "5 · Say hello to DJ Chris and ask what's next",
      note: "Toast & Jam introduced Chris Gemerchak as your DJ on Sep 10. Nothing is required of you, but a two-line hello costs nothing and starts the relationship well. Worth asking in the same note when planning calls usually begin and when the remaining $1,397.50 balance is due, so it goes on the payment schedule rather than surprising you later.",
      draft: "",
    },
    {
      level: "yellow",
      title: "6 · Answer Friends of Friends and Garfield's",
      note: "Abe confirmed the $7,500 after-party buyout on Aug 9 and has heard nothing in 36 days. Danielle at Garfield's sent a sample quote on Aug 17 and needs six quick answers (venue, caterer, wine with dinner, champagne toast, signature cocktails, end-of-event pickup) before she can price your actual bar. Neither takes more than ten minutes and both have waited a month.",
      draft: "",
    },
    {
      level: "yellow",
      title: "7 · Close the two remaining DJs, nudge Emporium, start florist",
      note: "Nick at DJ-Chicago has followed up three times without ever getting an answer, and Clare at Groove quoted $2,450 back on Aug 10 — one warm line each and both are done. Raven at Emporium has been silent 21 days, so send one bump and start looking at a second welcome-party venue in parallel. Then florist: it is the next real search and the one where good people book out earliest.",
      draft: "",
    },
  ],
  risks: [
    { head: "The booking link you were told had arrived does not exist.", body: "Last week's board recorded it as delivered on Sep 3; the inbox says otherwise. Gracie promised it was coming and eleven days have passed. Twenty rooms are being held under a signed LOI that no guest can reach, and the save-the-dates are waiting behind it. Ask Gracie and Peter together this week, and don't mark it done again until you have clicked the URL yourself." },
    { head: "Two hotel proposals expired without anyone answering them.", body: "Freehand at $239 lapsed Sep 13, Holiday Inn Express at $359 lapsed Sep 11, and Peter has chased twice, the second time marked urgent. He's been the most responsive person in this whole project and he is now the one being left on read. Re-requesting Freehand at a realistic cap for 10–20 rooms takes one email and keeps that goodwill intact." },
    { head: "The reply backlog keeps growing while the wins pile up.", body: "Lisa 60 days, Abe 36, Danielle 28, Matt 21, Raven 21. You booked a photographer and a DJ inside three weeks, so the momentum is real — but Afterglow quietly closed her own file in August after exactly this pattern. Every one of these needs two lines, not a decision, and the whole set is about half an hour." },
  ],
  hotels: [
    { name: "Residence Inn Chicago Downtown/Loop", area: "Downtown / The Loop (via Engine)", rate: "From $304/night", status: "Block confirmed — link missing", statusClass: "yellow", contact: "Gracie Larey (Marriott) · Peter Fanous · HE-261848", note: "LOI fully executed Aug 16 — 20 rooms / 60 room nights, Thu 5/20–Sun 5/23/27. The guest booking link has still not been sent. Gracie said on Sep 3 that her events team would send it shortly; nothing has arrived since. Chase her and Peter on the existing thread this week" },
    { name: "Freehand Chicago", area: "River North (HE-274675)", rate: "$239/night", status: "Proposal expired Sep 13 — unanswered", statusClass: "red", contact: "Engine · HE-274675", note: "The only budget-ish option anyone produced, and it lapsed without a reply. Ask Peter to re-request it at roughly $240/night for 10–20 rooms so it stays a courtesy block rather than an attrition one" },
    { name: "The Gwen, Michigan Avenue", area: "Streeterville (HE-267168)", rate: "$459/night", status: "No word for 12 days", statusClass: "yellow", contact: "Engine · HE-267168", note: "Peter said on Sep 2 that The Gwen was checking whether it could accommodate the group and he'd update you the following week. Twelve days on, nothing. Worth including in your reply to him — if it comes back yes, this is your high-end option" },
    { name: "Holiday Inn Express Magnificent Mile", area: "Streeterville (HE-274675)", rate: "$359/night", status: "Expired Sep 11 — above range", statusClass: "grey", contact: "Engine · HE-274675", note: "Came in Sep 8 at more than double the cap and above the Residence Inn you've already confirmed. Lapsed Sep 11 and there's no reason to revive it" },
    { name: "Overflow block #3 — HE-270411", area: "Chicago", rate: "Cap was $160/night", status: "You declined Sep 2", statusClass: "grey", contact: "Engine · HE-270411", note: "Allegro Royal Sonesta Loop $299, Club Quarters Wacker $329, Claridge House and Kinzie (never quoted). You declined all of them on Sep 2 because they were attrition blocks, which carry real risk of being charged for unsold rooms. Correct call" },
    { name: "Royal Sonesta River North", area: "River North (HE-267168)", rate: "$329/night", status: "Proposal expired Aug 26", statusClass: "grey", contact: "Engine · HE-267168", note: "Came in Aug 19 above the $291 cap and expired Aug 26. Nothing to action unless Engine reopens the request" },
    { name: "Palmer House Hilton · Kimpton Gray", area: "The Loop", rate: "$329 (Palmer suite $659)", status: "Closed", statusClass: "grey", contact: "Jordan Samson (Hilton) · Corey Jones", note: "Palmer House declined by you on Aug 2 in favour of the Engine block; Kimpton Gray declined you because of a citywide event on your dates. No action on either" },
  ],
  hotelsNote:
    "Engine (Groups), rep Peter Fanous. HE-261848 is the signed and confirmed block; HE-258133 is superseded; HE-267168 (The Gwen) is still pending an answer; HE-274675 (the budget request, 35 rooms, 3 stars or above, $154 cap) produced two proposals that both expired unanswered; HE-270411 was declined. " +
    "The plan you described to Peter is a low / medium / high set of price points, all courtesy blocks so you're never on the hook for unsold rooms. Residence Inn is the middle option and is signed — but it has no booking link, which makes it unusable by guests today. " +
    "One realistic note that hasn't changed: downtown Chicago for a Thursday-to-Sunday in May 2027 runs roughly $250–$330, so a $154 cap will keep coming back empty. Raising it to about $240 and shrinking the block to 10–20 rooms is the version of this that actually works.",
  djs: [
    { name: "Toast & Jam", frontrunner: true, skill: "Curator / seamless transitions, emcee-forward", rate: "$2,795.00 total · $1,397.50 retainer paid · $1,397.50 remaining", status: "BOOKED — retainer paid Sep 9", statusClass: "green", contact: "tcb@toastandjamdjs.com · Melissa Riddle · DJ Chris Gemerchak", next: "Signed Sep 2, retainer sent by Zelle Sep 9 and confirmed Sep 10 with zero processing fee — the card route would have cost about $56 more. Chris Gemerchak was assigned as your DJ on Sep 10. Send him a hello, and ask when planning calls begin and when the $1,397.50 balance is due" },
    { name: "Groove is in the Heart", skill: "DJ Clare — full service, ceremony included", rate: "$2,450 flat (6 hrs; +$200 per extra 30 min)", status: "Owed a no — quote lapsed", statusClass: "yellow", contact: "info@grooveisintheheartdjs.com", next: "The best value on paper and a genuinely close second — the flat fee covered ceremony services, wireless mics and extra speakers. Her quote has now lapsed; send a short, warm no so it ends cleanly" },
    { name: "DJ-Chicago", skill: "Seamless mixes + song edits; mirror photo booth", rate: "Published on dj-chicago.com", status: "Owed a no — 3 follow-ups", statusClass: "yellow", contact: "djchicago@gmail.com · Nick McMann", next: "Available for 5/21/27, has worked Salvage One, and followed up three times (Aug 17, Aug 25, Sep 1) without ever getting an answer. Two weeks on from his last note, he's earned one line back" },
    { name: "Hot Mix Entertainment", skill: "Live mixing (Hot Mix 5 pedigree)", rate: "$3,500 DJ + $550 ceremony (booth dropped)", status: "Closed — silent since Aug 16", statusClass: "grey", contact: "scott@hotmixentertainment.com", next: "You told him on Aug 16 that $3,500 was your ceiling and there's been no reply in a month. Nothing owed — let it go" },
    { name: "Fig Media", skill: "Premium; resident or named-artist packages", rate: "~$4,500 resident package", status: "Closed Sep 2", statusClass: "grey", contact: "brent@figgy.net", next: "You sent Brent a polite no on Sep 2 and he replied warmly the same day. Done" },
    { name: "Love Ent by Milk Majer", skill: "Open-format touring artist", rate: "~$1,995+", status: "Never contacted", statusClass: "grey", contact: "773-206-8513 / loveentweddings.com", next: "Never reached out, and no longer needed" },
  ],
  djsNote:
    "The search is over and paid for. Six weeks, six leads, one bad email address and a lot of patience — Toast & Jam won on the strength of the Aug 26 meeting and landed inside the $2,500–$3,500 range you set. " +
    "The retainer went out by Zelle on Sep 9, four days before their seven-day cancellation clause would have voided the contract, and it saved roughly $56 in card fees. Half the fee, $1,397.50, is still to come — ask Chris or Melissa when it's due so it goes on the payment schedule. " +
    "The only loose ends are Clare at Groove and Nick at DJ-Chicago. Both were quick and generous with information, and Chicago's wedding world is small enough that you may want one of them for the welcome party or the after-party.",
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
        if (dj.frontrunner) nm += ' <span class="vhq-star">★ FRONT-RUNNER</span>';
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
