import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../src/modules/transactions/application/use-cases/create-transaction.use-case';
import { TransactionType } from '../../src/modules/transactions/domain/enums/transaction-type.enum';
import { TransactionsRepository } from '../../src/modules/transactions/application/ports/transactions-repository.port';
import { UsersVerificationGateway } from '../../src/modules/transactions/application/ports/users-verification-gateway.port';

describe('CreateTransactionUseCase', () => {
  const mockRepository: jest.Mocked<TransactionsRepository> = {
    create: jest.fn(),
    listByUser: jest.fn(),
    getBalanceByUser: jest.fn(),
  };

  const mockUsersGateway: jest.Mocked<UsersVerificationGateway> = {
    userExists: jest.fn(),
  };

  const makeSut = () => new CreateTransactionUseCase(mockRepository, mockUsersGateway);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const sut = makeSut();
    mockUsersGateway.userExists.mockResolvedValue(false);

    await expect(
      sut.execute({
        user_id: 'user-1',
        amount: 10.5,
        type: TransactionType.CREDIT,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(mockRepository.create).not.toHaveBeenCalled();
    expect(mockRepository.getBalanceByUser).not.toHaveBeenCalled();
  });

  it('should create CREDIT transaction when user exists', async () => {
    const sut = makeSut();
    mockUsersGateway.userExists.mockResolvedValue(true);
    mockRepository.create.mockResolvedValue({
      id: 'tx-1',
      user_id: 'user-1',
      amount: 10.5,
      type: TransactionType.CREDIT,
      created_at: new Date().toISOString(),
    });

    const result = await sut.execute({
      user_id: 'user-1',
      amount: 10.5,
      type: TransactionType.CREDIT,
    });

    expect(mockRepository.create).toHaveBeenCalledWith({
      user_id: 'user-1',
      amount: 10.5,
      type: TransactionType.CREDIT,
    });
    expect(mockRepository.getBalanceByUser).not.toHaveBeenCalled();
    expect(result.id).toBe('tx-1');
  });

  it('should throw UnprocessableEntityException when DEBIT amount is greater than balance', async () => {
    const sut = makeSut();
    mockUsersGateway.userExists.mockResolvedValue(true);
    mockRepository.getBalanceByUser.mockResolvedValue(50);

    await expect(
      sut.execute({
        user_id: 'user-1',
        amount: 100,
        type: TransactionType.DEBIT,
      }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should create DEBIT transaction when there is enough balance', async () => {
    const sut = makeSut();
    mockUsersGateway.userExists.mockResolvedValue(true);
    mockRepository.getBalanceByUser.mockResolvedValue(200);
    mockRepository.create.mockResolvedValue({
      id: 'tx-2',
      user_id: 'user-1',
      amount: 100,
      type: TransactionType.DEBIT,
      created_at: new Date().toISOString(),
    });

    const result = await sut.execute({
      user_id: 'user-1',
      amount: 100,
      type: TransactionType.DEBIT,
    });

    expect(mockRepository.getBalanceByUser).toHaveBeenCalledWith('user-1');
    expect(mockRepository.create).toHaveBeenCalledWith({
      user_id: 'user-1',
      amount: 100,
      type: TransactionType.DEBIT,
    });
    expect(result.id).toBe('tx-2');
  });
});
