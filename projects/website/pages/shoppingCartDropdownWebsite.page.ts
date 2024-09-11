import { Locator, Page, test } from "@playwright/test";
import { ProductCart } from "../../../test_data/models/productCart";
import { PurchaseType, Edition } from "../../../test_data/parameters.enum";
import {
    IProductCartModel as ICartProductsModel,
    IPrice,
} from "../../../test_data/models/ICartProducts.model";
import { Price } from "../../../test_data/models/price";
import { BasePage } from "./base.page";

export class ShoppingCartDropdownWebsitePage extends BasePage {
    readonly page: Page;
    private readonly viewCartButton: Locator;
    private readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.viewCartButton = this.page.getByText("View cart");
        this.checkoutButton = this.page
            .locator(".dropdown-shopping-cart-btn")
            .getByText("Checkout");
    }

    async clickViewCartButton() {
        await test.step('I can click on the "View Cart" button', async () => {
            await this.viewCartButton.click();
        })
    }

    async clickCheckoutButton() {
        await test.step('I can click on the "Checkout" button', async () => {
            await this.checkoutButton.click();
        })
    }

    async getProductsList() {
        const products: ICartProductsModel[] = [];
        const productsList = await this.page
            .locator(".dropdown-cart .table-shopping-cart")
            .locator("tr")
            .all();
        for (const productLocator of productsList) {
            products.push(await this.getProductDetail(productLocator));
        }
        return products;
    }

    async getProductDetail(rowLocator: Locator) {
        const name = await this.getName(rowLocator);
        const edition = await this.getEdition(rowLocator);
        const purchaseType = await this.getPurchaseType(rowLocator);
        const duration = await this.getDuration(rowLocator);
        const unitPrice = await this.getUnitPrice(rowLocator);
        const totalPrice = await this.getTotalPrice(rowLocator);
        const quantity = await this.getQuantity(rowLocator);
        const prioritySupport = await this.getPrioritySupport(rowLocator);

        return await new ProductCart(
            name,
            edition,
            purchaseType,
            duration,
            unitPrice,
            totalPrice,
            quantity,
            prioritySupport,
        );
    }

    private async getName(productRow: Locator) {
        const value = await productRow.locator(".link a").textContent();
        return value;
    }

    private async getEdition(productRow: Locator) {
        const value = (await productRow.locator(".edition").innerText())
            ?.split(" ")
            .pop();
        switch (value) {
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

    private async getPurchaseType(productRow: Locator) {
        if (await productRow.locator(".sales-model").isVisible()) {
            let value = await productRow
                .locator(".sales-model")
                .innerText()
                .catch(() => null);
            value = value?.split(" ").pop();
            switch (value) {
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
        } else {
            return null;
        }
    }

    private async getDuration(productRow: Locator) {
        const value = (await productRow.locator(".subscription").innerText())
            ?.split(" ")
            .slice(-2)
            .join(" ");
        return value;
    }

    private async getUnitPrice(productRow: Locator): Promise<IPrice> {
        const value = await productRow.locator(".unit-price");
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

    private async getTotalPrice(productRow: Locator): Promise<IPrice> {
        const value = await productRow.locator(
            ".dropdown-shopping-cart__price",
        );
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

    private async getQuantity(productRow: Locator) {
        const value = Number(
            (await productRow.locator(".qty").innerText())
                ?.trim()
                .split(" ")
                .pop(),
        );
        return value;
    }

    private async getPrioritySupport(productRow: Locator) {
        const value = (
            await productRow.locator(".priority-support").innerText()
        )
            ?.split(" ")
            .pop();
        if (value === "Included") {
            return true;
        }
        return false;
    }
}
