import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class MonthlyExpensesDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn([1, 2])
  month?: number;
}
