import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../../application/ports/users-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class TypeOrmUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async create(input: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const entity = this.repository.create({
      id: randomUUID(),
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      password: input.password,
    });

    const persisted = await this.repository.save(entity);
    return this.toDomain(persisted);
  }

  async list(): Promise<User[]> {
    const rows = await this.repository.find({
      order: {
        created_at: 'DESC',
      },
    });

    return rows.map((row: UserOrmEntity) => this.toDomain(row));
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.repository.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repository.findOne({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async update(
    id: string,
    input: Partial<Pick<User, 'first_name' | 'last_name' | 'email' | 'password'>>,
  ): Promise<User> {
    await this.repository.update({ id }, input);
    const updated = await this.repository.findOne({ where: { id } });

    if (!updated) {
      throw new Error('User not found after update.');
    }

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  private toDomain(entity: UserOrmEntity): User {
    return {
      id: entity.id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      email: entity.email,
      password: entity.password,
      created_at: entity.created_at.toISOString(),
      updated_at: entity.updated_at.toISOString(),
    };
  }
}
