import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ExceptionFilter,
} from "@nestjs/common";
import type { Response } from "express";
import { API_CODE_BY_STATUS } from "./api-code";
import type { RequestWithContext } from "./request-id.middleware";

type ErrorDetail = { field?: string; reason: string };

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<RequestWithContext>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const payload =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const normalized = this.normalize(payload, status);

    if (status >= 500) {
      this.logger.error(
        JSON.stringify({
          requestId: request.requestId,
          method: request.method,
          path: request.originalUrl,
          error: exception instanceof Error ? exception.name : "UnknownError",
        }),
      );
    }

    response.status(status).json({
      error: {
        code: normalized.code,
        message: normalized.message,
        details: normalized.details,
        requestId: request.requestId,
      },
    });
  }

  private normalize(payload: unknown, status: number) {
    let code = API_CODE_BY_STATUS[status] ?? "INTERNAL_ERROR";
    let message =
      status >= 500 ? "Beklenmeyen bir hata oluştu." : "İstek tamamlanamadı.";
    const details: ErrorDetail[] = [];

    if (typeof payload === "string") message = payload;
    if (payload && typeof payload === "object") {
      const body = payload as Record<string, unknown>;
      if (typeof body.code === "string") code = body.code;
      if (typeof body.message === "string") message = body.message;
      if (Array.isArray(body.message)) {
        message = "Gönderilen alanlardan biri geçersiz.";
        details.push(
          ...body.message.map((reason) => ({ reason: String(reason) })),
        );
      }
      if (Array.isArray(body.details))
        details.push(...(body.details as ErrorDetail[]));
    }

    return { code, message, details };
  }
}
