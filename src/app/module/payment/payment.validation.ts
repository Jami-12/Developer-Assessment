import { z } from "zod";
export const topUpValidation = z.object({
  body: z.object({
    amount: z.number().positive(),
    credits: z.number().int().positive(),
    gateway: z.enum(["STRIPE", "BKASH", "MOCK"]),
  }),
});
