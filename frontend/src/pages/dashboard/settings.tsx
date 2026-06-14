import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import UserSettingView from 'src/sections/auth/jwt/user-settings';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('pages.settings.title')}</title>
      </Helmet>

      <UserSettingView />
    </>
  );
}
