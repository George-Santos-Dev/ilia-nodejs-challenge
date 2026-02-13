import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '../dtos/auth.dto';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../../../users/application/ports/password-hasher.port';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../../users/application/ports/users-repository.port';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: AuthDto) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const user = await this.usersRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await this.passwordHasher.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }
}
