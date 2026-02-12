import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateTransactionDto } from '../application/dtos/create-transaction.dto';
import { ListTransactionsQueryDto } from '../application/dtos/list-transactions-query.dto';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { ListTransactionsUseCase } from '../application/use-cases/list-transactions.use-case';
import { GetBalanceUseCase } from '../application/use-cases/get-balance.use-case';

@Controller()
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly getBalanceUseCase: GetBalanceUseCase,
  ) {}

  @Post('transactions')
  create(
    @Req() req: Request & { user?: Record<string, unknown> },
    @Body() body: CreateTransactionDto,
  ) {
    const authenticatedUserId = this.getAuthenticatedUserId(req);
    return this.createTransactionUseCase.execute({
      user_id: authenticatedUserId,
      amount: body.amount,
      type: body.type,
    });
  }

  @Get('transactions')
  list(
    @Req() req: Request & { user?: Record<string, unknown> },
    @Query() query: ListTransactionsQueryDto,
  ) {
    const authenticatedUserId = this.getAuthenticatedUserId(req);
    return this.listTransactionsUseCase.execute({
      user_id: authenticatedUserId,
      type: query.type,
    });
  }

  @Get('balance')
  balance(@Req() req: Request & { user?: Record<string, unknown> }) {
    const authenticatedUserId = this.getAuthenticatedUserId(req);
    return this.getBalanceUseCase.execute(authenticatedUserId);
  }

  private getAuthenticatedUserId(req: Request & { user?: Record<string, unknown> }): string {
    const userId = req.user?.sub;

    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException('Authenticated user not found in token.');
    }

    return userId;
  }
}
