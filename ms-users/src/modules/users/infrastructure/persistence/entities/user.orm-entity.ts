import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@Unique('uq_users_email', ['email'])
export class UserOrmEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  first_name!: string;

  @Column({ type: 'text' })
  last_name!: string;

  @Index('idx_users_email')
  @Column({ type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  password!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}
