import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const recordAudit = async (
  action: string,
  userId: string,
  details: Prisma.InputJsonObject,
) => {
  await prisma.auditLog.create({ data: { action, userId, details } });
};
