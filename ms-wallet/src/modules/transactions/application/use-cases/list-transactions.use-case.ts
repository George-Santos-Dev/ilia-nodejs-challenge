import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import {
  TRANSACTIONS_REPOSITORY,
  TransactionsRepository,
} from '../ports/transactions-repository.port';

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  execute(input: { user_id: string; type?: TransactionType }): Promise<Transaction[]> {
    return this.transactionsRepository.listByUser(input);
  }
}
