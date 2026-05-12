import connection from "../db/db.js";
import User from "./auth.model.js";
import Category from "./category.model.js";
import Job from "./job.model.js";

const db = {
  connection,
  User,
  Category,
  Job,
};

db.User.hasMany(db.Category, {
  foreignKey: "userId",
  as: "categories",
  onDelete: "CASCADE",
});

db.Category.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

db.User.hasMany(db.Job, {
  foreignKey: "clientId",
  as: "jobs",
});

db.Job.belongsTo(db.User, {
  foreignKey: "clientId",
  as: "client",
});
// db.Job.hasMany(db.Bid, { foreignKey: "jobId" });
// db.Bid.belongsTo(db.Job, { foreignKey: "jobId" });

// db.User.hasMany(db.Bid, { foreignKey: "userId" });
// db.Bid.belongsTo(db.User, { foreignKey: "userId" });

export default db;
