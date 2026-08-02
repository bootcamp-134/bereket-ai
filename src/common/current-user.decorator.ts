import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { RequestWithContext } from "./request-id.middleware";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<RequestWithContext>().user,
);
