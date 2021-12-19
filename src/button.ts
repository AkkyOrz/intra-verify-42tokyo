import puppeteer, { Browser, Page, ElementHandle } from "puppeteer";
import assertIsDefined from "./assertIsDefined";

const clickButton = async (
  page: Page,
  button: ElementHandle<Element> | null | undefined
) => {
  assertIsDefined(button);
  await Promise.all([
    page.waitForNavigation({
      waitUntil: ["load", "networkidle2"],
    }),
    button.click(),
  ]);
};

export default clickButton;
