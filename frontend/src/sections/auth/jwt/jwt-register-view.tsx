import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useLocales } from 'src/locale/use-locales';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const { t } = useLocales();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [redirectPending, setRedirectPending] = useState(false);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PATIENT',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const message = await register?.(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.role
      );

      setSuccessMsg(message || 'User registered successfully');
      setOpenSnackbar(true);
      setErrorMsg('');
      setRedirectPending(true);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
      setOpenSnackbar(false);
      setRedirectPending(false);
    }
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    // Redirect after snackbar closes
    if (redirectPending) {
      router.push(returnTo || PATH_AFTER_LOGIN);
    }
  };
  // }
  // });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">{t('signup.rememberMe')}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> {t('signup.haveAccount')} </Typography>

        <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
          {t('signup.signIn')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {t('signup.policy1')}
      <Link underline="always" color="text.primary">
        {t('signup.termService')}
      </Link>
      {t('signup.policy2')}
      <Link underline="always" color="text.primary">
        {t('signup.privacyPolicy')}
      </Link>
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="firstName" label={t('signup.firstName')} />
        <RHFTextField name="lastName" label={t('signup.lastName')} />
      </Stack>

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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('signup.signUp')}
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ m: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      {renderTerms}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
