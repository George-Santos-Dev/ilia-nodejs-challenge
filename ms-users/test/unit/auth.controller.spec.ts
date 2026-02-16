import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../../src/modules/auth/presentation/auth.controller';
import { AuthenticateUserUseCase } from '../../src/modules/auth/application/use-cases/authenticate-user.use-case';

describe('AuthController', () => {
  const mockJwtService: jest.Mocked<JwtService> = {
    sign: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  const mockAuthenticateUserUseCase: jest.Mocked<AuthenticateUserUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<AuthenticateUserUseCase>;

  const makeSut = () => new AuthController(mockJwtService, mockAuthenticateUserUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return authenticated user and access token', async () => {
    const sut = makeSut();
    const body = { email: 'user@doe.com', password: '123456' };
    const authenticatedUser = {
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'user@doe.com',
    };

    mockAuthenticateUserUseCase.execute.mockResolvedValue(authenticatedUser);
    mockJwtService.sign.mockReturnValue('jwt-token');

    const result = await sut.authenticate(body);

    expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith(body);
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'user@doe.com',
    });
    expect(result).toEqual({
      user: authenticatedUser,
      access_token: 'jwt-token',
    });
  });
});
