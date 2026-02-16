import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from '../../src/modules/users/application/use-cases/delete-user.use-case';
import { makeUsersRepositoryMock } from '../mocks/users-repository.mock';

describe('DeleteUserUseCase', () => {
  const mockRepository = makeUsersRepositoryMock();

  const makeSut = () => new DeleteUserUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const sut = makeSut();
    mockRepository.findById.mockResolvedValue(null);

    await expect(sut.execute('user-1')).rejects.toBeInstanceOf(NotFoundException);

    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it('should delete user when user exists', async () => {
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
    mockRepository.delete.mockResolvedValue();

    await sut.execute('user-1');

    expect(mockRepository.delete).toHaveBeenCalledWith('user-1');
  });
});
