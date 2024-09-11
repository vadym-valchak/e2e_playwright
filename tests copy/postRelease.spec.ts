import { test } from "../fixtures/fixture";
import { mailinatorInboxClient } from "../helpers/mail.helper";
import { expect } from "@playwright/test";
import {
    DurationEnum,
    Edition,
    PurchaseType,
} from "../test_data/parameters.enum";
import { users } from "../test_data/users";
import {
    IPricesList,
    IProductCartModel,
} from "../test_data/models/ICartProducts.model";
import { ProductCart } from "../test_data/models/productCart";

const licenseOwner = users.licenseOwner;
const licenseAdmin = users.licenseAdmin;

test("AUT-001: Check assigning and revoking license @postrelease @regression", async ({
    page,
    signInPage,
    homeWebsitePage,
    purchasedProductsCustomerPortalPage,
    licenseDetailsCustomerPortalPage,
}) => {
    const productName = "dbForge SQL Tools";

    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.checkPageElements();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await purchasedProductsCustomerPortalPage.openLicenseDetails(productName);
    // Check owner and assigned user emails
    await licenseDetailsCustomerPortalPage.checkLicenseOwnerIsDisplayed(
        licenseOwner.email,
    );
    // Assign license
    await licenseDetailsCustomerPortalPage.assignLicenseTo(licenseAdmin.email);
    //Check snackbar is shown.
    await licenseDetailsCustomerPortalPage.checkInvitationSnackbar();
    await licenseDetailsCustomerPortalPage.logout();
    // Read email and navigate on link in email
    await test.step(`I can receive email on the "${licenseAdmin.email}" inbox`, async () => {
        const emailHTML = await mailinatorInboxClient.getLatestMessageBodyFor(
            licenseAdmin.email,
        );
        const verificationCodeFromEmail =
            await mailinatorInboxClient.getJoinYourTeamLink(emailHTML);
        await mailinatorInboxClient.deleteAllMessagesForEmail(licenseAdmin.email);
        await test.step('I can click on the "Join Your Team" button in email', async () => {
            await page.goto(verificationCodeFromEmail);
        })
    })
    await signInPage.login(licenseAdmin.email, licenseAdmin.password);
    await purchasedProductsCustomerPortalPage.openLicenseDetails(productName);
    // Check owner and assigned user emails
    await licenseDetailsCustomerPortalPage.checkLicenseOwnerIsDisplayed(
        licenseOwner.email,
    );
    await licenseDetailsCustomerPortalPage.checkLicenseAdminIsAssigned(
        licenseAdmin.email,
    );

    await licenseDetailsCustomerPortalPage.logout();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await purchasedProductsCustomerPortalPage.openLicenseDetails(productName);
    await licenseDetailsCustomerPortalPage.revokeLicense();
    await licenseDetailsCustomerPortalPage.checkRevokeButtonIsHidden();
    //Check snackbar is shown.
    await licenseDetailsCustomerPortalPage.checkLicenseRevokedSnackbar();
    // Check owner and assigned user emails
    await licenseDetailsCustomerPortalPage.checkLicenseOwnerIsDisplayed(
        licenseOwner.email,
    );
    await licenseDetailsCustomerPortalPage.checkLicenseAdminIsNotAssigned();
    await licenseDetailsCustomerPortalPage.logout();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(licenseAdmin.email, licenseAdmin.password);
    await purchasedProductsCustomerPortalPage.checkThatEmptyPageIsShown();
});

test("AUT-02: Check downloading product in Customer Portal @postrelease @regression", async ({
    signInPage,
    homeWebsitePage,
    purchasedProductsCustomerPortalPage,
    licenseDetailsCustomerPortalPage,
    downloadProductsCustomerPortalPage,
}) => {
    const productName = "dotConnect for Oracle";

    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await purchasedProductsCustomerPortalPage.openLicenseDetails(productName);
    await licenseDetailsCustomerPortalPage.openDownalodProductPage();
    await downloadProductsCustomerPortalPage.downloadAndCheckLatestProduct();
});

test("AUT-03: Check downloading trial product in website by unauthorized user @postrelease @regression", async ({
    signInPage,
    signUpPage,
    homeWebsitePage,
    productDetailsWebsitePage: productWebsitePage,
    downloadProductWebsitePage,
}) => {
    await homeWebsitePage.open();
    // Navigate to Product through Main Menu
    await (
        await (
            await homeWebsitePage.openProductsMenu()
        ).openDatabaseToolsMenuItem()
    ).menuItem("SQL Complete");
    await productWebsitePage.clickDownloadButton();
    // Download trial version product
    await downloadProductWebsitePage.downloadProductBuild(0);
    await signUpPage.openSignInPage();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await downloadProductWebsitePage.downloadAndCheckFileIsDownloaded(0);
});

