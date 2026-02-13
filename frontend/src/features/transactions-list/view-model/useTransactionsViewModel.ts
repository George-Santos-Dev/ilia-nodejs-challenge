import { useEffect, useState } from 'react';
import { getTransactions, type TransactionItem } from '../model/transactions-list.service';

type TransactionsState = {
  items: TransactionItem[];
  loading: boolean;
  error: string | null;
};

export function useTransactionsViewModel(refreshKey: number) {
  const [state, setState] = useState<TransactionsState>({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    getTransactions()
      .then((items) => {
        if (!mounted) return;
        setState({ items, loading: false, error: null });
      })
      .catch(() => {
        if (!mounted) return;
        setState({ items: [], loading: false, error: 'transactions.loadError' });
      });

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  return { state };
}
