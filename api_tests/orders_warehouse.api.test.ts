import { beforeAll, afterAll, describe, test, expect } from "vitest";
import { WarehouseApi, OrdersApi, Configuration } from "../client";
import { startServer } from "./run_server";

describe("Warehouse + Orders API (generated client)", () => {
  let stop: (() => Promise<void>) | undefined;
  const basePath = "http://127.0.0.1:3001";

  beforeAll(async () => {
    stop = await startServer(basePath);
  }, 60000);

  afterAll(async () => {
    if (stop) await stop();
  });

  test("place stock -> order -> fulfil -> stock reduces -> list orders", async () => {
    const config = new Configuration({ basePath });
    const warehouseApi = new WarehouseApi(config);
    const ordersApi = new OrdersApi(config);

    const bookId = `book-${Date.now()}`;
    const shelf = "shelf-A";

    // 1) Place stock: 5 copies on shelf-A
    const placed = await warehouseApi.placeBooksOnShelf({
  shelf,
  bookId,
  placeBooksRequest: { numberOfBooks: 5 },
});

expect((placed as unknown as { ok?: boolean }).ok).toBe(true);
    // 2) Verify stock is 5
    const before = await warehouseApi.findBookOnShelf({ bookId });
    const beforeCount =
      before.find((x) => x.shelf === shelf)?.count ?? 0;
    expect(beforeCount).toBe(5);

    // 3) Create order for 2 copies
    const orderRes = await ordersApi.orderBooks({
      createOrderRequest: { order: [bookId, bookId] },
    });
    expect(orderRes.orderId).toBeTruthy();

    // 4) Fulfil from shelf-A
    const fulfilRes = await ordersApi.fulfilOrder({
  orderId: orderRes.orderId,
  fulfilOrderRequest: {
    booksFulfilled: [{ book: bookId, shelf, numberOfBooks: 2 }],
  },
});

expect((fulfilRes as unknown as { ok?: boolean }).ok).toBe(true);

    // 5) Verify stock reduced to 3
    const after = await warehouseApi.findBookOnShelf({ bookId });
    const afterCount =
      after.find((x) => x.shelf === shelf)?.count ?? 0;
    expect(afterCount).toBe(3);

    // 6) Verify orders list includes this order id
    const orders = await ordersApi.listOrders();
    expect(orders.some((o) => o.orderId === orderRes.orderId)).toBe(true);
  });
});