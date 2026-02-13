import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '@/app/layouts/AppLayout';
import { TransactionCreateForm } from '@/features/transaction-create/view/TransactionCreateForm';
import { TransactionsTable } from '@/features/transactions-list/view/TransactionsTable';
import { WalletBalanceCard } from '@/features/wallet-balance/view/WalletBalanceCard';

export function DashboardPage() {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AppLayout>
      <Stack spacing={3}>
        <Typography variant="h4">{t('dashboard.title')}</Typography>
        <WalletBalanceCard refreshKey={refreshKey} />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: '5fr 7fr',
            },
          }}
        >
          <Box>
            <TransactionCreateForm onCreated={handleTransactionCreated} />
          </Box>
          <Box>
            <TransactionsTable refreshKey={refreshKey} />
          </Box>
        </Box>
      </Stack>
    </AppLayout>
  );
}
