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
        "⭐ The architecture river cruise — if you do ONE thing in Chicago, make it this one (book ahead!)",
        "Millennium Park & The Bean",
        "The Art Institute of Chicago",
        "Navy Pier at sunset",
        "And check the calendar for neighborhood art fairs & street festivals — summer Chicago's true specialty",
      ],
    },
  ],

  /* ---- Hotels (Travel section) ----
     PLACEHOLDERS: replace name/note/url/mapQuery when room blocks are booked.
     Set `confirmed: true` to remove the "coming soon" badge. */
  hotels: [
    {
      name: "Hotel Block #1 — Coming Soon",
      area: "West Loop",
      note: "We're negotiating a group rate near the venue. Details will appear here.",
      url: "",            // booking link goes here later
      mapQuery: "West Loop, Chicago, IL",
      confirmed: false,
    },
    {
      name: "Hotel Block #2 — Coming Soon",
      area: "Downtown / The Loop",
      note: "A downtown option near the trains for guests who want to sightsee.",
      url: "",
      mapQuery: "The Loop, Chicago, IL",
      confirmed: false,
    },
  ],

  /* ---- Registry links (Registry section) ----
     PLACEHOLDERS: swap example.com URLs for your real registry pages. */
  registries: [
    {
      store: "Bed + Bath",
      initials: "BB",
      url: "https://example.com/registry/bed-and-bath",
      note: "For the home we're building together (mostly cookware, honestly).",
    },
    {
      store: "Honeymoon Fund",
      initials: "HF",
      url: "https://example.com/registry/honeymoon",
      note: "Help send us somewhere warm with questionable Wi-Fi.",
    },
    {
      store: "Charity: One Tail at a Time",
      initials: "🐾",
      url: "https://example.com/registry/charity",
      note: "In lieu of gifts, support Chicago shelter dogs in our names.",
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
