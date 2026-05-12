import { StatusCodes } from "../config/index.js";
import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import imagekit from "../utils/imageKit.js";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer.js";
import { Op, fn, col, where as sequelizeWhere } from "sequelize";
import { emailQueue } from "../queue/emailQueue.js";

// register client
export const registerClient = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      companyName,
      companyWebsite,
      address,
    } = req.body;

    const existEmail = await db.User.findOne({ where: { email } });
    if (existEmail) {
      throw ApiError.CONFLICT("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "client",
      companyName,
      companyWebsite,
      address,
    });

    await generateToken(user, res);

    return successResponse(res, StatusCodes.CREATED, {
      message: "Client registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// register freelancer
export const registerFreelancer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      title,
      bio,
      skills,
      languages,
      hourlyRate,
      currency,
      portfolio,
      address,
    } = req.body;

    const existEmail = await db.User.findOne({ where: { email } });

    if (existEmail) {
      throw ApiError.CONFLICT("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "freelancer",
      title,
      bio,
      skills,
      languages,
      hourlyRate,
      currency,
      portfolio,
      address,
    });

    await generateToken(user, res);

    return successResponse(res, StatusCodes.CREATED, {
      message: "Freelancer registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw ApiError.UNAUTHORIZED("Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw ApiError.UNAUTHORIZED("Invalid email or password");
    }

    await generateToken(user, res);

    return successResponse(res, 200, {
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// get me
export const getMe = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      throw ApiError.UNAUTHORIZED("User not authenticated");
    }

    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    const userData = user.toJSON();
    delete userData.password;

    let filteredUser = {};

    const role = userData.role?.toLowerCase();

    if (role === "client") {
      filteredUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        profilePic: userData.profilePic,
        address: userData.address,
        companyName: userData.companyName,
        companyWebsite: userData.companyWebsite,
        isEmailVerified: userData.isEmailVerified,
        createdAt: userData.createdAt,
      };
    } else if (role === "freelancer") {
      filteredUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        profilePic: userData.profilePic,
        address: userData.address,
        title: userData.title,
        bio: userData.bio,
        skills: userData.skills,
        languages: userData.languages,
        hourlyRate: userData.hourlyRate,
        currency: userData.currency,
        portfolio: userData.portfolio,
        isEmailVerified: userData.isEmailVerified,
        createdAt: userData.createdAt,
      };
    } else {
      filteredUser = userData;
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Profile fetched successfully",
      data: filteredUser,
    });
  } catch (error) {
    console.log("GET ME ERROR:", error.message);
    next(error);
  }
};

// logout
export const logout = (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Logout Successfully!",
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// update profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    const data = req.body;

    if (data.name !== undefined) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.email !== undefined) user.email = data.email;
    if (data.address !== undefined) user.address = data.address;
    if (data.profilePic !== undefined) user.profilePic = data.profilePic;

    if (user.role === "freelancer") {
      if (data.title !== undefined) user.title = data.title;
      if (data.bio !== undefined) user.bio = data.bio;
      if (data.skills !== undefined) user.skills = data.skills;
      if (data.languages !== undefined) user.languages = data.languages;
      if (data.hourlyRate !== undefined) user.hourlyRate = data.hourlyRate;
      if (data.currency !== undefined) user.currency = data.currency;
      if (data.portfolio !== undefined) user.portfolio = data.portfolio;
    }

    if (user.role === "client") {
      if (data.companyName !== undefined) user.companyName = data.companyName;
      if (data.companyWebsite !== undefined)
        user.companyWebsite = data.companyWebsite;
    }

    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    if (user.role === "client") {
      delete userData.title;
      delete userData.bio;
      delete userData.skills;
      delete userData.hourlyRate;
      delete userData.portfolio;
    }

    if (user.role === "freelancer") {
      delete userData.companyName;
      delete userData.companyWebsite;
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Profile updated successfully",
      data: userData,
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// upload profile pic
export const uploadProfilePic = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id);
    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    if (!req.file) {
      throw ApiError.BADREQUEST("Profile Image is required");
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `profile_${user.id}_${Date.now()}`,
      folder: "ProfilePics",
    });

    user.profilePic = result.url;
    await user.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Profile picture uploaded successfully",
      data: {
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// update pofile pic
export const updateProfilePic = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    if (!req.file) {
      throw ApiError.BADREQUEST("Profile image is required");
    }

    if (user.profilePic) {
      const fileId = user.profilePic.split("/").pop().split(".")[0];

      try {
        await imagekit.deleteFile(fileId);
      } catch (err) {
        console.log("Old image delete failed:", err.message);
      }
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `profile_${user.id}_${Date.now()}`,
      folder: "/profilePics",
    });

    user.profilePic = result.url;
    await user.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Profile picture updated successfully",
      data: {
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      throw ApiError.BADREQUEST(
        "New password and confirm password do not match",
      );
    }

    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw ApiError.BADREQUEST("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw ApiError.NOTFOUND("User not found with this email");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await emailQueue.add(
      "sendEmail",
      {
        to: user.email,
        subject: "Reset Password",
        text: `Click to reset password: ${resetUrl}`,
      },
      {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
    return successResponse(res, 200, {
      message: "Reset link sent to email",
    });
  } catch (error) {
    next(error);
  }
};

