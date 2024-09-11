import { Locator, Page, expect, test } from "@playwright/test";
import { BasePage } from "./base.page";

export class ProductDetailsWebsitePage extends BasePage {
    readonly page: Page;
    private readonly downloadButtonOnBunner: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.downloadButtonOnBunner = page
            .locator(".banner-group-btn")
            .getByText("Download");
    }

    async clickDownloadButton() {
        await test.step('I can click on the "Download" button on the bunner on product info page', async () => {
            await this.downloadButtonOnBunner.click();
        })
    }

    async clickBuyNowButton() {
        await test.step('I can click on the "Buy Now" button', async () => {
            await this.page.locator(".banner-btn").getByText("Buy now").click();
        })
    }

    async clickRequestDemoButton() {
        await this.page
            .locator(".banner-btn")
            .getByText("Request a demo")
            .click();
    }

    async filterProductsByCategory(category: string) {
        await this.page.waitForSelector("div.store-img");
        await expect(
            await this.page
                .locator(".input-checkbox span.checkbox-label")
                .getByText(category),
        ).toBeVisible();
        await this.page
            .locator(".input-checkbox span.checkbox-label")
            .getByText("Data connectivity")
            .click();
        await this.page.waitForSelector("div.store-img");
    }
}
