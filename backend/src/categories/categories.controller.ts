import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
    @Request() req: { user: { sub: number } },
  ) {
    return this.categoriesService.update(id, dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number, @Request() req: { user: { sub: number } }) {
    return this.categoriesService.remove(id, req.user.sub);
  }
}
