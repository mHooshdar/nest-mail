import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetMailsFilterDto {
  @IsOptional()
  @IsNumber()
  offset: number;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  box: string;
}
