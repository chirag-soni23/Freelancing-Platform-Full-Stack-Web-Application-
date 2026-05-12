import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./src/middlewares/error.middleware.js";
import { connectDB } from "./src/db/db.js";
import { isAuth } from "./src/middlewares/auth.middleware.js";
import authRoutes from "./src/routes/auth.route.js";
import categoryRoutes from "./src/routes/category.route.js";
import jobRoutes from "./src/routes/job.route.js";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    maxAge: 86400,
  })
);
// routes
app.use("/api/auth", authRoutes);
app.use("/api/category", isAuth, categoryRoutes);
app.use("/api/job",jobRoutes);

// error middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Listening on port no. ${PORT}`);
  connectDB();
});
