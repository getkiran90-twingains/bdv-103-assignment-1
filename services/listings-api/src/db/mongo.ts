import { MongoClient, Db } from "mongodb";

let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) {
    return db;
  }

  const mongoUri = process.env.MONGO_URI || "mongodb://mongo-listings:27017";
  const client = new MongoClient(mongoUri);

  await client.connect();

  db = client.db("listings");
  return db;
}