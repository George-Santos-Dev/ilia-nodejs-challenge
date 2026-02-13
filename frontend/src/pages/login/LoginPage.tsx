import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { AppLayout } from '@/app/layouts/AppLayout';
import { useAuthViewModel } from '@/features/auth/view-model/useAuthViewModel';
import { ROUTES } from '@/shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, setEmail, setPassword, submit } = useAuthViewModel();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    const success = await submit();

    if (success) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  };

  return (
    <AppLayout>
      <Box sx={{ minHeight: { xs: '70vh', md: '75vh' }, display: 'grid', placeItems: 'center' }}>
        <Paper elevation={2} sx={{ width: '100%', maxWidth: 420, p: { xs: 2, md: 3 } }}>
          <Stack spacing={2}>
            <Typography variant="h4">{t('auth.title')}</Typography>
            <TextField
              label={t('auth.email')}
              type="email"
              value={state.email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              value={state.password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="contained" onClick={handleSubmit} disabled={state.loading}>
              {t('auth.submit')}
            </Button>
            {state.error ? (
              <Box color="error.main" role="alert">
                {t(state.error)}
              </Box>
            ) : null}
          </Stack>
        </Paper>
      </Box>
    </AppLayout>
  );
}
