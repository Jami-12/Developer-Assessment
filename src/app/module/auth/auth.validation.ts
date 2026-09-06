import { z } from "zod";

export const registerValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "COMPANY", "CANDIDATE"]).optional(),
  companyName: z.string().min(1).optional(),
  website: z.string().url().optional(),
});

export const loginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
