// import { client } from "./mongo.js";
import { getPptr } from "./pptr-init.js";

// export const setSrcInDb = async (src) => {
//   await client.connect();
//   try {
//     const db = client.db("main");

//     await db.collection("archillect-api").replaceOne({}, { src });

//     return null;
//   } catch (e) {
//     console.error(e);
//   } finally {
//     client.close();
//   }
// };

export const scrapeImgUrl = async () => {
  const { page, browser } = await getPptr();

  // https://xnaas.github.io/nitter-instances/
  await page.goto(`https://nitter.lacontrevoie.fr/archillect`, {
    waitUntil: "networkidle2",
  });

  //grab last image in feed
  const srcUrl = await page.$eval(
    "div.timeline-container a.still-image > img",
    // @ts-ignore
    (el) => el.src
  );

  browser.close();

  const res = await fetch(srcUrl);
  const buffer = Buffer.from(await res.arrayBuffer());

  return "data:image/jpg;base64," + buffer.toString("base64");
};
