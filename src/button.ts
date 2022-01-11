import puppeteer, { Browser, Page, ElementHandle } from "puppeteer";
import assertIsDefined from "./assertIsDefined";

const clickButton = async (
  page: Page,
  button: ElementHandle<Element> | null | undefined,
  selector?: string
) => {
  assertIsDefined(button);
  if (!selector) {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
      }),
      button.click(),
    ]);
  } else {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ["load", "networkidle2"],
      }),
      button.click(),
      page.waitForSelector(selector),
    ]);
  }
};

export default clickButton;
