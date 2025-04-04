// filepath: tests/setup.js
const { afterEach } = require('node:test');
const puppeteer = require('puppeteer');
jest.setTimeout(30000);


describe('User Related Tests', () => {
  //copied from assignment 3 tests
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 30 });
    page = await browser.newPage();
    await page.goto("http://localhost:5173");
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Home page displays correct layout and route", async () => {

    // Verify "Register" and "Login" buttons exist
    // use xpath simply because I'm more familiar with it
    const registerButton = await page.$("xpath/.//button[text()='Register']");

    await registerButton.click();
    await page.waitForNavigation();
    expect(page.url()).toContain("/register");

    await page.goto("http://localhost:5173/");

    const loginButton = await page.$("xpath/.//button[text()='Login']");
    await loginButton.click();
    await page.waitForNavigation();
    expect(page.url()).toContain("/login");

  });

  // Test clicking "Register" button redirects to /register
  test("Clicking 'Register' button redirects to /register", async () => {
    await page.goto("http://localhost:5173/register");

    // Enter text in username, email, and password text inputs
    await page.type("input[id='username']", "fe-testuser");
    await page.type("input[id='email']", "fe-testuser@example.com");
    await page.type("input[id='password']", "fe-Password123");
    // Click the "Register" button
    const registerButton2 = await page.$("xpath/.//button[text()='Sign Up']");
    await registerButton2.click();

    const confirm = await page.waitForSelector("xpath/.//button[text()='Confirm']");
    await confirm.click();

    await page.waitForNavigation();

    // Check if the URL contains "/login"
    expect(page.url()).toContain("/login");
  });

  // Test clicking "Login" button redirects to /login
  test("Clicking 'Login' button redirects to /login", async () => {
    await page.goto("http://localhost:5173/login");

    // Enter text in username and password text inputs
    await page.type("input[id='email']", "fe-testuser@example.com");
    await page.type("input[id='password']", "fe-Password123");
    // Click the "Login" button
    loginButton2 = await page.$("xpath/.//button[text()='Login']");
    await loginButton2.click();
    await page.waitForNavigation();
    // Check if the URL contains "/profile"
    expect(page.url()).toContain("/profile");

    await page.goto("http://localhost:5173");
  });
});