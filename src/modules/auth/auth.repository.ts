import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  createUser(email: string, passwordHash: string, fullName?: string) {
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: fullName ? { create: { fullName } } : undefined,
      },
      include: { profile: true },
    });
  }

  createRefreshSession(input: {
    userId: string;
    familyId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return this.prisma.refreshSession.create({ data: input });
  }

  findRefreshSession(tokenHash: string) {
    return this.prisma.refreshSession.findUnique({
      where: { tokenHash },
      include: { user: { include: { profile: true } } },
    });
  }

  rotateRefreshSession(input: {
    oldId: string;
    userId: string;
    familyId: string;
    oldTokenHash: string;
    newTokenHash: string;
    expiresAt: Date;
  }) {
    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      const rotated = await tx.refreshSession.updateMany({
        where: {
          id: input.oldId,
          tokenHash: input.oldTokenHash,
          revokedAt: null,
        },
        data: {
          lastUsedAt: now,
          revokedAt: now,
          replacedByTokenHash: input.newTokenHash,
        },
      });
      if (rotated.count !== 1) {
        await tx.refreshSession.updateMany({
          where: { familyId: input.familyId, revokedAt: null },
          data: { revokedAt: now },
        });
        return null;
      }
      return tx.refreshSession.create({
        data: {
          userId: input.userId,
          familyId: input.familyId,
          tokenHash: input.newTokenHash,
          expiresAt: input.expiresAt,
        },
      });
    });
  }

  revokeFamily(familyId: string) {
    return this.prisma.refreshSession.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  revokeSession(id: string) {
    return this.prisma.refreshSession.updateMany({
      where: { id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async createPasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: { userId, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      return tx.passwordResetToken.create({
        data: { userId, tokenHash, expiresAt },
      });
    });
  }

  findPasswordResetToken(tokenHash: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  resetPassword(userId: string, resetTokenId: string, passwordHash: string) {
    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      const consumed = await tx.passwordResetToken.updateMany({
        where: {
          id: resetTokenId,
          userId,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) return false;
      await tx.user.update({ where: { id: userId }, data: { passwordHash } });
      await tx.refreshSession.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: now },
      });
      return true;
    });
  }
}
