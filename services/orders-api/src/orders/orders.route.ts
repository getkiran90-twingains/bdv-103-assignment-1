import { Body, Get, Path, Post, Route, Tags } from "tsoa";
import crypto from "crypto";
import { findOrdersBookCache } from "./bookCache";

export type BookID = string;
export type OrderId = string;
export type ShelfId = string;

export interface CreateOrderRequest {
  order: BookID[];
}

export interface FulfilOrderRequest {
  booksFulfilled: Array<{
    book: BookID;
    shelf: ShelfId;
    numberOfBooks: number;
  }>;
}

export interface OrderSummary {
  orderId: OrderId;
  books: Record<BookID, number>;
}

const orders: OrderSummary[] = [];

@Route("orders")
@Tags("Orders")
export class OrdersController {
  @Post()
  public async orderBooks(@Body() body: CreateOrderRequest): Promise<{ orderId: OrderId }> {
    if (!body || !Array.isArray(body.order) || !body.order.every((x) => typeof x === "string")) {
      throw new Error("order must be an array of book IDs");
    }

    for (const bookId of body.order) {
      const cachedBook = await findOrdersBookCache(bookId);

      if (!cachedBook) {
        throw new Error(`Invalid book ID: ${bookId}`);
      }
    }

    const counts: Record<string, number> = {};

    for (const bookId of body.order) {
      counts[bookId] = (counts[bookId] ?? 0) + 1;
    }

    const orderId = crypto.randomUUID();
    orders.push({
      orderId,
      books: counts,
    });

    return { orderId };
  }

  @Post("{orderId}/fulfil")
  public async fulfilOrder(
    @Path() orderId: OrderId,
    @Body() body: FulfilOrderRequest
  ): Promise<{ ok: true }> {
    if (!body || !Array.isArray(body.booksFulfilled)) {
      throw new Error("booksFulfilled must be an array");
    }

    const order = orders.find((o) => o.orderId === orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    return { ok: true };
  }

  @Get()
  public async listOrders(): Promise<OrderSummary[]> {
    return orders;
  }
}