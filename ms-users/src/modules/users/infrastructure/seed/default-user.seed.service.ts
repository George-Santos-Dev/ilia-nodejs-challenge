import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PASSWORD_HASHER, PasswordHasher } from '../../application/ports/password-hasher.port';
import { USERS_REPOSITORY, UsersRepository } from '../../application/ports/users-repository.port';

@Injectable()
export class DefaultUserSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DefaultUserSeedService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const enabled =
      this.configService.get<string>('SEED_DEFAULT_USER', 'false').toLowerCase() === 'true';

    if (!enabled) {
      return;
    }

    const emailRaw = this.configService.get<string>('SEED_DEFAULT_USER_EMAIL', '');
    const password = this.configService.get<string>('SEED_DEFAULT_USER_PASSWORD', '');
    const firstName = this.configService.get<string>('SEED_DEFAULT_USER_FIRST_NAME', 'Default');
    const lastName = this.configService.get<string>('SEED_DEFAULT_USER_LAST_NAME', 'User');

    const email = emailRaw.trim().toLowerCase();

    if (!email || !password) {
      this.logger.warn('Default user seed skipped: email or password not configured.');
      return;
    }

    const existing = await this.usersRepository.findByEmail(email);

    if (existing) {
      this.logger.log(`Default user seed skipped: user already exists (${email}).`);
      return;
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    await this.usersRepository.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
    });

    this.logger.log(`Default user seeded successfully (${email}).`);
  }
}
