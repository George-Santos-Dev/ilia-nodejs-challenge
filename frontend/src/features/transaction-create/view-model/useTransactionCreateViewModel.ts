import { useState } from 'react';
import { AxiosError } from 'axios';
import { createTransaction, type TransactionPayload } from '../model/transaction-create.service';

type CreateState = {
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  loading: boolean;
  error: string | null;
  success: string | null;
};

const initialState: CreateState = {
  amount: 0,
  type: 'CREDIT',
  loading: false,
  error: null,
  success: null,
};

export function useTransactionCreateViewModel() {
  const [state, setState] = useState<CreateState>(initialState);

  const setField = (field: keyof Pick<CreateState, 'amount' | 'type'>, value: string | number) => {
    setState((prev) => ({ ...prev, [field]: value, error: null, success: null }));
  };

  const submit = async (): Promise<boolean> => {
    if (state.amount <= 0) {
      setState((prev) => ({ ...prev, error: 'createTransaction.amountRequired' }));
      return false;
    }

    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));

    try {
      const payload: TransactionPayload = {
        amount: Number(state.amount),
        type: state.type,
      };
      await createTransaction(payload);
      setState((prev) => ({
        ...prev,
        amount: 0,
        loading: false,
        success: 'createTransaction.createSuccess',
      }));
      return true;
    } catch (error) {
      const message = resolveCreateTransactionErrorMessage(error);
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return false;
    }
  };

  const clearFeedback = () => {
    setState((prev) => ({ ...prev, error: null, success: null }));
  };

  return { state, setField, submit, clearFeedback };
}

function resolveCreateTransactionErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string | string[] }>;
  const backendMessage = axiosError.response?.data?.message;
  const normalizedMessage = Array.isArray(backendMessage)
    ? backendMessage.join(' ')
    : (backendMessage ?? '');

  if (normalizedMessage.toLowerCase().includes('insufficient balance')) {
    return 'createTransaction.insufficientBalance';
  }

  return 'createTransaction.createError';
}
