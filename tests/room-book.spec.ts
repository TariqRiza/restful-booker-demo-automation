import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/home-page";
import * as userData from "../data/room-book-data.json";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test("RBK-01 Verify that user can book a room", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 07 - 10 of next month
  date1.setDate(7);
  date1.setMonth(date1.getMonth() + 1);
  date2.setDate(10);
  date2.setMonth(date2.getMonth() + 1);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
  });
});

test("RBK 02 Verify book a room without choosing the date", async ({ page }) => {
  const home = new HomePage(page);
  await test.step('Click "Book this room" button ', async () => {
    await home.roomBookButton.click();
    await home.page.waitForTimeout(500);
    await expect.soft(home.roomFirstnameForm).toBeVisible();
    await expect.soft(home.roomLastnameForm).toBeVisible();
    await expect.soft(home.roomEmailForm).toBeVisible();
    await expect.soft(home.roomPhoneForm).toBeVisible();
  });
  await test.step("Enter Firstname", async () => {
    await home.roomFirstnameForm.fill(userData.firstName);
    await expect.soft(home.roomFirstnameForm).toHaveValue(userData.firstName);
  });
  await test.step("Enter Lastname", async () => {
    await home.roomLastnameForm.fill(userData.lastName);
    await expect.soft(home.roomLastnameForm).toHaveValue(userData.lastName);
  });
  await test.step("Enter Email", async () => {
    await home.roomEmailForm.fill(userData.email);
    await expect.soft(home.roomEmailForm).toHaveValue(userData.email);
  });
  await test.step("Enter Phone Number", async () => {
    await home.roomPhoneForm.fill(userData.phone);
    await expect.soft(home.roomPhoneForm).toHaveValue(userData.phone);
  });
  await test.step('Click "Book" button', async () => {
    await home.bookButton.click();
  });
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("must not be null").first()).toBeVisible();
  });
});

test("RBK-03 Verify that user can't book an already booked room", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 14 - 17 of next month
  date1.setDate(14);
  date1.setMonth(date1.getMonth() + 1);
  date2.setDate(17);
  date2.setMonth(date2.getMonth() + 1);

  await test.step("Book a room first", async () => {
    await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.email, userData.phone);
  });
  await page.waitForTimeout(1000);
  await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
  await test.step('Click "Close" button', async () => {
    await home.closeButton.click();
  });
  await test.step("Trying to book an already booked room", async () => {
    await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.email, userData.phone);
  });
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("already booked").first()).toBeVisible();
  });
});

test("RBK-04 Verify that user can't book a room with a past date", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 07 - 10 of the previous month
  date1.setDate(7);
  date1.setMonth(date1.getMonth() - 1);
  date2.setDate(10);
  date2.setMonth(date2.getMonth() - 1);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(home.roomFirstnameForm).toBeVisible();
  });
});

test("RBK-05 Verify that it displayed the right number of night and cost when choosing the date", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();
  let nightBooked: number;

  await test.step('Click "Book this room" button ', async () => {
    await home.roomBookButton.click();
    await home.page.waitForTimeout(500);
    await expect.soft(home.roomFirstnameForm).toBeVisible();
    await expect.soft(home.roomLastnameForm).toBeVisible();
    await expect.soft(home.roomEmailForm).toBeVisible();
    await expect.soft(home.roomPhoneForm).toBeVisible();
  });

  await test.step("Check Display 01", async () => {
    date1.setDate(7);
    date2.setDate(10);
    nightBooked = date2.getDate() - date1.getDate();
    await home.selectDate(date1, date2);
    await page.waitForTimeout(200);
    await expect(page.getByText(nightBooked + " night(s) - £" + nightBooked + "00").first()).toBeVisible();
  });
  await test.step("Check Display 02", async () => {
    date1.setDate(1);
    date2.setDate(8);
    nightBooked = date2.getDate() - date1.getDate();
    await home.selectDate(date1, date2);
    await page.waitForTimeout(200);
    await expect(page.getByText(nightBooked + " night(s) - £" + nightBooked + "00").first()).toBeVisible();
  });
  await test.step("Check Display 03", async () => {
    date1.setDate(9);
    date2.setDate(20);
    nightBooked = date2.getDate() - date1.getDate();
    await home.selectDate(date1, date2);
    await page.waitForTimeout(200);
    await expect(page.getByText(nightBooked + " night(s) - £" + nightBooked + "00").first()).toBeVisible();
  });
  await test.step("Check Display 04", async () => {
    date1.setDate(15);
    date2.setDate(21);
    nightBooked = date2.getDate() - date1.getDate();
    await home.selectDate(date1, date2);
    await page.waitForTimeout(200);
    await expect(page.getByText(nightBooked + " night(s) - £" + nightBooked + "00").first()).toBeVisible();
  });
});

