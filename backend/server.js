import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./src/middlewares/error.middleware.js";
import authRoutes from "./src/routes/auth.route.js";
import { connectDB } from "./src/db/db.js";

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
  }),
);

// routes
app.use("/api/auth", authRoutes);

// error middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Listening on port no. ${PORT}`);
  connectDB();
});
