import { z } from "zod";

const assessmentSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().optional(),

  durationMinutes: z.number().int().positive("Duration must be greater than 0"),

  passMarks: z.number().int().nonnegative("Pass marks cannot be negative"),

  problems: z
    .array(
      z.object({
        problemId: z.string().uuid("Invalid problem ID"),

        marks: z.number().int().positive("Marks must be greater than 0"),
      }),
    )
    .min(1, "At least one problem is required"),
});

export const createAssessmentValidation = assessmentSchema;

export const updateAssessmentValidation = assessmentSchema.partial();

export const invitationValidation = z.object({
  candidateEmail: z.string().email("Invalid candidate email"),
});
