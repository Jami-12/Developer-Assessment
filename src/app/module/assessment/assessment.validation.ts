import { z } from "zod";
const assessment = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  durationMinutes: z.number().int().positive(),
  passMarks: z.number().int().nonnegative(),
  problems: z
    .array(
      z.object({
        problemId: z.string().uuid(),
        marks: z.number().int().positive(),
      }),
    )
    .min(1),
});
export const createAssessmentValidation = z.object({ body: assessment });
export const updateAssessmentValidation = z.object({
  body: assessment.partial(),
});
export const invitationValidation = z.object({
  body: z.object({ candidateEmail: z.string().email() }),
});
