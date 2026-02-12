import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { TransactionType } from '../../../domain/enums/transaction-type.enum';

@Entity({ name: 'transactions' })
@Index('idx_transactions_user_id', ['user_id'])
@Index('idx_transactions_user_id_type', ['user_id', 'type'])
export class TransactionOrmEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  user_id!: string;

  @Column({ type: 'double precision' })
  amount!: number;

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
