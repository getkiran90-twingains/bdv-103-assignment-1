export type BookID = string;
export type ShelfId = string;

export interface PlaceBooksRequest {
  numberOfBooks: number;
}

export interface ShelfStock {
  shelf: ShelfId;
  count: number;
}
