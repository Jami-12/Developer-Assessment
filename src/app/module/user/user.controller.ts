import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
const getProfile = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched",
    data: await UserServices.getProfile(req.user!.userId),
  }),
);
const updateProfile = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated",
    data: await UserServices.updateProfile(req.user!.userId, req.body),
  }),
);
export const UserController = { getProfile, updateProfile };
