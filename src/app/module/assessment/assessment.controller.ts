import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AssessmentService } from "./assessment.service";
const create = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Assessment created",
    data: await AssessmentService.create(req.user!.userId, req.body),
  }),
);
const list = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assessments fetched",
    data: await AssessmentService.list(req.user!.userId),
  }),
);
const get = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assessment fetched",
    data: await AssessmentService.get(req.user!.userId, String(req.params.id)),
  }),
);
const update = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assessment updated",
    data: await AssessmentService.update(
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
    message: "Assessment deleted",
    data: await AssessmentService.remove(
      req.user!.userId,
      String(req.params.id),
    ),
  }),
);
const invite = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Candidate invited",
    data: await AssessmentService.invite(
      req.user!.userId,
      String(req.params.id),
      req.body,
    ),
  }),
);
export const AssessmentController = {
  create,
  list,
  get,
  update,
  remove,
  invite,
};
