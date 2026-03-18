// tests/puppeteer.js
const puppeteer = require("puppeteer");
const { app } = require("../app");

let browser, page, server;

before(async function () {
  this.timeout(30000);
  server = app.listen(3000); // start server for Puppeteer

  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
});

after(async function () {
  await browser.close();
  server.close();
});

describe("Puppeteer task operations", function () {
  it("navigates to logon page", async function () {
    await page.goto("http://localhost:3000/session/logon");
    await page.waitForSelector('input[name="email"]');
  });

  it("fills logon form and submits", async function () {
    await page.type('input[name="email"]', "test@example.com");
    await page.type('input[name="password"]', "TestPassword123");
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    const url = page.url();
    if (!url.includes("/")) throw new Error("Login failed");
  });
});