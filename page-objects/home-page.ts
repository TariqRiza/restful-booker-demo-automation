import { test, expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  // Room booking form Locator
  readonly roomBookButton: Locator;
  readonly backDateButton: Locator;
  readonly nextDateButton: Locator;
  readonly roomFirstnameForm: Locator;
  readonly roomLastnameForm: Locator;
  readonly roomEmailForm: Locator;
  readonly roomPhoneForm: Locator;
  readonly bookButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  // Contact form Locator
  readonly contactNameForm: Locator;
  readonly contactEmailForm: Locator;
  readonly contactPhoneForm: Locator;
  readonly contactSubjectForm: Locator;
  readonly contactMessageForm: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Room booking form Locator
    this.roomBookButton = page.getByRole("button", { name: "Book this room" }).first();
    this.backDateButton = page.getByRole("button", { name: "Back" }).first();
    this.nextDateButton = page.getByRole("button", { name: "Next" }).first();
    this.roomFirstnameForm = page.getByPlaceholder("Firstname");
    this.roomLastnameForm = page.getByPlaceholder("Lastname");
    this.roomEmailForm = page.getByPlaceholder("Email").first();
    this.roomPhoneForm = page.getByPlaceholder("Phone").first();
    this.bookButton = page.getByRole("button", { name: "Book", exact: true });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.closeButton = page.getByRole("button", { name: "Close" });

    // Contact form Locator
    this.contactNameForm = page.getByTestId("ContactName");
    this.contactEmailForm = page.getByTestId("ContactEmail");
    this.contactPhoneForm = page.getByTestId("ContactPhone");
    this.contactSubjectForm = page.getByTestId("ContactSubject");
    this.contactMessageForm = page.getByTestId("ContactDescription");
    this.submitButton = page.getByRole("button", { name: "Submit" });
  }

  // Method to get the Date locator
  getDateLocator(date: Date) {
    let dateLocation: Locator;
    const dateStr = date.getDate().toString().padStart(2, "0");
    dateLocation = this.page.getByLabel("Month View").locator(".rbc-date-cell:not(.rbc-off-range)").filter({ hasText: dateStr });
    return dateLocation;
  }

  // Method to select the date
  async selectDate(dateStart: Date, dateEnd: Date) {
    const todayDate = new Date();
    const bookMonth = dateStart.toLocaleString("default", { month: "long", year: "numeric" });

    const date1 = this.getDateLocator(dateStart);
    const date2 = this.getDateLocator(dateEnd);

    // Choosing the right month based on the booking date
    let monthDiff = dateStart.getMonth() - todayDate.getMonth() + 12 * (dateStart.getFullYear() - todayDate.getFullYear());
    while (monthDiff != 0) {
      if (monthDiff > 0) {
        await this.nextDateButton.click();
        monthDiff--;
      } else if (monthDiff < 0) {
        await this.backDateButton.click();
        monthDiff++;
      }
    }
    // Checking if it's already on the right month on the date selector
    await expect.soft(this.page.getByText(bookMonth)).toBeVisible();

    // Selecting the date
    await date1.hover();
    await this.page.mouse.down();
    await date2.hover();
    await this.page.mouse.down();
    await date1.hover();
    await this.page.mouse.up();
  }

  // Method to book a room
  async roomBook(dateStart: Date, dateEnd: Date, firstName: string, lastName: string, email: string, phone: string) {
    await test.step('Click "Book this room" button ', async () => {
      await this.roomBookButton.click();
      await this.page.waitForTimeout(500);
      await expect.soft(this.roomFirstnameForm).toBeVisible();
      await expect.soft(this.roomLastnameForm).toBeVisible();
      await expect.soft(this.roomEmailForm).toBeVisible();
      await expect.soft(this.roomPhoneForm).toBeVisible();
    });
    await test.step("Select date", async () => {
      await this.selectDate(dateStart, dateEnd);
      // Soft check if the number of night and cost is right or not
      const nightBooked = dateEnd.getDate() - dateStart.getDate();
      await expect.soft(this.page.getByText(nightBooked + " night(s) - £" + nightBooked + "00").first()).toBeVisible();
    });
    await test.step("Enter Firstname", async () => {
      await this.roomFirstnameForm.fill(firstName);
      await expect.soft(this.roomFirstnameForm).toHaveValue(firstName);
    });
    await test.step("Enter Lastname", async () => {
      await this.roomLastnameForm.fill(lastName);
      await expect.soft(this.roomLastnameForm).toHaveValue(lastName);
    });
    await test.step("Enter Email", async () => {
      await this.roomEmailForm.fill(email);
      await expect.soft(this.roomEmailForm).toHaveValue(email);
    });
    await test.step("Enter Phone Number", async () => {
      await this.roomPhoneForm.fill(phone);
      await expect.soft(this.roomPhoneForm).toHaveValue(phone);
    });
    await test.step('Click "Book" button', async () => {
      await this.bookButton.click();
    });
  }

  //Method to send an email
  async sendEmail(name: string, email: string, phone: string, subject: string, message: string) {
    await test.step("Enter Name", async () => {
      await this.contactNameForm.fill(name);
      await expect.soft(this.contactNameForm).toHaveValue(name);
    });
    await test.step("Enter Email", async () => {
      await this.contactEmailForm.fill(email);
      await expect.soft(this.contactEmailForm).toHaveValue(email);
    });
    await test.step("Enter Phone number", async () => {
      await this.contactPhoneForm.fill(phone);
      await expect.soft(this.contactPhoneForm).toHaveValue(phone);
    });
    await test.step("Enter Subject", async () => {
      await this.contactSubjectForm.fill(subject);
      await expect.soft(this.contactSubjectForm).toHaveValue(subject);
    });
    await test.step("Enter Message", async () => {
      await this.contactMessageForm.fill(message);
      await expect.soft(this.contactMessageForm).toHaveValue(message);
    });
    await test.step("Click Submit button", async () => {
      await this.submitButton.click();
    });
  }
}
