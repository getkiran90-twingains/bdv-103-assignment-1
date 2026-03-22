export type DomainEvent =
  | {
      type: "BookAdded";
      bookId: string;
      name: string;
    }
  | {
      type: "BookStocked";
      bookId: string;
      totalStock: number;
    };