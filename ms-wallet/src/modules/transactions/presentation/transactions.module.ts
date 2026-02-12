import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { JwtStrategy } from '../../../shared/auth/jwt.strategy';
import { TRANSACTIONS_REPOSITORY } from '../application/ports/transactions-repository.port';
import { USERS_VERIFICATION_GATEWAY } from '../application/ports/users-verification-gateway.port';
import { TypeOrmTransactionsRepository } from '../infrastructure/persistence/repositories/typeorm-transactions.repository';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { ListTransactionsUseCase } from '../application/use-cases/list-transactions.use-case';
import { GetBalanceUseCase } from '../application/use-cases/get-balance.use-case';
import { TransactionOrmEntity } from '../infrastructure/persistence/entities/transaction.orm-entity';
import { UsersInternalClient } from '../infrastructure/clients/users/users-internal.client';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_INTERNAL_SECRET', 'ILIACHALLENGE_INTERNAL'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [TransactionsController],
  providers: [
    JwtStrategy,
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    GetBalanceUseCase,
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: TypeOrmTransactionsRepository,
    },
    {
      provide: USERS_VERIFICATION_GATEWAY,
      useClass: UsersInternalClient,
    },
  ],
})
export class TransactionsModule {}
