export type BookID = string;
export type ShelfId = string;
export type OrderId = string;

export interface ShelfStock {
  shelf: ShelfId;
  count: number;
}

export interface PlaceBooksRequest {
  numberOfBooks: number;
}

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