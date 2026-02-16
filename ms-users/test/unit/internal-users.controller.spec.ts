import { InternalUsersController } from '../../src/modules/users/presentation/internal-users.controller';
import { CheckUserExistsUseCase } from '../../src/modules/users/application/use-cases/check-user-exists.use-case';

describe('InternalUsersController', () => {
  const mockCheckUserExistsUseCase: jest.Mocked<CheckUserExistsUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CheckUserExistsUseCase>;

  const makeSut = () => new InternalUsersController(mockCheckUserExistsUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call CheckUserExistsUseCase with id', async () => {
    const sut = makeSut();
    mockCheckUserExistsUseCase.execute.mockResolvedValue({ exists: true });

    const result = await sut.exists('user-1');

    expect(mockCheckUserExistsUseCase.execute).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ exists: true });
  });
});
