import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { ZodObject } from "zod";

import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: ZodObject) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const result = zodSchema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result.success) {
        console.log("ZOD ERROR:", result.error.issues);

        throw new AppError(
          httpStatus.BAD_REQUEST,
          result.error.issues[0]?.message || "Invalid request",
        );
      }

      req.body = result.data.body;

      next();
    },
  );
};