test("AUT-04: Check downloading product Data Connectivity in Store @postrelease @regression", async ({
    signInPage,
    purchasedProductsCustomerPortalPage,
    homeWebsitePage,
    productsWebsitePage,
    downloadProductWebsitePage,
}) => {
    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await purchasedProductsCustomerPortalPage.openStore();
    // Filter products
    await productsWebsitePage.filterProductsByCategory("Data connectivity");
    // Click download for product 'dotConnect for Oracle'
    await productsWebsitePage.clickDownloadButtonForProduct(
        "dotConnect for Oracle",
    );
    await downloadProductWebsitePage.downloadAndCheckFileIsDownloaded(2);
});

test("AUT-05: Check added products in the cart @postrelease @regression", async ({
    signInPage,
    purchasedProductsCustomerPortalPage,
    homeWebsitePage,
    productsWebsitePage,
    productDetailsWebsitePage,
    pricingOptionsPage,
    shoppingCartDropdownWebsitePage,
    shoppingCartWebsitePage,
    sISSSubGroupWebsitePage,
}) => {
    let price: IPricesList;
    const dbForgeStudioForSqlServer = new ProductCart(
        "dbForge Studio for SQL Server",
        Edition.Standard,
        PurchaseType.Perpetual,
        DurationEnum["1 year"],
        null,
        null,
        5,
        true,
    );
    const dotConnectForOracle = new ProductCart(
        "dotConnect for Oracle",
        Edition.Standard,
        null,
        DurationEnum["1 year"],
        null,
        null,
        1,
        true,
    );
    const dbForgeSQLTools = new ProductCart(
        "dbForge SQL Tools",
        Edition.Standard,
        PurchaseType.Subscription,
        DurationEnum["1 year"],
        null,
        null,
        1,
        true,
    );
    const SSISIntegrationDatabaseBundle = new ProductCart(
        "SSIS Integration Universal Bundle",
        Edition.Standard,
        null,
        DurationEnum["3 years"],
        null,
        null,
        5,
        true,
    );
    const products: IProductCartModel[] = [
        dbForgeStudioForSqlServer,
        dotConnectForOracle,
        dbForgeSQLTools,
        SSISIntegrationDatabaseBundle,
    ];

    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await purchasedProductsCustomerPortalPage.openStore();
    // Cleare shopping list in the cart
    await productsWebsitePage.removeProductsFromCart();
    await productsWebsitePage.clickViewPricingOptionsForProduct(
        dbForgeStudioForSqlServer.name,
    );
    price = await pricingOptionsPage.addDbForgeProductToCart(
        dbForgeStudioForSqlServer,
    );
    await dbForgeStudioForSqlServer.setPrice(price);
    await pricingOptionsPage.checkProductAddedToCartSnackbar();
    // Filter products
    await pricingOptionsPage.goBack();
    await productsWebsitePage.waitForPageIsLoaded();
    await productsWebsitePage.filterProductsByCategory("Data connectivity");
    // Click 'add to cart' button for product 'dotConnect for Oracle'
    price = await productsWebsitePage.addSingleProductToCartAndReturnPrice(
        dotConnectForOracle.name,
    );
    await dotConnectForOracle.setPrice(price);
    await productsWebsitePage.checkProductAddedToCartSnackbar();
    // Uncheck filtering
    await productsWebsitePage.doNotFilterProductsByCategory(
        "Data connectivity",
    );
    // Click 'add to cart' button for product 'dbForgeSQLTools'
    price = await productsWebsitePage.addSingleProductToCartAndReturnPrice(
        dbForgeSQLTools.name,
    );
    await dbForgeSQLTools.setPrice(price);
    await productsWebsitePage.checkProductAddedToCartSnackbar();
    // Navigate to Product through Main Menu
    await (
        await (
            await homeWebsitePage.openProductsMenu()
        ).openDataConnectivityMenuItem()
    ).menuItem("SSIS Components");

    await sISSSubGroupWebsitePage.openProduct(
        SSISIntegrationDatabaseBundle.name,
    );
    await productDetailsWebsitePage.clickBuyNowButton();
    await pricingOptionsPage.waitForPageIsLoaded();
    price = await pricingOptionsPage.addSSISProductToCart(
        SSISIntegrationDatabaseBundle,
    );
    SSISIntegrationDatabaseBundle.setPrice(price);
    await pricingOptionsPage.checkProductAddedToCartSnackbar();

    await homeWebsitePage.openCartDropdown();
    const productsInShoppingCartDropdown =
        await shoppingCartDropdownWebsitePage.getProductsList();
    await expect(productsInShoppingCartDropdown, 'Shopping cart contains expected product properties').toMatchObject(products);

    await shoppingCartDropdownWebsitePage.clickViewCartButton();
    const productsInShopingCartPage =
        await shoppingCartWebsitePage.getProductsList();
    await expect(productsInShopingCartPage, 'Products on the shopping cart page contains expected properties').toMatchObject(products);
});

