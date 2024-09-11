import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

let env_value;
switch (process.env.CI_COMMIT_BRANCH) {
    case "master":
        env_value = "prod";
        break;
    case "dev":
    default:
        env_value = "prod";
        break;
}

dotenv.config({
    path: `./env/.env.${env_value}`,
});

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./tests",
    timeout: 2 * 60 * 1000,
    expect: {
        timeout: 15 * 1000,
    },
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 0 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ["list"],
        ["html", { outputFolder: "html-report" }],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "retain-on-first-failure",
        navigationTimeout: 30 * 1000,
        actionTimeout: 30 * 1000,
        video: "retain-on-failure",
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: {
                bypassCSP: true,
                ...devices["Desktop Chrome"],
                screenshot: {
                    mode: "only-on-failure",
                    fullPage:true,
                },
                launchOptions: {
                    args: ["--disable-blink-features=AutomationControlled"],
                },
            },
        },

        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
