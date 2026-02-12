import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PASSWORD_HASHER, PasswordHasher } from '../ports/password-hasher.port';
import { USERS_REPOSITORY, UsersRepository } from '../ports/users-repository.port';
import { UserPublic } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserDto): Promise<UserPublic> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existing = await this.usersRepository.findByEmail(normalizedEmail);

    if (existing) {
      throw new ConflictException('Email already in use.');
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    const created = await this.usersRepository.create({
      ...input,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return this.sanitize(created);
  }

  private sanitize(user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }): UserPublic {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }
}
