import { Locator, Page, expect, test } from "@playwright/test";
import { MenuCustomerPortalSection } from "../sections/menuCustomerPortal.section";

export class ProfileDeleteCustomerPortalPage extends MenuCustomerPortalSection {
    protected readonly page: Page;
    private readonly deleteButton: Locator;
    private readonly confirmEmailSnackbar: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.deleteButton = page.locator("button").getByText("Delete");
        this.confirmEmailSnackbar = page
            .locator(".emailsent-snackbar-message")
            .getByText(
                " The confirmation email has been sent to your email successfully.",
            );
    }

    async deleteProfile() {
        await test.step('I can click on the "Delete" button', async () => {
            await this.deleteButton.click();
        })
    }

    async checkConfirmEmailIsShown() {
        await expect.soft(this.confirmEmailSnackbar, "Snackbar confirm email is shown").toBeVisible();
        await expect.soft(this.confirmEmailSnackbar, "Snackbar confirm email is hidden").toBeHidden();
    }
}
