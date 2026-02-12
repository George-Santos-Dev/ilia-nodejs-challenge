import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import {
  TRANSACTIONS_REPOSITORY,
  TransactionsRepository,
} from '../ports/transactions-repository.port';
import {
  USERS_VERIFICATION_GATEWAY,
  UsersVerificationGateway,
} from '../ports/users-verification-gateway.port';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: TransactionsRepository,
    @Inject(USERS_VERIFICATION_GATEWAY)
    private readonly usersVerificationGateway: UsersVerificationGateway,
  ) {}

  async execute(input: {
    user_id: string;
    amount: number;
    type: TransactionType;
  }): Promise<Transaction> {
    const userExists = await this.usersVerificationGateway.userExists(input.user_id);

    if (!userExists) {
      throw new NotFoundException('User not found for transaction.');
    }

    if (input.type === TransactionType.DEBIT) {
      const currentBalance = await this.transactionsRepository.getBalanceByUser(input.user_id);

      if (input.amount > currentBalance) {
        throw new UnprocessableEntityException('Insufficient balance for DEBIT transaction.');
      }
    }

    return this.transactionsRepository.create(input);
  }
}
