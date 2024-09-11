import { Page, test } from "@playwright/test";
import fs from "fs";

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async removeProductsFromCart() {
        await this.page.waitForTimeout(2000);
        await this.page.request.post(
            `${process.env.URL}/api/cart/remove-cart`,
            {},
        );
    }

    async goBack() {
        await test.step('I can navigate back to previous page', async () => {
            await this.page.goBack();
        })
    }

    async navigateTo(path: string) {
        await this.page.goto(`${process.env.URL}${path}`, { timeout: 40000 });
        await this.page.waitForLoadState("networkidle");
    }

    async navigateToAndGetResponseBody(path: string, responseApiPath: string) {
        const jsonObj = this.page.waitForResponse(
            (resp) =>
                resp.url().includes(responseApiPath) && resp.status() == 200,
        );
        await this.navigateTo(path);
        return await jsonObj.then((resp) => resp.json());
    }
}
