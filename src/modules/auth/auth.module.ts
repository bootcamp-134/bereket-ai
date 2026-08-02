import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { EmailService } from "./email.service";

@Module({
  controllers: [AuthController],
  exports: [JwtModule],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthRepository, AuthService, EmailService],
})
export class AuthModule {}
