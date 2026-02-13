import { Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { formatCurrency } from '@/shared/utils/currency';
import { useWalletBalanceViewModel } from '../view-model/useWalletBalanceViewModel';

export function WalletBalanceCard({ refreshKey }: { refreshKey: number }) {
  const { t } = useTranslation();
  const { state } = useWalletBalanceViewModel(refreshKey);

  return (
    <Card>
      <CardContent>
        <Typography variant="overline">{t('balance.title')}</Typography>
        {state.loading ? <LoadingState /> : null}
        {state.error ? <ErrorState label={t(state.error)} /> : null}
        {!state.loading && !state.error ? (
          <Typography variant="h4">{formatCurrency(state.amount)}</Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
