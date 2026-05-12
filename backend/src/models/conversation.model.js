import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userOneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userTwoId: {
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