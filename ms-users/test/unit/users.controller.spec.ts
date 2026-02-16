import { UsersController } from '../../src/modules/users/presentation/users.controller';
import { CreateUserUseCase } from '../../src/modules/users/application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../src/modules/users/application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../src/modules/users/application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../src/modules/users/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../src/modules/users/application/use-cases/delete-user.use-case';

describe('UsersController', () => {
  const mockCreateUserUseCase: jest.Mocked<CreateUserUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CreateUserUseCase>;

  const mockListUsersUseCase: jest.Mocked<ListUsersUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<ListUsersUseCase>;

  const mockGetUserByIdUseCase: jest.Mocked<GetUserByIdUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<GetUserByIdUseCase>;

  const mockUpdateUserUseCase: jest.Mocked<UpdateUserUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<UpdateUserUseCase>;

  const mockDeleteUserUseCase: jest.Mocked<DeleteUserUseCase> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<DeleteUserUseCase>;

  const makeSut = () =>
    new UsersController(
      mockCreateUserUseCase,
      mockListUsersUseCase,
      mockGetUserByIdUseCase,
      mockUpdateUserUseCase,
      mockDeleteUserUseCase,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call CreateUserUseCase with request body', async () => {
    const sut = makeSut();
    const body = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@doe.com',
      password: '123456',
    };
    const expected = {
      id: 'user-1',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@doe.com',
    };

    mockCreateUserUseCase.execute.mockResolvedValue(expected);

    const result = await sut.create(body);

    expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(body);
    expect(result).toEqual(expected);
  });

  it('should call ListUsersUseCase', async () => {
    const sut = makeSut();
    const expected = [{ id: 'user-1', first_name: 'Jane', last_name: 'Doe', email: 'jane@doe.com' }];

    mockListUsersUseCase.execute.mockResolvedValue(expected);

    const result = await sut.list();

    expect(mockListUsersUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should call GetUserByIdUseCase with id in detail', async () => {
    const sut = makeSut();
    const expected = { id: 'user-1', first_name: 'Jane', last_name: 'Doe', email: 'jane@doe.com' };

    mockGetUserByIdUseCase.execute.mockResolvedValue(expected);

    const result = await sut.detail('user-1');

    expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(expected);
  });

  it('should call UpdateUserUseCase with id and request body', async () => {
    const sut = makeSut();
    const body = { first_name: 'Janet' };
    const expected = { id: 'user-1', first_name: 'Janet', last_name: 'Doe', email: 'jane@doe.com' };

    mockUpdateUserUseCase.execute.mockResolvedValue(expected);

    const result = await sut.update('user-1', body);

    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith('user-1', body);
    expect(result).toEqual(expected);
  });

  it('should call DeleteUserUseCase with id in remove', async () => {
    const sut = makeSut();
    mockDeleteUserUseCase.execute.mockResolvedValue();

    await sut.remove('user-1');

    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith('user-1');
  });
});
