import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
  resources: {
    'pt-BR': {
      translation: {
        app: {
          title: 'FinTech Wallet',
          logout: 'Sair',
          language: 'Idioma',
        },
        auth: {
          title: 'Login',
          email: 'Email',
          password: 'Senha',
          submit: 'Entrar',
          invalidCredentials: 'Falha ao autenticar. Verifique suas credenciais.',
        },
        dashboard: {
          title: 'Dashboard',
        },
        balance: {
          title: 'Saldo Atual',
          loadError: 'Não foi possível carregar saldo.',
        },
        transactions: {
          title: 'Transações',
          type: 'Tipo',
          amount: 'Valor',
          loadError: 'Não foi possível carregar transações.',
          empty: 'Nenhuma transação encontrada.',
        },
        createTransaction: {
          title: 'Nova Transação',
          amount: 'Valor',
          type: 'Tipo',
          credit: 'Crédito',
          debit: 'Débito',
          submit: 'Criar',
          amountRequired: 'Informe um valor maior que zero.',
          insufficientBalance: 'Saldo insuficiente para realizar essa transação de débito.',
          createError: 'Falha ao criar transação.',
          createSuccess: 'Transação criada com sucesso.',
        },
        common: {
          loading: 'Carregando...',
          genericError: 'Algo deu errado.',
        },
      },
    },
    en: {
      translation: {
        app: {
          title: 'FinTech Wallet',
          logout: 'Logout',
          language: 'Language',
        },
        auth: {
          title: 'Sign in',
          email: 'Email',
          password: 'Password',
          submit: 'Sign in',
          invalidCredentials: 'Authentication failed. Check your credentials.',
        },
        dashboard: {
          title: 'Dashboard',
        },
        balance: {
          title: 'Current Balance',
          loadError: 'Could not load balance.',
        },
        transactions: {
          title: 'Transactions',
          type: 'Type',
          amount: 'Amount',
          loadError: 'Could not load transactions.',
          empty: 'No transactions found.',
        },
        createTransaction: {
          title: 'New Transaction',
          amount: 'Amount',
          type: 'Type',
          credit: 'Credit',
          debit: 'Debit',
          submit: 'Create',
          amountRequired: 'Enter an amount greater than zero.',
          insufficientBalance: 'Insufficient balance to perform this debit transaction.',
          createError: 'Failed to create transaction.',
          createSuccess: 'Transaction created successfully.',
        },
        common: {
          loading: 'Loading...',
          genericError: 'Something went wrong.',
        },
      },
    },
  },
});

export default i18n;
