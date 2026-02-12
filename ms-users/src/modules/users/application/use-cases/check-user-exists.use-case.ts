import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from '../ports/users-repository.port';

@Injectable()
export class CheckUserExistsUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string): Promise<{ exists: boolean }> {
    const user = await this.usersRepository.findById(id);
    return { exists: Boolean(user) };
  }
}
