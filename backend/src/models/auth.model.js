import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("client", "freelancer", "admin"),
      allowNull: false,
      defaultValue: "freelancer",
    },

    profilePic: {
      type: DataTypes.STRING,
    },

    address: {
      type: DataTypes.STRING,
    },

    title: {
      type: DataTypes.STRING,
    },

    bio: {
      type: DataTypes.TEXT,
    },

    skills: {
      type: DataTypes.JSON,
    },

    hourlyRate: {
      type: DataTypes.FLOAT,
    },

    portfolio: {
      type: DataTypes.STRING,
    },

    companyName: {
      type: DataTypes.STRING,
    },

    companyWebsite: {
      type: DataTypes.STRING,
    },

    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    emailVerificationToken: {
      type: DataTypes.STRING,
    },

    emailVerificationExpire: {
      type: DataTypes.DATE,
    },

    resetPasswordToken: {
      type: DataTypes.STRING,
    },

    resetPasswordExpire: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

export default User;
