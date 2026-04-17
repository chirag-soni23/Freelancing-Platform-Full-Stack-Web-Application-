import { StatusCodes } from "../config/index.js";
import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import imagekit from "../utils/imageKit.js";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer.js";
import { Op } from "sequelize";

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
    } = req.validatedData;

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
      hourlyRate,
      portfolio,
      address,
    } = req.validatedData;

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
      hourlyRate,
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

// login client
export const loginClient = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw ApiError.UNAUTHORIZED("Invalid email or password");
    }

    if (user.role !== "client") {
      throw ApiError.FORBIDDEN("Access denied: Not a client account");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw ApiError.UNAUTHORIZED("Invalid email or password");
    }

    await generateToken(user, res);

    return successResponse(res, StatusCodes.OK, {
      message: "Client login successful",
      data: user,
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// login freelancer
export const loginFreelancer = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw ApiError.UNAUTHORIZED("Invalid email or password");
    }

    if (user.role !== "freelancer") {
      throw ApiError.FORBIDDEN("Access denied: Not a freelancer account");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw ApiError.UNAUTHORIZED("Invalid email or password");
    }

    await generateToken(user, res);

    return successResponse(res, StatusCodes.OK, {
      message: "Freelancer login successful",
      data: user,
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

// get me
export const getMe = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      raw: true,
    });

    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    delete user.password;

    let filteredUser = {};

    if (user.role === "client") {
      filteredUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        address: user.address,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };
    }

    if (user.role === "freelancer") {
      filteredUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        address: user.address,
        title: user.title,
        bio: user.bio,
        skills: user.skills,
        hourlyRate: user.hourlyRate,
        portfolio: user.portfolio,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Profile fetched successfully",
      data: filteredUser,
    });
  } catch (error) {
    next(error);
    console.log(error.message);
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

    const data = req.validatedData;

    if (data.name !== undefined) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.email !== undefined) user.email = data.email;
    if (data.address !== undefined) user.address = data.address;
    if (data.profilePic !== undefined) user.profilePic = data.profilePic;

    if (user.role === "freelancer") {
      if (data.title !== undefined) user.title = data.title;
      if (data.bio !== undefined) user.bio = data.bio;
      if (data.skills !== undefined) user.skills = data.skills;
      if (data.hourlyRate !== undefined) user.hourlyRate = data.hourlyRate;
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
    const { oldPassword, newPassword, confirmPassword } = req.validatedData;

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

    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      text: `Click to reset password: ${resetUrl}`,
    });

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

    const user = await db.User.findOne({
      where: {
        emailVerificationToken: hashedToken,
        emailVerificationExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      throw ApiError.BADREQUEST("Invalid or expired verification link");
    }

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

// resend email varification
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

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      text: `Click to verify email: ${verifyUrl}`,
    });

    return successResponse(res, 200, {
      message: "Verification email sent again",
    });
  } catch (error) {
    next(error);
  }
};
