import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import httpStatus from "http-status";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";

export interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}
declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
export const auth = (...requiredRoles: UserRole[]) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ??
      req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token)
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    const verified = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!verified.success)
      throw new AppError(httpStatus.UNAUTHORIZED, verified.error);
    const payload = verified.data as JwtPayload;
    const user = await prisma.user.findFirst({
      where: { id: String(payload.userId), isDeleted: false },
      select: { id: true, email: true, role: true },
    });
    if (!user || user.email !== payload.email)
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role))
      throw new AppError(httpStatus.FORBIDDEN, "Insufficient permissions");
    req.user = { userId: user.id, email: user.email, role: user.role };
    next();
  });
