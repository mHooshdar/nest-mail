import { IsNotEmpty, IsString } from "class-validator";

export class AddBoxDto {
  @IsString()
  @IsNotEmpty()
  box: string;
}