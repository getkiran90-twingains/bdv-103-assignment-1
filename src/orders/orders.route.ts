import { Body, Get, Path, Post, Route, Tags } from "tsoa";
import { warehouse } from "../warehouse/warehouse";
import type { OrderId, CreateOrderRequest, FulfilOrderRequest, OrderSummary } from "../api/types";

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