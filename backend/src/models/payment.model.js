import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    stripeSessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    currency: {
      type: DataTypes.ENUM("INR", "USD"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },

    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
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

    bidId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "bids",
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
    tableName: "payments",
    timestamps: true,
  },
);

export default Payment;
