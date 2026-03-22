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

export interface PlaceBooksRequest {
  numberOfBooks: number;
}

export interface ShelfStock {
  shelf: ShelfId;
  count: number;
}