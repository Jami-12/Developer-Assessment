import crypto from "node:crypto";
import { PaymentStatus } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { recordAudit } from "../../utils/audit";
import type { TopUpPayload } from "./payment.interface";

const company = async (userId: string) => {
  const profile = await prisma.companyProfile.findFirst({
    where: { userId, isDeleted: false },
  });
  if (!profile)
    throw new AppError(httpStatus.FORBIDDEN, "A company profile is required");
  return profile;
};
const createGatewayPayment = async (payload: TopUpPayload) => ({
  transactionId: `${payload.gateway.toLowerCase()}_${crypto.randomUUID()}`,
  status: PaymentStatus.SUCCESS,
});
const topUp = async (userId: string, payload: TopUpPayload) => {
  const profile = await company(userId);
  const gatewayPayment = await createGatewayPayment(payload);
  const payment = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        companyId: profile.id,
        amount: payload.amount,
        credits: payload.credits,
        transactionId: gatewayPayment.transactionId,
        gateway: payload.gateway,
        status: gatewayPayment.status,
      },
    });
    await tx.companyProfile.update({
      where: { id: profile.id },
      data: { credits: { increment: payload.credits } },
    });
    return payment;
  });
  void recordAudit("CREDITS_TOPPED_UP", userId, {
    paymentId: payment.id,
    credits: payload.credits,
  });
  return payment;
};
const history = async (userId: string) => {
  const profile = await company(userId);
  return prisma.payment.findMany({
    where: { companyId: profile.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};
export const PaymentService = { topUp, history };
