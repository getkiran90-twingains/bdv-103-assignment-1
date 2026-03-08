import { Body, Delete, Get, Path, Post, Put, Route, Tags, SuccessResponse } from "tsoa";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import { warehouse } from "../warehouse/warehouse";

export interface Book {
  id?: string;
  name: string;
  author?: string;
  description?: string;
  price?: number;
  image?: string;
  stock?: number;
}

@Route("books")
@Tags("Books")
export class BooksController {
  @Get()
  public async listBooks(): Promise<Book[]> {
    const db = await getDb();
    const col = db.collection("books");
    const docs = await col.find({}).toArray();

    return docs.map((b: any) => ({
      ...(b as any),
      id: (b._id ?? b.id)?.toString(),
    }));
  }

  @Get("{id}")
  public async getBook(@Path() id: string): Promise<Book> {
    if (!ObjectId.isValid(id)) throw new Error("Invalid book id");

    const db = await getDb();
    const col = db.collection("books");
    const book = await col.findOne({ _id: new ObjectId(id) });

    if (!book) throw new Error("Book not found");

    return { ...(book as any), id, stock: warehouse.getTotalStock(id) };
  }

  @Post()
  @SuccessResponse("201", "Created")
  public async createBook(@Body() body: Record<string, unknown>): Promise<any> {
    const nameOrTitle = (body as any).name ?? (body as any).title;
    if (typeof nameOrTitle !== "string" || nameOrTitle.trim() === "") {
      throw new Error("Book name/title is required");
    }

    const payload: Record<string, unknown> = { ...body };

    if ((payload as any).name === undefined && typeof (payload as any).title === "string") {
      (payload as any).name = (payload as any).title;
      delete (payload as any).title;
    }

    const db = await getDb();
    const col = db.collection("books");
    const result = await col.insertOne(payload);

    this.setStatus(201);
    return { ...payload, _id: result.insertedId, id: result.insertedId.toString() };
  }

  @Put("{id}")
  public async updateBook(
    @Path() id: string,
    @Body() updatesUnknown: Record<string, unknown>
  ): Promise<any> {
    if (!ObjectId.isValid(id)) throw new Error("Invalid book id");

    const updates: Record<string, unknown> = { ...updatesUnknown };
    if ("_id" in updates) delete (updates as any)._id;

    if ((updates as any).name === undefined && typeof (updates as any).title === "string") {
      (updates as any).name = (updates as any).title;
      delete (updates as any).title;
    }

    const db = await getDb();
    const col = db.collection("books");
    const _id = new ObjectId(id);

    const result = await col.updateOne({ _id }, { $set: updates });
    if (result.matchedCount === 0) throw new Error("Book not found");

    const updated = await col.findOne({ _id });
    return { ...(updated as any), id };
  }

  @Delete("{id}")
  public async deleteBook(@Path() id: string): Promise<{ deleted: boolean }> {
    if (!ObjectId.isValid(id)) throw new Error("Invalid book id");

    const db = await getDb();
    const col = db.collection("books");
    const result = await col.deleteOne({ _id: new ObjectId(id) });

    return { deleted: result.deletedCount === 1 };
  }
}