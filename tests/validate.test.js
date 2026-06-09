/* Run with: npm test  (or: node --test tests/*.test.js) */
const test = require("node:test");
const assert = require("node:assert/strict");

const V = require("../js/validate.js");

function validRsvp(overrides = {}) {
  return {
    attending: "yes",
    name: "Robin Beattie",
    email: "robin@example.com",
    hasPlusOne: false,
    plusOneName: "",
    dietary: "",
    plusOneDietary: "",
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

test("validateRsvp passes a complete solo RSVP", () => {
  const result = V.validateRsvp(validRsvp());
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("validateRsvp requires a plus one's name when bringing one", () => {
  const missing = V.validateRsvp(validRsvp({ hasPlusOne: true, plusOneName: " " }));
  assert.equal(missing.valid, false);
  assert.ok(missing.errors.plusOneName);

  const ok = V.validateRsvp(validRsvp({ hasPlusOne: true, plusOneName: "Andy Horton" }));
  assert.equal(ok.valid, true);
});

test("validateRsvp ignores plus-one fields for declining guests", () => {
  const result = V.validateRsvp(
    validRsvp({ attending: "no", hasPlusOne: true, plusOneName: "" })
  );
  assert.equal(result.valid, true);
});

test("validateRsvp still needs name + email for declines", () => {
  const result = V.validateRsvp(validRsvp({ attending: "no", name: "", email: "nope" }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
});

test("dietary notes are optional everywhere", () => {
  const result = V.validateRsvp(validRsvp({ dietary: "", plusOneDietary: "" }));
  assert.equal(result.valid, true);
});

test("validateHouseholdResponses passes when everyone decided", () => {
  const result = V.validateHouseholdResponses([
    { id: "g-1", rsvp_status: "yes", dietary: "vegan" },
    { id: "g-2", rsvp_status: "no", dietary: "" },
  ]);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("validateHouseholdResponses flags undecided guests individually", () => {
  const result = V.validateHouseholdResponses([
    { id: "g-1", rsvp_status: "pending", dietary: "" },
    { id: "g-2", rsvp_status: "yes", dietary: "" },
  ]);
  assert.equal(result.valid, false);
  assert.ok(result.errors["g-1"]);
  assert.equal(result.errors["g-2"], undefined);
});

test("validateHouseholdResponses requires a name for an added plus one", () => {
  const guests = [{ id: "g-1", rsvp_status: "yes", dietary: "" }];
  const bad = V.validateHouseholdResponses(guests, { name: "", dietary: "" });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.plusOne);

  const ok = V.validateHouseholdResponses(guests, { name: "Sam Plus", dietary: "" });
  assert.equal(ok.valid, true);
});

test("validateHouseholdResponses rejects an empty guest list", () => {
  const result = V.validateHouseholdResponses([]);
  assert.equal(result.valid, false);
});
