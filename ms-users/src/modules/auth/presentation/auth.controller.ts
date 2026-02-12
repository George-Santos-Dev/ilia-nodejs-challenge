import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../application/dtos/auth.dto';
import { AuthenticateUserUseCase } from '../application/use-cases/authenticate-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post()
  async authenticate(@Body() body: AuthDto) {
    const user = await this.authenticateUserUseCase.execute(body);

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user,
      access_token: accessToken,
    };
  }
}
