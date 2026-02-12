import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { JwtStrategy } from '../../../shared/auth/jwt.strategy';
import { TRANSACTIONS_REPOSITORY } from '../application/ports/transactions-repository.port';
import { TypeOrmTransactionsRepository } from '../infrastructure/persistence/repositories/typeorm-transactions.repository';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { ListTransactionsUseCase } from '../application/use-cases/list-transactions.use-case';
import { GetBalanceUseCase } from '../application/use-cases/get-balance.use-case';
import { TransactionOrmEntity } from '../infrastructure/persistence/entities/transaction.orm-entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_EXTERNAL_SECRET', 'ILIACHALLENGE'),
        signOptions: { expiresIn: '1h' },
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
  ],
})
export class TransactionsModule {}
