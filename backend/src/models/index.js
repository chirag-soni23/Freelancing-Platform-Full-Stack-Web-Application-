import connection from "../db/db.js";
import User from "./auth.model.js";

const db = {
  connection,
  User,
};

export default db;
