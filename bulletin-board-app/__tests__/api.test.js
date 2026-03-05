const request = require("supertest");
const { spawn } = require("node:child_process");

// These tests are intentionally small and focused. We reload ../server for
// some cases to execute different code paths in server.js.

describe("API routes", () => {
  test("GET /api/events returns 200 (Simple-Test Pattern)", async () => {
    const app = require("../server");
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
  });

  test("POST /api/events creates an event (Code-Path Pattern)", async () => {
    const app = require("../server");
    const newEvent = { title: "Unit Test Event", detail: "detail", date: "2026-02-03" };
    const res = await request(app).post("/api/events").send(newEvent);
    expect([200, 201, 204]).toContain(res.status);
  });

  test("DELETE /api/events/:id is reachable (Simple-Test Pattern)", async () => {
    const app = require("../server");
    const res = await request(app).delete("/api/events/0");
    expect([200, 204, 404]).toContain(res.status);
  });

  test("server.js runs development branch when NODE_ENV=development (Code-Path Pattern)", async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    jest.resetModules();
    const app = require("../server");

    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);

    process.env.NODE_ENV = prev;
  });

  test("server.js runs production branch when NODE_ENV=production (Code-Path Pattern)", async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    jest.resetModules();
    const app = require("../server");

    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);

    process.env.NODE_ENV = prev;
  });

  test("server.js starts when executed directly (covers require.main branch)", async () => {
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["server.js"], {
        cwd: process.cwd(),
        env: { ...process.env, PORT: "0" },
        stdio: ["ignore", "pipe", "pipe"],
      });

      let out = "";
      let err = "";
      let finished = false;

      const timeout = setTimeout(() => {
        if (finished) return;
        finished = true;
        child.kill();
        reject(new Error(`Timed out waiting for server.js to start. stderr: ${err}`));
      }, 3000);

      child.stdout.on("data", (buf) => {
        out += buf.toString();
        if (out.includes("Magic happens on port")) {
          // Stop the server and resolve once the process actually exits.
          child.kill();
        }
      });

      child.stderr.on("data", (buf) => {
        err += buf.toString();
      });

      child.on("error", (e) => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        reject(e);
      });

      child.on("exit", () => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        if (out.includes("Magic happens on port")) {
          resolve();
        } else {
          reject(new Error(`server.js exited without starting. stderr: ${err}`));
        }
      });
    });
  });
});
