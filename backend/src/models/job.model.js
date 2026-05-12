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
