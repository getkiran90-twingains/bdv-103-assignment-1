import Router from "@koa/router";
import type { Context } from "koa";
import { warehouse } from "./warehouse";

const router = new Router();

// Place books on a shelf
router.post("/warehouse/shelves/:shelf/books/:bookId", async (ctx: Context) => {
  const { shelf, bookId } = ctx.params;

  const body = ctx.request.body as unknown;

  if (typeof body !== "object" || body === null) {
    ctx.status = 400;
    ctx.body = { error: "Invalid payload" };
    return;
  }

  const rec = body as Record<string, unknown>;
  const numberOfBooks = typeof rec.numberOfBooks === "number" ? rec.numberOfBooks : undefined;

  if (!numberOfBooks || numberOfBooks <= 0) {
    ctx.status = 400;
    ctx.body = { error: "numberOfBooks must be a positive number" };
    return;
  }

  warehouse.placeBooksOnShelf(bookId, numberOfBooks, shelf);

  ctx.status = 200;
  ctx.body = { ok: true };
});

// Find book on shelves
router.get("/warehouse/books/:bookId", async (ctx: Context) => {
  const { bookId } = ctx.params;
  ctx.body = warehouse.findBookOnShelf(bookId);
});

// Create an order
router.post("/orders", async (ctx: Context) => {
  const body = ctx.request.body as unknown;

  if (typeof body !== "object" || body === null) {
    ctx.status = 400;
    ctx.body = { error: "Invalid payload" };
    return;
  }

  const rec = body as Record<string, unknown>;
  const order = Array.isArray(rec.order) ? rec.order : undefined;

  if (!order || !order.every((x) => typeof x === "string")) {
    ctx.status = 400;
    ctx.body = { error: "order must be an array of book IDs" };
    return;
  }

  ctx.body = warehouse.orderBooks(order);
});

// Fulfil an order
router.post("/orders/:orderId/fulfil", async (ctx: Context) => {
  const { orderId } = ctx.params;
  const body = ctx.request.body as unknown;

  if (typeof body !== "object" || body === null) {
    ctx.status = 400;
    ctx.body = { error: "Invalid payload" };
    return;
  }

  const rec = body as Record<string, unknown>;
  const fulfilled = Array.isArray(rec.booksFulfilled) ? rec.booksFulfilled : undefined;

  if (!fulfilled) {
    ctx.status = 400;
    ctx.body = { error: "booksFulfilled must be an array" };
    return;
  }

  try {
    warehouse.fulfilOrder(
      orderId,
      fulfilled as Array<{ book: string; shelf: string; numberOfBooks: number }>
    );
    ctx.status = 200;
    ctx.body = { ok: true };
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error: `${e}` };
  }
});

// List orders
router.get("/orders", async (ctx: Context) => {
  ctx.body = warehouse.listOrders();
});

export default router;