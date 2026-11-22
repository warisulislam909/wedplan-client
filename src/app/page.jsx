import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { webhook } from "./controllers/payment.controller.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";

const app = express();

const allowed = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""));

const corsOptions = {
  origin: (origin, cb) =>
    !origin || allowed.includes(origin) ? cb(null, true) : cb(null, false),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Stripe webhook: raw body দরকার, তাই express.json() এর আগে
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), async (req, res, next) => {
  try { await connectDB(); return webhook(req, res); } catch (e) { next(e); }
});

app.use(express.json({ limit: "1mb" }));

// Serverless (Vercel) এ প্রতি request এ DB connection নিশ্চিত করা হয় (cached)
app.use(async (_req, _res, next) => {
  try { await connectDB(); next(); } catch (e) { next(e); }
});
app.get("/", (_req, res) => res.json({ message: "WedPlan API is running" }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
