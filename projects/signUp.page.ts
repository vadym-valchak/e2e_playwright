import { expect, type Locator, type Page, test } from "@playwright/test";

export class SignUpPage {
    readonly page: Page;
    private signInLink: Locator;
    private readonly firstName: Locator;
    private readonly emailField: Locator;
    private readonly passwordField: Locator;
    private readonly accepCheckbox: Locator;
    private readonly signUpButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInLink = page.locator("a[href='#login']").getByText("Sign In");
        this.firstName = page.locator("#create-account-tab #FirstName");
        this.emailField = page.locator("#create-account-tab #Email");
        this.passwordField = page.locator("#create-account-tab #NewPassword");
        this.accepCheckbox = page.locator(
            "#create-account-tab .input-checkbox",
        );
        this.signUpButton = page.locator("#create-account-tab [type='submit']");
    }

    async assertElements() {
        await expect(this.firstName).toBeVisible();
        await expect(this.emailField).toBeVisible();
        await expect(this.passwordField).toBeVisible();
        await expect(this.accepCheckbox).toBeVisible();
        await expect(this.signUpButton).toBeVisible();
    }

    async signUp(firstName: string, email: string, password: string) {
        await this.page.waitForSelector("#register-account");
        const emailAttribute = await this.emailField.getAttribute("readonly");
        if (emailAttribute != "readonly") {
            await this.emailField.fill(email);
        }
        await test.step('I can fill Sign Up form and registrate new user', async () => {
            await this.firstName.fill(firstName);
            await this.passwordField.fill(password);
            await this.accepCheckbox.click({ position: { x: 5, y: 5 } });
            await this.signUpButton.click();
        })
    }

    async openSignInPage() {
        await this.page.waitForLoadState("networkidle");
        await test.step('I can open Sign In page', async () => {
            await expect(this.signInLink).toBeVisible();
            await this.signInLink.click();
        })
    }

    async checkUserExist() {
        await this.page
            .locator("#register-account .validation-summary-errors")
            .isVisible();
    }
}
