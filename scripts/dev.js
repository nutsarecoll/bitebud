import { spawn } from "node:child_process";

const children = [
  spawn("node", ["server/index.js"], {
    stdio: "inherit",
    env: { ...process.env, BITEBUD_SERVER_PORT: process.env.BITEBUD_SERVER_PORT || "8787" }
  }),
  spawn("npx", ["vite", "--host", "0.0.0.0"], {
    stdio: "inherit",
    env: process.env
  })
];

function stopAll(signal) {
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

process.on("SIGINT", () => {
  stopAll("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopAll("SIGTERM");
  process.exit(0);
});

for (const child of children) {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      stopAll("SIGTERM");
      process.exit(code);
    }
  });
}
