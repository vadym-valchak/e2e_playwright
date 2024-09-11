import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ContactSalesPage extends BasePage {
    readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    async selectRequestCategoryDp(category: string) {
        await this.page.locator("[name = 'Topic']").selectOption(category);
    }

    async selectProductGroupDp(group: string) {
        await this.page.locator("[name = 'ProductGroup']").selectOption(group);
    }

    async selectProductNameDp(product: string) {
        await this.page.locator("[name = 'ProductName']").selectOption(product);
    }

    async inputFirstName(firstName: string) {
        await this.page.locator("[name = 'FirstName']").fill(firstName);
    }

    async inputLastName(lastName: string) {
        await this.page.locator("[name = 'LastName']").fill(lastName);
    }

    async inputEmail(email: string) {
        await this.page.locator("[name = 'Email']").fill(email);
    }

    async writeMessage(message: string) {
        await this.page.locator("[name = 'Text']").fill(message);
    }

    async clickSendRequestButton() {
        const responsePromise = this.page.waitForResponse((response) =>
            response.url().includes("/contact-sales"),
        );
        await this.page.getByText("Send Request").click();
        const response = await responsePromise;
        return response.status();
    }
}
