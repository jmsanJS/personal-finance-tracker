import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import {
  Between,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindTransactionsDto } from './dto/find-transactions.dto';

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async findAll(
    userId: number,
    query: FindTransactionsDto,
  ): Promise<{ data: Transaction[]; total: number }> {
    const where: FindOptionsWhere<Transaction> = { userId };

    if (query.type) where.type = query.type;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.description) where.description = ILike(`%${query.description}%`);

    if (query.amountFrom && query.amountTo)
      where.amount = Between(query.amountFrom, query.amountTo);
    else if (query.amountFrom) where.amount = MoreThanOrEqual(query.amountFrom);
    else if (query.amountTo) where.amount = LessThanOrEqual(query.amountTo);

    if (query.from && query.to) where.date = Between(query.from, query.to);
    else if (query.from) where.date = MoreThanOrEqual(query.from);
    else if (query.to) where.date = LessThanOrEqual(query.to);

    const page = query.page ?? 1;
    const limit = query.limit ?? 25;

    const [data, total] = await this.transactionsRepository.findAndCount({
      where,
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async getSummary(userId: number): Promise<Summary> {
    const rows: { type: string; sum: string }[] =
      await this.transactionsRepository
        .createQueryBuilder('t')
        .select('t.type', 'type')
        .addSelect('SUM(t.amount)', 'sum')
        .where('t.userId = :userId', { userId })
        .groupBy('t.type')
        .getRawMany();

    const incomeRow = rows.find((r) => r.type === 'income');
    const expenseRow = rows.find((r) => r.type === 'expense');

    const totalIncome = parseFloat(incomeRow?.sum ?? '0');
    const totalExpenses = parseFloat(expenseRow?.sum ?? '0');

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  }

  async create(
    dto: CreateTransactionDto,
    userId: number,
  ): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({ ...dto, userId });
    return this.transactionsRepository.save(transaction);
  }

  async update(
    id: number,
    dto: UpdateTransactionDto,
    userId: number,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return this.transactionsRepository.save({ ...transaction, ...dto });
  }

  async remove(id: number, userId: number): Promise<void> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    await this.transactionsRepository.remove(transaction);
  }
}
