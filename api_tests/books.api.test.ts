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

    // 1) Create
    const created: any = await api.createBook({
      requestBody: {
        name: "Test Book",
        author: "Tester",
        description: "Created in API test",
        price: 9.99,
        image: "test.png",
      },
    });

    const id = created.id ?? created._id;
    expect(id).toBeTruthy();

    // 2) Get by ID
    const fetched = await api.getBook({ id: String(id) });
    expect(fetched.name).toBe("Test Book");

    // 3) List
    const list = await api.listBooks();
    expect(Array.isArray(list)).toBe(true);

    // 4) Delete
    const del = await api.deleteBook({ id: String(id) });
    expect(del.deleted).toBe(true);
  });
});