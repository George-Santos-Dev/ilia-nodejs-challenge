import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersVerificationGateway } from '../../../application/ports/users-verification-gateway.port';

@Injectable()
export class UsersInternalClient implements UsersVerificationGateway {
  private readonly usersServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.usersServiceUrl = this.configService.get<string>(
      'USERS_SERVICE_URL',
      'http://ms-users:3002',
    );
  }

  async userExists(userId: string): Promise<boolean> {
    const token = this.jwtService.sign(
      {
        scope: 'internal',
        service: 'ms-wallet',
      },
      {
        subject: 'ms-wallet',
        expiresIn: '60s',
      },
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(`${this.usersServiceUrl}/internal/users/${userId}/exists`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ServiceUnavailableException('Users service unavailable for internal validation.');
      }

      const payload = (await response.json()) as { exists?: boolean };
      return payload.exists === true;
    } catch {
      throw new ServiceUnavailableException('Users service unavailable for internal validation.');
    } finally {
      clearTimeout(timeout);
    }
  }
}
