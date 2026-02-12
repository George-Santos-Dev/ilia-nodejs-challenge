import { Inject, Injectable } from '@nestjs/common';
import { UserPublic } from '../../domain/entities/user.entity';
import { USERS_REPOSITORY, UsersRepository } from '../ports/users-repository.port';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(): Promise<UserPublic[]> {
    const users = await this.usersRepository.list();

    return users.map((user) => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }));
  }
}
