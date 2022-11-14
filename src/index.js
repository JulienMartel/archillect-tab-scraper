import { scrapeImgUrl, setSrcInDb } from "./utils.js";

const b64url = await scrapeImgUrl();
await setSrcInDb(b64url);

export {};
