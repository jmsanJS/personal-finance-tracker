import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    const defaultCategories = await this.categoriesRepository.find({
      where: { userId: IsNull() },
    });

    if (defaultCategories.length === 0) {
      await this.categoriesRepository.save([
        // Expenses
        { name: 'Food & Groceries', type: 'expense', color: '#ef4444' },
        { name: 'Transport', type: 'expense', color: '#f97316' },
        { name: 'Housing', type: 'expense', color: '#eab308' },
        { name: 'Health', type: 'expense', color: '#ec4899' },
        { name: 'Entertainment', type: 'expense', color: '#8b5cf6' },
        { name: 'Shopping', type: 'expense', color: '#06b6d4' },
        { name: 'Utilities', type: 'expense', color: '#64748b' },
        { name: 'Education', type: 'expense', color: '#0ea5e9' },
        { name: 'Sports', type: 'expense', color: '#22c55e' },
        { name: 'Holidays', type: 'expense', color: '#fb923c' },
        { name: 'Presents', type: 'expense', color: '#f43f5e' },
        { name: 'Donations', type: 'expense', color: '#a78bfa' },
        { name: 'Insurance', type: 'expense', color: '#475569' },
        // Income
        { name: 'Salary', type: 'income', color: '#16a34a' },
        { name: 'Freelance', type: 'income', color: '#10b981' },
        { name: 'Investments', type: 'income', color: '#6366f1' },
        { name: 'Other Income', type: 'income', color: '#84cc16' },
        { name: 'Bonus', type: 'income', color: '#f59e0b' },
        { name: 'Refunds', type: 'income', color: '#14b8a6' },
      ]);
    }
  }

  async findAll(userId: number): Promise<Category[]> {
    return await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.userId = :userId', { userId })
      .orWhere('category.userId IS NULL')
      .getMany();
  }

  async create(dto: CreateCategoryDto, userId: number): Promise<Category> {
    const category = this.categoriesRepository.create({ ...dto, userId });
    return this.categoriesRepository.save(category);
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoriesRepository.save({ ...category, ...dto });
  }

  async remove(id: number, userId: number): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoriesRepository.remove(category);
  }
}
