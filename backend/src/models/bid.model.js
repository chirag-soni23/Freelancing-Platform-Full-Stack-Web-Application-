import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Bid = sequelize.define(
  "Bid",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    currency: {
      type: DataTypes.ENUM("INR", "USD"),

      allowNull: false,

      defaultValue: "INR",
    },

    proposal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    deliveryDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "withdrawn"),
      allowNull: false,
      defaultValue: "pending",
    },

    freelancerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "jobs",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },

  {
    tableName: "bids",

    timestamps: true,

    indexes: [
      {
        unique: true,

        fields: ["freelancerId", "jobId"],
      },
    ],
  },
);

export default Bid;
