import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { Price } from "../../../test_data/models/price";
import { IPricesList } from "../../../test_data/models/ICartProducts.model";

export class ProductsWebsitePage extends BasePage {
    readonly page: Page;
    private readonly productAddedToCartSnackbar: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.productAddedToCartSnackbar = page.locator(".show-snackbar");
    }

    async filterProductsByCategory(categoryName: string) {
        await this.page.waitForSelector("div.store-img");
        await expect(
            await this.page
                .locator(".input-checkbox span.checkbox-label")
                .getByText(categoryName),
        ).toBeVisible();
        await this.page
            .locator(".input-checkbox span.checkbox-label")
            .getByText(categoryName)
            .click();
        await this.page.waitForSelector("div.store-img");
    }

    async doNotFilterProductsByCategory(categoryName: string) {
        await this.filterProductsByCategory(categoryName);
    }

    async clickViewPricingOptionsForProduct(productName: string) {
        await this.page
            .locator(".store-products-box", {
                has: this.page
                    .locator(".all-product-title a")
                    .getByText(`${productName}`),
            })
            .locator(".view-pricing-options a")
            .click({ timeout: 15000 });
    }

    async clickDownloadButtonForProduct(productName: string) {
        await this.page
            .locator(".store-products-box", {
                has: this.page
                    .locator(".all-product-title a")
                    .getByText(`${productName}`),
            })
            .getByText("Download")
            .click();
    }

    async waitForPageIsLoaded() {
        await this.page.waitForSelector("div.store-img");
    }

    async checkProductAddedToCartSnackbar() {
        await expect(this.productAddedToCartSnackbar).toBeVisible();
        await expect(this.productAddedToCartSnackbar).toBeHidden();
    }

    async addSingleProductToCartAndReturnPrice(
        productName: string,
    ): Promise<IPricesList> {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) =>
                res.url().includes("api/store/add-to-cart"),
            ),
            this.page
                .locator(".store-products-box", {
                    has: this.page
                        .locator(".all-product-title a")
                        .getByText(`${productName}`),
                })
                .locator(".devart-tooltip")
                .click(),
        ]);
        //Get price of product from API response
        const responseData = await response.json();
        const index = responseData.shoppingCartItems.length - 1;
        const unitPrice = Number(
            responseData.shoppingCartItems[index].basePrice,
        );
        const unitPriceCurrency = responseData.shoppingCartItems[
            index
        ].basePriceString.substring(0, 1);
        const totalPrice = Number(
            responseData.shoppingCartItems[index].subtotal,
        );
        const totalPriceCurrency = responseData.shoppingCartItems[
            index
        ].subtotalString.substring(0, 1);
        return {
            unitPrice: new Price(unitPrice, unitPriceCurrency),
            totalPrice: new Price(totalPrice, totalPriceCurrency),
        };
    }

    async addSingleProductToCart(productName: string) {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) =>
                res.url().includes("api/store/add-to-cart"),
            ),
            await this.page
                .locator(".store-products-box", {
                    has: this.page
                        .locator(".all-product-title a")
                        .getByText(`${productName}`),
                })
                .locator(".devart-tooltip")
                .click(),
        ]);
    }

    async openProductDetails(productName: string) {
        await this.page
            .locator('a[href="universal-bundle/"]')
            .getByText(productName)
            .click();
    }
}
