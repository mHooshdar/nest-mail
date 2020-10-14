import { IsNumber, IsOptional } from 'class-validator';

export class GetMailsFilterDto {
  @IsOptional()
  @IsNumber()
  offset: number;

  @IsOptional()
  @IsNumber()
  limit: number;
}
