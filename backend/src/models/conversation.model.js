import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
  },
);

export default Conversation;