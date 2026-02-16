import { ListTransactionsUseCase } from '../../src/modules/transactions/application/use-cases/list-transactions.use-case';
import { TransactionsRepository } from '../../src/modules/transactions/application/ports/transactions-repository.port';
import { TransactionType } from '../../src/modules/transactions/domain/enums/transaction-type.enum';

describe('ListTransactionsUseCase', () => {
  const mockRepository: jest.Mocked<TransactionsRepository> = {
    create: jest.fn(),
    listByUser: jest.fn(),
    getBalanceByUser: jest.fn(),
  };

  const makeSut = () => new ListTransactionsUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return transactions filtered by type', async () => {
    const sut = makeSut();
    mockRepository.listByUser.mockResolvedValue([
      {
        id: 'tx-1',
        user_id: 'user-1',
        amount: 10,
        type: TransactionType.CREDIT,
        created_at: new Date().toISOString(),
      },
    ]);

    const result = await sut.execute({
      user_id: 'user-1',
      type: TransactionType.CREDIT,
    });

    expect(mockRepository.listByUser).toHaveBeenCalledWith({
      user_id: 'user-1',
      type: TransactionType.CREDIT,
    });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(TransactionType.CREDIT);
  });
});
