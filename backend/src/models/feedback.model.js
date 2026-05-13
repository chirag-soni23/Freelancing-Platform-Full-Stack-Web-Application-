import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import User from "./auth.model.js";

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "users",
        key: "id",
      },

      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "users",
        key: "id",
      },

      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        min: 1,
        max: 5,
      },
    },

    comment: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "feedbacks",
    timestamps: true,
  },
);

export default Feedback;
