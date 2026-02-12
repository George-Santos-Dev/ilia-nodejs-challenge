import { IsEnum, IsOptional } from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class ListTransactionsQueryDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
