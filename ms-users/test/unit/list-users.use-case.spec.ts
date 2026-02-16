import { ListUsersUseCase } from '../../src/modules/users/application/use-cases/list-users.use-case';
import { makeUsersRepositoryMock } from '../mocks/users-repository.mock';

describe('ListUsersUseCase', () => {
  const mockRepository = makeUsersRepositoryMock();

  const makeSut = () => new ListUsersUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return sanitized users list', async () => {
    const sut = makeSut();
    mockRepository.list.mockResolvedValue([
      {
        id: 'user-1',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@doe.com',
        password: 'hashed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    const result = await sut.execute();

    expect(mockRepository.list).toHaveBeenCalled();
    expect(result).toEqual([
      {
        id: 'user-1',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@doe.com',
      },
    ]);
  });
});
