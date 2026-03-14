export type BookID = string;

export interface Book {
  // DB returns _id. UI code may use id.
  _id?: string;
  id?: BookID;

  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

const API_BASE = "/api";

function normalizeBook(b: unknown): Book {
  if (typeof b !== "object" || b === null) {
    throw new Error("Invalid book data");
  }

  const rec = b as Record<string, unknown>;

  const name = typeof rec.name === "string" ? rec.name : "";
  const author = typeof rec.author === "string" ? rec.author : "";
  const description =
    typeof rec.description === "string" ? rec.description : "";
  const price = typeof rec.price === "number" ? rec.price : 0;
  const image = typeof rec.image === "string" ? rec.image : "";

  const id = (rec.id ?? rec._id) as string | undefined;
  const _id = (rec._id ?? rec.id) as string | undefined;

  return {
    name,
    author,
    description,
    price,
    image,
    id,
    _id,
  };
}

async function listBooks(
  filters?: Array<{ from?: number; to?: number }>
): Promise<Book[]> {
  const url = new URL(`${API_BASE}/books`);

  if (filters && filters.length > 0) {
    url.searchParams.set("filters", JSON.stringify(filters));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`listBooks failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? data.map(normalizeBook) : [];
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  const id = (book.id ?? book._id) as string | undefined;

  if (id) {
    // UPDATE
    const bookObj = book as unknown as Record<string, unknown>;
    const { id: _ignore1, _id: _ignore2, ...updates } = bookObj;

    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`updateBook failed: ${res.status} ${text}`);
    }

    const updated = normalizeBook(await res.json());
    return (updated.id ?? updated._id) as string;
  }

  // CREATE
  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`createBook failed: ${res.status} ${text}`);
  }

  const created = normalizeBook(await res.json());
  return (created.id ?? created._id) as string;
}

async function removeBook(bookId: BookID): Promise<void> {
  const res = await fetch(`${API_BASE}/books/${bookId}`, { method: "DELETE" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`removeBook failed: ${res.status} ${text}`);
  }
}

const assignment = "assignment-2";

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
};
