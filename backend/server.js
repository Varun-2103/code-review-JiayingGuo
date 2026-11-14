import "dotenv/config";
import express from "express";
import { fileURLToPath } from "node:url";
import { connectDB } from "./db/connection.js";
import { createIndexes } from "./db/indexes.js";
import errorHandler from "./middleware/errorHandler.js";

for (const name of ["MONGO_URI", "SESSION_SECRET"]) {
  if (!process.env[name]) {
    console.error(
      `${name} is not set. Copy .env.example to .env and fill it in.`,
    );
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;
const DIST_DIR = fileURLToPath(new URL("../frontend/dist", import.meta.url));
const INDEX_HTML = fileURLToPath(
  new URL("../frontend/dist/index.html", import.meta.url),
);

await connectDB();
await createIndexes();

const app = express();
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
app.use(express.json());

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(express.static(DIST_DIR));
app.get("/{*splat}", (req, res, next) => {
  res.sendFile(INDEX_HTML, (err) => {
    if (err) next(err);
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SubletBoard running at http://localhost:${PORT}`);
});
