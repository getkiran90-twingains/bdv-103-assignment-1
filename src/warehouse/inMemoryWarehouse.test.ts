import { describe, test, expect } from "vitest";
import { InMemoryWarehouse } from "./inMemoryWarehouse";

describe("InMemoryWarehouse", () => {
  test("can place books on shelf and find them", () => {
    const warehouse = new InMemoryWarehouse();

    warehouse.placeBooksOnShelf("book1", 5, "shelf-A");

    const result = warehouse.findBookOnShelf("book1");

    expect(result).toEqual([
      { shelf: "shelf-A", count: 5 }
    ]);
  });

  test("can create an order", () => {
    const warehouse = new InMemoryWarehouse();

    warehouse.orderBooks(["book1", "book1", "book2"]);

    const orders = warehouse.listOrders();

    expect(orders[0].books).toEqual({
      book1: 2,
      book2: 1
    });
  });
  test("can fulfil an order and reduce stock", () => {
  const warehouse = new InMemoryWarehouse();

  warehouse.placeBooksOnShelf("book1", 5, "shelf-A");

  const { orderId } = warehouse.orderBooks(["book1", "book1"]);

  warehouse.fulfilOrder(orderId, [
    { book: "book1", shelf: "shelf-A", numberOfBooks: 2 }
  ]);

  const result = warehouse.findBookOnShelf("book1");

  expect(result).toEqual([
    { shelf: "shelf-A", count: 3 }
  ]);
});
test("cannot fulfil order if not enough stock", () => {
  const warehouse = new InMemoryWarehouse();

  warehouse.placeBooksOnShelf("book1", 1, "shelf-A");

  const { orderId } = warehouse.orderBooks(["book1", "book1"]);

  expect(() =>
    warehouse.fulfilOrder(orderId, [
      { book: "book1", shelf: "shelf-A", numberOfBooks: 2 }
    ])
  ).toThrow("Not enough stock");
});
});