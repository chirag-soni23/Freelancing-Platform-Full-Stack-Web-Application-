import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { sendEmail } from "../utils/mailer.js";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("📥 Job received:", job.data);

    const { to, subject, text, html } = job.data;

    await sendEmail({ to, subject, text,html });

    console.log(" Email sent:", to);
  },
  {
    connection,
    lockDuration: 120000,
    concurrency: 1,
  },
);

worker.on("failed", (job, err) => {
  console.log(" Email failed:", err.message);
});
