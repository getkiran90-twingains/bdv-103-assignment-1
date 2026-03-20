import Router from "@koa/router";
import { Book } from "../../adapter/assignment-2";
import { getDb } from "../db/mongo";
import { warehouse } from "../warehouse/warehouse";

const listRouter = new Router();

type PriceFilter = { from?: string | number; to?: string | number };

/**
 * GET /books
 * Optional query param:
 *   filters=[{"from":10,"to":20},{"from":30}]
 */
listRouter.get("/books", async (ctx) => {
  // Parse filters from query string
  let filters: unknown = ctx.query.filters;

  if (typeof filters === "string") {
    try {
      filters = JSON.parse(filters);
    } catch {
      filters = undefined;
    }
  }

  try {
    let bookList = await readBooksFromDb();

    // Apply filters if provided and valid
    if (filters && validateFilters(filters) && filters.length > 0) {
      bookList = filterBooks(bookList, filters);
    } else if (filters) {
      // filters was provided but invalid
      ctx.status = 400;
      ctx.body = {
        error:
          'Invalid filters. Each filter must have valid "from" and "to" numbers where from <= to.'
      };
      return;
    }

    ctx.body = bookList.map((b) => ({
  ...b,
  stock: warehouse.getTotalStock((b.id ?? b._id) as string),
}));
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: `Failed to fetch books due to: ${error}` };
  }
});

/**
 * Validate filter objects
 */
function validateFilters(filters: unknown): filters is PriceFilter[] {
  if (!Array.isArray(filters)) return false;

  return filters.every((filter) => {
    if (typeof filter !== "object" || filter === null) return false;

    const f = filter as Record<string, unknown>;
    const fromVal = f.from;
    const toVal = f.to;

    const from = fromVal !== undefined ? Number(fromVal) : undefined;
    const to = toVal !== undefined ? Number(toVal) : undefined;

    if (from !== undefined && Number.isNaN(from)) return false;
    if (to !== undefined && Number.isNaN(to)) return false;
    if (from !== undefined && to !== undefined && from > to) return false;

    return true;
  });
}

/**
 * Read all books from MongoDB
 */
async function readBooksFromDb(): Promise<Book[]> {
  const db = await getDb();
  const books = await db.collection<Book>("books").find({}).toArray();
  return books;
}

/**
 * Filter books by price range
 * A book matches if it falls within ANY filter range
 */
function filterBooks(bookList: Book[], filters: PriceFilter[]): Book[] {
  return bookList.filter((book) =>
    filters.some((filter) => {
      const from = filter.from !== undefined ? Number(filter.from) : undefined;
      const to = filter.to !== undefined ? Number(filter.to) : undefined;

      const matchesFrom = from === undefined || book.price >= from;
      const matchesTo = to === undefined || book.price <= to;

      return matchesFrom && matchesTo;
    })
  );
}

export default listRouter;
