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

const API_BASE = "http://localhost:3001";

// Helper: normalize DB book to UI book (ensure id exists)
function normalizeBook(b: any): Book {
  return {
    ...b,
    id: b.id ?? b._id,     // UI-friendly id
    _id: b._id ?? b.id     // keep _id too if present
  } as Book;
}

async function listBooks(filters?: Array<{ from?: number; to?: number }>): Promise<Book[]> {
  // Your backend expects ctx.query.filters
  // We’ll send filters as JSON in query string (works reliably).
  const url = new URL(`${API_BASE}/books`);

  if (filters && filters.length > 0) {
    url.searchParams.set("filters", JSON.stringify(filters));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`listBooks failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return (data ?? []).map(normalizeBook);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  // If book has an id/_id => update, else create
  const id = (book.id ?? book._id) as string | undefined;

  if (id) {
    // UPDATE
    const { id: _ignore1, _id: _ignore2, ...updates } = book as any;

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
  } else {
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
}

async function removeBook(bookId: BookID): Promise<void> {
  const res = await fetch(`${API_BASE}/books/${bookId}`, { method: "DELETE" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`removeBook failed: ${res.status} ${text}`);
  }

  // backend returns { deleted: true/false } — no need to return anything
}

const assignment = "assignment-2";

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
};
