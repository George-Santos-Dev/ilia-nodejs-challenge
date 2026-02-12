import { User } from '../../domain/entities/user.entity';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UsersRepository {
  create(input: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<User>;
  list(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(
    id: string,
    input: Partial<Pick<User, 'first_name' | 'last_name' | 'email' | 'password'>>,
  ): Promise<User>;
  delete(id: string): Promise<void>;
}
