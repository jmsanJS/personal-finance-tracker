import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindTransactionsDto } from './dto/find-transactions.dto';
import { MonthlyTrendsDto } from './dto/monthly-trends.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query() query: FindTransactionsDto,
    @Request() req: { user: { sub: number } },
  ) {
    return this.transactionsService.findAll(req.user.sub, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  getSummary(@Request() req: { user: { sub: number } }) {
    return this.transactionsService.getSummary(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary/by-category')
  getCategorySummary(@Request() req: { user: { sub: number } }) {
    return this.transactionsService.getCategorySummary(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary/monthly-trends')
  getMonthlyTrends(
    @Query() query: MonthlyTrendsDto,
    @Request() req: { user: { sub: number } },
  ) {
    return this.transactionsService.getMonthlyTrends(
      req.user.sub,
      query.months ?? 6,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateTransactionDto,
    @Request() req: { user: { sub: number } },
  ) {
    return this.transactionsService.create(dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateTransactionDto,
    @Request() req: { user: { sub: number } },
  ) {
    return this.transactionsService.update(id, dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number, @Request() req: { user: { sub: number } }) {
    return this.transactionsService.remove(id, req.user.sub);
  }
}
