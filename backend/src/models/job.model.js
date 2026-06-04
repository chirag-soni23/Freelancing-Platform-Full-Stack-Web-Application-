import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    currency: {
      type: DataTypes.ENUM("INR", "USD"),
      allowNull: false,
      defaultValue: "INR",
    },

    level: {
      type: DataTypes.ENUM("Entry", "Intermediate", "Expert"),
      allowNull: false,
      defaultValue: "Entry",
    },

    employment: {
      type: DataTypes.ENUM("Contract", "Full-time", "Part-time"),
      allowNull: false,
      defaultValue: "Contract",
    },

    jobType: {
      type: DataTypes.ENUM("Remote", "On-site", "Hybrid"),
      allowNull: false,
      defaultValue: "Remote",
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    bidCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    avgBid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    projectStatus: {
      type: DataTypes.ENUM("in_progress", "submitted", "completed"),
      allowNull: false,
      defaultValue: "in_progress",
    },

    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid"),
      allowNull: false,
      defaultValue: "pending",
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    competition: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "low",
    },

    status: {
      type: DataTypes.ENUM("open", "closed"),
      defaultValue: "open",
    },

    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  },
);

export default Job;
