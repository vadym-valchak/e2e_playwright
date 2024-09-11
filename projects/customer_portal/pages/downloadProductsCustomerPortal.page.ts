import { Locator, Page, expect, test } from "@playwright/test";
import { MenuCustomerPortalSection } from "../sections/menuCustomerPortal.section";
import {
    removeFolder,
    isFileExist,
} from "../../../helpers/fileOperations.helper";

export class DownloadProductsCustomerPortalPage extends MenuCustomerPortalSection {
    protected readonly page: Page;
    private readonly latestProduct: Locator;
    private readonly downloadDir: string = "./../downloads/";

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.latestProduct = page.locator("a.download-version__link").first();
    }

    async downloadAndCheckLatestProduct() {
        await test.step('I can download file', async () => {
            const downloadPromise = this.page.waitForEvent("download", {
                timeout: 120000,
            });
            await this.latestProduct.click();
            const download = await downloadPromise;
            const fileName = await download.suggestedFilename();
            await download.saveAs(this.downloadDir + fileName);
            // Check that file is exist;
            await expect(
                await isFileExist(this.downloadDir + fileName),
            `File "${fileName}" is downloaded`).toBeTruthy();
            await removeFolder(this.downloadDir);
        })
    }
}
