export type DomainEvent =
  | { type: "BookAdded"; bookId: string; name: string }
  | { type: "BookDeleted"; bookId: string }
  | { type: "BookStocked"; bookId: string; totalStock: number }
  | { type: "OrderPlaced"; orderId: string; books: Record<string, number> }
  | { type: "OrderFulfilled"; orderId: string };