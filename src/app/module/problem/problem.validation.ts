import { z } from "zod";
const body = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  type: z.enum(["MCQ", "CODING"]),
  testCases: z.unknown(),
  points: z.number().int().positive(),
});
export const createProblemValidation = z.object({ body });
export const updateProblemValidation = z.object({ body: body.partial() });
