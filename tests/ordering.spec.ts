import { test } from "../fixtures/fixture";
import { expect } from "@playwright/test";
import storageGroupJson from "../test_data/data_files/storage-group.json";

// Get expected list of products from JSON file.
const allProducts = Object.values(storageGroupJson)
    .flat()
    .map((item) => item.products)
    .flat();

// test.describe("Quontity of products", async () => {
//     test("Checking quontity of products on the Products page @regression", async ({
//         productsWebsitePage,
//     }) => {
//         const productNames = allProducts.map((product) => product.name);
//         await productsWebsitePage.navigateTo("/products.html");
//         const productsOnThePage =
//             await productsWebsitePage.getListOfProductsName();
//         await expect.soft(productsOnThePage).toHaveLength(allProducts.length);
//         await expect.soft(productsOnThePage).toEqual(productNames);
//     });
// });

// test.describe("Products details", async () => {
//     test(`Checking of product cart details  Product page @regression`, async ({
//         productsWebsitePage,
//     }) => {
//         test.setTimeout(5 * 60 * 1000);
//         await productsWebsitePage.navigateTo("/products.html");
//         await productsWebsitePage.waitForPageIsLoaded();

//         for (const expectedProduct of allProducts) {
//             const details = await productsWebsitePage.getProductCartDetails(
//                 expectedProduct.name,
//             );
//             const {
//                 viewPricingOptionLink,
//                 downloadLink,
//                 cartButtonIsAvailable,
//                 productLabel,
//             } = details;
//             console.log(
//                 `Checking product cart details for "${expectedProduct.name}" product`,
//             );
//             const freeExpectedProduct =
//                 expectedProduct.productLabel == "Free" ? false : true;
//             // Check View Pricing Option link
//             if (viewPricingOptionLink != null) {
//                 await expect
//                     .soft(
//                         viewPricingOptionLink,
//                         `Checking "View Pricing Option" link is displayed for ${expectedProduct.name}`,
//                     )
//                     .toEqual(`${expectedProduct.url}ordering.html`);
//             }
//             if (freeExpectedProduct == null) {
//                 await expect
//                     .soft(
//                         viewPricingOptionLink,
//                         `Checking "View Pricing Option" link is hidden for ${expectedProduct.name}`,
//                     )
//                     .toBeNull();
//             }
//             // Check Download link
//             await expect
//                 .soft(
//                     downloadLink,
//                     `Checking "Download" link for ${expectedProduct.name}`,
//                 )
//                 .toEqual(`${expectedProduct.url}download.html`);
//             // Check "Add to cart" button is displayed

//             await expect
//                 .soft(cartButtonIsAvailable, 'Checking "Add to cart" link')
//                 .toEqual(freeExpectedProduct);

//             // Check product label text
//             if (productLabel != null) {
//                 await expect
//                     .soft(
//                         productLabel?.toLowerCase(),
//                         `Checking ${productLabel} product label is displayed`,
//                     )
//                     .toContain(expectedProduct.productLabel?.toLowerCase());
//             } else {
//                 await expect
//                     .soft(productLabel, "Checking product label is absent")
//                     .toEqual(expectedProduct.productLabel);
//             }
//         }
//     });
// });

test.describe("Pricing option form", async () => {
    for (const product of allProducts) {
        test(`Checking ordering form is displayed for ${product.name} @regression`, async ({
                productsWebsitePage
        }) => {
      await productsWebsitePage.navigateTo(`${product.url}ordering.html`);
    });
}});
