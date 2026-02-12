import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/presentation/users.module';
import { AuthenticateUserUseCase } from '../application/use-cases/authenticate-user.use-case';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../../shared/auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_EXTERNAL_SECRET', 'ILIACHALLENGE'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthenticateUserUseCase],
  exports: [JwtModule],
})
export class AuthModule {}
