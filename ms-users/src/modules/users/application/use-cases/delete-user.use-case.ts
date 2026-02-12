import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from '../ports/users-repository.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.usersRepository.findById(id);

    if (!existing) {
      throw new NotFoundException('User not found.');
    }

    await this.usersRepository.delete(id);
  }
}
