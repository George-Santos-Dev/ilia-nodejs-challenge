import LogoutIcon from '@mui/icons-material/Logout';
import TranslateIcon from '@mui/icons-material/Translate';
import {
  AppBar,
  Box,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { clearAccessToken, hasAccessToken } from '@/shared/services/auth/token-storage';

type AppLayoutProps = PropsWithChildren<{
  showToolbarActions?: boolean;
}>;

export function AppLayout({ children, showToolbarActions = true }: AppLayoutProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAuthenticated = hasAccessToken();

  const handleLogout = () => {
    clearAccessToken();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <Box>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>

          {showToolbarActions ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TranslateIcon fontSize="small" />
                <FormControl size="small" variant="standard" sx={{ minWidth: 96 }}>
                  <Select
                    value={i18n.language}
                    onChange={(event) => i18n.changeLanguage(event.target.value)}
                    disableUnderline
                    inputProps={{ 'aria-label': t('app.language') }}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="pt-BR">PT-BR</MenuItem>
                    <MenuItem value="en">EN</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {isAuthenticated ? (
                <Tooltip title={t('app.logout')}>
                  <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </>
          ) : null}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
        {children}
      </Container>
    </Box>
  );
}
