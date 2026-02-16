import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from '../../src/modules/users/application/use-cases/update-user.use-case';
import { PasswordHasher } from '../../src/modules/users/application/ports/password-hasher.port';
import { makeUsersRepositoryMock } from '../mocks/users-repository.mock';

describe('UpdateUserUseCase', () => {
  const mockRepository = makeUsersRepositoryMock();

  const mockPasswordHasher: jest.Mocked<PasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const makeSut = () => new UpdateUserUseCase(mockRepository, mockPasswordHasher);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const sut = makeSut();
    mockRepository.findById.mockResolvedValue(null);

    await expect(sut.execute('user-1', { first_name: 'Jane' })).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when email is used by another user', async () => {
    const sut = makeSut();
    mockRepository.findById.mockResolvedValue({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@doe.com',
      password: 'hashed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    mockRepository.findByEmail.mockResolvedValue({
      id: 'user-2',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
      password: 'hashed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await expect(sut.execute('user-1', { email: '  JOHN@DOE.COM  ' })).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should update user with normalized email and hashed password', async () => {
    const sut = makeSut();
    mockRepository.findById.mockResolvedValue({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@doe.com',
      password: 'hashed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    mockRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue('new-hashed-password');
    mockRepository.update.mockResolvedValue({
      id: 'user-1',
      first_name: 'Janet',
      last_name: 'Doe',
      email: 'janet@doe.com',
      password: 'new-hashed-password',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const result = await sut.execute('user-1', {
      first_name: 'Janet',
      email: '  JANET@DOE.COM  ',
      password: '654321',
    });

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('janet@doe.com');
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('654321');
    expect(mockRepository.update).toHaveBeenCalledWith('user-1', {
      first_name: 'Janet',
      email: 'janet@doe.com',
      password: 'new-hashed-password',
    });
    expect(result).toEqual({
      id: 'user-1',
      first_name: 'Janet',
      last_name: 'Doe',
      email: 'janet@doe.com',
    });
  });
});
