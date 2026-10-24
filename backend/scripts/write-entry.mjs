// tsc keeps the repo layout (the server imports shared level data from ../frontend/src/data), so the compiled
// server lands in dist/backend/index.js. This writes dist/index.js, so `node dist/index.js` works as usual.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";

if (!existsSync("dist/backend/index.js")) {
  console.error("dist/backend/index.js is missing: did tsc fail?");
  process.exit(1);
}
mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.js", 'require("./backend/index.js");\n');
console.log("wrote dist/index.js");
