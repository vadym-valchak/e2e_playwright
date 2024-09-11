import { Page, Locator } from "@playwright/test";
import {
    IProductCartModel as ICartProductsModel,
    IPrice,
} from "../../test_data/models/ICartProducts.model";
import { Price } from "../../test_data/models/price";
import { PurchaseType, Edition } from "../../test_data/parameters.enum";
import { ProductCart } from "../../test_data/models/productCart";

export class AvangatePage {
    readonly page: Page;
    private readonly avangateTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.avangateTitle = this.page
            .locator(".page-title")
            .getByText("Secure checkout");
    }

    async waitForPageIsLoaded() {
        await this.page.waitForLoadState("networkidle");
    }

    async openPricingOptioinsDropdown(rowProduct: Locator) {
        const pricingOptionsTitle = await rowProduct.locator(
            ".pricing-options__title",
        );
        const pricingOptionsContainer =
            await rowProduct.locator(".pricing-options");
        const attrStyle = await pricingOptionsContainer.getAttribute("style");
        if (attrStyle == "display: none;") {
            await pricingOptionsTitle.click();
        }
    }

    async getProductsList() {
        await this.closeAdvertismentModal();
        await this.page.waitForTimeout(8000);
        const products: ICartProductsModel[] = [];
        const productsList = await this.page
            .locator(".order__listing__row")
            .all();
        for (const productLocator of productsList) {
            products.push(await this.getProductDetail(productLocator));
        }
        return products;
    }

    async getProductDetail(rowProduct: Locator) {
        const name = await this.getName(rowProduct);
        const edition = await this.getEdition(rowProduct);
        const purchaseType = await this.getPurchaseType(rowProduct);
        const duration = await this.getDuration(rowProduct);
        const quantity = await this.getQuantity(rowProduct);
        const prioritySupport = await this.getPrioritySupport(rowProduct);

        return new ProductCart(
            name,
            edition,
            purchaseType,
            duration,
            null,
            null,
            quantity,
            prioritySupport,
        );
    }

    private async getName(rowProduct: Locator) {
        const value = await rowProduct
            .locator(".order__listing__item__name")
            .innerText();
        return value;
    }

    private async getEdition(rowProduct: Locator) {
        if (
            await rowProduct
                .locator(".pricing-options-group", { hasText: "Editions" })
                .isVisible()
        ) {
            const editionValue = await (
                await rowProduct
                    .locator(".pricing-options-group", { hasText: "Editions" })
                    .locator("[selected='selected']")
                    .innerText()
            ).trim();

            switch (editionValue) {
                case Edition.Standard: {
                    return Edition.Standard;
                }
                case Edition.Professional: {
                    return Edition.Professional;
                }
                case Edition.Enterprise: {
                    return Edition.Enterprise;
                }
                case Edition.Developer: {
                    return Edition.Developer;
                }
            }
        }
    }

    private async getPurchaseType(rowProduct: Locator) {
        if (
            await rowProduct
                .locator(".pricing-options-group", { hasText: "Sales Model" })
                .isVisible()
        ) {
            const purchaseElementAttribut = await rowProduct
                .locator(".pricing-options-group", { hasText: "Sales Model" })
                .locator("[checked='checked']")
                .getAttribute("id");
            const purchaseValue = await rowProduct
                .locator(".pricing-options-group", { hasText: "Sales Model" })
                .locator(`[for='${purchaseElementAttribut}']`)
                .innerText();

            switch (purchaseValue) {
                case PurchaseType.Single: {
                    return PurchaseType.Single;
                }
                case PurchaseType.Perpetual: {
                    return PurchaseType.Perpetual;
                }
                case PurchaseType.Subscription: {
                    return PurchaseType.Subscription;
                }
                case PurchaseType.Team: {
                    return PurchaseType.Team;
                }
            }
        }
    }

    private async getDuration(rowProduct: Locator) {
        let durationText;

        if (
            await rowProduct
                .locator(".pricing-options-group", {
                    hasText: "Subscription duration",
                })
                .locator("select")
                .isVisible()
        ) {
            durationText = await rowProduct
                .locator(".pricing-options-group", {
                    hasText: "Subscription duration",
                })
                .locator("[selected='selected']");
        }
        if (
            await rowProduct
                .locator(".pricing-options-group", {
                    hasText: "Subscription duration",
                })
                .locator(".custom-options-radios-wrapper")
                .isVisible()
        ) {
            const durationElementAttribut = await rowProduct
                .locator(".pricing-options-group", {
                    hasText: "Subscription duration",
                })
                .locator("[checked='checked']")
                .getAttribute("id");
            durationText = await rowProduct
                .locator(".pricing-options-group", {
                    hasText: "Subscription duration",
                })
                .locator(`[for='${durationElementAttribut}']`);
        }
        if (await rowProduct.locator(".pricing-option-text").isVisible()) {
            durationText = await rowProduct.locator(".pricing-option-text");
        }

        const durationValue = await (await durationText.innerText())
            .trim()
            .split(" ")
            .slice(0, 2)
            .join(" ");
        return durationValue;
    }

    private async getUnitPrice(rowProduct: Locator): Promise<IPrice> {
        const value = await rowProduct
            .locator(".price-wrap", { hasText: "Unit price" })
            .locator(".price");
        const price = Number(
            (await value.innerText())
                ?.split(" ")
                .pop()
                ?.slice(1)
                .replace(",", ""),
        );
        const currency = (await value.innerText())
            ?.split(" ")
            .pop()
            ?.slice(0, 1);
        return new Price(price, currency);
    }

    private async getTotalPrice(rowProduct: Locator): Promise<IPrice> {
        const value = await rowProduct.locator(".shopping-cart-price div");
        const price = Number(
            (await value.innerText())
                ?.split(" ")
                .pop()
                ?.slice(1)
                .replace(",", ""),
        );
        const currency = (await value.innerText())
            ?.split(" ")
            .pop()
            ?.slice(0, 1);
        return new Price(price, currency);
    }

    private async getQuantity(rowProduct: Locator) {
        return Number(
            await rowProduct
                .locator(".quantity-field__input")
                .locator("input")
                .inputValue(),
        );
    }

    private async getPrioritySupport(rowProduct: Locator) {
        let prioritySupportValue;
        if (
            await rowProduct
                .locator(".pricing-options-group", {
                    hasText: "Priority Support",
                })
                .isVisible()
        ) {
            const prioritySupportElementAttribut = await rowProduct
                .locator(".pricing-options-group", {
                    hasText: "Priority Support",
                })
                .locator("[checked='checked']")
                .getAttribute("id");
            prioritySupportValue = await (
                await rowProduct
                    .locator(".pricing-options-group", {
                        hasText: "Priority Support",
                    })
                    .locator(`[for='${prioritySupportElementAttribut}']`)
                    .innerText()
            ).trim();
        }
        if (await rowProduct.locator(".pricing-option-text").isVisible()) {
            prioritySupportValue = await rowProduct
                .getByText("Priority support")
                .allTextContents();
        }

        if (prioritySupportValue.includes("Priority support included")) {
            return true;
        }
        if (
            prioritySupportValue.includes("Priority support doesn't included")
        ) {
            return false;
        }
    }

    async closeAdvertismentModal() {
        const advertismentModal = await this.page.getByRole("dialog").first();
        if (await advertismentModal.isVisible()) {
            await advertismentModal.locator("[title='Close']").click();
        }
    }
}
