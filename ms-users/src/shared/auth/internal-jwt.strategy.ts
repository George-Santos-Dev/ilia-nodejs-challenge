import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class InternalJwtStrategy extends PassportStrategy(Strategy, 'jwt-internal') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_INTERNAL_SECRET', 'ILIACHALLENGE_INTERNAL'),
    });
  }

  validate(payload: Record<string, unknown>) {
    if (!payload?.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedException('Invalid internal token payload.');
    }

    return payload;
  }
}
