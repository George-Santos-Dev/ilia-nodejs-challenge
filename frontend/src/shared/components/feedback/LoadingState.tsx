import { CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function LoadingState({ label }: { label?: string }) {
  const { t } = useTranslation();

  return (
    <Stack alignItems="center" spacing={1} py={2}>
      <CircularProgress size={24} />
      <Typography variant="body2">{label ?? t('common.loading')}</Typography>
    </Stack>
  );
}
