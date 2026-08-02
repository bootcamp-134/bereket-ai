import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async cleanup(now = new Date()) {
    const revokedBefore = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const budgetBefore = new Date(
      Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), 1),
    );
    const [rateLimits, passwordResets, refreshSessions, budgetPeriods] =
      await this.prisma.$transaction([
        this.prisma.rateLimitBucket.deleteMany({
          where: { expiresAt: { lt: now } },
        }),
        this.prisma.passwordResetToken.deleteMany({
          where: { expiresAt: { lt: now } },
        }),
        this.prisma.refreshSession.deleteMany({
          where: {
            OR: [
              { expiresAt: { lt: now } },
              { revokedAt: { lt: revokedBefore } },
            ],
          },
        }),
        this.prisma.aiBudgetPeriod.deleteMany({
          where: { periodStart: { lt: budgetBefore } },
        }),
      ]);

    return {
      deleted: {
        rateLimitBuckets: rateLimits.count,
        passwordResetTokens: passwordResets.count,
        refreshSessions: refreshSessions.count,
        aiBudgetPeriods: budgetPeriods.count,
      },
    };
  }
}
