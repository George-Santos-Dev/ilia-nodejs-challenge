import { NotFoundException } from '@nestjs/common';
import { GetUserByIdUseCase } from '../../src/modules/users/application/use-cases/get-user-by-id.use-case';
import { makeUsersRepositoryMock } from '../mocks/users-repository.mock';

describe('GetUserByIdUseCase', () => {
  const mockRepository = makeUsersRepositoryMock();

  const makeSut = () => new GetUserByIdUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const sut = makeSut();
    mockRepository.findById.mockResolvedValue(null);

    await expect(sut.execute('user-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should return sanitized user when user exists', async () => {
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

    const result = await sut.execute('user-1');

    expect(mockRepository.findById).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@doe.com',
    });
  });
});
