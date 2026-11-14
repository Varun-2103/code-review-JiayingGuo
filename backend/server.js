import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { fileURLToPath } from "node:url";
import { connectDB, getClient } from "./db/connection.js";
import { createIndexes } from "./db/indexes.js";
import passport from "./auth/passport.js";
import authRouter from "./routes/authRouter.js";
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
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const DIST_DIR = fileURLToPath(new URL("../frontend/dist", import.meta.url));
const INDEX_HTML = fileURLToPath(
  new URL("../frontend/dist/index.html", import.meta.url),
);

const db = await connectDB();
await createIndexes();

const app = express();
// Render sits behind an HTTPS proxy. Trusting it lets secure cookies work.
if (IS_PRODUCTION) app.set("trust proxy", 1);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // dbName is needed because MONGO_URI has no database name in it.
    store: MongoStore.create({ client: getClient(), dbName: db.databaseName }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: IS_PRODUCTION,
      maxAge: SEVEN_DAYS,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);

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
