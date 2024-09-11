import { Locator, Page, expect, test } from "@playwright/test";
import { BasePage } from "./base.page";
import { Price } from "../../../test_data/models/price";
import { IPricesList } from "../../../test_data/models/ICartProducts.model";
import filterCategoryList from "../../../test_data/data_files/filter-category.json";
import storageGroupJson from "../../../test_data/data_files/storage-group.json";

export class ProductsWebsitePage extends BasePage {
    readonly page: Page;
    private readonly productAddedToCartSnackbar: Locator;
    private readonly productBoxes: Locator;
    private readonly clearAllButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.productAddedToCartSnackbar = page.locator(".show-snackbar");
        this.productBoxes = page.locator(".store-products-box");
        this.clearAllButton = page.getByText("Clear all");
    }

    async waitingPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    // Get expected list of all products from JSON file.
    async getAllProductsFromStorageGroupJson() {
        return Object.values(storageGroupJson)
            .flat()
            .map((item) => item.products)
            .flat();
    }

    private async getIdOfFilterCategory(categoryName: string) {
        return filterCategoryList.filter(
            (item) => item.name === categoryName,
        )[0].id;
    }

    private async getProductsIdByCategory(
        groupedProductsObject,
        idOfFilterCategory,
    ) {
        return groupedProductsObject
            .flat()
            .filter((item) => item.filterId === idOfFilterCategory)
            .map((item) => item.productId);
    }

    // Return list of expected filtered products.
    // 'groupedProductsObject' argument receives object from endpoint "/api/store/products" received from products page
    async getExpectedFilteredProducts(groupedProductsObject, categoryName) {
        const allProducts = await this.getAllProductsFromStorageGroupJson();
        const categoryID = await this.getIdOfFilterCategory(categoryName);
        const productsIdListByCategoryId = await this.getProductsIdByCategory(
            groupedProductsObject,
            categoryID,
        );
        return allProducts
            .filter((item) => productsIdListByCategoryId.includes(item.id))
            .map((item) => item.name);
    }

    async clickClearAllButton() {
        await this.clearAllButton.click();
    }

    async getListOfFiltersCategory(filterCategory: string) {
        return await this.page
            .locator(".store-sidebar-accordion", {
                has: this.page.getByText(filterCategory),
            })
            .locator("li")
            .allInnerTexts();
    }

    async filterProductsByCategory(categoryName: string) {
        await this.page.waitForSelector("div.store-img");
        await test.step(`I can filter products by ${categoryName}`, async () => {
            await this.page
            .locator(".input-checkbox span.checkbox-label")
            .getByText(categoryName)
            .click();
        await this.page.waitForSelector("div.store-img");
        })
    }

    async doNotFilterProductsByCategory(categoryName: string) {
        await this.filterProductsByCategory(categoryName);
    }

    async clickViewPricingOptionsForProduct(productName: string) {
        await test.step(`I can open click on the "View Pricing Option" button on ${productName} product card`, async () => {
            await this.page
            .locator(".store-products-box", {
                has: this.page
                    .locator(".all-product-title a")
                    .getByText(productName, { exact: true }),
            })
            .locator(".view-pricing-options a")
            .click({ timeout: 10000 });
        })
    }

    async clickDownloadButtonForProduct(productName: string) {
        await test.step(`I can open Download page for ${productName} by clicking on Download button`, async () => {
            await this.page
            .locator(".store-products-box", {
                has: this.page
                    .locator(".all-product-title a")
                    .getByText(`${productName}`),
            })
            .getByText("Download")
            .click();
        });
    }

    async waitForPageIsLoaded() {
        await this.page.waitForSelector("div.store-img");
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
        await test.step(`I can click on "Add to cart" icon for ${productName} product`, async () => {
            await this.page
            .locator(".store-products-box", {
                has: this.page
                    .locator(".all-product-title a")
                    .getByText(`${productName}`),
            })
            .locator(".devart-tooltip")
            .click();
        })
        await this.page.waitForTimeout(3000);
    }

    async openProductDetails(productName: string) {
        await this.page
            .locator('a[href="universal-bundle/"]')
            .getByText(productName)
            .click();
    }

    async getListOfProducts() {
        const productsBoxList = await this.productBoxes.all();
        return productsBoxList;
    }

    async getListOfProductsName() {
        const productsNameLocator = await this.page
            .locator(".all-product-title > a")
            .allInnerTexts();
        return productsNameLocator;
    }

    async getProductCartDetails(productName: string) {
        const productCartLocator = await this.page.locator(
            ".store-products-box",
            {
                has: this.page
                    .locator(".all-product-title a")
                    .getByText(`${productName}`, { exact: true }),
            },
        );

        let viewPricingOptionLink = null;
        let downloadLink = null;
        let cartButtonIsAvailable = false;
        let productLabel = null;

        // let description = (await productCartLocator.locator('.store-description').innerText()).replace('s*', '');

        if (
            await productCartLocator
                .locator(".view-pricing-options > a")
                .isVisible()
        ) {
            viewPricingOptionLink = await productCartLocator
                .locator(".view-pricing-options > a")
                .getAttribute("href");
        }

        if (await productCartLocator.getByText("Download").isVisible()) {
            downloadLink = (
                await productCartLocator
                    .getByText("Download")
                    .getAttribute("href")
            )?.trim();
        }

        if (await productCartLocator.locator(".cart-pluse-check").isVisible()) {
            cartButtonIsAvailable = true;
        }

        if (
            await productCartLocator.locator(".product-label__text").isVisible()
        ) {
            productLabel = (
                await productCartLocator
                    .locator(".product-label__text")
                    .innerText()
            ).trim();
        }

        return {
            viewPricingOptionLink,
            downloadLink,
            cartButtonIsAvailable,
            productLabel,
        };
    }

    async checkProductAddedToCartSnackbar() {
        await expect(this.productAddedToCartSnackbar, 'Snackbar "Product added to cart" is shown').toBeVisible();
        await expect(this.productAddedToCartSnackbar, 'Snackbar "Product added to cart" is hidden').toBeHidden();
    }
}
