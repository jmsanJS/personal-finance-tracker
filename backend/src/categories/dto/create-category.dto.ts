import { IsIn, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsIn(['income', 'expense'])
  type!: string;

  @IsString()
  color!: string;
}
