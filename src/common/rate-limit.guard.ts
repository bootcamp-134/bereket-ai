import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { createHash } from "node:crypto";
import { PrismaService } from "../database/prisma.service";
import { RATE_LIMIT_KEY, type RateLimitOptions } from "./rate-limit.decorator";
import type { RequestWithContext } from "./request-id.middleware";

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!options) return true;

    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const identifier =
      options.scope === "user"
        ? (request.user?.id ?? request.ip)
        : options.scope === "session"
          ? (request.user?.sessionId ?? request.ip)
          : request.ip;
    const key = createHash("sha256")
      .update(
        `${request.method}:${request.route?.path ?? request.path}:${identifier}`,
      )
      .digest("hex");
    const now = Date.now();
    const windowMs = options.windowSeconds * 1000;
    const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
    const expiresAt = new Date(windowStart.getTime() + windowMs * 2);

    const rows = await this.prisma.$queryRaw<Array<{ count: number }>>`
      INSERT INTO "RateLimitBucket" ("key", "windowStart", "count", "expiresAt")
      VALUES (${key}, ${windowStart}, 1, ${expiresAt})
      ON CONFLICT ("key", "windowStart")
      DO UPDATE SET "count" = "RateLimitBucket"."count" + 1
      RETURNING "count"
    `;

    if ((rows[0]?.count ?? 1) > options.limit) {
      throw new HttpException(
        {
          code: "RATE_LIMIT_EXCEEDED",
          message:
            "Çok fazla istek gönderildi. Lütfen kısa süre sonra tekrar deneyin.",
        },
        429,
      );
    }
    return true;
  }
}
