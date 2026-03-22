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

  const docs = await col.find({}).toArray() as Array<{
    bookId?: unknown;
    name?: unknown;
  }>;

  return docs.map((doc) => ({
    bookId: String(doc.bookId ?? ""),
    name: String(doc.name ?? ""),
  }));
}