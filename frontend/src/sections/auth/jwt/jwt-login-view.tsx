import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useLocales } from 'src/locale/use-locales';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import MenuItem from '@mui/material/MenuItem/MenuItem';

// Helper function to get redirect path based on role
const getRedirectPath = (role: string): string => {
  if (role === 'ADMIN' || role === 'admin') {
    return paths.admin.root; // '/admin'
  }
  if (role === 'SPECIALIST' || role === 'specialist') {
    return paths.specialist.root; // '/specialist'
  }
  return paths.dashboard.root; // '/dashboard'
};

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login, user } = useAuthContext();
  const { t } = useLocales();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = {
    email: 'dn841746@gmail.com',
    password: 'Dat@12345',
    role: 'PATIENT',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Login - this updates auth context with user data including role
      await login?.(data.email, data.password, data.role);

      setIsRedirecting(true);
      setErrorMsg('');

      // Redirect immediately based on role (no delay)
      const redirectPath = returnTo || getRedirectPath(data.role);
      router.push(redirectPath);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
      setIsRedirecting(false);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">{t('login.rememberMe')}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">{t('login.noAccount')}</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          {t('login.createAccount')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label={t('login.email')} />

      <RHFTextField
        name="password"
        label={t('login.password')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFSelect name="role" label="Role">
        <MenuItem value="PATIENT">Patient</MenuItem>
        <MenuItem value="SPECIALIST">Specialist</MenuItem>
        <MenuItem value="ADMIN">Admin</MenuItem>
      </RHFSelect>

      <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        {t('login.forgotPassword')}
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('login.signIn')}
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {isRedirecting && <LoadingScreen />}

      {!isRedirecting && (
        <>
          {renderHead}

          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderForm}
          </FormProvider>
        </>
      )}
    </>
  );
}
