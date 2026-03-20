import { MongoClient, Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

let client: MongoClient | null = null;
let db: Db | null = null;
let memoryServer: MongoMemoryServer | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  let mongoUrl = process.env.MONGO_URI;

  // If no Mongo URI is provided, start in-memory Mongo
  if (!mongoUrl) {
    memoryServer = await MongoMemoryServer.create();
    mongoUrl = memoryServer.getUri();
    console.log("!!!!Using in-memory MongoDB!!!!");
  }

  client = new MongoClient(mongoUrl);
  await client.connect();

  db = client.db("assignment-db");
  return db;
}