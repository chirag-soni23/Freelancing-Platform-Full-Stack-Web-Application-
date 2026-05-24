import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    jobId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("job", "chat", "bid"),
      defaultValue: "job",
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },

  {
    tableName: "notifications",
    timestamps: true,
  },
);

export default Notification;
