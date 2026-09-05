import { z } from "zod";
export const startAttemptValidation = z.object({
  body: z.object({
    assessmentId: z.string().uuid(),
    invitationToken: z.string().optional(),
  }),
});
export const submitAttemptValidation = z.object({
  body: z.object({
    submissions: z.array(
      z.object({
        problemId: z.string().uuid(),
        submittedCodeOrAnswer: z.string(),
      }),
    ),
  }),
});
