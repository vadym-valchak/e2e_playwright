import { expect, Locator, Page } from "@playwright/test";
import { users } from "../test_data/users";

const userLogin = users.googleAccount.email || "";
const userPass = users.googleAccount.password || "";

export class GoogleAutorizationPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async authorize() {
        const html = await this.page.locator("body").innerHTML();
        // Determine type of Google sign in form
        if (html.includes('aria-label="Google"')) {
            // Old Google sign in form
            await this.page.fill("#Email", userLogin);
            await this.page.locator("#next").click();
            await this.page.fill("#password", userPass);
            await this.page.locator("#submit").click();
        } else {
            // New Google sign in form
            await this.page.fill('input[type="email"]', userLogin);
            await this.page.locator("#identifierNext >> button").click();
            await this.page.fill(
                '#password >> input[type="password"]',
                userPass,
            );
            await this.page.locator("button >> nth=1").click();
        }
    }
}
