import type { UserRole } from "@prisma/client";

export interface IRequestUser {
  userId: string;
  email: string;
  role: UserRole;
}
