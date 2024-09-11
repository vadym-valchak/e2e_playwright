import { Locator, Page, test } from "@playwright/test";

export class MenuDatabaseToolsWebsiteSection {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async menuItem(productName: string) {
        await test.step(`I can open ${productName} menu item `, async () => {
            await this.page
            .locator(".dropdown-menu-content-list__link")
            .getByText(productName)
            .click();
        })
    }
}
