import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Submission = sequelize.define(
  "Submission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    submissionUrl: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    tableName: "submissions",
    timestamps: true,
  },
);

export default Submission;
