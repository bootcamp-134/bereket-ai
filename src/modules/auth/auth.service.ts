import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Algorithm, hash, verify } from "@node-rs/argon2";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { AuthRepository } from "./auth.repository";
import type {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "./dto";
import { EmailService } from "./email.service";

const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_MS = 30 * 24 * 60 * 60 * 1000;
const RESET_TOKEN_MS = 30 * 60 * 1000;

function profileComplete(
  profile: {
    fullName: string | null;
    age: number | null;
    householdSize: number | null;
    mealsPerDay: number | null;
    incomeLevel: unknown;
    weeklyFoodBudget: unknown;
    dietPreferences: string[];
  } | null,
) {
  return Boolean(
    profile?.fullName &&
    profile.age &&
    profile.householdSize &&
    profile.mealsPerDay &&
    profile.incomeLevel &&
    profile.weeklyFoodBudget !== null &&
    profile.dietPreferences.length,
  );
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly repository: AuthRepository,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLocaleLowerCase("tr-TR");
    if (await this.repository.findUserByEmail(email)) {
      throw new ConflictException({
        code: "EMAIL_ALREADY_REGISTERED",
        message: "Bu e-posta adresi zaten kayıtlı.",
      });
    }

    const passwordHash = await this.hashPassword(dto.password);
    const user = await this.repository.createUser(
      email,
      passwordHash,
      dto.fullName?.trim(),
    );
    return this.issueInitialTokens(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLocaleLowerCase("tr-TR");
    const user = await this.repository.findUserByEmail(email);
    if (!user || !(await verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException({
        code: "INVALID_CREDENTIALS",
        message: "E-posta veya şifre hatalı.",
      });
    }
    return this.issueInitialTokens(user);
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken, "REFRESH_TOKEN_PEPPER");
    const session = await this.repository.findRefreshSession(tokenHash);
    if (!session) throw this.invalidRefresh();

    if (session.revokedAt) {
      await this.repository.revokeFamily(session.familyId);
      throw this.invalidRefresh();
    }
    if (session.expiresAt <= new Date()) {
      await this.repository.revokeSession(session.id);
      throw this.invalidRefresh();
    }

    const nextToken = this.randomToken();
    const nextHash = this.hashToken(nextToken, "REFRESH_TOKEN_PEPPER");
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
    const nextSession = await this.repository.rotateRefreshSession({
      oldId: session.id,
      oldTokenHash: tokenHash,
      newTokenHash: nextHash,
      userId: session.userId,
      familyId: session.familyId,
      expiresAt,
    });
    if (!nextSession) throw this.invalidRefresh();

    return this.authResponse(
      session.user,
      nextSession.id,
      nextToken,
      expiresAt,
    );
  }

  async logout(sessionId: string) {
    await this.repository.revokeSession(sessionId);
  }

  async forgotPassword(dto: ForgotPasswordDto, requestId?: string) {
    const user = await this.repository.findUserByEmail(
      dto.email.trim().toLocaleLowerCase("tr-TR"),
    );
    if (!user) return;

    const token = this.randomToken();
    const tokenHash = this.hashToken(token, "PASSWORD_RESET_TOKEN_PEPPER");
    const reset = await this.repository.createPasswordResetToken(
      user.id,
      tokenHash,
      new Date(Date.now() + RESET_TOKEN_MS),
    );
    try {
      await this.email.sendPasswordReset({
        email: user.email,
        fullName: user.profile?.fullName,
        token,
        tokenId: reset.id,
      });
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          event: "password_reset_email_failed",
          requestId,
          error: error instanceof Error ? error.name : "UnknownError",
        }),
      );
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token, "PASSWORD_RESET_TOKEN_PEPPER");
    const reset = await this.repository.findPasswordResetToken(tokenHash);
    if (!reset || reset.usedAt || reset.expiresAt <= new Date()) {
      throw new UnauthorizedException({
        code: "INVALID_RESET_TOKEN",
        message: "Şifre yenileme bağlantısı geçersiz veya süresi dolmuş.",
      });
    }
    const resetSucceeded = await this.repository.resetPassword(
      reset.userId,
      reset.id,
      await this.hashPassword(dto.password),
    );
    if (!resetSucceeded) {
      throw new UnauthorizedException({
        code: "INVALID_RESET_TOKEN",
        message: "Şifre yenileme bağlantısı geçersiz veya süresi dolmuş.",
      });
    }
  }

  private async issueInitialTokens(
    user: Awaited<ReturnType<AuthRepository["findUserByEmail"]>> & {},
  ) {
    if (!user) throw new Error("Kullanıcı oluşturulamadı.");
    const refreshToken = this.randomToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
    const session = await this.repository.createRefreshSession({
      userId: user.id,
      familyId: randomUUID(),
      tokenHash: this.hashToken(refreshToken, "REFRESH_TOKEN_PEPPER"),
      expiresAt,
    });
    return this.authResponse(user, session.id, refreshToken, expiresAt);
  }

  private async authResponse(
    user: NonNullable<Awaited<ReturnType<AuthRepository["findUserByEmail"]>>>,
    sessionId: string,
    refreshToken: string,
    refreshExpiresAt: Date,
  ) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, sid: sessionId },
      { expiresIn: ACCESS_TOKEN_SECONDS },
    );
    return {
      user: {
        id: user.id,
        email: user.email,
        profileComplete: profileComplete(user.profile),
      },
      tokens: {
        tokenType: "Bearer",
        accessToken,
        accessExpiresInSeconds: ACCESS_TOKEN_SECONDS,
        refreshToken,
        refreshExpiresAt: refreshExpiresAt.toISOString(),
      },
    };
  }

  private hashPassword(password: string) {
    return hash(password, {
      algorithm: Algorithm.Argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
      outputLen: 32,
    });
  }

  private randomToken() {
    return randomBytes(32).toString("base64url");
  }

  private hashToken(token: string, variable: string) {
    const pepper = process.env[variable] ?? process.env.JWT_SECRET;
    if (!pepper) throw new Error(`${variable} tanımlı değil.`);
    return createHmac("sha256", pepper).update(token).digest("hex");
  }

  private invalidRefresh() {
    return new UnauthorizedException({
      code: "INVALID_REFRESH_TOKEN",
      message: "Refresh token geçersiz veya süresi dolmuş.",
    });
  }
}
