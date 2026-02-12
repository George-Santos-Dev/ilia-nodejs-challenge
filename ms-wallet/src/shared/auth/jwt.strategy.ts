import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_EXTERNAL_SECRET', 'ILIACHALLENGE'),
    });
  }

  validate(payload: Record<string, unknown>) {
    if (!payload?.sub || typeof payload.sub !== 'string') {
      throw new UnauthorizedException('Invalid token payload.');
    }

    return payload;
  }
}
