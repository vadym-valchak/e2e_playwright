import { Locator, Page, expect, test } from "@playwright/test";
import { MenuCustomerPortalSection } from "../sections/menuCustomerPortal.section";

export class LicenseDetailsCustomerPortalPage extends MenuCustomerPortalSection {
    protected readonly page: Page;
    private readonly assignLicenseInputField: Locator;
    private readonly assignButton: Locator;
    private readonly revokeButton: Locator;
    private readonly cancelInvitationButton: Locator;
    private readonly resendInvitationButton: Locator;
    private readonly downloadButton: Locator;
    private readonly licenseOwner: Locator;
    private readonly licenseAdmin: Locator;
    private readonly emailSentSnackbar: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.assignLicenseInputField = page.locator(
            "[formcontrolname='email']",
        );
        this.assignButton = page.getByRole("button", { name: "Assign" });
        this.revokeButton = page.getByRole("button", { name: "Revoke" });
        this.cancelInvitationButton = page.getByRole("button", {
            name: "Cancel invitation",
        });
        this.resendInvitationButton = page.getByRole("button", {
            name: "Resend invitation",
        });
        this.downloadButton = page.getByText("Download product versions");
        this.licenseOwner = page.locator("div.email-licenses").first();
        this.licenseAdmin = page.locator("div.email-licenses").nth(1);
        this.emailSentSnackbar = page.locator(".emailsent-snackbar-message");
    }

    async assignLicenseTo(email: string) {
        await this.page.waitForTimeout(2000);
        if (await this.resendInvitationButton.isVisible()) {
            await test.step('I can click on Resend Invitation button', async () => {
                await this.resendInvitationButton.click();
            })
            await this.checkSpinnerIsVisible();
            await this.checkSpinnerIsHidden();
        }
        if (await this.revokeButton.isVisible()) {
            await test.step('I can click on Revoke button', async () => {
                await this.revokeButton.click();
            })
            await this.checkSpinnerIsVisible();
            await this.checkSpinnerIsHidden();
            await test.step(`I can input "${email}" in Assign License field`, async () => {
                await this.assignLicense(email);
            })
        }
        if (await this.assignButton.isVisible()) {
            await test.step(`I can input "${email}" in Assign License field`, async () => {
                await this.assignLicense(email);
            })
        }
    }

    async revokeLicense() {
        await test.step('I can click on the Revoke button', async () => {
            await this.revokeButton.click();
        })
        await this.checkSpinnerIsHidden();
    }

    async checkRevokeButtonIsHidden() {
        await expect(this.revokeButton, 'Clicking on the Revoke button hide it').toBeHidden({ timeout: 10000 });
    }

    async openDownalodProductPage() {
        await this.page.waitForTimeout(1000);
        await test.step('I can open Download page for license product', async () => {
            await this.downloadButton.click({ force: true });
        })
    }

    async checkLicenseOwnerIsDisplayed(licenseOwnerValue: string) {
        await expect.soft(this.licenseOwner, `License owner field contains email: "${licenseOwnerValue}"`).toContainText(licenseOwnerValue);
    }

    async checkLicenseAdminIsAssigned(licenseAdminValue: string) {
        await expect.soft(this.licenseAdmin, `License admin field contains email: "${licenseAdminValue}"`).toContainText(licenseAdminValue);
    }

    async checkLicenseAdminIsNotAssigned() {
        await expect.soft(this.licenseAdmin, 'License admin field is not empty').toContainText("Not assigned");
    }

    async checkInvitationSnackbar() {
        await expect.soft(this.emailSentSnackbar, '"Email is sent" snackbar is visible"').toBeVisible();
        await expect
            .soft(this.emailSentSnackbar, '"Email is sent" snackbar is hidden')
            .toBeHidden({ timeout: 10000 });
    }

    async checkLicenseRevokedSnackbar() {
        await expect
            .soft(
                this.emailSentSnackbar.getByText(
                    "The license assignment has been revoked successfully"
                ), 'Snackbar revoke license is shown'
            )
            .toBeVisible();
        await expect
            .soft(
                this.emailSentSnackbar.getByText(
                    "The license assignment has been revoked successfully"
                ), 'Snackbar revoke license is hidden'
            )
            .toBeHidden();
    }

    private async checkSpinnerIsVisible() {
        await expect.soft(this.spinner, 'Spinner is displayed').toBeVisible({ timeout: 10000 });
    }

    private async checkSpinnerIsHidden() {
        await expect.soft(this.spinner, 'Spinner is hidden').toBeHidden({ timeout: 10000 });
    }

    private async assignLicense(email: string) {
        await this.assignLicenseInputField.fill(email);
        await this.assignButton.isEnabled();
        await this.assignButton.click();
        await this.checkSpinnerIsHidden();
        await await expect.soft(this.assignButton).toBeHidden();
    }
}
