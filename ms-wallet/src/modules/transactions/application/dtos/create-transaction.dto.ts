import { Type } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class CreateTransactionDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;
}
