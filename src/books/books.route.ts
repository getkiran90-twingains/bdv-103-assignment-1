import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Tags,
  SuccessResponse,
} from "tsoa";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import { warehouse } from "../warehouse/warehouse";

export interface Book {
  id?: string;
  name?: string;
  author?: string;
  description?: string;
  price?: number;
  image?: string;
  stock?: number;
}

@Route("books")
@Tags("Books")
export class BooksController extends Controller {
  @Get()
  public async listBooks(): Promise<Book[]> {
    const db = await getDb();
    const col = db.collection("books");
    const docs = await col.find({}).toArray();

    return docs.map((b) => {
      const rec = b as Record<string, unknown>;
      const id = (rec["_id"] ?? rec["id"])?.toString();
      return { ...(rec as unknown as Book), id };
    });
  }

  @Get("{id}")
  public async getBook(@Path() id: string): Promise<Book> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid book id");
    }

    const db = await getDb();
    const col = db.collection("books");
    const book = await col.findOne({ _id: new ObjectId(id) });

    if (!book) {
      throw new Error("Book not found");
    }

    const rec = book as Record<string, unknown>;
    const stock = warehouse.getTotalStock(id);

    return {
      ...(rec as unknown as Book),
      id,
      stock,
    };
  }

  @Post()
  @SuccessResponse("201", "Created")
  public async createBook(@Body() body: Record<string, unknown>): Promise<Book> {
    const nameOrTitle = body.name ?? body.title;

    if (typeof nameOrTitle !== "string" || nameOrTitle.trim() === "") {
      throw new Error("Book name/title is required");
    }

    const payload: Record<string, unknown> = { ...body };

    if (payload.name === undefined && typeof payload.title === "string") {
      payload.name = payload.title;
      delete payload.title;
    }

    const db = await getDb();
    const col = db.collection("books");
    const result = await col.insertOne(payload);

    this.setStatus(201);
    return {
      ...(payload as unknown as Book),
      id: result.insertedId.toString(),
    };
  }

  @Put("{id}")
  public async updateBook(
    @Path() id: string,
    @Body() updatesUnknown: Record<string, unknown>
  ): Promise<Book> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid book id");
    }

    const updates: Record<string, unknown> = { ...updatesUnknown };

    if ("_id" in updates) {
      delete updates._id;
    }

    if (updates.name === undefined && typeof updates.title === "string") {
      updates.name = updates.title;
      delete updates.title;
    }

    const db = await getDb();
    const col = db.collection("books");
    const _id = new ObjectId(id);

    const result = await col.updateOne({ _id }, { $set: updates });

    if (result.matchedCount === 0) {
      throw new Error("Book not found");
    }

    const updated = await col.findOne({ _id });
    const rec = (updated ?? {}) as Record<string, unknown>;

    return {
      ...(rec as unknown as Book),
      id,
    };
  }

  @Delete("{id}")
  public async deleteBook(@Path() id: string): Promise<{ deleted: boolean }> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid book id");
    }

    const db = await getDb();
    const col = db.collection("books");
    const result = await col.deleteOne({ _id: new ObjectId(id) });

    return { deleted: result.deletedCount === 1 };
  }
}