import { Injectable, Logger, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import type { RequestWithContext } from "./request-id.middleware";

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HttpRequest");

  use(request: RequestWithContext, response: Response, next: NextFunction) {
    const startedAt = performance.now();
    response.once("finish", () => {
      this.logger.log(
        JSON.stringify({
          event: "http_request_completed",
          requestId: request.requestId,
          method: request.method,
          path: request.originalUrl,
          statusCode: response.statusCode,
          durationMs: Math.round(performance.now() - startedAt),
          userId: request.user?.id,
        }),
      );
    });
    next();
  }
}
