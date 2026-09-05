import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";
const metrics = catchAsync(async (_req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Platform metrics fetched",
    data: await AdminService.metrics(),
  }),
);
const createAudit = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Audit log created",
    data: await AdminService.createAudit({
      ...req.body,
      userId: req.user!.userId,
    }),
  }),
);
const listAudits = catchAsync(async (_req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Audit logs fetched",
    data: await AdminService.listAudits(),
  }),
);
export const AdminController = { metrics, createAudit, listAudits };
