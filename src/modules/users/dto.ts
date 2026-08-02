import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";

const whenDefined = (_object: unknown, value: unknown) => value !== undefined;

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "Samet Dönmez" })
  @ValidateIf(whenDefined)
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @ApiPropertyOptional({ example: 28, minimum: 13, maximum: 120 })
  @ValidateIf(whenDefined)
  @Type(() => Number)
  @IsInt()
  @Min(13)
  @Max(120)
  age?: number;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 30 })
  @ValidateIf(whenDefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  householdSize?: number;

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 10 })
  @ValidateIf(whenDefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  mealsPerDay?: number;

  @ApiPropertyOptional({ enum: ["unspecified", "low", "middle", "high"] })
  @ValidateIf(whenDefined)
  @IsIn(["unspecified", "low", "middle", "high"])
  incomeLevel?: "unspecified" | "low" | "middle" | "high";

  @ApiPropertyOptional({ example: 1500, minimum: 0 })
  @ValidateIf(whenDefined)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  weeklyFoodBudget?: number;

  @ApiPropertyOptional({ example: ["balanced"] })
  @ValidateIf(whenDefined)
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  dietPreferences?: string[];

  @ApiPropertyOptional({ example: ["gluten", "sut"] })
  @ValidateIf(whenDefined)
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  allergens?: string[];
}
