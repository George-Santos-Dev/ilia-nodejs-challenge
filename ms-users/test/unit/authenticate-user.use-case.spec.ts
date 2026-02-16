import { UnauthorizedException } from '@nestjs/common';
import { AuthenticateUserUseCase } from '../../src/modules/auth/application/use-cases/authenticate-user.use-case';
import { PasswordHasher } from '../../src/modules/users/application/ports/password-hasher.port';
import { makeUsersRepositoryMock } from '../mocks/users-repository.mock';

describe('AuthenticateUserUseCase', () => {
  const mockRepository = makeUsersRepositoryMock();

  const mockPasswordHasher: jest.Mocked<PasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const makeSut = () => new AuthenticateUserUseCase(mockRepository, mockPasswordHasher);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    const sut = makeSut();
    mockRepository.findByEmail.mockResolvedValue(null);

    await expect(
      sut.execute({
        email: '  user@doe.com  ',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when password does not match', async () => {
    const sut = makeSut();
    mockRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'user@doe.com',
      password: 'hashed-password',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    mockPasswordHasher.compare.mockResolvedValue(false);

    await expect(
      sut.execute({
        email: '  user@doe.com  ',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should authenticate user with normalized email', async () => {
    const sut = makeSut();
    mockRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'user@doe.com',
      password: 'hashed-password',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    mockPasswordHasher.compare.mockResolvedValue(true);

    const result = await sut.execute({
      email: '  USER@DOE.COM  ',
      password: '123456',
    });

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('user@doe.com');
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith('123456', 'hashed-password');
    expect(result).toEqual({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'user@doe.com',
    });
  });
});
