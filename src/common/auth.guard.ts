import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";
import type { RequestWithContext } from "./request-id.middleware";

type AccessPayload = { sub: string; email: string; sid: string };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const authorization = request.header("authorization");
    const [scheme, token] = authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedException({
        code: "AUTHENTICATION_REQUIRED",
        message: "Bu işlem için giriş yapmalısınız.",
      });
    }

    try {
      const payload = await this.jwt.verifyAsync<AccessPayload>(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        sessionId: payload.sid,
      };
      return true;
    } catch {
      throw new UnauthorizedException({
        code: "AUTHENTICATION_REQUIRED",
        message: "Oturum süresi dolmuş veya token geçersiz.",
      });
    }
  }
}
