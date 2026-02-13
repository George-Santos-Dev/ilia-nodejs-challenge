import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTransactionCreateViewModel } from '../view-model/useTransactionCreateViewModel';

export function TransactionCreateForm({ onCreated }: { onCreated: () => void }) {
  const { t } = useTranslation();
  const { state, setField, submit, clearFeedback } = useTransactionCreateViewModel();

  const handleSubmit = async () => {
    const created = await submit();

    if (created) {
      onCreated();
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">{t('createTransaction.title')}</Typography>

        <TextField
          label={t('createTransaction.amount')}
          type="number"
          value={state.amount || ''}
          onChange={(e) => setField('amount', Number(e.target.value))}
          inputProps={{ min: 0.01, step: '0.01' }}
        />

        <FormControl>
          <InputLabel id="transaction-type">{t('createTransaction.type')}</InputLabel>
          <Select
            labelId="transaction-type"
            label={t('createTransaction.type')}
            value={state.type}
            onChange={(e) => setField('type', e.target.value as 'CREDIT' | 'DEBIT')}
          >
            <MenuItem value="CREDIT">{t('createTransaction.credit')}</MenuItem>
            <MenuItem value="DEBIT">{t('createTransaction.debit')}</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSubmit} disabled={state.loading}>
          {t('createTransaction.submit')}
        </Button>
      </Stack>

      <Snackbar
        open={Boolean(state.error)}
        autoHideDuration={4500}
        onClose={clearFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={clearFeedback} sx={{ width: '100%' }}>
          {state.error ? t(state.error) : ''}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(state.success)}
        autoHideDuration={3000}
        onClose={clearFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={clearFeedback} sx={{ width: '100%' }}>
          {state.success ? t(state.success) : ''}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