test("AUT-06: Checked creating account, change password, deleting account @postrelease @regression", async ({
    page,
    signInPage,
    signUpPage,
    homeWebsitePage,
    purchasedProductsCustomerPortalPage,
    profilePersonalInformationCustomerPortalPage,
    profileSecureInformationCustomerPortalPage,
    profileDeleteCustomerPortalPage,
}) => {
    const userEmail = users.deletedUser.email;
    const name = users.deletedUser.name;
    let password = users.deletedUser.password;
    let newPassword = users.deletedUser.newPassword;

    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.openSignUpForm();
    await signUpPage.signUp(name, userEmail, password);
    // Login if user is exist
    if (
        await page
            .locator("#register-account .validation-summary-errors")
            .isVisible()
    ) {
        await signUpPage.openSignInPage();
        await signInPage.login(userEmail, password);
        if (await page.locator(".tab-pane#login").isVisible()) {
            //Login with new password and change password value in variable
            const temp = password;
            password = newPassword;
            newPassword = temp;
            await signInPage.login(userEmail, password);
        }
    }

    await purchasedProductsCustomerPortalPage.openProfilePage();
    await profilePersonalInformationCustomerPortalPage.openSecureInformationPage();
    await profileSecureInformationCustomerPortalPage.changePassword(
        password,
        newPassword,
        newPassword,
    );
    await profileSecureInformationCustomerPortalPage.logout();
    // Login with new password
    await homeWebsitePage.openSignInPage();
    await signInPage.login(userEmail, newPassword);
    // Delete profile
    await purchasedProductsCustomerPortalPage.openProfilePage();
    await profilePersonalInformationCustomerPortalPage.openDeleteProfileTab();
    await profileDeleteCustomerPortalPage.deleteProfile();
    //Check snackbar is shown.
    await profileDeleteCustomerPortalPage.checkConfirmEmailIsShown();
    // Read email and navigate on link in email
    const emailHTML =
        await mailinatorInboxClient.getLatestMessageBodyFor(userEmail);
    const verificationCodeFromEmail =
        await mailinatorInboxClient.getDeleteAccountLink(emailHTML);
    await mailinatorInboxClient.deleteAllMessagesForEmail(userEmail);

    await page.goto(verificationCodeFromEmail);
    // Check information that account is deleted
    await expect(
        await page
            .locator(".account-deleted__title")
            .getByText("Account deleted successfully"), '"Account deleted successfully" notification is shown'
    ).toBeVisible();
    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(userEmail, password);
    await signInPage.checkInvalidLoginPasswordWarningIsDisplayed();
});

test.skip("AUT-07: Check Google authorization @postrelease @regression", async ({
    signInPage,
    purchasedProductsCustomerPortalPage,
    homeWebsitePage,
    googleAutorizationPage,
}) => {
    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.openGoogleAuthorizationForm();
    await googleAutorizationPage.authorize();
    await purchasedProductsCustomerPortalPage.checkPurchasedProductPageIsShown();
});

test("AUT-08: Check Buy Now for Database tools and SSIS @postrelease @regression", async ({
    signInPage,
    homeWebsitePage,
    pricingOptionsPage,
    avangatePage,
}) => {
    const dbForgeSQLTools = new ProductCart(
        "dbForge SQL Tools",
        Edition.Professional,
        PurchaseType.Subscription,
        DurationEnum["1 year"],
        null,
        null,
        1,
        true,
    );
    const ssisIntegrationUniversalBundle = new ProductCart(
        "SSIS Integration Universal Bundle",
        undefined,
        undefined,
        DurationEnum["1 year"],
        null,
        null,
        1,
        true,
    );

    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await homeWebsitePage.removeProductsFromCart();
    await homeWebsitePage.navigateTo("/dbforge/sql/sql-tools/ordering.html");
    await pricingOptionsPage.clickBuyNowButton(Edition.Professional);
    await expect(await avangatePage.getProductsList(), 'Product objects are matched').toMatchObject([
        dbForgeSQLTools,
    ]);
    await await homeWebsitePage.removeProductsFromCart();
    await homeWebsitePage.navigateTo("/ssis/database-bundle/ordering.html");
    await pricingOptionsPage.clickBuyNowButton(
        "SSIS Integration Universal Bundle",
    );
    await expect(await avangatePage.getProductsList(), 'Product objects are matched').toMatchObject([
        ssisIntegrationUniversalBundle,
    ]);
});

