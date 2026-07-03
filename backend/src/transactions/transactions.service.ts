import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async findAll(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
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
