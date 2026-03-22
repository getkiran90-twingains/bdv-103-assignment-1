import Router from "@koa/router";
import type { Context } from "koa";
import { ObjectId } from "mongodb";

import listRouter from "./lists";
import { getDb } from "../db/mongo";
import { warehouse } from "../warehouse/warehouse";
const router = new Router();

// mount list routes (GET /books etc.)
router.use(listRouter.routes());
router.use(listRouter.allowedMethods());

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Create book route (MongoDB)
router.post("/books", async (ctx: Context) => {
  const payloadUnknown: unknown = ctx.request.body;

  if (!isRecord(payloadUnknown)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid book payload" };
    return;
  }

  const payload: Record<string, unknown> = { ...payloadUnknown };

  const nameOrTitle = payload.name ?? payload.title;

  if (typeof nameOrTitle !== "string" || nameOrTitle.trim() === "") {
    ctx.status = 400;
    ctx.body = { error: "Book name/title is required" };
    return;
  }

  if (payload.name === undefined && typeof payload.title === "string") {
    payload.name = payload.title;
    delete payload.title;
  }

  const db = await getDb();
  const col = db.collection("books");

  const result = await col.insertOne(payload);

  ctx.status = 201;
  ctx.body = { ...payload, _id: result.insertedId };
});
router.get("/books/:id", async (ctx: Context) => {
  const id = ctx.params.id;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid book id" };
    return;
  }

  const db = await getDb();
  const col = db.collection("books");
  const _id = new ObjectId(id);

  const book = await col.findOne({ _id });

  if (!book) {
    ctx.status = 404;
    ctx.body = { error: "Book not found" };
    return;
  }

  // Add stock count
 const stock = warehouse.getTotalStock(id);
  ctx.status = 200;
  ctx.body = { ...book, stock };
});
// Update book route (MongoDB)
router.put("/books/:id", async (ctx: Context) => {
  const id = ctx.params.id;
  const updatesUnknown: unknown = ctx.request.body;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid book id" };
    return;
  }

  if (!isRecord(updatesUnknown)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid update payload" };
    return;
  }

  const updates: Record<string, unknown> = { ...updatesUnknown };

  // Prevent changing _id
  if ("_id" in updates) delete updates._id;

  // Optional: normalize title -> name if provided
  if (updates.name === undefined && typeof updates.title === "string") {
    updates.name = updates.title;
    delete updates.title;
  }

  const db = await getDb();
  const col = db.collection("books");
  const _id = new ObjectId(id);

  const result = await col.updateOne({ _id }, { $set: updates });

  if (result.matchedCount === 0) {
    ctx.status = 404;
    ctx.body = { error: "Book not found" };
    return;
  }

  const updated = await col.findOne({ _id });

  ctx.status = 200;
  ctx.body = updated;
});

// Delete book route (MongoDB)
router.delete("/books/:id", async (ctx: Context) => {
  const id = ctx.params.id;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid book id" };
    return;
  }

  const db = await getDb();
  const col = db.collection("books");

  const result = await col.deleteOne({ _id: new ObjectId(id) });

  ctx.status = 200;
  ctx.body = { deleted: result.deletedCount === 1 };
});

export default router;
