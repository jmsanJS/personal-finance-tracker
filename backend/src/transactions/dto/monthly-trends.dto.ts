import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class MonthlyTrendsDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn([3, 6, 12])
  months?: number;
}
