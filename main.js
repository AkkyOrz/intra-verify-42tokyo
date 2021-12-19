// const envPath = "/home/ubuntu/Documents/intra-verify-42tokyo/.env";
const envPath = "./.env";

require("dotenv").config({ path: envPath });
const { syncBuiltinESMExports } = require("module");
const puppeteer = require("puppeteer");
const { createLogger, format, transports } = require("winston");
const { splat, combine, timestamp, label, printf, simple } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ message: true }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "result.log" }),
  ],
});

(async () => {
  logger.warn("start");
  // const browser = await puppeteer.launch({
  //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
  // });
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
  });
  const page = await browser.newPage();
  await Promise.all([
    page.waitForSelector("#user_login"),
    page.goto("https://discord.42tokyo.jp/"),
  ]);

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

  logger.info("-----------login success------------");

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

  logger.info("-----------OAuth success------------");
  const discordLoginFormDivs = await page.$$(".inputWrapper-31_8H8");

  for (const [i, discordLoginFormDiv] of discordLoginFormDivs.entries()) {
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

  logger.info("-----------discord login success------------");
  const discordAuthButtonDiv = await page.$(".footer-3ZalXG");
  const discordAuthButton = await discordAuthButtonDiv.$(".lookFilled-1Gx00P");

  if (discordAuthButton) {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
      }),
      discordAuthButton.click(),
    ]);
  }
  logger.info("-----------discord OAuth success------------");
  logger.warn("finish");

  await browser.close();
})();
