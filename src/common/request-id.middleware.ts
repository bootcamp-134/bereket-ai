import { Injectable, type NestMiddleware } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export type RequestWithContext = Request & {
  requestId: string;
  user?: AuthenticatedUser;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  sessionId: string;
};

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: RequestWithContext, response: Response, next: NextFunction) {
    const incoming = request.header("x-request-id")?.trim();
    request.requestId =
      incoming && incoming.length <= 100 ? incoming : `req_${randomUUID()}`;
    response.setHeader("x-request-id", request.requestId);
    next();
  }
}
