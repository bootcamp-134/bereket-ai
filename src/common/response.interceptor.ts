import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import type { Response } from "express";
import { map, type Observable } from "rxjs";
import type { RequestWithContext } from "./request-id.middleware";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((value: unknown) => {
        if (response.statusCode === 204) return undefined;

        if (value && typeof value === "object" && "data" in value) {
          const shaped = value as {
            data: unknown;
            meta?: Record<string, unknown>;
          };
          return {
            data: shaped.data,
            meta: { ...(shaped.meta ?? {}), requestId: request.requestId },
          };
        }

        return { data: value, meta: { requestId: request.requestId } };
      }),
    );
  }
}
