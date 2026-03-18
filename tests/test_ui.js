// tests/test_ui.test.js
const request = require("supertest");
const { expect } = require("chai");
const { app } = require("../app");

describe("UI page tests", () => {
  it("should get the index page", async () => {
    const res = await request(app).get("/").expect(200);
    expect(res.text).to.include("<!DOCTYPE html>");
  });
});