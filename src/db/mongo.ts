import { MongoClient, Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

let db: Db | null = null;
let client: MongoClient | null = null;
let memoryServer: MongoMemoryServer | null = null;

export async function getDb(): Promise<Db> {
  if (db) {
    return db;
  }

  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db("app");
    return db;
  }

  console.warn("!!!!Using in-memory MongoDB!!!!");

  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();

  client = new MongoClient(uri);
  await client.connect();
  db = client.db("app");

  return db;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }

  db = null;
}