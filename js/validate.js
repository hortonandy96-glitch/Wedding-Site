/* =========================================================================
   RSVP validation — pure functions, no DOM.
   Loaded in the browser as a plain script AND testable in Node
   (see tests/validate.test.js). Don't add DOM code here.
   ========================================================================= */

(function (root) {
  "use strict";

  var MAX_PARTY_SIZE = 10;

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

  /** Party size must be a whole number from 1 to MAX_PARTY_SIZE. */
  function validatePartySize(size) {
    var n = Number(size);
    return Number.isInteger(n) && n >= 1 && n <= MAX_PARTY_SIZE;
  }

  /** Meal must be one of the offered options. */
  function validateMeal(meal, mealOptions) {
    return Array.isArray(mealOptions) && mealOptions.indexOf(meal) !== -1;
  }

  /**
   * Validate a full RSVP object:
   * {
   *   attending: "yes" | "no",
   *   name: string,
   *   email: string,
   *   partySize: number,
   *   guests: [{ name: string, meal: string }, ...],  // one per attendee
   *   message: string (optional)
   * }
   * Returns { valid: boolean, errors: { fieldName: "message", ... } }.
   * Declining guests only need a name + email.
   */
  function validateRsvp(rsvp, mealOptions) {
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

    var attending = rsvp.attending === "yes";
    if (attending) {
      if (!validatePartySize(rsvp.partySize)) {
        errors.partySize = "Party size must be between 1 and " + MAX_PARTY_SIZE + ".";
      }
      var guests = Array.isArray(rsvp.guests) ? rsvp.guests : [];
      if (validatePartySize(rsvp.partySize) && guests.length !== Number(rsvp.partySize)) {
        errors.meals = "Please pick a dinner for each guest.";
      } else {
        for (var i = 0; i < guests.length; i++) {
          if (i > 0 && !validateName(guests[i].name)) {
            errors.meals = "Please add a name for guest " + (i + 1) + ".";
            break;
          }
          if (!validateMeal(guests[i].meal, mealOptions)) {
            errors.meals = "Please pick a dinner for each guest.";
            break;
          }
        }
      }
    }

    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  var api = {
    MAX_PARTY_SIZE: MAX_PARTY_SIZE,
    validateName: validateName,
    validateEmail: validateEmail,
    validatePartySize: validatePartySize,
    validateMeal: validateMeal,
    validateRsvp: validateRsvp,
  };

  // Browser global + Node (CommonJS) export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.RsvpValidate = api;
  }
})(typeof self !== "undefined" ? self : this);
