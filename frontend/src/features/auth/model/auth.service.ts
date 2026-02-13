import { usersApi } from '@/shared/services/api/httpClient';

export type AuthInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  access_token: string;
};

export async function authenticate(input: AuthInput) {
  const { data } = await usersApi.post('/auth', input);
  return data as AuthResponse;
}
