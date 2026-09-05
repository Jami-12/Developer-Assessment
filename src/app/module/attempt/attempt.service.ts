import httpStatus from "http-status";
import { AttemptStatus, InvitationStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { recordAudit } from "../../utils/audit";
import type {
  StartAttemptPayload,
  SubmitAttemptPayload,
} from "./attempt.interface";

const activeAttempt = (id: string, candidateId: string) =>
  prisma.attempt.findFirst({
    where: {
      id,
      candidateId,
      deletedAt: null,
      status: AttemptStatus.IN_PROGRESS,
    },
    include: {
      assessment: {
        include: {
          problems: { where: { deletedAt: null }, include: { problem: true } },
        },
      },
    },
  });
const start = async (
  candidateId: string,
  candidateEmail: string,
  payload: StartAttemptPayload,
) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id: payload.assessmentId, isDeleted: false },
    include: {
      problems: {
        where: { deletedAt: null },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              type: true,
              points: true,
            },
          },
        },
      },
    },
  });
  if (!assessment)
    throw new AppError(httpStatus.NOT_FOUND, "Assessment not found");
  const invitation = payload.invitationToken
    ? await prisma.invitation.findFirst({
        where: {
          token: payload.invitationToken,
          assessmentId: assessment.id,
          candidateEmail,
          deletedAt: null,
        },
      })
    : null;
  if (payload.invitationToken && !invitation)
    throw new AppError(httpStatus.FORBIDDEN, "Invalid invitation");
  const updated = await prisma.$transaction(async (tx) => {
    const attempt = await tx.attempt.create({
      data: {
        candidateId,
        assessmentId: assessment.id,
        invitationId: invitation?.id,
      },
      include: {
        assessment: {
          include: {
            problems: {
              where: { deletedAt: null },
              include: {
                problem: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    difficulty: true,
                    type: true,
                    points: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (invitation)
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.STARTED },
      });
    return attempt;
  });
  void recordAudit("ATTEMPT_STARTED", candidateId, {
    assessmentId: assessment.id,
    attemptId: updated.id,
  });
  return updated;
};
const isCorrect = (testCases: unknown, answer: string) => {
  const cases = Array.isArray(testCases) ? testCases : [testCases];
  const expected = cases
    .map((item) =>
      typeof item === "object" && item !== null
        ? ((
            item as {
              expectedAnswer?: unknown;
              answer?: unknown;
              expectedOutput?: unknown;
            }
          ).expectedAnswer ??
          (item as { answer?: unknown }).answer ??
          (item as { expectedOutput?: unknown }).expectedOutput)
        : item,
    )
    .filter((value) => value !== undefined);
  return expected.some((value) => String(value).trim() === answer.trim());
};
const submit = async (
  candidateId: string,
  id: string,
  payload: SubmitAttemptPayload,
) => {
  const attempt = await activeAttempt(id, candidateId);
  if (!attempt)
    throw new AppError(httpStatus.NOT_FOUND, "Active attempt not found");
  const expiresAt =
    attempt.startTime.getTime() + attempt.assessment.durationMinutes * 60_000;
  if (Date.now() > expiresAt) {
    await prisma.attempt.update({
      where: { id },
      data: { status: AttemptStatus.EXPIRED, endTime: new Date() },
    });
    throw new AppError(httpStatus.GONE, "Attempt time has expired");
  }
  const problemMap = new Map(
    attempt.assessment.problems.map((item) => [item.problemId, item]),
  );
  const updated = await prisma.$transaction(async (tx) => {
    let totalScore = 0;
    for (const submission of payload.submissions) {
      const link = problemMap.get(submission.problemId);
      if (!link)
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Problem is not part of this assessment",
        );
      const correct = isCorrect(
        link.problem.testCases,
        submission.submittedCodeOrAnswer,
      );
      const marks = correct ? link.marks : 0;
      totalScore += marks;
      await tx.submission.upsert({
        where: {
          attemptId_problemId: {
            attemptId: id,
            problemId: submission.problemId,
          },
        },
        create: {
          attemptId: id,
          problemId: submission.problemId,
          submittedCodeOrAnswer: submission.submittedCodeOrAnswer,
          isCorrect: correct,
          marksObtained: marks,
        },
        update: {
          submittedCodeOrAnswer: submission.submittedCodeOrAnswer,
          isCorrect: correct,
          marksObtained: marks,
        },
      });
    }
    const updated = await tx.attempt.update({
      where: { id },
      data: {
        status: AttemptStatus.SUBMITTED,
        endTime: new Date(),
        totalScore,
      },
      include: {
        submissions: { where: { deletedAt: null } },
        assessment: true,
      },
    });
    if (updated.invitationId)
      await tx.invitation.update({
        where: { id: updated.invitationId },
        data: { status: InvitationStatus.COMPLETED },
      });
    return updated;
  });
  void recordAudit("ATTEMPT_SUBMITTED", candidateId, {
    attemptId: id,
    totalScore: updated.totalScore,
  });
  return updated;
};
const get = async (candidateId: string, id: string) => {
  const attempt = await prisma.attempt.findFirst({
    where: { id, candidateId, deletedAt: null },
    include: { submissions: { where: { deletedAt: null } }, assessment: true },
  });
  if (!attempt) throw new AppError(httpStatus.NOT_FOUND, "Attempt not found");
  return attempt;
};
export const AttemptService = { start, submit, get };
