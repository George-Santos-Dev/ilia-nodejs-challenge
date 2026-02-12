export const USERS_VERIFICATION_GATEWAY = Symbol('USERS_VERIFICATION_GATEWAY');

export interface UsersVerificationGateway {
  userExists(userId: string): Promise<boolean>;
}
