/* =========================================================================
   RSVP validation — pure functions, no DOM.
   Loaded in the browser as a plain script AND testable in Node
   (see tests/validate.test.js). Don't add DOM code here.

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
   * Validate the public RSVP form (index.html):
   * {
   *   attending: "yes" | "no",
   *   name: string,
   *   email: string,
   *   hasPlusOne: boolean,        // only meaningful when attending
   *   plusOneName: string,        // required when hasPlusOne
   *   dietary: string (optional),
   *   plusOneDietary: string (optional),
   *   message: string (optional)
   * }
   * Returns { valid: boolean, errors: { fieldName: "message", ... } }.
   */
  function validateRsvp(rsvp) {
    var errors = {};
    if (!rsvp || typeof rsvp !== "object") {
      return { valid: false, errors: { form: "Missing RSVP data." } };
    }

    if (!validateName(rsvp.name)) {
      errors.name = "Please enter your full name.";
    }
    if (!validateEmail(rsvp.email)) {
      errors.email = "That email doesn't look right — mind double-checking?";
    }
    if (rsvp.attending === "yes" && rsvp.hasPlusOne && !validateName(rsvp.plusOneName)) {
      errors.plusOneName = "Please add your plus one's name.";
    }

    return { valid: Object.keys(errors).length === 0, errors: errors };
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
    validateRsvp: validateRsvp,
    validateHouseholdResponses: validateHouseholdResponses,
  };

  // Browser global + Node (CommonJS) export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.RsvpValidate = api;
  }
})(typeof self !== "undefined" ? self : this);
