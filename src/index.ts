const envPath = "./.env";
require("dotenv").config({ path: envPath });

const { syncBuiltinESMExports } = require("module");
import puppeteer from "puppeteer-extra";
import { Browser, Page, ElementHandle, Frame } from "puppeteer";
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha")
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "XXXXXXX", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    },
  })
)
const { createLogger, format, transports } = require("winston");
const { splat, combine, timestamp, label, printf, simple } = format;

import {
  setCredentials,
  CredentialsTokyo42,
  CredentialsDiscord,
  Credentials,
} from "./credentials";
import clickButton from "./button";
import assertIsDefined from "./assertIsDefined";
import { assert } from "console";

type InfoType = {
  level: string;
  message: string;
  timestamp: string;
};

const myFormat = printf(({ level, message, timestamp }: InfoType) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ message: true }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "result.log" }),
  ],
});

const login42Tokyo = async (page: Page, cred42: CredentialsTokyo42) => {
  await Promise.all([
    page.waitForSelector("#user_login"),
    page.goto("https://discord.42tokyo.jp/"),
  ]);

  await page.type("#user_login", cred42.name);
  await page.type("#user_password", cred42.password);

  const submitButtonDiv = await page.$(".form-actions");
  const submitButton = await submitButtonDiv?.$(".btn");
  await clickButton(page, submitButton);
  logger.info("-----------42tokyo login success------------");
};

const authorize42Tokyo = async (page: Page) => {
  const authorizeButtonDiv = await page.$(".actions");
  const authorizeButton = await authorizeButtonDiv?.$(".btn-success");
  await clickButton(page, authorizeButton);

  logger.info("-----------42tokyo OAuth success------------");
};

const loginDiscord = async (page: Page, credDiscord: CredentialsDiscord) => {
  const discordLoginFormDivs = await page.$$(".inputWrapper-31_8H8");
  for (const [i, discordLoginFormDiv] of discordLoginFormDivs.entries()) {
    const discordLoginForm = await discordLoginFormDiv.$("input");
    assertIsDefined(discordLoginForm);
    if (i == 0) {
      await discordLoginForm.type(credDiscord.email);
    } else {
      await discordLoginForm.type(credDiscord.password);
    }
  }
  logger.info("-----------discord fill-in form------------");
  const discordLoginButton = await page.$(".button-3k0cO7");
  if (discordLoginButton) {
    await discordLoginButton.click();
    await page.waitForTimeout(5000);
    // console.log(page.frames());
    const result = await Promise.race([
      page.waitForTimeout(5 * 60 * 1000),
      page
        .frames()
        .find((f) =>
          f.url().startsWith("https://newassets.hcaptcha.com/captcha/")
        ),
      page.waitForSelector("div.footer-3ZalXG"),
    ]);
    logger.info("recaptcha?");
    // await Promise.race([page.waitForSelector("div.footer-3ZalXG")]);
    await page.waitForTimeout(5 * 60 * 1000);
  }
  logger.info("-----------discord login success------------");
};

const authorizeDiscord = async (page: Page) => {
  const discordAuthButtonDiv = await page.$(".footer-3ZalXG");
  const discordAuthButton = await discordAuthButtonDiv?.$(".lookFilled-1Gx00P");
  await clickButton(page, discordAuthButton);
  logger.info("-----------discord OAuth success------------");
};

const launchBrowser = async () => {
  if (process.env.ENVIRONMENT === "local") {
    return await puppeteer.launch({
      headless: false,
      slowMo: 10,
    });
  } else {
    return await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
};

const main = async () => {
  logger.info("start");

  const credentials = setCredentials(process.env);

  const browser = await launchBrowser();
  const page: Page = await browser.newPage();

  await login42Tokyo(page, credentials.tokyo42);
  await authorize42Tokyo(page);
  await loginDiscord(page, credentials.discord);
  await authorizeDiscord(page);

  logger.info("finish");
  await browser.close();
};

main();
