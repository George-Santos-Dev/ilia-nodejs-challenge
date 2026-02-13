import { useState } from 'react';
import { authenticate } from '../model/auth.service';
import { setAccessToken } from '@/shared/services/auth/token-storage';

type AuthState = {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  email: '',
  password: '',
  loading: false,
  error: null,
};

export function useAuthViewModel() {
  const [state, setState] = useState<AuthState>(initialState);

  const setEmail = (email: string) => setState((prev) => ({ ...prev, email }));
  const setPassword = (password: string) => setState((prev) => ({ ...prev, password }));

  const submit = async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authenticate({
        email: state.email.trim().toLowerCase(),
        password: state.password,
      });

      setAccessToken(response.access_token);
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'auth.invalidCredentials' }));
      return false;
    }
  };

  return { state, setEmail, setPassword, submit };
}
