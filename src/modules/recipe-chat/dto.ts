import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateRecipeChatSessionDto {
  @ApiProperty({ example: "rec_ee178dd463626f74" })
  @IsString()
  @MaxLength(80)
  recipeId!: string;
}

export class SendRecipeChatMessageDto {
  @ApiProperty({ example: "Fırınım yoksa bunu tencerede yapabilir miyim?" })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  message!: string;
}
