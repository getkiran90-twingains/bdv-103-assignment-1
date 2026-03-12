import { Body, Get, Path, Post, Route, Tags } from "tsoa";
import { warehouse } from "./warehouse";
import type { BookID, ShelfId, ShelfStock, PlaceBooksRequest } from "../api/types";

@Route("warehouse")
@Tags("Warehouse")
export class WarehouseController {
  @Post("shelves/{shelf}/books/{bookId}")
  public async placeBooksOnShelf(
    @Path() shelf: ShelfId,
    @Path() bookId: BookID,
    @Body() body: PlaceBooksRequest
  ): Promise<{ ok: true }> {
    if (!body || typeof body.numberOfBooks !== "number" || body.numberOfBooks <= 0) {
      throw new Error("numberOfBooks must be a positive number");
    }

    warehouse.placeBooksOnShelf(bookId, body.numberOfBooks, shelf);
    return { ok: true };
  }

  @Get("books/{bookId}")
  public async findBookOnShelf(@Path() bookId: BookID): Promise<ShelfStock[]> {
    return warehouse.findBookOnShelf(bookId);
  }
}