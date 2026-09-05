import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AttemptService } from "./attempt.service";
const start = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Attempt started",
    data: await AttemptService.start(
      req.user!.userId,
      req.user!.email,
      req.body,
    ),
  }),
);
const submit = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attempt submitted",
    data: await AttemptService.submit(
      req.user!.userId,
      String(req.params.id),
      req.body,
    ),
  }),
);
const get = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attempt fetched",
    data: await AttemptService.get(req.user!.userId, String(req.params.id)),
  }),
);
export const AttemptController = { start, submit, get };
