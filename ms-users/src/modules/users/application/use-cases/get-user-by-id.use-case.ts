import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserPublic } from '../../domain/entities/user.entity';
import { USERS_REPOSITORY, UsersRepository } from '../ports/users-repository.port';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string): Promise<UserPublic> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }
}
