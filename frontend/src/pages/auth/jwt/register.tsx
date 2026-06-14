import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import { JwtRegisterView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('common.register')}</title>
      </Helmet>

      <JwtRegisterView />
    </>
  );
}
