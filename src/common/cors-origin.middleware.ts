import { randomUUID } from "node:crypto";
import type { NextFunction, Response } from "express";
import type { RequestWithContext } from "./request-id.middleware";

type WarningLogger = { warn(message: string): void };

export function configuredCorsOrigins() {
  const configured = (process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([
    "https://bereket.app",
    "https://www.bereket.app",
    ...configured,
  ]);
}

export function createCorsOriginGuard(
  allowedOrigins: Set<string>,
  logger: WarningLogger,
) {
  return (
    request: RequestWithContext,
    response: Response,
    next: NextFunction,
  ) => {
    const origin = request.header("origin");
    const allowed =
      !origin ||
      allowedOrigins.has(origin) ||
      (process.env.NODE_ENV !== "production" &&
        /^http:\/\/localhost:\d+$/.test(origin));
    if (allowed) {
      next();
      return;
    }

    request.requestId ||= `req_${randomUUID()}`;
    response.setHeader("x-request-id", request.requestId);
    response.setHeader("vary", "Origin");
    logger.warn(
      JSON.stringify({
        event: "cors_origin_rejected",
        requestId: request.requestId,
        method: request.method,
        path: request.originalUrl,
      }),
    );
    response.status(403).json({
      error: {
        code: "FORBIDDEN",
        message: "Bu origin için erişim izni bulunmuyor.",
        details: [],
        requestId: request.requestId,
      },
    });
  };
}
