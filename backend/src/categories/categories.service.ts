import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(userId: number): Promise<Category[]> {
    return this.categoriesRepository.find({ where: { userId } });
  }

  async create(dto: CreateCategoryDto, userId: number): Promise<Category> {
    const category = this.categoriesRepository.create({ ...dto, userId });
    return this.categoriesRepository.save(category);
  }
}
