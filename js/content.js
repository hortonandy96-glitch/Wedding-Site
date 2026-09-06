/* =========================================================================
   EDIT ME! This is the one file to change when updating site content.
   No coding knowledge needed — just edit the text between the quotes.
   Keep the commas and brackets exactly as they are.
   ========================================================================= */

window.SITE_CONTENT = {
  /* ---- Dinner ----
     Food is served from stations (no plated meal choices), with vegetarian
     options guaranteed. The RSVP forms ask for dietary restrictions only. */
  dietaryPrompt: "Any dietary restrictions? (optional)",
  dietaryPlaceholder: "Allergies, vegan, gluten-free, kosher…",

  /* ---- Weekend itineraries (Travel section) ---- */
  itineraries: [
    {
      title: "Andy's Ideal Sunday",
      emoji: "🥖",
      blurb: "Logan Square, done properly.",
      stops: [
        "10:00 AM — Logan Square Farmers Market: coffee from Anticonquista Café, a baguette from La Boulangerie, pâté from Chef Didier Durand, poblano mustard from Co-op Sauce, and any cheese from J2K Dairy — then claim a spot in the park and call it lunch",
        "2:00 PM — Catch a movie at the Logan Theatre (locally owned — swing by the bar inside for a bev first)",
        "7:00 PM — Dinner at Club Lucky: a dirty vodka martini (Tito's preferred) with blue-cheese olives, and any pasta on the menu to share",
      ],
    },
    {
      title: "Robin's Night Out",
      emoji: "🍸",
      blurb: "Dress up a little. It's worth it.",
      stops: [
        "5:00 PM — Happy hour at Lone Wolf",
        "To be continued… Robin is out conducting (very fun) research. Check back soon.",
      ],
    },
    {
      title: "Chicago Tourist Classics",
      emoji: "🏙️",
      blurb: "First time in Chicago? Do these. No shame.",
      stops: [
        "9:00 AM — Millennium Park & The Bean (go early, beat the selfie crowds)",
        "10:30 AM — The Art Institute of Chicago (say hi to the lions on your way in)",
        "2:00 PM — ⭐ The architecture river cruise — if you do ONE thing in Chicago, make it this one (book ahead!)",
        "5:30 PM — Navy Pier as the sun goes down",
        "All weekend — check the calendar for neighborhood art fairs & street festivals, summer Chicago's true specialty",
      ],
    },
  ],

  /* ---- Hotels (Travel section) ----
     One card per room block, ordered budget → mid → luxury. These use the same
     card layout as the registry cards below, so keep them to three.

     HOW TO UPDATE A CARD:
     - `tier`      small label above the name ("Budget", "Mid-range", "Luxury").
     - `confirmed` true removes the "details coming soon" badge.
     - `url`       paste the hotel's booking link here when it arrives. The card
                   then shows a real "Book a room" button instead of the `cta`
                   text, so leave `url: ""` until you actually have the link.
     - `cta`       the italic placeholder shown while `url` is empty.
     - `rate`      nightly rate; leave "" to hide the line.
     - `initials`  accepts letters or an emoji. */
  hotels: [
    {
      tier: "Budget",
      name: "Budget Block — Coming Soon",
      initials: "🏨",
      area: "Chicago — neighborhood TBC",
      rate: "",
      note: "We're working on a third block at a friendlier nightly rate for anyone who'd rather spend their money on the weekend than the room. Details will land here as soon as it's signed.",
      url: "",
      mapQuery: "Chicago, IL",
      cta: "",
      confirmed: false,
    },
    {
      tier: "Mid-range",
      name: "Residence Inn Chicago Downtown/Loop",
      initials: "🏨",
      area: "Downtown / The Loop",
      rate: "From $304/night",
      note: "Our main room block — 20 rooms held for Thursday, May 20 through Sunday, May 23, 2027. Suites come with kitchens, so it works well for longer stays.",
      // Marriott group booking link for our block (received Sept 2026).
      url: "https://www.marriott.com/event-reservations/reservation-link.mi?id=1787156132238&key=GRP&app=resvlink",
      mapQuery: "Residence Inn Chicago Downtown Loop, Chicago, IL",
      cta: "Booking link coming soon",
      confirmed: true,
    },
    {
      tier: "Luxury",
      name: "The Gwen — Coming Soon",
      initials: "🏨",
      area: "Streeterville / Michigan Avenue",
      rate: "",
      note: "A smaller block of 10 rooms we're holding at a splurgier address just off the Magnificent Mile. Not confirmed yet — we'll post the rate and booking link the moment it is.",
      url: "",
      mapQuery: "The Gwen, a Luxury Collection Hotel, Chicago, IL",
      cta: "",
      confirmed: false,
    },
  ],

  /* ---- Registry links (Registry section) ----
     All three cards point at the real Zola registry (one page holds the
     gifts, the honeymoon fund, and the naming-rights joke fund). To deep-link
     a card to a specific fund later, replace its `url`. `cta` is the button
     wording; `initials` accepts letters or an emoji. */
  registries: [
    {
      store: "Buy Us Something",
      initials: "🎁",
      url: "https://www.zola.com/registry/andyandrobin2027",
      note: "Pick something off our registry — for the home we're building together.",
      cta: "Shop our registry →",
    },
    {
      store: "Honeymoon Fund",
      initials: "✈️",
      url: "https://www.zola.com/registry/andyandrobin2027",
      note: "Or chip in on the honeymoon and send us somewhere warm with questionable Wi-Fi.",
      cta: "Contribute →",
    },
    {
      /* The joke item. Clicking it opens the "naming-rights agreement"
         dialog (see index.html) before sending anyone to the payment link. */
      store: "Naming Rights: Our Firstborn",
      initials: "👶",
      price: "$100,000",
      url: "https://www.zola.com/registry/andyandrobin2027",
      note: "One (1) opportunity to name our first child. Serious inquiries only. Agreement required.",
      cta: "Inquire →",
      joke: true,
    },
  ],

  /* ---- FAQ (accordion) ---- */
  faqs: [
    {
      q: "When should I RSVP by?",
      a: "Please RSVP by April 21, 2027 so we can give the venue a final count. The RSVP form at the top of this page takes about a minute.",
    },
    {
      q: "Can I bring a plus-one?",
      a: "If your invitation says “and guest,” absolutely! Otherwise we've kept the list snug so we can celebrate properly with everyone — thanks for understanding.",
    },
    {
      q: "Are kids invited?",
      a: "We love your kids, but this is a grown-ups' night out. Consider it our gift to you: an excuse for a date night in Chicago.",
    },
    {
      q: "Is the venue accessible?",
      a: "Yes — Salvage One has step-free access and accessible restrooms. If you have any mobility, sensory, or dietary needs, mention them in the RSVP note and we'll take care of you.",
    },
    {
      q: "What's the weather like in late May?",
      a: "Usually lovely: 60s–70s°F. The celebration is indoors either way, so rain can't touch us.",
    },
    {
      q: "What about health & safety?",
      a: "We'll follow whatever city guidance is in place in May 2027 and will post updates here if anything changes.",
    },
  ],
};
