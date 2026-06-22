import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: { user: { sub: number } }) {
    return this.categoriesService.findAll(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateCategoryDto,
    @Request() req: { user: { sub: number } },
  ) {
    return this.categoriesService.create(dto, req.user.sub);
  }
}
