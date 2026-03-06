import { beforeAll, afterAll, describe, test, expect } from "vitest";
import { DefaultApi, Configuration } from "../client";
import { startServer } from "./run_server";

describe("Hello API (generated client)", () => {
  let stop: (() => Promise<void>) | undefined;

beforeAll(async () => {
  stop = await startServer();
}, 60000); // 60 seconds

afterAll(async () => {
  if (stop) await stop();
});

  test("GET /hello/{name} returns greeting", async () => {
   const api = new DefaultApi(
  new Configuration({ basePath: "http://127.0.0.1:3001" })
);

    const result = await api.sayHello({ name: "Kiran" });
    expect(result).toContain("Hello");
  });
});