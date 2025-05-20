import bcrypt from "bcryptjs";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import User from "../models/auth.model.js";
import {
  daysToMS,
  generateResetToken,
  generateTokenAndSetCookies,
  generateVerificationToken,
} from "../utils/tokens.js";

export const signup = async (req, res) => {
  try {
    const verificationToken = generateVerificationToken();
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + daysToMS(),
    });
    const token = generateTokenAndSetCookies(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);
    res.status(201).json({
      success: true,
      token,
      data: { ...user._doc, password: undefined },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.stack });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code!",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res
      .status(200)
      .json({ success: true, message: "Email Verified Succesfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.stack });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({
        success: false,
        message: `Invalid credintials! ${user?.email}`,
      });
    const token = generateTokenAndSetCookies(res, user._id);
    user.lastLogin = Date.now();
    await user.save();
    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      token,
      data: { ...user._doc, password: undefined },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.stack });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { resetPasswordToken, resetTokenExpiresAt } = generateResetToken();
    const user = await User.findOneAndUpdate(
      { email },
      { resetPasswordToken, resetTokenExpiresAt },
      { new: true }
    );
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: `User not found` });

    await sendPasswordResetEmail(
      email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );
    console.log(
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );
    res.status(200).json({
      success: true,
      message: "Reset Password Email sent successfully!",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: `Invalid or expired reset token` });
    //do it manually coz "save" middleware isn't valid for find/
    user.password = password;
    user.resetPasswordToken = user.resetTokenExpiresAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password Reset successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
