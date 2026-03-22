import { getDb } from "../db/mongo";

export interface OrdersBookCache {
  bookId: string;
  name?: string;
}

export async function upsertOrdersBookCache(book: OrdersBookCache): Promise<void> {
  const db = await getDb();
  const col = db.collection("book_cache");

  await col.updateOne(
    { bookId: book.bookId },
    { $set: book },
    { upsert: true }
  );
}

export async function findOrdersBookCache(bookId: string): Promise<OrdersBookCache | null> {
  const db = await getDb();
  const col = db.collection("book_cache");

  const doc = await col.findOne({ bookId });

  if (!doc) {
    return null;
  }

  return {
    bookId: String((doc as any).bookId),
    name: (doc as any).name ? String((doc as any).name) : undefined,
  };
}

export async function listOrdersBookCache(): Promise<OrdersBookCache[]> {
  const db = await getDb();
  const col = db.collection("book_cache");

  const docs = await col.find({}).toArray();

  return docs.map((doc) => ({
    bookId: String((doc as any).bookId),
    name: (doc as any).name ? String((doc as any).name) : undefined,
  }));
}