import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { formatCurrency } from '@/shared/utils/currency';
import { useTransactionsViewModel } from '../view-model/useTransactionsViewModel';

export function TransactionsTable({ refreshKey }: { refreshKey: number }) {
  const { t } = useTranslation();
  const { state } = useTransactionsViewModel(refreshKey);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('transactions.title')}
      </Typography>

      {state.loading ? <LoadingState /> : null}
      {state.error ? <ErrorState label={t(state.error)} /> : null}
      {!state.loading && !state.error && state.items.length === 0 ? (
        <EmptyState label={t('transactions.empty')} />
      ) : null}

      {!state.loading && !state.error && state.items.length > 0 ? (
        <Table size="small" aria-label={t('transactions.title')}>
          <TableHead>
            <TableRow>
              <TableCell>{t('transactions.type')}</TableCell>
              <TableCell>{t('transactions.amount')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{formatCurrency(item.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </Paper>
  );
}