// reset password with token
export const resetPasswordWithToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw ApiError.BADREQUEST("Passwords do not match");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await db.User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      throw ApiError.BADREQUEST("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return successResponse(res, 200, {
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

// verify email
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 🔍 token se user dhundo
    const user = await db.User.findOne({
      where: {
        emailVerificationToken: hashedToken,
      },
    });

    // ❌ user nahi mila
    if (!user) {
      throw ApiError.BADREQUEST("Invalid verification link");
    }

    // ❌ token expired
    if (user.emailVerificationExpire < Date.now()) {
      throw ApiError.BADREQUEST("Verification link expired");
    }

    // ❌ already verified
    if (user.isEmailVerified) {
      throw ApiError.BADREQUEST("Email already verified");
    }

    // ✅ verify karo
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpire = null;

    await user.save();

    return successResponse(res, 200, {
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

// resend verification email
export const resendVerificationEmail = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    if (user.isEmailVerified) {
      throw ApiError.BADREQUEST("Email already verified");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await emailQueue.add(
      "sendEmail",
      {
        to: user.email,
        subject: "Verify Your Email",
        text: `Click to verify email: ${verifyUrl}`,
      },
      {
        attempts: 2,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    return successResponse(res, 200, {
      message: "Verification email sent again",
    });
  } catch (error) {
    next(error);
  }
};

// get all freelancer
export const getAllFreelancers = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const offset = (page - 1) * limit;

    let where = {
      role: "freelancer",
    };

    if (search && search.trim().length > 0) {
      const keyword = search.trim().toLowerCase();

      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { title: { [Op.like]: `%${keyword}%` } },

        sequelizeWhere(fn("JSON_SEARCH", col("skills"), "one", keyword), {
          [Op.ne]: null,
        }),
      ];
    }

    const { count, rows } = await db.User.findAndCountAll({
      where,
      attributes: { exclude: ["password"] },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Freelancers fetched",
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// get all clients
export const getAllClients = async (req, res, next) => {
  try {
    const clients = await db.User.findAll({
      where: { role: "client" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, 200, {
      message: "Clients fetched successfully",
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

// get freelancer by id
export const getFreelancerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const freelancer = await db.User.findOne({
      where: {
        id,
        role: "freelancer",
      },
      attributes: {
        exclude: [
          "password",
          "resetPasswordToken",
          "resetPasswordExpire",
          "emailVerificationToken",
          "emailVerificationExpire",
        ],
      },
    });

    if (!freelancer) {
      throw ApiError.NOTFOUND("Freelancer not found");
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Freelancer fetched successfully",
      data: freelancer,
    });
  } catch (error) {
    next(error);
  }
};
