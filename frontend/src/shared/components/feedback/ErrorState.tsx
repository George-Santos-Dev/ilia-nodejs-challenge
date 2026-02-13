import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function ErrorState({ label }: { label?: string }) {
  const { t } = useTranslation();

  return <Alert severity="error">{label ?? t('common.genericError')}</Alert>;
}