test("RBK-06 Verify book a room leaving Firstname field empty", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 21 - 23 of next month
  date1.setDate(21);
  date1.setMonth(date1.getMonth() + 1);
  date2.setDate(23);
  date2.setMonth(date2.getMonth() + 1);

  await home.roomBook(date1, date2, "", userData.lastName, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("Firstname should not be blank").first()).toBeVisible();
  });
});

test("RBK-07 Verify book a room leaving Lastname field empty", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 21 - 23 of next month
  date1.setDate(21);
  date1.setMonth(date1.getMonth() + 1);
  date2.setDate(23);
  date2.setMonth(date2.getMonth() + 1);

  await home.roomBook(date1, date2, userData.firstName, "", userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("Lastname should not be blank").first()).toBeVisible();
  });
});

test("RBK-08 Verify book a room leaving Email field empty", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 21 - 23 of next month
  date1.setDate(21);
  date1.setMonth(date1.getMonth() + 1);
  date2.setDate(23);
  date2.setMonth(date2.getMonth() + 1);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName, "", userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("must not be empty").first()).toBeVisible();
  });
});

test("RBK-09 Verify book a room leaving Phone field empty", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 21 - 23 of next month
  date1.setDate(21);
  date1.setMonth(date1.getMonth() + 1);
  date2.setDate(23);
  date2.setMonth(date2.getMonth() + 1);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.email, "");
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("must not be empty").first()).toBeVisible();
  });
});

test("RBK-10 Verify book a room with 2 characters for the Firstname", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 21 - 23 of next month
  date1.setDate(21);
  date1.setMonth(date1.getMonth() + 1);
  date2.setDate(23);
  date2.setMonth(date2.getMonth() + 1);

  await home.roomBook(date1, date2, userData.firstName2Char, userData.lastName, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("size must be between 3 and 18").first()).toBeVisible();
  });
});

test("RBK-11 Verify book a room with 3 characters for the Firstname", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 21 - 23 of next month
  date1.setDate(21);
  date1.setMonth(date1.getMonth() + 1);
  date2.setDate(23);
  date2.setMonth(date2.getMonth() + 1);

  await home.roomBook(date1, date2, userData.firstName3Char, userData.lastName, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
  });
});

test("RBK-12 Verify book a room with 18 characters for the Firstname", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 02 - 05 of the next 2 month
  date1.setDate(2);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(5);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName18Char, userData.lastName, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
  });
});

test("RBK-13 Verify book a room with 19 characters for the Firstname", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 07 - 09 of the next 2 month
  date1.setDate(7);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(9);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName19Char, userData.lastName, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("size must be between 3 and 18").first()).toBeVisible();
  });
});

test("RBK-14 Verify book a room with 2 characters for the Lastname", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 07 - 09 of the next 2 month
  date1.setDate(7);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(9);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName2Char, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("size must be between 3 and 30").first()).toBeVisible();
  });
});

test("RBK-15 Verify book a room with 3 characters for the Lastname", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 07 - 09 of the next 2 month
  date1.setDate(7);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(9);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName3Char, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
  });
});

test("RBK-16 Verify book a room with 30 characters for the Lastname", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 11 - 13 of the next 2 month
  date1.setDate(11);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(13);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName30Char, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
  });
});

test("RBK-17 Verify book a room with 31 characters for the Lastname", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 15 - 17 of the next 2 month
  date1.setDate(15);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(17);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName31Char, userData.email, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("size must be between 3 and 30").first()).toBeVisible();
  });
});

test("RBK-18 Verify book a room with a wrong email format", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 15 - 17 of the next 2 month
  date1.setDate(15);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(17);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.wrongEmailFormat, userData.phone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("must be a well-formed email address").first()).toBeVisible();
  });
});

test("RBK-19 Verify book a room with a non-numeric characters for the Phone Number", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 15 - 17 of the next 2 month
  date1.setDate(15);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(17);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.email, userData.nonNumberPhone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(home.roomPhoneForm).toBeVisible();
  });
});

test("RBK-20 Verify book a room with a very short Phone Number", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 19 - 21 of the next 2 month
  date1.setDate(19);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(21);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.email, userData.veryShortPhone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("size must be between 11 and 21").first()).toBeVisible();
  });
});

test("RBK-21 Verify book a room with a very long Phone Number", async ({ page }) => {
  const home = new HomePage(page);
  const date1 = new Date();
  const date2 = new Date();

  // set book date to 19 - 21 of the next 2 month
  date1.setDate(19);
  date1.setMonth(date1.getMonth() + 2);
  date2.setDate(21);
  date2.setMonth(date2.getMonth() + 2);

  await home.roomBook(date1, date2, userData.firstName, userData.lastName, userData.email, userData.veryLongPhone);
  await page.waitForTimeout(1000);
  await test.step("Check result", async () => {
    await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeHidden();
    await expect(page.getByText("size must be between 11 and 21").first()).toBeVisible();
  });
});
