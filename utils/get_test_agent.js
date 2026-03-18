// utils/get_test_agent.js
const supertest = require("supertest");
const { app } = require("../app"); 

async function getTestAgent() {
  const agent = supertest.agent(app); 
  const res = await agent.get("/logon"); 
  const match = res.text.match(/name="_csrf" value="([^"]+)"/);
  const csrfToken = match ? match[1] : null;

  if (!csrfToken) {
    throw new Error("Could not find CSRF token on logon page");
  }

  return { agent, csrfToken };
}

module.exports = getTestAgent;