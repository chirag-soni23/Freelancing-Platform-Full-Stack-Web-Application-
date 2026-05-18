import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const SavedJob = sequelize.define(
  "SavedJob",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    freelancerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "saved_jobs",
    timestamps: true,
  },
);

export default SavedJob;

