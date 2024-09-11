import { Locator, Page, expect, test } from "@playwright/test";
import {
    DurationEnum,
    Edition,
    PurchaseType,
} from "../../../test_data/parameters.enum";
import { Price } from "../../../test_data/models/price";
import {
    IPricesList,
    IProductCartModel,
} from "../../../test_data/models/ICartProducts.model";
import { BasePage } from "./base.page";
import fs from "fs";

export class PricingOptionsPage extends BasePage {
    readonly page: Page;
    private readonly plusQuontityIcon: Locator;
    private readonly productAddedToCartSnackbar: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.plusQuontityIcon = page.locator("button[data-type='plus']");
        this.productAddedToCartSnackbar = page.locator(".show-snackbar");
    }

    async waitForPageIsLoaded() {
        await this.page.waitForSelector(".pricing-box");
    }

    async clickBuyNowButton(edition: Edition | string) {
        await test.step('I can click on the "Buy Now" button', async () => {
            await this.page
            .locator(".pricing-box-inner", {
                has: this.page.getByText(edition),
            })
            .getByText("Buy Now")
            .click();
        })
    }

    async setProductParametersSSIS(
        duration: DurationEnum,
        prioritySuport: boolean,
        quontity: number,
    ) {
        await this.setDuration(duration);
        // need to add checkbox action
        await this.setQuontity(quontity);
    }

    async addDbForgeProductToCart(
        product: IProductCartModel,
    ): Promise<IPricesList> {
        await this.setPurchaseType(product.purchaseType);
        await this.setDuration(product.duration);
        // need to add checkbox action
        await this.setQuontity(product.quantity);
        return await this.clickAddToCartButtonAndSetPriceToObject(
            product.edition,
        );
    }

    async addSSISProductToCart(
        product: IProductCartModel,
    ): Promise<IPricesList> {
        await this.setDuration(product.duration);
        // need to add checkbox action
        await this.setQuontity(product.quantity);
        return await this.clickAddToCartButtonAndSetPriceToObject(product.name);
    }

    private async setQuontity(quontity: number) {
        await test.step(`I can set quontity to bought license`, async () => {
            for (let i = 1; i < quontity; i++) {
                await this.plusQuontityIcon.click();
            }
        })
    }

    private async setPurchaseType(purchaseType: PurchaseType) {
        await test.step(`I can set ${purchaseType} purchase type`, async () => {
            await this.page
            .locator(".saas-button__text")
            .getByText(purchaseType)
            .click();
        })
    }

    private async setDuration(duration: DurationEnum) {
        await test.step(`I can set duration ${duration}`, async () => {
            let duration_x: number = 10;
            if (duration == DurationEnum["1 year"]) {
                duration_x = 10;
            } else if (duration == DurationEnum["2 years"]) {
                duration_x = 160;
            } else if (duration == DurationEnum["3 years"]) {
                duration_x = 320;
            }
            await this.page
                .locator(".slider-horizontal")
                .click({ position: { x: duration_x, y: 0 } });
        })
    }

    async checkProductAddedToCartSnackbar() {
        await expect(this.productAddedToCartSnackbar, 'Snackbar "Product Added to cart" is displayed').toBeVisible();
        await expect(this.productAddedToCartSnackbar, 'Snackbar "Product Added to cart" is hidden').toBeHidden();
    }

    private async clickAddToCartButtonAndSetPriceToObject(
        edition: Edition | string,
    ): Promise<IPricesList> {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) => res.url().includes("/api/cart")),
            this.page
                .locator(".pricing-box-inner", {
                    has: this.page
                        .locator(".pricing-head")
                        .getByText(`${edition}`),
                })
                .locator(".btn-add_cart")
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

    async checkFormIsLoaded() {
        await expect(
            await this.page.locator(".btn-add_cart").first(),
        ).toBeVisible({ timeout: 30000 });
    }
}
