// tests/crud_operations.test.js
const { expect } = require("chai");
const getTestAgent = require("../utils/get_test_agent");
const { seed_db } = require("../utils/seed_db");

describe("CRUD operations for tasks", function () {
  let agent, csrfToken, testUser;

  before(async function () {
    this.timeout(15000);
    testUser = await seed_db();

    const data = await getTestAgent();
    agent = data.agent;
    csrfToken = data.csrfToken;

    await agent
      .post("/session/logon")
      .type("form")
      .send({
        email: testUser.email,
        password: "TestPassword123",
        _csrf: csrfToken,
      })
      .expect(302);
  });

  it("should get the task list page with 20 entries", async function () {
    const res = await agent.get("/tasks").expect(200);
    const pageParts = res.text.split("<tr>");
    expect(pageParts.length - 1).to.equal(20);
  });
});