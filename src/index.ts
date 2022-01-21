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

type BrowserSettingType = {
  args?: Array<string>;
  executablePath?: string;
  userDataDir?: string;
  ignoreDefaultArgs?: Array<string>;
  headless?: boolean;
  slowMo?: number;
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

const hasAlreadyLoggedIn42 = async (page: Page) => {
  await page.goto("https://discord.42tokyo.jp/");

  const loginMainDiv = await page.$("#user_login");
  return (loginMainDiv === null ? true : false) as boolean;
};

const login42Tokyo = async (page: Page, cred42: CredentialsTokyo42) => {
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

const hasAlreadyLoggedInDiscord = async (page: Page) => {
  const discordLoginButton = await page.$("button[type=submit]");
  return (discordLoginButton === null ? true : false) as boolean;
};

const loginDiscord = async (page: Page, credDiscord: CredentialsDiscord) => {
  const discordLoginForms = await page.$$("input");
  for (const [i, discordLoginForm] of discordLoginForms.entries()) {
    assertIsDefined(discordLoginForm);
    if (i == 0) {
      await discordLoginForm.type(credDiscord.email);
    } else {
      await discordLoginForm.type(credDiscord.password);
    }
  }
  logger.info("-----------discord fill-in form------------");

  const discordLoginButton = await page.$("button[type=submit]");
  await clickButton(
    page,
    discordLoginButton,
    'header[id="oauth2-authorize-header-id"]'
  );
  logger.info("-----------discord login success------------");
};

const authorizeDiscord = async (page: Page) => {
  const discordButtons = await page.$$("button");
  const discordAuthButton = discordButtons[1];
  await clickButton(page, discordAuthButton);
  logger.info("-----------discord OAuth success------------");
};

const launchBrowser = async () => {
  const configs: BrowserSettingType = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  };
  if (process.env.ENVIRONMENT === "local") {
    configs.headless = false;
    configs.slowMo = 10;
    configs.executablePath = "/snap/bin/chromium";
    configs.userDataDir = process.env.HOME + "/snap/chromium/common/chromium/";
  } else if (process.env.ENVIRONMENT === "browser") {
    configs.executablePath = "/snap/bin/chromium";
    configs.userDataDir = process.env.HOME + "/snap/chromium/common/chromium/";
  }
  return await puppeteer.launch(configs);
};

const main = async () => {
  logger.info("start");

  const credentials = setCredentials(process.env);

  const browser = await launchBrowser();
  const page: Page = await browser.newPage();

  const hasLoggedIn42 = await hasAlreadyLoggedIn42(page);
  if (!hasLoggedIn42) {
    await login42Tokyo(page, credentials.tokyo42);
  } else {
    logger.info("already logged in 42");
  }
  await authorize42Tokyo(page);
  const hasLoggedInDiscord = await hasAlreadyLoggedInDiscord(page);
  if (!hasLoggedInDiscord) {
    await loginDiscord(page, credentials.discord);
  } else {
    logger.info("already logged in discord");
  }
  await authorizeDiscord(page);

  logger.info("finish");
  await browser.close();
};

main();
