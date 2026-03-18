// tests/registration_logon.test.js
const { expect } = require("chai");
const getTestAgent = require("../utils/get_test_agent");
const { factory } = require("../utils/seed_db");
const User = require("../models/User");

describe("Registration and Logon", function () {
  let agent, csrfToken, testUser, password;

  before(async function () {
    const data = await getTestAgent();
    agent = data.agent;
    csrfToken = data.csrfToken;
  });

  it("should register a new user", async function () {
    password = "TestPassword123";
    testUser = await factory.build("user", { password });

    const res = await agent
      .post("/session/register")
      .type("form")
      .send({
        name: testUser.name,
        email: testUser.email,
        password,
        password1: password,
        _csrf: csrfToken,
      });

    expect(res).to.have.status(200);
    expect(res.text).to.include("Jobs List");

    const newUser = await User.findOne({ email: testUser.email });
    expect(newUser).to.not.be.null;
  });

  it("should log the user on", async function () {
    const res = await agent
      .post("/session/logon")
      .type("form")
      .send({
        email: testUser.email,
        password,
        _csrf: csrfToken,
      })
      .redirects(0);

    expect(res).to.have.status(302);
  });
});