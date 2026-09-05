import httpStatus from "http-status";
import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const setTokens = (
  res: Response,
  result: { accessToken: string; refreshToken: string },
) => {
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};
const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  setTokens(res, result);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registration successful",
    data: result,
  });
});
const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  setTokens(res, result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});
const me = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user!.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched",
    data: result,
  });
});
const logout = catchAsync(async (_req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out",
    data: null,
  });
});
export const AuthController = { register, login, me, logout };
