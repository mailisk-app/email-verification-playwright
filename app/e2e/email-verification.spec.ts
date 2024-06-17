import { test, expect } from "@playwright/test";
import axios from "axios";
import { MailiskClient } from "mailisk";

const namespace = process.env.MAILISK_NAMESPACE;

const mailisk = new MailiskClient({ apiKey: process.env.MAILISK_API_KEY });

test.describe("Test email verification", () => {
  
  test("Should sign up, verify email, and login a new user", async ({
    page,
  }) => {
    const testEmailAddress = `test.${Date.now()}@${namespace}.mailisk.net`;

    await page.goto("http://localhost:3000/register");
    await page.fill("#email", testEmailAddress);
    await page.fill("#password", "password");
    await page.click('form button[type="submit"]');
    // if the register was successful we should be redirected to the login screen
    await expect(page).toHaveURL("http://localhost:3000/");

    // Login as user
    await page.fill("#email", testEmailAddress);
    await page.fill("#password", "password");
    await page.click('form button[type="submit"]');
    // if the login was successful we should be redirected to the verify email screen, as we haven't verified our email yet
    await expect(page).toHaveURL("http://localhost:3000/verify-email");
    // at this point an email with the verification code will be sent by the backend

    // Verify email
    await page.goto("http://localhost:3000/verify-email");

    let code;

    // we wait for the email to arrive, we filter by it's prefix
    const { data: emails } = await mailisk.searchInbox(namespace, {
      to_addr_prefix: testEmailAddress,
    });

    const email = emails[0];
    // we know that the code is the only number in the email, so we easily filter it out
    code = email.text.match(/\d+/)[0];
    expect(code).toBeDefined();

    // now we enter the code and confirm our email
    await page.fill("#email", testEmailAddress);
    await page.fill("#code", code);
    await page.click('form button[type="submit"]');

    // we should be redirected to the dashboard as proof of a successful verification
    await expect(page).toHaveURL("http://localhost:3000/dashboard");

    // Login as user again
    // as a sanity check we want to ensure our email is verified, by logging in again
    await page.goto("http://localhost:3000/");
    await page.fill("#email", testEmailAddress);
    await page.fill("#password", "password");
    await page.click('form button[type="submit"]');
    // this time we should be redirected to the dashboard since we've verified the email
    await expect(page).toHaveURL("http://localhost:3000/dashboard");
  });
});
