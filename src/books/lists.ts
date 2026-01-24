import Router from '@koa/router';
import { Book } from '../../adapter/assignment-2';
import { getDb } from "../db/mongo";

const listRouter = new Router();

/**
 * GET /books
 * Optional query param:
 *   filters=[{"from":10,"to":20},{"from":30}]
 */
listRouter.get('/books', async (ctx) => {
  // Parse filters from query string (arrives as string)
  let filters: any = ctx.query.filters;

  if (typeof filters === "string") {
    try {
      filters = JSON.parse(filters);
    } catch {
      filters = undefined;
    }
  }

  try {
    let bookList = await readBooksFromDb();

    // Apply filters if provided
    if (filters && Array.isArray(filters) && filters.length > 0) {
      if (!validateFilters(filters)) {
        ctx.status = 400;
        ctx.body = {
          error: 'Invalid filters. Each filter must have valid "from" and "to" numbers where from <= to.'
        };
        return;
      }

      bookList = filterBooks(bookList, filters);
    }

    ctx.body = bookList;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: `Failed to fetch books due to: ${error}` };
  }
});

/**
 * Validate filter objects
 */
function validateFilters(filters: any): boolean {
  if (!filters || !Array.isArray(filters)) {
    return false;
  }

  return filters.every(filter => {
    const from = filter.from !== undefined ? parseFloat(filter.from) : undefined;
    const to = filter.to !== undefined ? parseFloat(filter.to) : undefined;

    if (from !== undefined && isNaN(from)) return false;
    if (to !== undefined && isNaN(to)) return false;
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
function filterBooks(
  bookList: Book[],
  filters: Array<{ from?: string; to?: string }>
): Book[] {
  return bookList.filter(book =>
    filters.some(filter => {
      const from = filter.from !== undefined ? parseFloat(filter.from) : undefined;
      const to = filter.to !== undefined ? parseFloat(filter.to) : undefined;

      const matchesFrom = from === undefined || book.price >= from;
      const matchesTo = to === undefined || book.price <= to;

      return matchesFrom && matchesTo;
    })
  );
}

export default listRouter;
