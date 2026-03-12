import { spawn } from "node:child_process";

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function waitForReady(baseUrl: string, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${baseUrl}/openapi.json`);
      if (res.ok) return;
    } catch {
      // server not ready yet
    }
    await sleep(500);
  }
  throw new Error(`Server did not become ready within ${timeoutMs}ms`);
}

export async function startServer(baseUrl = "http://127.0.0.1:3001") {
const child = spawn("npm", ["run", "start-server:fast"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env },
  detached: true,
});

  await waitForReady(baseUrl);

  return async () => {
    // Kill server and wait for it to exit
  if (child.pid) process.kill(-child.pid, "SIGTERM");

    await new Promise<void>((resolve) => {
      const t = setTimeout(() => resolve(), 5000);
      child.once("exit", () => {
        clearTimeout(t);
        resolve();
      });
    });
  };
}