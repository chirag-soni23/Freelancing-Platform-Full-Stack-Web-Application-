import connection from "../db/db.js";
import User from "./auth.model.js";
import Category from "./category.model.js";
import Contact from "./contact.model.js";
import Conversation from "./conversation.model.js";
import Feedback from "./feedback.model.js";
import Job from "./job.model.js";
import Message from "./message.model.js";

const db = {
  connection,
  User,
  Category,
  Job,
  Conversation,
  Message,
  Contact,
  Feedback,
};

db.User.hasMany(db.Category, {
  foreignKey: "userId",
  as: "categories",
  onDelete: "CASCADE",
});

// db.Category.belongsTo(db.User, {
//   foreignKey: "userId",
//   as: "user",
// });

db.User.hasMany(db.Job, {
  foreignKey: "clientId",
  as: "jobs",
});

db.Job.belongsTo(db.User, {
  foreignKey: "clientId",
  as: "client",
});

db.Category.hasMany(db.Job, {
  foreignKey: "categoryId",
  as: "jobs",
});

db.Job.belongsTo(db.Category, {
  foreignKey: "categoryId",
  as: "category",
});

// conversation
db.Conversation.hasMany(db.Message, {
  foreignKey: "conversationId",
  as: "messages",
});

db.Message.belongsTo(db.Conversation, {
  foreignKey: "conversationId",
});

db.User.hasMany(db.Conversation, {
  foreignKey: "senderId",
  as: "sentConversations",
});

db.User.hasMany(db.Conversation, {
  foreignKey: "receiverId",
  as: "receivedConversations",
});

db.Conversation.belongsTo(db.User, {
  foreignKey: "senderId",
  as: "sender",
});

db.Conversation.belongsTo(db.User, {
  foreignKey: "receiverId",
  as: "receiver",
});

// feedback
db.User.hasMany(db.Feedback, {
  foreignKey: "senderId",
  as: "givenFeedbacks",
  onDelete: "CASCADE",
});

db.User.hasMany(db.Feedback, {
  foreignKey: "receiverId",
  as: "receivedFeedbacks",
  onDelete: "CASCADE",
});

db.Feedback.belongsTo(db.User, {
  foreignKey: "senderId",
  as: "sender",
});

db.Feedback.belongsTo(db.User, {
  foreignKey: "receiverId",
  as: "receiver",
});

// db.Job.hasMany(db.Bid, { foreignKey: "jobId" });
// db.Bid.belongsTo(db.Job, { foreignKey: "jobId" });

// db.User.hasMany(db.Bid, { foreignKey: "userId" });
// db.Bid.belongsTo(db.User, { foreignKey: "userId" });

export default db;
