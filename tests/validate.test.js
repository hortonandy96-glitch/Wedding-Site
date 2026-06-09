/* Run with: npm test  (or: node --test tests/*.test.js) */
const test = require("node:test");
const assert = require("node:assert/strict");

const V = require("../js/validate.js");

const MEALS = ["Herb-Roasted Chicken", "Braised Short Rib", "Wild Mushroom Risotto (vegetarian)"];

function validRsvp(overrides = {}) {
  return {
    attending: "yes",
    name: "Robin Beattie",
    email: "robin@example.com",
    partySize: 2,
    guests: [
      { name: "Robin Beattie", meal: MEALS[0] },
      { name: "Andy Horton", meal: MEALS[1] },
    ],
    message: "",
    ...overrides,
  };
}

test("validateName accepts real names, rejects blanks", () => {
  assert.equal(V.validateName("Robin Beattie"), true);
  assert.equal(V.validateName("  "), false);
  assert.equal(V.validateName(""), false);
  assert.equal(V.validateName(undefined), false);
});

test("validateEmail accepts normal emails, rejects malformed ones", () => {
  assert.equal(V.validateEmail("andy@example.com"), true);
  assert.equal(V.validateEmail("andy@sub.example.co"), true);
  assert.equal(V.validateEmail("andy@example"), false);
  assert.equal(V.validateEmail("andy example.com"), false);
  assert.equal(V.validateEmail(""), false);
});

test("validatePartySize allows 1-10 whole numbers only", () => {
  assert.equal(V.validatePartySize(1), true);
  assert.equal(V.validatePartySize("4"), true);
  assert.equal(V.validatePartySize(0), false);
  assert.equal(V.validatePartySize(11), false);
  assert.equal(V.validatePartySize(2.5), false);
  assert.equal(V.validatePartySize("lots"), false);
});

test("validateMeal only accepts offered meals", () => {
  assert.equal(V.validateMeal(MEALS[2], MEALS), true);
  assert.equal(V.validateMeal("Hot Dog (no ketchup, it's Chicago)", MEALS), false);
  assert.equal(V.validateMeal("", MEALS), false);
});

test("validateRsvp passes a complete accepting RSVP", () => {
  const result = V.validateRsvp(validRsvp(), MEALS);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("validateRsvp requires a meal for every guest", () => {
  const rsvp = validRsvp();
  rsvp.guests[1].meal = "";
  const result = V.validateRsvp(rsvp, MEALS);
  assert.equal(result.valid, false);
  assert.ok(result.errors.meals);
});

test("validateRsvp requires names for additional guests", () => {
  const rsvp = validRsvp();
  rsvp.guests[1].name = "";
  const result = V.validateRsvp(rsvp, MEALS);
  assert.equal(result.valid, false);
  assert.ok(result.errors.meals);
});

test("validateRsvp flags mismatched party size vs guest rows", () => {
  const rsvp = validRsvp({ partySize: 3 });
  const result = V.validateRsvp(rsvp, MEALS);
  assert.equal(result.valid, false);
  assert.ok(result.errors.meals);
});

test("validateHouseholdResponses passes when everyone decided and attendees have meals", () => {
  const result = V.validateHouseholdResponses(
    [
      { id: "g-1", rsvp_status: "yes", meal: MEALS[0] },
      { id: "g-2", rsvp_status: "no", meal: "" },
    ],
    MEALS
  );
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("validateHouseholdResponses flags undecided guests and missing meals per guest", () => {
  const result = V.validateHouseholdResponses(
    [
      { id: "g-1", rsvp_status: "pending", meal: "" },
      { id: "g-2", rsvp_status: "yes", meal: "" },
      { id: "g-3", rsvp_status: "no", meal: "" },
    ],
    MEALS
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors["g-1"]); // never answered
  assert.ok(result.errors["g-2"]); // attending but no meal
  assert.equal(result.errors["g-3"], undefined);
});

test("validateHouseholdResponses rejects an empty guest list", () => {
  const result = V.validateHouseholdResponses([], MEALS);
  assert.equal(result.valid, false);
});

test("declining guests skip party/meal checks but still need name + email", () => {
  const ok = V.validateRsvp(
    { attending: "no", name: "Busy Cousin", email: "cousin@example.com", guests: [] },
    MEALS
  );
  assert.equal(ok.valid, true);

  const bad = V.validateRsvp({ attending: "no", name: "", email: "nope" }, MEALS);
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.name);
  assert.ok(bad.errors.email);
});
