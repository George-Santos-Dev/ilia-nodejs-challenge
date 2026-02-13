import { useEffect, useState } from 'react';
import { getWalletBalance } from '../model/wallet-balance.service';

type BalanceState = {
  amount: number;
  loading: boolean;
  error: string | null;
};

export function useWalletBalanceViewModel(refreshKey: number) {
  const [state, setState] = useState<BalanceState>({
    amount: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    getWalletBalance()
      .then((response) => {
        if (!mounted) return;
        setState({ amount: response.amount, loading: false, error: null });
      })
      .catch(() => {
        if (!mounted) return;
        setState({ amount: 0, loading: false, error: 'balance.loadError' });
      });

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return { state };
}
