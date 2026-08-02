import { Controller, Get, Redirect } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { Public } from "./common/public.decorator";

@Controller()
export class RootController {
  @ApiExcludeEndpoint()
  @Public()
  @Get()
  @Redirect("/api/docs", 308)
  apiDocumentation() {
    return undefined;
  }
}
