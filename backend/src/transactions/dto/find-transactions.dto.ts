import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FindTransactionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  amountFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  amountTo?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsIn(['income', 'expense'])
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;
}
