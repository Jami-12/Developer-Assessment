import { z } from "zod";

const problemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  type: z.enum(["MCQ", "CODING"]),
  testCases: z.unknown(),
  points: z.number().int().positive(),
});

export const createProblemValidation = problemSchema;

export const updateProblemValidation = problemSchema.partial();
