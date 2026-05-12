import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "categories",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["name", "userId"],
      },
    ],
  },
);

export default Category;