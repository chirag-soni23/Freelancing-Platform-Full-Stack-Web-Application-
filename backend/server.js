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

import db from "./src/models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // JOIN USER
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;

    console.log("Online Users:", onlineUsers);
  });

  // SEND MESSAGE
  socket.on("sendMessage", async (data) => {
    try {
      console.log("MESSAGE EVENT:", data);

      // SAVE MESSAGE IN DB
      const message = await db.Message.create({
        conversationId: data.conversationId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.message,
        isRead: false,
      });

      const receiverSocketId = onlineUsers[data.receiverId];

      console.log("Receiver Socket:", receiverSocketId);

      // REALTIME MESSAGE
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);

        // UNREAD NOTIFICATION
        io.to(receiverSocketId).emit("newMessageNotification", {
          senderId: data.senderId,
          message: data.message,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  // TYPING EVENT
  socket.on("typing", (data) => {
    const receiverSocketId = onlineUsers[data.receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        senderId: data.senderId,
        message: "Typing...",
      });
    }
  });

  // MARK AS READ
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

      // REALTIME SEEN EVENT
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

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }

    console.log("Online Users:", onlineUsers);
  });
});

// MIDDLEWARES
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
app.use("/api/category", isAuth, categoryRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/chat", isAuth, chatRoutes);

// error handler
app.use(errorHandler);


server.listen(PORT, async () => {
  console.log(`Server Listening on port no. ${PORT}`);

  await connectDB();
});