test("AUT-09: Navigate to checkout page @postrelease @regression", async ({
    signInPage,
    homeWebsitePage,
    avangatePage,
    purchasedProductsCustomerPortalPage,
    productsWebsitePage,
    shoppingCartDropdownWebsitePage,
    shoppingCartWebsitePage,
}) => {
    const dbForgeSQLTools = new ProductCart(
        "dbForge SQL Tools",
        Edition.Standard,
        PurchaseType.Subscription,
        DurationEnum["1 year"],
        null,
        null,
        1,
        true,
    );

    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await homeWebsitePage.removeProductsFromCart();
    await purchasedProductsCustomerPortalPage.openStore();
    await productsWebsitePage.addSingleProductToCart(dbForgeSQLTools.name);
    await homeWebsitePage.openCartDropdown();
    await shoppingCartDropdownWebsitePage.clickCheckoutButton();
    await expect(await avangatePage.getProductsList(), 'Product objects are matched').toMatchObject([
        dbForgeSQLTools,
    ]);

    await homeWebsitePage.open();
    await homeWebsitePage.openCartDropdown();
    await shoppingCartDropdownWebsitePage.clickViewCartButton();
    await shoppingCartWebsitePage.clickCheckoutButton();
    await expect(await avangatePage.getProductsList(), 'Product objects are matched').toMatchObject([
        dbForgeSQLTools,
    ]);
});

test("AUT-10: Change product options @postrelease @regression", async ({
    signInPage,
    homeWebsitePage,
    avangatePage,
    purchasedProductsCustomerPortalPage,
    productsWebsitePage,
    shoppingCartDropdownWebsitePage,
    shoppingCartWebsitePage,
}) => {
    const dbForgeSQLTools = new ProductCart(
        "dbForge SQL Tools",
        Edition.Professional,
        PurchaseType.Subscription,
        DurationEnum["2 years"],
        null,
        null,
        2,
        true,
    );

    await homeWebsitePage.open();
    await homeWebsitePage.openSignInPage();
    await signInPage.login(licenseOwner.email, licenseOwner.password);
    await homeWebsitePage.removeProductsFromCart();
    await purchasedProductsCustomerPortalPage.openStore();
    await productsWebsitePage.addSingleProductToCart(dbForgeSQLTools.name);
    await homeWebsitePage.openCartDropdown();
    await shoppingCartDropdownWebsitePage.clickViewCartButton();

    const shopingCartLocator =
        await shoppingCartWebsitePage.findProductAndOpenPricingOption(
            dbForgeSQLTools.name,
        );

    await shoppingCartWebsitePage.changeEdition(
        shopingCartLocator,
        Edition.Professional,
    );
    await shoppingCartWebsitePage.changeDuration(
        shopingCartLocator,
        DurationEnum["2 years"],
    );
    await shoppingCartWebsitePage.changeQuontity(shopingCartLocator, 2);
    await shoppingCartWebsitePage.clickCheckoutButton();
    await expect(await avangatePage.getProductsList(), 'Product objects are matched').toMatchObject([
        dbForgeSQLTools,
    ]);
});

test("AUT-11: Send request in Contact Sales form @postrelease @regression", async ({
    homeWebsitePage,
    contactSalesPage,
}) => {
    await homeWebsitePage.navigateTo("/contact-sales/");
    await contactSalesPage.selectRequestCategoryDp("I need a demo");
    await contactSalesPage.selectProductGroupDp("Database Tools");
    await contactSalesPage.inputFirstName("QA");
    await contactSalesPage.inputLastName("Automation");
    await contactSalesPage.inputEmail("qa.devart@test.com");
    await contactSalesPage.writeMessage("Devart site QA Automation test");

    const responseStatus = await contactSalesPage.clickSendRequestButton();
    await expect(responseStatus).toEqual(200);
});

test("AUT-12: Send request in Request Demo form @postrelease @regression", async ({
    homeWebsitePage,
    productDetailsWebsitePage,
    requestDemoPage,
}) => {
    await homeWebsitePage.navigateTo(
        "/dbforge/sql/sql-tools/dbforge-sql-tools.html",
    );
    await await productDetailsWebsitePage.clickRequestDemoButton();
    await requestDemoPage.inputFirstName("QA");
    await requestDemoPage.inputLastName("Automation");
    await requestDemoPage.inputEmail("qa.devart@test.com");
    await requestDemoPage.writeMessage(
        "QA Devart site Automation test!!! Dont't reply",
    );

    const responseStatus = await requestDemoPage.clickSendRequestButton();
    await expect(responseStatus).toEqual(200);
});
