import { Locator, Page, test } from "@playwright/test";

export class MenuCustomerPortalSection {
    protected readonly page: Page;
    readonly spinner: Locator;
    private readonly exitIcon: Locator;
    private readonly storeButton: Locator;
    private readonly menuProfile: Locator;

    constructor(page: Page) {
        this.page = page;
        this.exitIcon = page.getByText("login");
        this.spinner = page.locator(".lds-roller");
        this.storeButton = page.locator("a.btn").getByText("store");
        this.menuProfile = page.locator(".menu-item").getByText("Profile");
    }

    async openStore() {
        await test.step('I can navigate to web site from Customer Portal (click on Store button)', async () => {
            await this.storeButton.click();
        })
    }

    async openProfilePage() {
        await test.step('I can click on the "Profile" item in customer menu', async () => {
            await this.menuProfile.click();
        })
    }

    async logout() {
        await test.step('I can click on Exit icon on Customet Portal application', async () => {
            await this.exitIcon.click();
        })
    }
}
