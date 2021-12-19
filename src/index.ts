const envPath = "./.env";

require("dotenv").config({ path: envPath });
const { syncBuiltinESMExports } = require("module");
import puppeteer, { Browser, Page, ElementHandle } from "puppeteer";
import {
  setCredentials,
  CredentialsTokyo42,
  CredentialsDiscord,
  Credentials,
} from "./credentials";
import clickButton from "./button";
import assertIsDefined from "./assertIsDefined";
import { assert } from "console";
const { createLogger, format, transports } = require("winston");
const { splat, combine, timestamp, label, printf, simple } = format;

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
  logger.info("-----------login success------------");
};

const authorize42Tokyo = async (page: Page) => {
  const authorizeButtonDiv = await page.$(".actions");
  const authorizeButton = await authorizeButtonDiv?.$(".btn-success");
  await clickButton(page, authorizeButton);
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
};

const authorizeDiscord = async (page: Page) => {
  const discordAuthButtonDiv = await page.$(".footer-3ZalXG");
  const discordAuthButton = await discordAuthButtonDiv?.$(".lookFilled-1Gx00P");
  await clickButton(page, discordAuthButton);
  logger.info("-----------discord OAuth success------------");
};

const main = async () => {
  logger.info("start");

  const credentials = setCredentials(process.env);

  const browser: Browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
  });
  const page: Page = await browser.newPage();

  await login42Tokyo(page, credentials.tokyo42);
  await authorize42Tokyo(page);
  await loginDiscord(page, credentials.discord);
  await authorizeDiscord(page);

  logger.info("finish");
  await browser.close();
};

main();
