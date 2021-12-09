const config = require('./config.js');
const { syncBuiltinESMExports } = require("module");
const puppeteer = require("puppeteer");

(async() => {
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
    });
    const page = await browser.newPage();
    await page.goto("https://discord.42tokyo.jp/");

    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    await page.evaluate(() => console.log(`url is ${location.href}`));

    await page.type("#user_login", config.loginConfig.userName);
    await page.type("#user_password", config.loginConfig.password);
    const submitButtonDivs = await page.$$(".form-actions");
    console.log(submitButtonDivs);
    for (const submitButtonDiv of submitButtonDivs) {
        const submitButton = await submitButtonDiv.$(".btn");
        console.log(submitButton);
        if (submitButton) {
            await submitButton.click();
        }
    }

    await page.waitFor(500000);

    await browser.close();
})();