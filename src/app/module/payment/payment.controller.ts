import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
const topUp = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Credits added",
    data: await PaymentService.topUp(req.user!.userId, req.body),
  }),
);
const history = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment history fetched",
    data: await PaymentService.history(req.user!.userId),
  }),
);
export const PaymentController = { topUp, history };
