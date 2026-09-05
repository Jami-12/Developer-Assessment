import { z } from "zod";
export const auditValidation = z.object({
  body: z.object({
    action: z.string().min(1),
    details: z.record(z.string(), z.unknown()),
  }),
});
