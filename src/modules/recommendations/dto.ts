import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";

export class RecommendRecipesDto {
  @ApiProperty({
    example: ["tavuk", "patates", "yoğurt", "domates"],
    maxItems: 20,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  availableIngredients!: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  wantsToShop!: boolean;

  @ApiPropertyOptional({ example: 250, minimum: 0 })
  @ValidateIf((object: RecommendRecipesDto) => object.wantsToShop)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  budgetTry?: number;
}
