import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesController } from './categories.controller';

@Module({
  providers: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
