import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { TransactionsRepository } from '../../../application/ports/transactions-repository.port';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransactionType } from '../../../domain/enums/transaction-type.enum';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';

@Injectable()
export class TypeOrmTransactionsRepository implements TransactionsRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {}

  async create(input: {
    user_id: string;
    amount: number;
    type: TransactionType;
  }): Promise<Transaction> {
    const entity = this.repository.create({
      id: randomUUID(),
      user_id: input.user_id,
      amount: input.amount,
      type: input.type,
    });

    const persisted = await this.repository.save(entity);
    return this.toDomain(persisted);
  }

  async listByUser(input: { user_id: string; type?: TransactionType }): Promise<Transaction[]> {
    const rows = await this.repository.find({
      where: {
        user_id: input.user_id,
        ...(input.type ? { type: input.type } : {}),
      },
      order: {
        created_at: 'DESC',
      },
    });

    return rows.map((row: TransactionOrmEntity) => this.toDomain(row));
  }

  async getBalanceByUser(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('t')
      .select(
        "COALESCE(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END), 0)",
        'amount',
      )
      .where('t.user_id = :userId', { userId })
      .getRawOne<{ amount: string | number | null }>();

    return Number(result?.amount ?? 0);
  }

  private toDomain(entity: TransactionOrmEntity): Transaction {
    return {
      id: entity.id,
      user_id: entity.user_id,
      amount: Number(entity.amount),
      type: entity.type,
      created_at: entity.created_at.toISOString(),
    };
  }
}
