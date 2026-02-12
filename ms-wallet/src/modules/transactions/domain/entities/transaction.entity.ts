import { TransactionType } from '../enums/transaction-type.enum';

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  created_at: string;
};
