import { GetBalanceUseCase } from '../../src/modules/transactions/application/use-cases/get-balance.use-case';
import { TransactionsRepository } from '../../src/modules/transactions/application/ports/transactions-repository.port';

describe('GetBalanceUseCase', () => {
  const mockRepository: jest.Mocked<TransactionsRepository> = {
    create: jest.fn(),
    listByUser: jest.fn(),
    getBalanceByUser: jest.fn(),
  };

  const makeSut = () => new GetBalanceUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return amount from repository', async () => {
    const sut = makeSut();
    mockRepository.getBalanceByUser.mockResolvedValue(123.45);

    const result = await sut.execute('user-1');

    expect(mockRepository.getBalanceByUser).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ amount: 123.45 });
  });
});
