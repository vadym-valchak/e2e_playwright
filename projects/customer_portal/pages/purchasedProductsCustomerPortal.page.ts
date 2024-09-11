import { Locator, Page, expect, test } from "@playwright/test";
import { MenuCustomerPortalSection } from "../sections/menuCustomerPortal.section";

export class PurchasedProductsCustomerPortalPage extends MenuCustomerPortalSection {
    protected readonly page: Page;
    private readonly emptyPageQuote: Locator;
    private readonly purchasedProductTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.emptyPageQuote = this.page.locator("h4.quotes-title");
        this.purchasedProductTitle = this.page.getByText("Purchased products");
    }

    async openLicenseDetails(productName: string) {
        await test.step(`I can open "${productName}" license detail page`, async () => {
            await this.page.getByText(productName).first().click();
        })
    }

    async checkThatEmptyPageIsShown() {
        await expect(this.emptyPageQuote, 'Licenses page is empty').toHaveText(
            "There are no product licenses associated with your account",
            {
                timeout: 30 * 1000,
            }
        );
    }

    async checkPurchasedProductPageIsShown() {
        await expect(this.purchasedProductTitle, "Purchased product page is not loaded").toHaveText(
            "Purchased products",
            { timeout: 30 * 1000 },
        );
    }
}
