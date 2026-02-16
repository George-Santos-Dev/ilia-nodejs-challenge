import { UsersRepository } from '../../src/modules/users/application/ports/users-repository.port';

type UsersRepositoryMock = jest.Mocked<UsersRepository>;
type UsersRepositoryOverrides = Partial<UsersRepositoryMock>;

export const makeUsersRepositoryMock = (
  overrides: UsersRepositoryOverrides = {},
): UsersRepositoryMock =>
  ({
    create: jest.fn(),
    list: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  }) as UsersRepositoryMock;
