import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/public.decorator";
import { PrismaService } from "../../database/prisma.service";

@Public()
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth() {
    await this.prisma.$queryRaw`SELECT 1`;
    const dataset = await this.prisma.datasetImport.findFirst({
      where: { active: true, status: "COMPLETED" },
      select: { checksum: true, recipeCount: true, completedAt: true },
    });
    return {
      name: "bereket-ai-backend",
      status: "ok",
      version: process.env.npm_package_version ?? "0.1.0",
      database: "ok",
      dataset: dataset
        ? {
            status: "ready",
            checksum: dataset.checksum,
            recipeCount: dataset.recipeCount,
            importedAt: dataset.completedAt,
          }
        : { status: "not_imported" },
      timestamp: new Date().toISOString(),
    };
  }
}
