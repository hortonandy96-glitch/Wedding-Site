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
  updated: "September 2, 2026 — the photographer is done: Allie Idrac's contract came back signed Aug 30 and her $2,500 retainer cleared Aug 31, so four vendors are now fully locked. The open question this week is the DJ — you told Toast & Jam you'd decide by Friday Sep 4, and Groove's quote lapses around Sep 9. Peter at Engine wrote this morning asking whether you still want a third hotel block",
  summary: [
    { n: "4", label: "Vendors fully locked (signed + deposit paid)" },
    { n: "$4,500", label: "Deposits paid in the last month (caterer + photographer)" },
    { n: "Fri Sep 4", label: "DJ decision deadline — your own, three quotes live" },
    { n: "20 rooms", label: "Room block confirmed — guest booking link still missing" },
  ],
  vendors: [
    {
      status: "green",
      name: "Salvage One", who: "Colleen", category: "Venue",
      contract: "Signed", contractClass: "green",
      deposit: "Paid", depositClass: "green",
      balance: "Final balance per agreement (later)",
      last: "Aug 18, 2026", court: "—",
      action: "Nothing owed. She confirmed Aug 18 that caterers handle ceremony chairs — usually through Tablescapes",
      flag: "",
    },
    {
      status: "green",
      name: "Allie Idrac", who: "hello@allieidrac.com", category: "Photographer — BOOKED",
      contract: "Signed Aug 30", contractClass: "green",
      deposit: "$2,500 paid Aug 31", depositClass: "green",
      balance: "6-hour wedding package — remaining balance per Dubsado contract",
      last: "Sep 1, 2026", court: "—",
      action: "Done. She confirmed Sep 1 that you're all set on her end. Next natural step, whenever you feel like it, is putting an engagement session on the calendar",
      flag: "",
    },
    {
      status: "green",
      name: "Elegante Weddings & Events", who: "Lisa Jaroscak", category: "Coordinator",
      contract: "Signed", contractClass: "green",
      deposit: "Paid", depositClass: "green",
      balance: "Per agreement",
      last: "Jul 16, 2026", court: "You",
      action: "48 days since you promised her the guest list and signed vendor contracts. You now have four — venue, caterer, photographer, coordinator — plus an executed room-block LOI. Send the bundle in one email",
      flag: "You owe her — 48 days",
    },
    {
      status: "yellow",
      name: "Catered by Design", who: "Matt Gray", category: "Caterer — BOOKED",
      contract: "Signed Aug 3", contractClass: "green",
      deposit: "$2,000 paid Aug 2", depositClass: "green",
      balance: "Revised quote sent Aug 24 (150 guests + ceremony chairs) — awaiting your yes",
      last: "Aug 24, 2026", court: "You",
      action: "Matt's revised pricing with white padded garden chairs has sat nine days. Confirm the number, then ask about the payment schedule and the tasting date",
      flag: "You owe — 9 days",
    },
    {
      status: "red",
      name: "Toast & Jam", who: "Melissa Riddle", category: "DJ — front-runner",
      contract: "Proposal sent Aug 26 — unsigned", contractClass: "red",
      deposit: "Due on signing", depositClass: "red",
      balance: "E-sign proposal at mytoastandjamevent.com (from ~$2,850)",
      last: "Aug 30, 2026", court: "You",
      action: "You told Melissa on Aug 30 they're the front-runner and you'd decide by the end of this week. Pricing is locked but the date is not held until the contract is signed",
      flag: "Your deadline: Fri Sep 4",
    },
    {
      status: "red",
      name: "Groove is in the Heart", who: "DJ Clare", category: "DJ",
      contract: "Quoted Aug 10", contractClass: "yellow",
      deposit: "—", depositClass: "grey",
      balance: "$2,450 flat — quote good ~30 days (about Sep 9)",
      last: "Aug 10, 2026", court: "You",
      action: "Cheapest all-in option and ceremony sound is included. The quote lapses around Sep 9 — book it or send a short no before then",
      flag: "Expires ~Sep 9",
    },
    {
      status: "red",
      name: "Hot Mix Entertainment", who: "Scott", category: "DJ",
      contract: "Quoted Jul 27", contractClass: "yellow",
      deposit: "—", depositClass: "grey",
      balance: "$3,500 DJ + $550 ceremony (booth dropped)",
      last: "Aug 16, 2026 (you)", court: "Scott",
      action: "Seventeen days of silence since you told him $3,500 was the ceiling. Treat this as closed unless he surfaces — no need to chase further",
      flag: "Silent 17 days",
    },
    {
      status: "yellow",
      name: "Fig Media", who: "Brent Rolland", category: "DJ",
      contract: "No quote yet", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Resident package ~$4,500 for ceremony-through-dancing; artist package higher",
      last: "Sep 1, 2026", court: "You",
      action: "Brent finally replied Sep 1 — available for May 21 and worked Salvage One recently. He wants a meeting before quoting, and flagged that ~$4,500 is realistic for your setup. Over budget; probably a polite no",
      flag: "New reply — over budget",
    },
    {
      status: "yellow",
      name: "DJ-Chicago", who: "Nick McMann", category: "DJ",
      contract: "No quote requested", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Pricing published on dj-chicago.com",
      last: "Sep 1, 2026", court: "You",
      action: "Third follow-up landed Sep 1 asking whether you've found a DJ. He's been patient and polite — send him a one-line answer either way",
      flag: "3rd follow-up",
    },
    {
      status: "yellow",
      name: "Friends of Friends", who: "Abe Vucekovich", category: "After-party bar",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "~$7,500 all-in ($6,000 open bar + 25% gratuity), 11pm–2am buyout",
      last: "Aug 9, 2026", court: "You",
      action: "Abe confirmed the $7,500 figure on Aug 9 and has heard nothing for 24 days. Either commit, ask him to hold the date, or release it",
      flag: "You owe — 24 days",
    },
    {
      status: "yellow",
      name: "Emporium Arcade Bar", who: "Raven Williams", category: "Welcome party — Thu May 20",
      contract: "Not sent", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Reserved section, ~150 guests, two-drink-ticket package",
      last: "Aug 24, 2026 (you)", court: "Raven",
      action: "Date is available at Logan Square. You asked Aug 24 about a reserved section rather than a full buyout — nine days of silence. One nudge is fair",
      flag: "Awaiting reply — 9 days",
    },
    {
      status: "yellow",
      name: "Garfield's Beverage", who: "Danielle Woller", category: "Alcohol supply",
      contract: "Mock quote only", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "Sample quote for 100 guests — real quote needs your answers",
      last: "Aug 17, 2026", court: "You",
      action: "She needs six answers before quoting: venue, caterer, wine with dinner or bar only, champagne toast, signature cocktails, end-of-event pickup. Ten minutes of work, sixteen days waiting",
      flag: "You owe — 16 days",
    },
    {
      status: "yellow",
      name: "Florist · Hair & Makeup · Cake", who: "", category: "Not started",
      contract: "—", contractClass: "grey",
      deposit: "—", depositClass: "grey",
      balance: "—",
      last: "—", court: "You",
      action: "Still on the timeline for autumn. Rentals is partly solved — ceremony chairs now come through the caterer. Once the DJ is signed, florist is the natural next search",
      flag: "Upcoming",
    },
  ],
  dormant:
    "Photography is closed out: Afterglow Studio (Hanako closed her own lead Aug 27) and Genuinely Jo (Robin sent Jordan a warm no Aug 25; Jordan replied graciously Aug 27). Previously closed: Lula Cafe (you passed Aug 2), Palmer House Hilton (declined Aug 2), Kimpton Gray (they declined — citywide event). Dormant catering bids: True Cuisine–SBR, Beyond Catering, J&L / JFOD, Maison Cuisine, Cocina Fusion, Blue Plate. Declined: The Wellsley (Boka). Alt venue closed: Ignite Glass Studios. DJ leads never contacted: Love Ent by Milk Majer.",
  actions: [
    {
      level: "red",
      title: "1 · Pick your DJ and sign by Friday, Sep 4",
      note: "You set this deadline yourself when you told Melissa on Aug 30 that Toast & Jam were the front-runner and you'd decide by the end of the week. Three quotes are live: Toast & Jam (proposal from ~$2,850, pricing locked but the date is not held until you sign), Groove is in the Heart at $2,450 flat with ceremony sound included (quote lapses around Sep 9), and Hot Mix at $3,500 plus $550, seventeen days silent. Fig came back Sep 1 at roughly $4,500 — over budget. This is the one decision that unblocks everything else this week.",
      draft:
        "Hi Melissa, thanks for your patience — we've made our decision and we'd love to move forward with Toast & Jam. " +
        "I'm signing the proposal today; could you confirm the retainer amount and how you'd like it sent? " +
        "Looking forward to meeting our DJ. — Andy & Robin",
    },
    {
      level: "yellow",
      title: "2 · Reply to Matt on the revised catering quote",
      note: "Matt sent updated pricing on Aug 24 covering 150 guests plus white padded garden chairs for the outdoor ceremony — the chair question the venue bounced back to catering. Nine days on, he's still waiting. Confirming it gives you a final catering number to hand Lisa, and it's the natural moment to ask about the payment schedule and the tasting.",
      draft:
        "Hi Matt, thanks for the updated quote with the ceremony chairs — that all looks good to us. " +
        "Two things: could you confirm the payment schedule from here, and when would you normally " +
        "schedule the tasting for a May 2027 date? Thanks! — Andy & Robin",
    },
    {
      level: "yellow",
      title: "3 · Answer Peter at Engine, and ask again for the booking link",
      note: "Peter wrote this morning (Sep 2) with three points: the Residence Inn block should be all confirmed, The Gwen is checking whether it can actually accommodate the group and will know the week of Sep 8, and he wants to know whether you still want a third block. Answer that question — and in the same reply, ask once more for the guest booking URL, which Gracie at Marriott said on Aug 25 'should have been sent last week' and still hasn't landed.",
      draft: "",
    },
    {
      level: "yellow",
      title: "4 · Send Lisa the guest list and the signed contracts",
      note: "Open since Jul 16 — 48 days, and the single longest-running thing on this list. You now have four signed vendor agreements (venue, caterer, photographer, and Lisa's own) plus an executed room-block LOI. Send the lot in one email and let your coordinator start coordinating.",
      draft: "",
    },
    {
      level: "yellow",
      title: "5 · Answer Friends of Friends and Garfield's",
      note: "Abe confirmed the $7,500 after-party buyout on Aug 9 and has heard nothing in 24 days — he warned that late semi-private bookings are hard in patio season. Danielle at Garfield's sent a sample quote Aug 17 and needs six quick answers (venue, caterer, wine with dinner, champagne toast, signature cocktails, end-of-event pickup) before she can price your actual bar. Neither takes more than ten minutes.",
      draft: "",
    },
    {
      level: "yellow",
      title: "6 · Close out the DJs you don't pick",
      note: "Whichever way Friday goes, three people are waiting on an answer: Clare at Groove (whose quote lapses ~Sep 9), Nick at DJ-Chicago (three polite follow-ups, most recently Sep 1), and Brent at Fig (replied Sep 1, and ~$4,500 is above your range). Scott at Hot Mix has gone quiet for 17 days and can simply be let go. A one-line no costs nothing and keeps the door open.",
      draft: "",
    },
    {
      level: "yellow",
      title: "7 · Nudge Emporium, then start on florist",
      note: "Raven has been quiet since your Aug 24 note asking about a reserved section rather than a full buyout — nine days, worth one short bump. After that, with photography and (soon) the DJ signed, florist is the sensible next search, followed by hair & makeup and cake.",
      draft: "",
    },
  ],
  risks: [
    { head: "The DJ decision has a real deadline this Friday.", body: "Toast & Jam have said plainly they won't hold May 21 without a signed contract, and you promised Melissa an answer by the end of the week. Groove's $2,450 quote lapses around Sep 9. If Friday passes quietly, you're back to square one on the biggest remaining vendor." },
    { head: "The slow-reply pattern already cost you one vendor.", body: "Afterglow closed her own file on Aug 27 after weeks of silence. The same clock is running on Friends of Friends (24 days), Garfield's (16 days), Matt Gray (9 days) and Lisa (48 days). None of these need a perfect answer — they need a short one, today." },
    { head: "The room block is 'confirmed' but guests still can't book it.", body: "Peter says the Residence Inn is all set, yet no booking URL has appeared since it was requested on Aug 25. Until that link exists, the hotel section of your website is writing a cheque it can't cash — and save-the-dates get harder to send without it." },
  ],
  hotels: [
    { name: "Residence Inn Chicago Downtown/Loop", area: "Downtown / The Loop (via Engine)", rate: "From $304/night", status: "CONFIRMED", statusClass: "green", contact: "Gracie Larey (Marriott) · Peter Fanous · HE-261848", note: "LOI fully executed Aug 16 — 20 rooms / 60 room nights, Thu 5/20–Sun 5/23/27. Peter confirmed Sep 2 that it 'should be all confirmed'. The one missing piece is the guest booking URL — requested Aug 25, never delivered. Ask again" },
    { name: "The Gwen, Michigan Avenue", area: "Streeterville (HE-267168)", rate: "$459/night", status: "Hotel reviewing capacity", statusClass: "yellow", contact: "Engine · HE-267168", note: "Well over your original $291 cap, and the proposal lapsed Aug 26 — but Peter said Sep 2 that The Gwen is checking whether it can actually accommodate the group and will know the week of Sep 8. Wait for that answer before doing anything" },
    { name: "Overflow block #3 — lapsing", area: "Chicago (HE-270411)", rate: "Cap set at $160/night", status: "Proposals expired Sep 1", statusClass: "yellow", contact: "Engine · HE-270411", note: "Submitted Aug 24 for 50 double rooms, 4 stars or above. Came back: Allegro Royal Sonesta Loop $299, Club Quarters Wacker $329 (expired Sep 1), Claridge House and Kinzie (rates never quoted). Everything is far above the $160 cap. Peter is asking whether you still want a third block — decide, and if yes, raise the cap to $250–$300" },
    { name: "Royal Sonesta River North", area: "River North (HE-267168)", rate: "$329/night", status: "Proposal expired Aug 26", statusClass: "grey", contact: "Engine · HE-267168", note: "Came in Aug 19 above the $291 cap and expired Aug 26. Nothing to action unless Engine reopens the request" },
    { name: "Palmer House Hilton", area: "The Loop", rate: "$329 (suite $659)", status: "You declined", statusClass: "grey", contact: "Jordan Samson · Hilton", note: "Declined Aug 2 in favour of the Engine block. Closed — no action" },
    { name: "Kimpton Gray", area: "The Loop", rate: "—", status: "They declined", statusClass: "grey", contact: "Corey Jones", note: "Citywide event on your dates. Closed — no action" },
  ],
  hotelsNote:
    "Engine (Groups), rep Peter Fanous. Account HE-261848 is the signed and confirmed block; HE-258133 is superseded; HE-267168 and HE-270411 are overflow requests. " +
    "A realistic downtown Chicago rate for a Thursday-to-Sunday in May 2027 is roughly $250–$330, so the $160 cap on the newest request will keep coming back empty or over. " +
    "Peter's Sep 2 email asks directly whether you still want a third block — that's a yes/no you can answer in a sentence. The most valuable thing in this whole section, though, is still the guest booking link.",
  djs: [
    { name: "Toast & Jam", frontrunner: true, skill: "Curator / seamless transitions, emcee-forward", rate: "E-sign proposal issued Aug 26 (from ~$2,850)", status: "Decide by Fri Sep 4", statusClass: "red", contact: "tcb@toastandjamdjs.com · Melissa Riddle", next: "You named them the front-runner on Aug 30 and promised a decision by the end of the week. Pricing is locked in; the date is not held until the contract is e-signed and the retainer lands. Open the proposal, check the all-in number against Groove's $2,450, and sign" },
    { name: "Groove is in the Heart", skill: "DJ Clare — full service, ceremony included", rate: "$2,450 flat (6 hrs; +$200 per extra 30 min)", status: "Quote lapses ~Sep 9", statusClass: "red", contact: "info@grooveisintheheartdjs.com", next: "Still the best value on paper: flat fee covers ceremony services, wireless mics and extra speakers. No photo booth (they suggest GlitterGuts). Nothing has moved since Aug 10 — book it or send a short no before the quote lapses" },
    { name: "Hot Mix Entertainment", skill: "Live mixing (Hot Mix 5 pedigree)", rate: "$3,500 DJ + $550 ceremony (booth dropped)", status: "Silent 17 days", statusClass: "red", contact: "scott@hotmixentertainment.com", next: "You told him Aug 16 that $3,500 was your ceiling and asked whether ceremony could fit inside it. No answer in 17 days. Treat as closed" },
    { name: "Fig Media", skill: "Premium; resident or named-artist packages", rate: "~$4,500 resident package (artist package higher)", status: "Replied Sep 1 — over budget", statusClass: "yellow", contact: "brent@figgy.net", next: "Brent surfaced Sep 1: available for May 21, worked Salvage One the week before, and wants a meeting before quoting. He flagged that a ceremony-through-dancing setup lands near $4,500 against the $2,500 you mentioned. Almost certainly a polite no" },
    { name: "DJ-Chicago", skill: "Seamless mixes + song edits; mirror photo booth", rate: "Published on dj-chicago.com", status: "3rd follow-up Sep 1", statusClass: "yellow", contact: "djchicago@gmail.com · Nick McMann", next: "Available for 5/21/27 and has worked Salvage One before. Has now followed up three times (Aug 17, Aug 25, Sep 1) without a reply. Send him an answer once Friday's decision is made" },
    { name: "Love Ent by Milk Majer", skill: "Open-format touring artist", rate: "~$1,995+", status: "Never contacted", statusClass: "grey", contact: "773-206-8513 / loveentweddings.com", next: "Never reached out. Safe to drop — you have more quotes than you need" },
  ],
  djsNote:
    "Budget is roughly $2,500–$3,500 (Fig was told $2,500; Hot Mix was told $3,500 was the ceiling), the priority is genuine live mixing, and the photo booth has been dropped. " +
    "Realistically it's a two-horse race: Toast & Jam, who you've already called the front-runner and who met you in person on Aug 26, versus Groove is in the Heart at $2,450 all-in with ceremony sound included. " +
    "Both have clocks on them — Toast & Jam won't hold the date unsigned, and Groove's quote lapses around Sep 9 — so this decision resolves itself one way or another within the next week.",
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
