import { Body, Get, Path, Post, Route, Tags } from "tsoa";
import crypto from "crypto";

import type {
  OrderId,
  CreateOrderRequest,
  FulfilOrderRequest,
  OrderSummary
} from "../api/types";

const orders: OrderSummary[] = [];

@Route("orders")
@Tags("Orders")
export class OrdersController {
  @Post()
  public async orderBooks(@Body() body: CreateOrderRequest): Promise<{ orderId: OrderId }> {
    if (
      !body ||
      !Array.isArray(body.order) ||
      !body.order.every((x: unknown) => typeof x === "string")
    ) {
      throw new Error("order must be an array of book IDs");
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