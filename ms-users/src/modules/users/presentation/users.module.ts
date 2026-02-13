import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { CheckUserExistsUseCase } from '../application/use-cases/check-user-exists.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { PASSWORD_HASHER } from '../application/ports/password-hasher.port';
import { USERS_REPOSITORY } from '../application/ports/users-repository.port';
import { BcryptPasswordHasherService } from '../infrastructure/cryptography/bcrypt-password-hasher.service';
import { UserOrmEntity } from '../infrastructure/persistence/entities/user.orm-entity';
import { TypeOrmUsersRepository } from '../infrastructure/persistence/repositories/typeorm-users.repository';
import { DefaultUserSeedService } from '../infrastructure/seed/default-user.seed.service';
import { InternalJwtStrategy } from '../../../shared/auth/internal-jwt.strategy';
import { InternalUsersController } from './internal-users.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController, InternalUsersController],
  providers: [
    CreateUserUseCase,
    CheckUserExistsUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    DefaultUserSeedService,
    InternalJwtStrategy,
    {
      provide: USERS_REPOSITORY,
      useClass: TypeOrmUsersRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasherService,
    },
  ],
  exports: [USERS_REPOSITORY, PASSWORD_HASHER],
})
export class UsersModule {}
