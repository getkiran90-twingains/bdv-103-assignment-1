import previous_assignment from "./assignment-3";

export type BookID = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
}

export interface Filter {
  from?: number;
  to?: number;
  name?: string;
  author?: string;
}

// Same backend as assignment-2/3 (your Koa server)
const API_BASE = "/api";

function ensureOk(res: Response, label: string): Promise<Response> {
  if (res.ok) return Promise.resolve(res);
  return res
    .text()
    .catch(() => "")
    .then((text) => {
      throw new Error(`${label} failed: ${res.status} ${text}`);
    });
}

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
  const stock = typeof rec.stock === "number" ? rec.stock : undefined;

  const idVal = (rec.id ?? rec._id) as string | undefined;

  return {
    id: idVal,
    name,
    author,
    description,
    price,
    image,
    stock,
  };
}

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters?: Filter[]): Promise<Book[]> {
  const url = new URL(`${API_BASE}/books`);

  // Your backend filter logic (if implemented) expects JSON in query param "filters"
  if (filters && filters.length > 0) {
    url.searchParams.set("filters", JSON.stringify(filters));
  }

  const res = await ensureOk(await fetch(url.toString()), "listBooks");
  const data = (await res.json()) as unknown;

  return Array.isArray(data) ? data.map(normalizeBook) : [];
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  // Keep using previous assignment behaviour (CRUD already done there)
  return await previous_assignment.createOrUpdateBook(book);
}

async function removeBook(book: BookID): Promise<void> {
  await previous_assignment.removeBook(book);
}

async function lookupBookById(bookId: BookID): Promise<Book> {
  const res = await ensureOk(
    await fetch(`${API_BASE}/books/${bookId}`),
    "lookupBookById"
  );
  return normalizeBook(await res.json());
}

export type ShelfId = string;
export type OrderId = string;

async function placeBooksOnShelf(
  bookId: BookID,
  numberOfBooks: number,
  shelf: ShelfId
): Promise<void> {
  const res = await ensureOk(
    await fetch(`${API_BASE}/warehouse/shelves/${encodeURIComponent(shelf)}/books/${encodeURIComponent(bookId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numberOfBooks }),
    }),
    "placeBooksOnShelf"
  );

  // consume body if present (not required)
  await res.text().catch(() => "");
}

async function orderBooks(order: BookID[]): Promise<{ orderId: OrderId }> {
  const res = await ensureOk(
    await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    }),
    "orderBooks"
  );

  const data = (await res.json()) as unknown;
  if (typeof data !== "object" || data === null) {
    throw new Error("orderBooks failed: invalid response");
  }
  const rec = data as Record<string, unknown>;
  if (typeof rec.orderId !== "string") {
    throw new Error("orderBooks failed: missing orderId");
  }
  return { orderId: rec.orderId };
}

async function findBookOnShelf(
  bookId: BookID
): Promise<Array<{ shelf: ShelfId; count: number }>> {
  const res = await ensureOk(
    await fetch(`${API_BASE}/warehouse/books/${encodeURIComponent(bookId)}`),
    "findBookOnShelf"
  );

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];

  return data
    .map((x) => {
      if (typeof x !== "object" || x === null) return null;
      const rec = x as Record<string, unknown>;
      const shelf = typeof rec.shelf === "string" ? rec.shelf : undefined;
      const count = typeof rec.count === "number" ? rec.count : undefined;
      if (!shelf || count === undefined) return null;
      return { shelf, count };
    })
    .filter((x): x is { shelf: ShelfId; count: number } => x !== null);
}

async function fulfilOrder(
  orderId: OrderId,
  booksFulfilled: Array<{ book: BookID; shelf: ShelfId; numberOfBooks: number }>
): Promise<void> {
  const res = await ensureOk(
    await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/fulfil`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booksFulfilled }),
    }),
    "fulfilOrder"
  );

  await res.text().catch(() => "");
}

async function listOrders(): Promise<
  Array<{ orderId: OrderId; books: Record<BookID, number> }>
> {
  const res = await ensureOk(await fetch(`${API_BASE}/orders`), "listOrders");
  const data = (await res.json()) as unknown;

  if (!Array.isArray(data)) return [];

  return data
    .map((x) => {
      if (typeof x !== "object" || x === null) return null;
      const rec = x as Record<string, unknown>;
      const orderId = typeof rec.orderId === "string" ? rec.orderId : undefined;

      const booksRaw = rec.books;
      if (!orderId || typeof booksRaw !== "object" || booksRaw === null) return null;

      // books should be Record<BookID, number>
      const booksObj = booksRaw as Record<string, unknown>;
      const books: Record<BookID, number> = {};
      for (const [k, v] of Object.entries(booksObj)) {
        if (typeof v === "number") books[k] = v;
      }

      return { orderId, books };
    })
    .filter(
      (x): x is { orderId: OrderId; books: Record<BookID, number> } => x !== null
    );
}

const assignment = "assignment-4";

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders,
  lookupBookById,
};