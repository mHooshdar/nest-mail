import { IsNotEmpty, IsString } from 'class-validator';

export class MoveMessageDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  destination: string;
}
