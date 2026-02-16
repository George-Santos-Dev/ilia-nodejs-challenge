import { UnauthorizedException } from '@nestjs/common';
import { TransactionsController } from '../../src/modules/transactions/presentation/transactions.controller';
import { CreateTransactionUseCase } from '../../src/modules/transactions/application/use-cases/create-transaction.use-case';
import { ListTransactionsUseCase } from '../../src/modules/transactions/application/use-cases/list-transactions.use-case';
import { GetBalanceUseCase } from '../../src/modules/transactions/application/use-cases/get-balance.use-case';
import { TransactionType } from '../../src/modules/transactions/domain/enums/transaction-type.enum';

describe('TransactionsController', () => {
  const mockCreateTransactionUseCase: jest.Mocked<CreateTransactionUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CreateTransactionUseCase>;

  const mockListTransactionsUseCase: jest.Mocked<ListTransactionsUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<ListTransactionsUseCase>;

  const mockGetBalanceUseCase: jest.Mocked<GetBalanceUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<GetBalanceUseCase>;

  const makeSut = () =>
    new TransactionsController(
      mockCreateTransactionUseCase,
      mockListTransactionsUseCase,
      mockGetBalanceUseCase,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call CreateTransactionUseCase with authenticated user id', async () => {
    const sut = makeSut();
    const request = { user: { sub: 'user-1' } } as any;
    const body = { amount: 100.25, type: TransactionType.CREDIT };
    const expected = {
      id: 'tx-1',
      user_id: 'user-1',
      amount: 100.25,
      type: TransactionType.CREDIT,
      created_at: new Date().toISOString(),
    };

    mockCreateTransactionUseCase.execute.mockResolvedValue(expected);

    const result = await sut.create(request, body);

    expect(mockCreateTransactionUseCase.execute).toHaveBeenCalledWith({
      user_id: 'user-1',
      amount: 100.25,
      type: TransactionType.CREDIT,
    });
    expect(result).toEqual(expected);
  });

  it('should call ListTransactionsUseCase with authenticated user id and query type', async () => {
    const sut = makeSut();
    const request = { user: { sub: 'user-1' } } as any;
    const query = { type: TransactionType.DEBIT };
    const expected = [
      {
        id: 'tx-2',
        user_id: 'user-1',
        amount: 20,
        type: TransactionType.DEBIT,
        created_at: new Date().toISOString(),
      },
    ];

    mockListTransactionsUseCase.execute.mockResolvedValue(expected);

    const result = await sut.list(request, query);

    expect(mockListTransactionsUseCase.execute).toHaveBeenCalledWith({
      user_id: 'user-1',
      type: TransactionType.DEBIT,
    });
    expect(result).toEqual(expected);
  });

  it('should call GetBalanceUseCase with authenticated user id', async () => {
    const sut = makeSut();
    const request = { user: { sub: 'user-1' } } as any;

    mockGetBalanceUseCase.execute.mockResolvedValue({ amount: 80.5 });

    const result = await sut.balance(request);

    expect(mockGetBalanceUseCase.execute).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ amount: 80.5 });
  });

  it('should throw UnauthorizedException when token payload has no sub in create', async () => {
    const sut = makeSut();
    const request = { user: {} } as any;

    expect(() => sut.create(request, { amount: 10, type: TransactionType.CREDIT })).toThrow(
      UnauthorizedException,
    );

    expect(mockCreateTransactionUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when token payload has invalid sub in list', async () => {
    const sut = makeSut();
    const request = { user: { sub: 123 } } as any;

    expect(() => sut.list(request, {})).toThrow(UnauthorizedException);

    expect(mockListTransactionsUseCase.execute).not.toHaveBeenCalled();
  });
});
