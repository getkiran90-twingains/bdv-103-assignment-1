import { getDb } from "../db/mongo";

export interface WarehouseBookCache {
  bookId: string;
  name: string;
}

export async function upsertWarehouseBookCache(book: WarehouseBookCache): Promise<void> {
  const db = await getDb();
  const col = db.collection("book_cache");

  await col.updateOne(
    { bookId: book.bookId },
    { $set: book },
    { upsert: true }
  );
}

export async function listWarehouseBookCache(): Promise<WarehouseBookCache[]> {
  const db = await getDb();
  const col = db.collection("book_cache");

  const docs = await col.find({}).toArray();

  return docs.map((doc) => ({
    bookId: String((doc as any).bookId),
    name: String((doc as any).name),
  }));
}