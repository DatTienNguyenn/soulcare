import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('common.login')}</title>
      </Helmet>

      <JwtLoginView />
    </>
  );
}
