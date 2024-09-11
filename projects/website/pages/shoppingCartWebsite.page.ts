import { Page, Locator, test } from "@playwright/test";
import { BasePage } from "./base.page";
import {
    IProductCartModel as ICartProductsModel,
    IPrice,
} from "../../../test_data/models/ICartProducts.model";
import { Price } from "../../../test_data/models/price";
import {
    PurchaseType,
    Edition,
    DurationEnum,
} from "../../../test_data/parameters.enum";
import { ProductCart } from "../../../test_data/models/productCart";

export class ShoppingCartWebsitePage extends BasePage {
    readonly page: Page;
    private readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.checkoutButton = this.page
            .locator(".cart-total-price")
            .getByText("Checkout");
    }

    async clickCheckoutButton() {
        await this.page.waitForTimeout(1000);
        await test.step('I can click on the checkout button', async () => {
            await this.checkoutButton.click();
        })
    }

    async openPricingOptionsDropdown(rowProduct: Locator) {
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
        await this.page.waitForSelector(".shopping-cart-item");
        const products: ICartProductsModel[] = [];
        const productsList = await this.page
            .locator(".shopping-cart-item")
            .all();
        for (const productLocator of productsList) {
            await this.openPricingOptionsDropdown(productLocator);
            products.push(await this.getProductDetail(productLocator));
        }
        return products;
    }

    async getProductDetail(rowProduct: Locator) {
        const name = await this.getName(rowProduct);
        const edition = await this.getEdition(rowProduct);
        const purchaseType = await this.getPurchaseType(rowProduct);
        const duration = await this.getDuration(rowProduct);
        const unitPrice = await this.getUnitPrice(rowProduct);
        const totalPrice = await this.getTotalPrice(rowProduct);
        const quantity = await this.getQuantity(rowProduct);
        const prioritySupport = await this.getPrioritySupport(rowProduct);

        return new ProductCart(
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

    private async getName(rowProduct: Locator) {
        const value = await rowProduct
            .locator(".shopping-cart-product__title")
            .innerText();
        return value;
    }

    private async getEdition(rowProduct: Locator) {
        const value = await (
            await rowProduct
                .locator(".pricing-options__item", {
                    has: this.page.getByText("Edition"),
                })
                .locator("span")
                .innerHTML()
        )
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

    private async getPurchaseType(rowProduct: Locator) {
        if (await rowProduct.getByText("Purchase Type").isVisible()) {
            const value = await (
                await rowProduct
                    .locator(".pricing-options__item", {
                        has: this.page.getByText("Purchase Type"),
                    })
                    .locator("span")
                    .innerHTML()
            )
                ?.split(" ")
                .pop();
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

    private async getDuration(rowProduct: Locator) {
        let value;
        if (await rowProduct.getByText("Subscription Duration").isVisible()) {
            value = await await rowProduct
                .locator(".pricing-options__item", {
                    has: this.page.getByText("Subscription Duration"),
                })
                .locator("span")
                .innerHTML();
        }
        if (
            await rowProduct.getByText("Support & upgrade period").isVisible()
        ) {
            value = await await rowProduct
                .locator(".pricing-options__item", {
                    has: this.page.getByText("Support & upgrade period"),
                })
                .locator("span")
                .innerHTML();
        }

        return value;
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
        const quontityValue = Number(
            (await rowProduct.locator("[name='quantityCounter']").inputValue())
                ?.trim()
                .split(" ")
                .pop(),
        );
        return quontityValue;
    }

    private async getPrioritySupport(rowProduct: Locator) {
        const prioritySupportValue = await rowProduct
            .locator("#prioritySupportIncluded")
            .isChecked();
        return prioritySupportValue;
    }

    // Method for changing Shopping cat product value

    async findProductAndOpenPricingOption(product: string): Promise<Locator> {
        await this.page.waitForSelector(".shopping-cart-item");
        const productLocator = await this.page.locator(".shopping-cart-item", {
            hasText: product,
        });
        await this.openPricingOptionsDropdown(productLocator);
        return productLocator;
    }

    async changeEdition(productLocator: Locator, edition: Edition) {
        await test.step(`I can change product edition to ${edition}`, async () => {
            const editionDpField = await productLocator
            .locator(".pricing-options__item", { hasText: "Edition" })
            .locator("select");
            await editionDpField.selectOption(edition);
        })
    }

    async changePurchaseType(
        productLocator: Locator,
        purchaseType: PurchaseType,
    ) {
        const purchaseTypeDpField = await productLocator
            .locator(".pricing-options__item", { hasText: "Purchase Type" })
            .locator("select");
        await purchaseTypeDpField.selectOption(purchaseType);
    }

    async changeDuration(productLocator: Locator, duration: DurationEnum) {
        await test.step(`I can change product duration to "${duration}"`, async () => {
            const durationDpField = await productLocator
            .locator(".pricing-options__item", {
                hasText: "Subscription Duration",
            })
            .locator("select");
        await durationDpField.selectOption(duration);
        })
    }

    async changePrioritySupport(
        productLocator: Locator,
        prioritySuport: boolean,
    ) {
        const prioritySuportCheckbox = await productLocator.locator(
            "#prioritySupportIncluded",
        );
        if (prioritySuport === true) {
            await prioritySuportCheckbox.check();
        }
        if (prioritySuport === false) {
            await prioritySuportCheckbox.uncheck();
        }
    }

    async changeQuontity(productLocator: Locator, quantity: number) {
        await test.step(`I can change quontity of product to "${quantity}"`, async () => {
            const quontityInputField = await productLocator.locator(
                "[name='quantityCounter']",
            );
            await quontityInputField.fill(String(quantity));
        })
    }
}
