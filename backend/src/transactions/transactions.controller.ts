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
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: { user: { sub: number } }) {
    return this.transactionsService.findAll(req.user.sub);
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
