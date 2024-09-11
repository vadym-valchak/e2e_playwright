import { test as base } from "@playwright/test";
import { ProductsWebsitePage } from "../projects/website/pages/productsWebsite.page";
import { PricingOptionsPage } from "../projects/website/pages/pricingOptions.page";

export interface TestOptions {
    productsWebsitePage: ProductsWebsitePage;
    pricingOptionsPage: PricingOptionsPage;
}

export const test = base.extend<TestOptions>({
    productsWebsitePage: async ({ page }, use) => {
        const productsWebsitePage = new ProductsWebsitePage(page);
        productsWebsitePage.navigateTo("products.html");
        use(productsWebsitePage);
    },

    pricingOptionsPage: async ({ page }, use) => {
        const pricingOptionsPage = new PricingOptionsPage(page);
        use(pricingOptionsPage);
    },
});
