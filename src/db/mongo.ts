import { MongoClient, Db } from "mongodb";

const MONGO_URL = "mongodb://mongo:27017";
const DB_NAME = "mcmasterful";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  return db;
}
