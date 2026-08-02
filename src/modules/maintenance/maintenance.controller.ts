import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { timingSafeEqual } from "node:crypto";
import { Public } from "../../common/public.decorator";
import type { RequestWithContext } from "../../common/request-id.middleware";
import { MaintenanceService } from "./maintenance.service";

function matchesSecret(
  value: string | undefined,
  expected: string | undefined,
) {
  if (!value || !expected) return false;
  const actualBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

@ApiExcludeController()
@Controller("internal/maintenance")
export class MaintenanceController {
  constructor(private readonly maintenance: MaintenanceService) {}

  @Public()
  @Get()
  cleanup(@Req() request: RequestWithContext) {
    const authorization = request.header("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : undefined;
    if (!matchesSecret(token, process.env.CRON_SECRET)) {
      throw new HttpException(
        {
          code: "NOT_FOUND",
          message: "Kaynak bulunamadı.",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.maintenance.cleanup();
  }
}
