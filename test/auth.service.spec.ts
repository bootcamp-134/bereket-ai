import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { AuthService } from "../src/modules/auth/auth.service";

const user = {
  id: "user_1",
  email: "test@bereket.app",
  passwordHash: "hash",
  createdAt: new Date(),
  updatedAt: new Date(),
  profile: null,
};

function service(repositoryOverrides: Record<string, unknown> = {}) {
  process.env.REFRESH_TOKEN_PEPPER = "test-refresh-pepper";
  process.env.PASSWORD_RESET_TOKEN_PEPPER = "test-reset-pepper";
  const repository = {
    findRefreshSession: vi.fn(),
    revokeFamily: vi.fn(),
    revokeSession: vi.fn(),
    rotateRefreshSession: vi.fn(),
    findPasswordResetToken: vi.fn(),
    resetPassword: vi.fn(),
    ...repositoryOverrides,
  };
  const jwt = { signAsync: vi.fn().mockResolvedValue("access-token") };
  const email = { sendPasswordReset: vi.fn() };
  return {
    auth: new AuthService(repository as never, jwt as never, email as never),
    repository,
  };
}

describe("AuthService token security", () => {
  it("revokes the whole token family when a rotated token is reused", async () => {
    const { auth, repository } = service({
      findRefreshSession: vi.fn().mockResolvedValue({
        id: "session_old",
        userId: user.id,
        familyId: "family_1",
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
        user,
      }),
    });
    await expect(auth.refresh("reused-token")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(repository.revokeFamily).toHaveBeenCalledWith("family_1");
  });

  it("rejects a concurrent refresh rotation that lost the atomic update", async () => {
    const { auth } = service({
      findRefreshSession: vi.fn().mockResolvedValue({
        id: "session_old",
        userId: user.id,
        familyId: "family_1",
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        user,
      }),
      rotateRefreshSession: vi.fn().mockResolvedValue(null),
    });
    await expect(auth.refresh("refresh-token")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("rejects a reset token that was consumed concurrently", async () => {
    const { auth } = service({
      findPasswordResetToken: vi.fn().mockResolvedValue({
        id: "reset_1",
        userId: user.id,
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      }),
      resetPassword: vi.fn().mockResolvedValue(false),
    });
    await expect(
      auth.resetPassword({
        token: "reset-token",
        password: "yeni-guclu-sifre-123",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
