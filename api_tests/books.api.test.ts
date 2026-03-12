import { beforeAll, afterAll, describe, test, expect } from "vitest";
import { BooksApi, Configuration } from "../client";
import { startServer } from "./run_server";

describe("Books API (generated client)", () => {
  let stop: (() => Promise<void>) | undefined;
  const basePath = "http://127.0.0.1:3001";

  beforeAll(async () => {
    stop = await startServer(basePath);
  }, 60000);

  afterAll(async () => {
    if (stop) await stop();
  });

  test("create -> get -> list -> delete", async () => {
    const api = new BooksApi(new Configuration({ basePath }));

    const created = await api.createBook({
      requestBody: {
        name: "Test Book",
        author: "Tester",
        description: "Created in API test",
        price: 9.99,
        image: "test.png",
      },
    });

    // LOG FIRST so we can see what the server returned
    console.log("CREATED RESPONSE:", created);

    const rec = created as unknown as { id?: string; _id?: string };
    const id = rec.id ?? rec._id;

    expect(id).toBeTruthy();

    const fetched = await api.getBook({ id: String(id) });
    expect(fetched.name).toBe("Test Book");

    const list = await api.listBooks();
    expect(Array.isArray(list)).toBe(true);

    const del = await api.deleteBook({ id: String(id) });
    expect(del.deleted).toBe(true);
  });
});