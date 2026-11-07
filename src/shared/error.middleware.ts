import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, isDuplicateKeyError } from "./errors";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.code && { code: err.code }),
    });
    return;
  }

  if (isDuplicateKeyError(err)) {
    res.status(409).json({ message: "Resource already exists" });
    return;
  }

  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ message: "Invalid JSON body" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
