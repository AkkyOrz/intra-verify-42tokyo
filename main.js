require("dotenv").config();
const { syncBuiltinESMExports } = require("module");
const config = require("./config.js");
const puppeteer = require("puppeteer");

(async () => {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
  });
  const page = await browser.newPage();
  await page.goto("https://discord.42tokyo.jp/");

  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  await page.evaluate(() => console.log(`url is ${location.href}`));

  await page.type("#user_login", process.env.TOKYO_42_USERNAME);
  await page.type("#user_password", process.env.TOKYO_42_PASSWORD);
  const submitButtonDiv = await page.$(".form-actions");
  const submitButton = await submitButtonDiv.$(".btn");
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
  if (authorizeButton) {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
      }),
      authorizeButton.click(),
    ]);
  }

  console.log("-----------OAuth success------------");

  const discordLoginFormDivs = await page.$$(".inputWrapper-31_8H8");

  for (const [i, discordLoginFormDiv] of discordLoginFormDivs.entries()) {
    console.log(`${i}th discordLoginFormDiv`);
    const discordLoginForm = await discordLoginFormDiv.$("input");
    if (i == 0) {
      await discordLoginForm.type(process.env.DISCORD_EMAIL);
    } else {
      await discordLoginForm.type(process.env.DISCORD_PASSWORD);
    }
  }

  const discordLoginButton = await page.$(".button-3k0cO7");
  if (discordLoginButton) {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
      }),
      page.waitForSelector("div.footer-3ZalXG"),
      discordLoginButton.click(),
    ]);
  }

  console.log("-----------discord login success------------");
  const discordAuthButtonDiv = await page.$(".footer-3ZalXG");
  console.log(discordAuthButtonDiv);
  const discordAuthButton = await discordAuthButtonDiv.$(".lookFilled-1Gx00P");

  console.log(discordAuthButton);
  if (discordAuthButton) {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
      }),
      discordAuthButton.click(),
    ]);
  }
  await browser.close();
})();
