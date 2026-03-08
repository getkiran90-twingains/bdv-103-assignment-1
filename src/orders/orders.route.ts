import { Body, Get, Path, Post, Route, Tags } from "tsoa";
import { warehouse } from "../warehouse/warehouse";
import type { BookID, OrderId, CreateOrderRequest, FulfilOrderRequest, OrderSummary } from "../api/types";

export type BookID = string;
export type OrderId = string;
export type ShelfId = string;

export interface CreateOrderRequest {
  order: BookID[];
}

export interface FulfilOrderRequest {
  booksFulfilled: Array<{ book: BookID; shelf: ShelfId; numberOfBooks: number }>;
}

export interface OrderSummary {
  orderId: OrderId;
  books: Record<BookID, number>;
}

@Route("orders")
@Tags("Orders")
export class OrdersController {
  /**
   * Create an order
   */
  @Post()
  public async orderBooks(@Body() body: CreateOrderRequest): Promise<{ orderId: OrderId }> {
    if (!body || !Array.isArray(body.order) || !body.order.every((x) => typeof x === "string")) {
      throw new Error("order must be an array of book IDs");
    }

    return warehouse.orderBooks(body.order);
  }

  /**
   * Fulfil an order
   */
  @Post("{orderId}/fulfil")
  public async fulfilOrder(
    @Path() orderId: OrderId,
    @Body() body: FulfilOrderRequest
  ): Promise<{ ok: true }> {
    if (!body || !Array.isArray(body.booksFulfilled)) {
      throw new Error("booksFulfilled must be an array");
    }

    warehouse.fulfilOrder(orderId, body.booksFulfilled);
    return { ok: true };
  }

  /**
   * List orders
   */
  @Get()
  public async listOrders(): Promise<OrderSummary[]> {
    return warehouse.listOrders();
  }
}