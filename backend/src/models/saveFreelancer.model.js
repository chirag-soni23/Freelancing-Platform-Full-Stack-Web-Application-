import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const SavedFreelancer = sequelize.define(
  "SavedFreelancer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    freelancerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "saved_freelancers",
    timestamps: true,
  },
);

export default SavedFreelancer;