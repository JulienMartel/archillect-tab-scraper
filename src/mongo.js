import { MongoClient } from "mongodb";

console.log(process.env.MONGODB_URI);

export const client = new MongoClient(process.env.MONGODB_URI);
