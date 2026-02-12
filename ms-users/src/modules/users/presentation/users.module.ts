import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { PASSWORD_HASHER } from '../application/ports/password-hasher.port';
import { USERS_REPOSITORY } from '../application/ports/users-repository.port';
import { BcryptPasswordHasherService } from '../infrastructure/cryptography/bcrypt-password-hasher.service';
import { UserOrmEntity } from '../infrastructure/persistence/entities/user.orm-entity';
import { TypeOrmUsersRepository } from '../infrastructure/persistence/repositories/typeorm-users.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
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
