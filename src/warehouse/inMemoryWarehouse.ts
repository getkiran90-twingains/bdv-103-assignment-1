export type BookID = string;
export type ShelfId = string;
export type OrderId = string;

interface Order {
  orderId: OrderId;
  books: Record<BookID, number>;
}

export class InMemoryWarehouse {
  private shelves: Record<ShelfId, Record<BookID, number>> = {};
  private orders: Order[] = [];

  placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId) {
    if (!this.shelves[shelf]) {
      this.shelves[shelf] = {};
    }

    const current = this.shelves[shelf][bookId] ?? 0;
    this.shelves[shelf][bookId] = current + numberOfBooks;
  }

  findBookOnShelf(bookId: BookID) {
    return Object.entries(this.shelves)
      .filter(([_, books]) => books[bookId] > 0)
      .map(([shelf, books]) => ({
        shelf,
        count: books[bookId]
      }));
  }

  orderBooks(bookIds: BookID[]): { orderId: OrderId } {
    const orderId = crypto.randomUUID();

    const bookCounts: Record<BookID, number> = {};

    for (const id of bookIds) {
      bookCounts[id] = (bookCounts[id] ?? 0) + 1;
    }

    this.orders.push({ orderId, books: bookCounts });

    return { orderId };
  }
  getTotalStock(bookId: BookID): number {
  return Object.values(this.shelves).reduce((sum, shelfBooks) => {
    return sum + (shelfBooks[bookId] ?? 0);
  }, 0);
}
  fulfilOrder(
  orderId: OrderId,
  booksFulfilled: Array<{ book: BookID; shelf: ShelfId; numberOfBooks: number }>
) {
  const order = this.orders.find(o => o.orderId === orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  for (const item of booksFulfilled) {
    const { book, shelf, numberOfBooks } = item;

    if (!this.shelves[shelf] || !this.shelves[shelf][book]) {
      throw new Error("Book not found on shelf");
    }

    if (this.shelves[shelf][book] < numberOfBooks) {
      throw new Error("Not enough stock");
    }

    this.shelves[shelf][book] -= numberOfBooks;

    if (this.shelves[shelf][book] === 0) {
      delete this.shelves[shelf][book];
    }
  }
}

  listOrders() {
    return this.orders;
  }
}