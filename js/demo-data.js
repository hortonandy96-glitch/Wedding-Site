/* =========================================================================
   Shared demo data for "demo mode" (used until Supabase is connected).

   Both the admin dashboard and the guest RSVP page read and write this
   same browser storage, so in demo mode you can play both roles: open a
   demo invite link, RSVP as a guest, then watch the admin tracker update.
   ========================================================================= */

(function () {
  "use strict";

  var KEY = "admin-demo-data";

  var SEED = [
    {
      id: "hh-1", name: "The Beattie Family", code: "demo123abc",
      email: "beatties@example.com", phone: "(312) 555-0101",
      notes: "Robin's parents + brother", rsvp_message: "So excited!!",
      responded_at: "2026-06-01T12:00:00Z",
      guests: [
        { id: "g-1", household_id: "hh-1", name: "Carol Beattie", rsvp_status: "yes", dietary: "", notes: "" },
        { id: "g-2", household_id: "hh-1", name: "Dale Beattie", rsvp_status: "yes", dietary: "", notes: "" },
        { id: "g-3", household_id: "hh-1", name: "Sam Beattie", rsvp_status: "no", dietary: "", notes: "Studying abroad" },
      ],
    },
    {
      id: "hh-2", name: "The Horton Household", code: "demo456def",
      email: "hortons@example.com", phone: "(773) 555-0102",
      notes: "", rsvp_message: "", responded_at: null,
      guests: [
        { id: "g-4", household_id: "hh-2", name: "Maria Horton", rsvp_status: "pending", dietary: "", notes: "" },
        { id: "g-5", household_id: "hh-2", name: "Greg Horton", rsvp_status: "pending", dietary: "gluten-free", notes: "" },
      ],
    },
    {
      id: "hh-3", name: "College Crew — Jess & Theo", code: "demo789ghi",
      email: "jess@example.com", phone: "",
      notes: "Flying in from Denver", rsvp_message: "", responded_at: null,
      plus_one_allowed: true,
      guests: [
        { id: "g-6", household_id: "hh-3", name: "Jess Alvarez", rsvp_status: "pending", dietary: "", notes: "" },
        { id: "g-7", household_id: "hh-3", name: "Theo Park", rsvp_status: "pending", dietary: "", notes: "" },
      ],
    },
  ];

  window.DemoData = {
    load: function () {
      try {
        var data = JSON.parse(localStorage.getItem(KEY));
        if (Array.isArray(data)) return data;
      } catch (e) { /* corrupted or missing: reseed */ }
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return JSON.parse(JSON.stringify(SEED));
    },
    save: function (data) {
      localStorage.setItem(KEY, JSON.stringify(data));
    },
  };
})();
