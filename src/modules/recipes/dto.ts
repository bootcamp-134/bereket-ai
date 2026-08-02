import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class RecipeQueryDto {
  @ApiPropertyOptional({ example: "makarna" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ example: "Ana Yemek" })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @ApiPropertyOptional({ example: "Kolay" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  difficulty?: string;

  @ApiPropertyOptional({
    description: "Virgülle ayrılmış alerjen kategorileri.",
    example: "gluten,sut",
  })
  @IsOptional()
  @IsString()
  excludeAllergens?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize = 20;
}
