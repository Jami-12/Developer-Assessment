import { prisma } from "../../lib/prisma";
import type { Prisma } from "@prisma/client";
import type { AuditPayload } from "./admin.interface";

const metrics = async () => {
  const [
    users,
    companies,
    candidates,
    problems,
    assessments,
    attempts,
    submissions,
    payments,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.companyProfile.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.user.count({
      where: {
        role: "CANDIDATE",
        isDeleted: false,
      },
    }),

    prisma.problem.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.assessment.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.attempt.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.submission.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        deletedAt: null,
      },
      _sum: {
        amount: true,
        credits: true,
      },
      _count: true,
    }),
  ]);

  return {
    users,
    companies,
    candidates,
    problems,
    assessments,
    attempts,
    submissions,
    payments,
  };
};

const createAudit = (payload: AuditPayload) =>
  prisma.auditLog.create({
    data: {
      action: payload.action,
      userId: payload.userId,
      details: payload.details as Prisma.InputJsonObject,
    },
  });

const listAudits = () =>
  prisma.auditLog.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

export const AdminService = {
  metrics,
  createAudit,
  listAudits,
};
