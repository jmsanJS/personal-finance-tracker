import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionsController } from './transactions.controller';

@Module({
  providers: [TransactionsService],
  imports: [TypeOrmModule.forFeature([Transaction]), AuthModule],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
