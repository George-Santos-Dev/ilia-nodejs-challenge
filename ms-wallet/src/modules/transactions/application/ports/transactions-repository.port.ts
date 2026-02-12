import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

export const TRANSACTIONS_REPOSITORY = Symbol('TRANSACTIONS_REPOSITORY');

export interface TransactionsRepository {
  create(input: { user_id: string; amount: number; type: TransactionType }): Promise<Transaction>;
  listByUser(input: { user_id: string; type?: TransactionType }): Promise<Transaction[]>;
  getBalanceByUser(userId: string): Promise<number>;
}
