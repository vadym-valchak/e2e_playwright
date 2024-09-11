import { Page, test } from "@playwright/test";
import { BasePage } from "./base.page";

export class SISSSubGroupWebsitePage extends BasePage {
    readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    async openProduct(productName: string) {
        await test.step(`I can open ${productName} product in menu `, async () => {
            await this.page
            .locator('a[href="universal-bundle/"]')
            .getByText(productName)
            .click();
        })
    }
}
