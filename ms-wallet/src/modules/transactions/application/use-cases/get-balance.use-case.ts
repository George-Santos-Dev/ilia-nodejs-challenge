import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTIONS_REPOSITORY,
  TransactionsRepository,
} from '../ports/transactions-repository.port';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute(userId: string): Promise<{ amount: number }> {
    const amount = await this.transactionsRepository.getBalanceByUser(userId);
    return { amount };
  }
}
