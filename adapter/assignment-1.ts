export interface Book {
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

async function listBooks(
  _filters?: Array<{ from?: number; to?: number }>
): Promise<Book[]> {
  return [];
}

const assignment = "assignment-1";

export default {
  assignment,
  listBooks,
};
