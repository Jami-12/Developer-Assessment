import httpStatus from "http-status";
import type { Prisma, ProblemDifficulty, ProblemType } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { recordAudit } from "../../utils/audit";
import type { ProblemPayload, ProblemQuery } from "./problem.interface";

const companyIdForUser = async (userId: string) => {
  const profile = await prisma.companyProfile.findFirst({
    where: { userId, isDeleted: false },
    select: { id: true },
  });
  if (!profile)
    throw new AppError(httpStatus.FORBIDDEN, "A company profile is required");
  return profile.id;
};
const getOwned = async (id: string, companyId: string) => {
  const problem = await prisma.problem.findFirst({
    where: { id, companyId, isDeleted: false },
  });
  if (!problem) throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  return problem;
};
const create = async (userId: string, payload: ProblemPayload) => {
  const problem = await prisma.problem.create({
    data: { ...payload, companyId: await companyIdForUser(userId) },
  });
  void recordAudit("PROBLEM_CREATED", userId, { problemId: problem.id });
  return problem;
};
const list = async (userId: string, query: ProblemQuery) => {
  const companyId = await companyIdForUser(userId);
  const builder = new QueryBuilder<Prisma.ProblemWhereInput>(
    query as Record<string, unknown>,
    ["title", "description"],
  )
    .search()
    .filter(["difficulty", "type"])
    .sort(["createdAt", "title", "points"]);
  const { where, orderBy, skip, take, page, limit } = builder.build();
  const scopedWhere = {
    ...where,
    companyId,
    isDeleted: false,
    difficulty: query.difficulty as ProblemDifficulty | undefined,
    type: query.type as ProblemType | undefined,
  } satisfies Prisma.ProblemWhereInput;
  const [data, total] = await prisma.$transaction([
    prisma.problem.findMany({ where: scopedWhere, orderBy, skip, take }),
    prisma.problem.count({ where: scopedWhere }),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
const get = async (userId: string, id: string) =>
  getOwned(id, await companyIdForUser(userId));
const update = async (
  userId: string,
  id: string,
  payload: Partial<ProblemPayload>,
) => {
  const problem = await get(userId, id);
  const updated = await prisma.problem.update({
    where: { id: problem.id },
    data: payload,
  });
  void recordAudit("PROBLEM_UPDATED", userId, { problemId: id });
  return updated;
};
const remove = async (userId: string, id: string) => {
  const problem = await get(userId, id);
  const removed = await prisma.problem.update({
    where: { id: problem.id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
  void recordAudit("PROBLEM_DELETED", userId, { problemId: id });
  return removed;
};
export const ProblemService = { create, list, get, update, remove };
