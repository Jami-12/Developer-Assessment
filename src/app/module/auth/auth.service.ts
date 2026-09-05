import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import type { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";

const publicUser = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
} as const;
const issueTokens = (user: { id: string; email: string; role: UserRole }) => {
  const payload = { userId: user.id, email: user.email, role: user.role };
  return {
    accessToken: jwtUtils.createToken(
      payload,
      config.jwt_access_secret,
      config.jwt_access_expires_in as SignOptions,
    ),
    refreshToken: jwtUtils.createToken(
      payload,
      config.jwt_refresh_secret,
      config.jwt_refresh_expires_in as SignOptions,
    ),
  };
};

const register = async (payload: {
  email: string;
  password: string;
  role?: UserRole;
  companyName?: string;
  website?: string;
}) => {
  const email = payload.email.trim().toLowerCase();
  if (await prisma.user.findUnique({ where: { email } }))
    throw new AppError(
      httpStatus.CONFLICT,
      "A user with this email already exists",
    );
  const role = payload.role ?? UserRole.CANDIDATE;
  const password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email, password, role },
      select: publicUser,
    });
    if (role === UserRole.COMPANY) {
      if (!payload.companyName)
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "companyName is required for company users",
        );
      await tx.companyProfile.create({
        data: {
          userId: created.id,
          companyName: payload.companyName,
          website: payload.website,
        },
      });
    }
    return created;
  });
  return { user, ...issueTokens(user) };
};

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email.trim().toLowerCase() },
  });
  if (
    !user ||
    user.isDeleted ||
    !(await bcrypt.compare(payload.password, user.password))
  )
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    ...issueTokens(user),
  };
};

const getMe = (userId: string) =>
  prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    select: publicUser,
  });
export const AuthService = { register, login, getMe };
