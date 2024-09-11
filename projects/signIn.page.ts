import { expect, Locator, Page, test } from "@playwright/test";

export class SignInPage {
    readonly page: Page;
    private readonly emailField: Locator;
    private readonly passwordField: Locator;
    private readonly signInButton: Locator;
    private readonly signUpLink: Locator;
    private readonly googleButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailField = page.locator("form[id='login'] #Email");
        this.passwordField = page.locator("#Password");
        this.signInButton = page.locator("button[value='login']");
        this.signUpLink = page.locator("a[href='#create-account-tab']");
        this.googleButton = page.getByText("Google").first();
    }

    async checkPageElements() {
        await expect(this.emailField, 'Email field is visible').toBeVisible();
        await expect(this.passwordField, 'Password field is visible').toBeVisible();
        await expect(this.signInButton, 'Password button is visible').toBeVisible();
    }

    async login(email: string, password: string) {
        const emailAttribute = await this.emailField.getAttribute("readonly");
        await test.step('I can authorize successfully on Login page', async () => {
            if (emailAttribute != "readonly") {
                await this.emailField.fill(email);
            }
            await this.passwordField.fill(password);
            await this.signInButton.click();
        })
    }

    async openSignUpForm() {
        await this.page.waitForLoadState("networkidle");
        await expect(this.signUpLink, 'Sign Up link is visible').toBeVisible();
        await test.step('I can click on the Sigh Up link', async () => {
            await this.signUpLink.click();
        })
    }

    async openGoogleAuthorizationForm() {
        await this.googleButton.click();
    }

    async checkInvalidLoginPasswordWarningIsDisplayed() {
        await expect(this.page.locator(".tab-pane#login"), '"Wrong Login or Password" warning message is shown').toContainText(
            "Invalid username or password",
        );
    }
}
