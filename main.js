const { syncBuiltinESMExports } = require("module");
const config = require("./config.js");
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

    console.log(config.loginConfig);
    await page.type("#user_login", config.loginConfig.tokyo_42.userName);
    await page.type("#user_password", config.loginConfig.tokyo_42.password);
    const submitButtonDiv = await page.$(".form-actions");
    const submitButton = await submitButtonDiv.$(".btn");
    console.log(submitButton);
    if (submitButton) {
        await Promise.all([
            page.waitForNavigation({
                waitUntil: ["load", "networkidle2"],
            }),
            submitButton.click(),
        ]);
    }

    console.log("-----------login success------------");

    const authorizeButtonDiv = await page.$(".actions");
    const authorizeButton = await authorizeButtonDiv.$(".btn-success");
    console.log(authorizeButton);
    if (authorizeButton) {
        await Promise.all([
            page.waitForNavigation({
                waitUntil: ["load", "networkidle2"],
            }),
            authorizeButton.click(),
        ]);
    }

    console.log("-----------OAuth success------------");
    await page.waitFor(500000);

    await browser.close();
})();
