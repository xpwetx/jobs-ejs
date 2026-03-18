// tests/jobs.test.js
const { expect } = require("chai");
const getTestAgent = require("../utils/get_test_agent");
const { seed_db } = require("../utils/seed_db");

describe("Jobs routes", function () {
  let agent, csrfToken, testUser;

  before(async function () {
    const dbData = await seed_db();
    testUser = dbData.user;

    const data = await getTestAgent();
    agent = data.agent;
    csrfToken = data.csrfToken;

    // Log in
    await agent
      .post("/session/logon")
      .type("form")
      .send({ email: testUser.email, password: "TestPassword123", _csrf: csrfToken })
      .redirects(0)
      .then(res => expect(res).to.have.status(302));
  });

  it("should get jobs page for authenticated user", async function () {
    const res = await agent.get("/jobs");
    expect(res).to.have.status(200);
  });

  it("should show 401 Unauthorized for unauthenticated user", async function () {
    const res = await agent.get("/jobs").unset("Cookie");
    expect(res).to.have.status(401);
  });
});