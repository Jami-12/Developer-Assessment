import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProblemService } from "./problem.service";
const create = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Problem created",
    data: await ProblemService.create(req.user!.userId, req.body),
  }),
);
const list = catchAsync(async (req, res) => {
  const result = await ProblemService.list(req.user!.userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Problems fetched",
    data: result.data,
    meta: result.meta,
  });
});
const get = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Problem fetched",
    data: await ProblemService.get(req.user!.userId, String(req.params.id)),
  }),
);
const update = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Problem updated",
    data: await ProblemService.update(
      req.user!.userId,
      String(req.params.id),
      req.body,
    ),
  }),
);
const remove = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Problem deleted",
    data: await ProblemService.remove(req.user!.userId, String(req.params.id)),
  }),
);
export const ProblemController = { create, list, get, update, remove };
