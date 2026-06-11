/* =========================================================================
   RSVP validation — pure functions, no DOM.
   Loaded in the browser as a plain script AND testable in Node
   (see tests/validate.test.js). Don't add DOM code here.
   Used by the RSVP screen (rsvp.html): household responses and the
   unmatched-name fallback form.

   Dinner is served from stations (no meal choices); the forms collect
   optional dietary restrictions instead, which need no validation.
   ========================================================================= */

(function (root) {
  "use strict";

  function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  /** A name needs at least 2 visible characters. */
  function validateName(name) {
    return isNonEmptyString(name) && name.trim().length >= 2;
  }

  /** Pragmatic email check: something@something.tld, no spaces. */
  function validateEmail(email) {
    if (!isNonEmptyString(email)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  /**
   * Validate a household's responses from the personal RSVP link:
   *   guests: [{ id, rsvp_status: "yes"|"no", dietary }, ...]
   *   plusOne: optional { name, dietary } when the household adds a +1
   * Rules: every listed guest needs a decision (no "pending"); a plus one,
   * if provided, needs a name. Dietary notes are always optional.
   * Returns { valid, errors: { guestId|plusOne: "message" } }.
   */
  function validateHouseholdResponses(guests, plusOne) {
    var errors = {};
    if (!Array.isArray(guests) || guests.length === 0) {
      return { valid: false, errors: { form: "No guests to respond for." } };
    }
    guests.forEach(function (g) {
      if (g.rsvp_status !== "yes" && g.rsvp_status !== "no") {
        errors[g.id] = "Please choose yes or no.";
      }
    });
    if (plusOne && !validateName(plusOne.name)) {
      errors.plusOne = "Please add your plus one's name.";
    }
    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  var api = {
    validateName: validateName,
    validateEmail: validateEmail,
    validateHouseholdResponses: validateHouseholdResponses,
  };

  // Browser global + Node (CommonJS) export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.RsvpValidate = api;
  }
})(typeof self !== "undefined" ? self : this);
