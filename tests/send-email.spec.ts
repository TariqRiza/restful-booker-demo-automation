import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/home-page";
import * as userData from "../data/send-email-data.json";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test("SND-01 Verify that the user can send an Email", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch " + userData.name })).toBeVisible();
  });
});

test("SND-02 Verify send an email leaving Name field empty", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail("", userData.email, userData.phone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Name may not be blank")).toBeVisible();
  });
});

test("SND-03 Verify send an email leaving Email field empty", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, "", userData.phone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Email may not be blank")).toBeVisible();
  });
});

test("SND-04 Verify send an email leaving Phone Number field empty", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, "", userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Phone may not be blank")).toBeVisible();
  });
});

test("SND-05 Verify send an email leaving Subject field empty", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, "", userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Subject may not be blank")).toBeVisible();
  });
});

test("SND-06 Verify send an email leaving Message field empty", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject, "");
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Message may not be blank")).toBeVisible();
  });
});

test("SND-07 Verify send an email with a very short Name", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.veryShortName, userData.email, userData.phone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    // await expect(page.getByText("Message may not be blank")).toBeVisible();
  });
});

test("SND-08 Verify send an email with a very long Name", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.veryLongName, userData.email, userData.phone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    // await expect(page.getByText("Message may not be blank")).toBeVisible();
  });
});

test("SND-09 Verify send an email with a wrong email format", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.wrongEmailFormat, userData.phone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("must be a well-formed email address")).toBeVisible();
  });
});

test("SND-10 Verify send an email with a non-numeric characters for the Phone Number", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.nonNumberPhone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    // await expect(page.getByText("must be a well-formed email address")).toBeVisible();
  });
});

test("SND-11 Verify send an email with a very short Phone Number", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.veryShortPhone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Phone must be between 11 and 21 characters")).toBeVisible();
  });
});

test("SND-12 Verify send an email with a very long Phone Number", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.veryLongPhone, userData.subject, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Phone must be between 11 and 21 characters")).toBeVisible();
  });
});

test("SND-13 Verify send an email with 4 characters for the subject", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject4Char, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Subject must be between 5 and 100 characters")).toBeVisible();
  });
});

test("SND-14 Verify send an email with 5 characters for the subject", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject5Char, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch " + userData.name })).toBeVisible();
  });
});

test("SND-15 Verify send an email with 100 characters for the subject", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject100Char, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch " + userData.name })).toBeVisible();
  });
});

test("SND-16 Verify send an email with 101 characters for the subject", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject101Char, userData.message);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Subject must be between 5 and 100 characters")).toBeVisible();
  });
});

test("SND-17 Verify send an email with 19 characters for the Message", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject, userData.message19Char);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Message must be between 20 and 2000 characters")).toBeVisible();
  });
});

test("SND-18 Verify send an email with 20 characters for the Message", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject, userData.message20Char);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch " + userData.name })).toBeVisible();
  });
});

test("SND-19 Verify send an email with 2000 characters for the Message", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject, userData.message2000Char);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch " + userData.name })).toBeVisible();
  });
});

test("SND-20 Verify send an email with 2001 characters for the Message", async ({ page }) => {
  const home = new HomePage(page);
  await home.sendEmail(userData.name, userData.email, userData.phone, userData.subject, userData.message2001Char);
  await page.waitForTimeout(1000);
  await test.step("Check Result", async () => {
    await expect(page.getByRole("heading", { name: "Thanks for getting in touch" })).toBeHidden();
    await expect(page.getByText("Message must be between 20 and 2000 characters")).toBeVisible();
  });
});
