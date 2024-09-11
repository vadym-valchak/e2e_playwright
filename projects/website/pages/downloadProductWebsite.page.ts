import { Page, expect, test } from "@playwright/test";
import {
    isFileExist,
    removeFolder,
} from "../../../helpers/fileOperations.helper";
import { BasePage } from "./base.page";

export class DownloadProductWebsitePage extends BasePage {
    readonly page: Page;
    readonly downloadDir: string = "./downloads/";

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    async downloadProductBuild(order: number) {
        await test.step('I can download product build', async () => {
            await this.page
            .locator(".download-row")
            .nth(order)
            .locator("a:has-text('Get Trial')")
            .click();
        })
    }

    async downloadAndCheckFileIsDownloaded(order: number) {
        const downloadPromise = this.page.waitForEvent("download", {
            timeout: 120000,
        });
        await test.step('I can download product build', async () => {
            await this.page
            .locator(".download-row")
            .nth(order)
            .locator("a[title='Download']")
            .click();
        const download = await downloadPromise;
        const fileName = await download.suggestedFilename();
        await download.saveAs(this.downloadDir + fileName);
        // Check that file is exist;
        await expect(
            await isFileExist(this.downloadDir + fileName), 'Build is downloaded'
        ).toBeTruthy();
        await removeFolder(this.downloadDir);
        })

    }
}
