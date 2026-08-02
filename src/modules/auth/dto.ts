import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "samet@bereket.app" })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiPropertyOptional({ example: "Samet Dönmez" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiProperty({ example: "StrongPass123!" })
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: "samet@bereket.app" })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ example: "StrongPass123!" })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  refreshToken!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: "samet@bereket.app" })
  @IsEmail()
  @MaxLength(254)
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  token!: string;

  @ApiProperty({ example: "NewStrongPass123!" })
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;
}
