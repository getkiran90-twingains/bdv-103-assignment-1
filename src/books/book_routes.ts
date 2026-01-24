import Router from "@koa/router";
import type { Context } from "koa";
import { ObjectId } from "mongodb";

import listRouter from "./lists";
import { getDb } from "../db/mongo";

const router = new Router();

// mount list routes (GET /books etc.)
router.use(listRouter.routes());
router.use(listRouter.allowedMethods());

// Create book route (MongoDB)
router.post("/books", async (ctx: Context) => {
  const payload = ctx.request.body as any;

  if (!payload || typeof payload !== "object") {
    ctx.status = 400;
    ctx.body = { error: "Invalid book payload" };
    return;
  }

const nameOrTitle = payload.name ?? payload.title;

if (!nameOrTitle || typeof nameOrTitle !== "string" || nameOrTitle.trim() === "") {
  ctx.status = 400;
  ctx.body = { error: "Book name/title is required" };
  return;
}

// Normalize: store as "name" so UI + dataset stay consistent
if (!payload.name && payload.title) {
  payload.name = payload.title;
  delete payload.title; 
}


  const db = await getDb();
  const col = db.collection("books");

  const result = await col.insertOne(payload);

  ctx.status = 201;
  ctx.body = { ...payload, _id: result.insertedId };
});

// Update book route (MongoDB)
router.put("/books/:id", async (ctx: Context) => {
  const id = ctx.params.id;
  const updates = ctx.request.body as any;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid book id" };
    return;
  }

  if (!updates || typeof updates !== "object") {
    ctx.status = 400;
    ctx.body = { error: "Invalid update payload" };
    return;
  }

  // Prevent changing _id
  if ("_id" in updates) delete updates._id;

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
