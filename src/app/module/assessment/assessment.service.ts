import crypto from "node:crypto";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { recordAudit } from "../../utils/audit";
import type {
  AssessmentPayload,
  InvitationPayload,
} from "./assessment.interface";

const companyIdForUser = async (userId: string) => {
  const profile = await prisma.companyProfile.findFirst({
    where: { userId, isDeleted: false },
    select: { id: true },
  });
  if (!profile)
    throw new AppError(httpStatus.FORBIDDEN, "A company profile is required");
  return profile.id;
};
const owned = async (userId: string, id: string) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id, company: { userId, isDeleted: false }, isDeleted: false },
    include: {
      problems: { where: { deletedAt: null }, include: { problem: true } },
      invitations: { where: { deletedAt: null } },
    },
  });
  if (!assessment)
    throw new AppError(httpStatus.NOT_FOUND, "Assessment not found");
  return assessment;
};
const create = async (userId: string, payload: AssessmentPayload) => {
  const companyId = await companyIdForUser(userId);
  const problemIds = payload.problems.map((problem) => problem.problemId);
  const valid = await prisma.problem.count({
    where: { id: { in: problemIds }, companyId, isDeleted: false },
  });
  if (valid !== problemIds.length)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Every problem must belong to your company and be active",
    );
  const assessment = await prisma.assessment.create({
    data: {
      title: payload.title,
      description: payload.description,
      durationMinutes: payload.durationMinutes,
      passMarks: payload.passMarks,
      companyId,
      problems: { create: payload.problems },
    },
    include: { problems: true },
  });
  void recordAudit("ASSESSMENT_CREATED", userId, {
    assessmentId: assessment.id,
  });
  return assessment;
};
const list = async (userId: string) =>
  prisma.assessment.findMany({
    where: { company: { userId, isDeleted: false }, isDeleted: false },
    include: {
      problems: { where: { deletedAt: null }, include: { problem: true } },
      _count: { select: { invitations: true, attempts: true } },
    },
    orderBy: { createdAt: "desc" },
  });
const get = (userId: string, id: string) => owned(userId, id);
const update = async (
  userId: string,
  id: string,
  payload: Partial<AssessmentPayload>,
) => {
  await owned(userId, id);
  const { problems, ...fields } = payload;
  return prisma.$transaction(async (tx) => {
    if (problems) {
      const current = await tx.assessmentProblem.findMany({
        where: { assessmentId: id },
      });
      await tx.assessmentProblem.updateMany({
        where: { assessmentId: id },
        data: { deletedAt: new Date() },
      });
      for (const problem of problems)
        await tx.assessmentProblem.upsert({
          where: {
            assessmentId_problemId: {
              assessmentId: id,
              problemId: problem.problemId,
            },
          },
          create: {
            assessmentId: id,
            problemId: problem.problemId,
            marks: problem.marks,
          },
          update: { marks: problem.marks, deletedAt: null },
        });
      void current;
    }
    return tx.assessment.update({
      where: { id },
      data: fields,
      include: { problems: { where: { deletedAt: null } } },
    });
  });
};
const remove = async (userId: string, id: string) => {
  await owned(userId, id);
  const removed = await prisma.assessment.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
  void recordAudit("ASSESSMENT_DELETED", userId, { assessmentId: id });
  return removed;
};
const invite = async (
  userId: string,
  id: string,
  payload: InvitationPayload,
) => {
  await owned(userId, id);
  return prisma.invitation.create({
    data: {
      assessmentId: id,
      candidateEmail: payload.candidateEmail.trim().toLowerCase(),
      token: crypto.randomUUID(),
    },
  });
};
export const AssessmentService = { create, list, get, update, remove, invite };
