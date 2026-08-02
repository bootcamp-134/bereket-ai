import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { EmailService } from "./email.service";
import { resendClientProvider } from "./resend.provider";

@Module({
  controllers: [AuthController],
  exports: [JwtModule],
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({ secret: process.env.JWT_ACCESS_SECRET }),
    }),
  ],
  providers: [AuthRepository, AuthService, EmailService, resendClientProvider],
})
export class AuthModule {}
