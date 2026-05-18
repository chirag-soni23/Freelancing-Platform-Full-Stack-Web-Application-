import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import errorHandler from "./src/middlewares/error.middleware.js";
import { connectDB } from "./src/db/db.js";
import { isAuth } from "./src/middlewares/auth.middleware.js";

import authRoutes from "./src/routes/auth.route.js";
import categoryRoutes from "./src/routes/category.route.js";
import jobRoutes from "./src/routes/job.route.js";
import chatRoutes from "./src/routes/chat.route.js";
import contactRoutes from "./src/routes/contact.route.js";
import feedbackRoutes from "./src/routes/feedback.route.js";
import dashboardRoutes from "./src/routes/dashboard.route.js";
import savedRoutes from "./src/routes/saved.route.js";

import db from "./src/models/index.js";
import { emailQueue } from "./src/queue/emailQueue.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// http server
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],

    credentials: true,
  },
});

const onlineUsers = {};

// socket connection
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // join user
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;

    console.log("Online Users:", onlineUsers);

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  // send message
  socket.on("sendMessage", async (data) => {
    try {
      const savedMessage = await db.Message.create({
        conversationId: data.conversationId,

        senderId: data.senderId,

        receiverId: data.receiverId,

        text: data.text,

        isRead: false,
      });

      // sender user
      const senderUser = await db.User.findByPk(data.senderId);

      // receiver user
      const receiverUser = await db.User.findByPk(data.receiverId);

      const receiverSocketId = onlineUsers[data.receiverId];

      const senderSocketId = onlineUsers[data.senderId];

      // RECEIVER REALTIME
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", savedMessage);
      }

      // SENDER REALTIME
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", savedMessage);
      }

      /* =========================
       OFFLINE EMAIL
    ========================= */

      if (!receiverSocketId && receiverUser?.email) {
        await emailQueue.add(
          "sendEmail",
          {
            to: receiverUser.email,

            subject: `New message from ${senderUser?.name}`,

            text: `
You received a new message from ${senderUser?.name}

Message:
${data.text}

Login to reply.
          `,
          },
          {
            attempts: 1,

            removeOnComplete: true,

            removeOnFail: true,
          },
        );

        console.log("Offline email sent to:", receiverUser.email);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  // typing event
  socket.on("typing", (data) => {
    const receiverSocketId = onlineUsers[data.receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        senderId: data.senderId,

        message: "Typing...",
      });
    }
  });

  // mark as read
  socket.on("markAsRead", async (data) => {
    try {
      await db.Message.update(
        {
          isRead: true,
        },
        {
          where: {
            conversationId: data.conversationId,

            receiverId: data.receiverId,

            isRead: false,
          },
        },
      );

      const senderSocketId = onlineUsers[data.senderId];

      // seen event
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", {
          conversationId: data.conversationId,

          seen: true,
        });
      }

      console.log("Messages marked as read");
    } catch (error) {
      console.log(error.message);
    }
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }

    console.log("Online Users:", onlineUsers);

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

// middlewared
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
  }),
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/chat", isAuth, chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", isAuth, feedbackRoutes);
app.use("/api/dashboard",isAuth,dashboardRoutes);
app.use("/api/saved",isAuth,savedRoutes);

// error handler
app.use(errorHandler);

// start server
server.listen(PORT, async () => {
  console.log(`Server Listening on port no. ${PORT}`);

  await connectDB();
});
