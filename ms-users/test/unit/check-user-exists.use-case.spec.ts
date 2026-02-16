import { CheckUserExistsUseCase } from '../../src/modules/users/application/use-cases/check-user-exists.use-case';
import { makeUsersRepositoryMock } from '../mocks/users-repository.mock';

describe('CheckUserExistsUseCase', () => {
  const mockRepository = makeUsersRepositoryMock();

  const makeSut = () => new CheckUserExistsUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return exists false when user does not exist', async () => {
    const sut = makeSut();
    mockRepository.findById.mockResolvedValue(null);

    const result = await sut.execute('user-1');

    expect(mockRepository.findById).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ exists: false });
  });

  it('should return exists true when user exists', async () => {
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

    expect(result).toEqual({ exists: true });
  });
});
