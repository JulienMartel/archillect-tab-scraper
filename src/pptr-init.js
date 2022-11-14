import userAgent from "user-agents";
import puppeteer from "puppeteer-extra";

import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

puppeteer.use(StealthPlugin()).use(AdblockerPlugin({ blockTrackers: true }));

const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];

const blocked_domains = [
  "googlesyndication.com",
  "adservice.google.com",
  "googleads.g.doubleclick.net",
  "pagead2.googlesyndication.com",
  "googleadservices.com",
  "google-analytics.com",
  "googletagmanager.com",
  "google.com",
];

export const getPptr = async (headless = true) => {
  const browser = await puppeteer.launch({
    headless,
    args: minimal_args,
    defaultViewport: { width: 1920, height: 1080 },
  });

  let [page] = await browser.pages();

  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

  await page.setUserAgent(userAgent.toString());

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    const resourceType = request.resourceType();

    if (
      blocked_domains.some((domain) => url.includes(domain)) ||
      // resourceType === "image" ||
      // resourceType === 'media' ||
      resourceType === "font" ||
      resourceType === "stylesheet"
    )
      request.abort();
    else request.continue();
  });

  return { page, browser };
};
