import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PASSWORD_HASHER, PasswordHasher } from '../ports/password-hasher.port';
import { USERS_REPOSITORY, UsersRepository } from '../ports/users-repository.port';
import { UserPublic } from '../../domain/entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(id: string, input: UpdateUserDto): Promise<UserPublic> {
    const existing = await this.usersRepository.findById(id);

    if (!existing) {
      throw new NotFoundException('User not found.');
    }

    const normalizedEmail = input.email?.trim().toLowerCase();

    if (normalizedEmail && normalizedEmail !== existing.email) {
      const userWithEmail = await this.usersRepository.findByEmail(normalizedEmail);

      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictException('Email already in use.');
      }
    }

    const payload = { ...input, ...(normalizedEmail ? { email: normalizedEmail } : {}) };

    if (payload.password) {
      payload.password = await this.passwordHasher.hash(payload.password);
    }

    const updated = await this.usersRepository.update(id, payload);

    return {
      id: updated.id,
      first_name: updated.first_name,
      last_name: updated.last_name,
      email: updated.email,
    };
  }
}
