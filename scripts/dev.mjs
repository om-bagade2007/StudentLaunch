import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

for (const file of [".env.development.local", ".env.vercel.local", ".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

// In dev the frontend talks to the local backend through Vite's /api proxy.
process.env.VITE_API_URL = "";

for (const dir of ["frontend", "backend"]) {
  if (!existsSync(`${dir}/node_modules`)) {
    spawnSync("npm", ["ci", "--prefix", dir], { stdio: "inherit" });
  }
}

const children = [
  spawn("node", ["server.js"], {
    cwd: "backend",
    stdio: "inherit",
    env: { ...process.env, PORT: "8080" },
  }),
  spawn("npm", ["run", "dev", "--", "--host", "0.0.0.0"], {
    cwd: "frontend",
    stdio: "inherit",
    env: process.env,
  }),
];

const shutdown = () => children.forEach((child) => child.kill());
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
children.forEach((child) =>
  child.on("exit", (code) => {
    shutdown();
    process.exit(code ?? 0);
  })
);
