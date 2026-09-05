import type { ProblemDifficulty, ProblemType, Prisma } from "@prisma/client";
export interface ProblemPayload {
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  type: ProblemType;
  testCases: Prisma.InputJsonValue;
  points: number;
}
export interface ProblemQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  searchTerm?: string;
  difficulty?: ProblemDifficulty;
  type?: ProblemType;
}
