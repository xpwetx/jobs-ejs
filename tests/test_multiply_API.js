// tests/test_multiply_API.test.js
const { expect } = require("chai");
const request = require("supertest");
const { app } = require("../app");

describe("test multiply API", () => {
  it("should multiply two numbers", async () => {
    const res = await request(app).get("/multiply?first=7&second=6").expect(200);
    expect(res.body.result).to.equal(42);
  });
});