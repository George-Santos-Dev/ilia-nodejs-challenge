import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from '../../src/modules/users/application/use-cases/create-user.use-case';
import { PasswordHasher } from '../../src/modules/users/application/ports/password-hasher.port';
import { makeUsersRepositoryMock } from '../mocks/users-repository.mock';

describe('CreateUserUseCase', () => {
  const mockRepository = makeUsersRepositoryMock();

  const mockPasswordHasher: jest.Mocked<PasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const makeSut = () => new CreateUserUseCase(mockRepository, mockPasswordHasher);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw ConflictException when email already exists', async () => {
    const sut = makeSut();
    mockRepository.findByEmail.mockResolvedValue({
      id: 'user-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
      password: 'hashed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await expect(
      sut.execute({
        first_name: 'Jane',
        last_name: 'Doe',
        email: '  JOHN@DOE.COM  ',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should create user with normalized email and hashed password', async () => {
    const sut = makeSut();
    mockRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue('hashed-password');
    mockRepository.create.mockResolvedValue({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@doe.com',
      password: 'hashed-password',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const result = await sut.execute({
      first_name: 'Jane',
      last_name: 'Doe',
      email: '  JANE@DOE.COM  ',
      password: '123456',
    });

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('jane@doe.com');
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('123456');
    expect(mockRepository.create).toHaveBeenCalledWith({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@doe.com',
      password: 'hashed-password',
    });
    expect(result).toEqual({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@doe.com',
    });
  });
});
