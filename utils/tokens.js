import jwt from "jsonwebtoken";
import crypto from "crypto";

export const daysToMS = (day = 1, hour = 24) => +(day * hour * 60 * 60 * 1000);

export const generateVerificationToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateTokenAndSetCookies = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: daysToMS(process.env.JWT_TOKEN_EXPIRES_IN),
  };

  res.cookie("jwt", token, cookieOption);
  return token;
};

export const generateResetToken = (hour = 24) => {
  return {
    resetPasswordToken: crypto.randomBytes(20).toString("hex"),
    resetTokenExpiresAt: Date.now() + daysToMS(1, hour),
  };
};
