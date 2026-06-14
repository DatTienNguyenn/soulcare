import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import UserManagementView from 'src/sections/admin/user-management/view';

// ----------------------------------------------------------------------

export default function UserManagementPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('userManagement.title')}</title>
      </Helmet>

      <UserManagementView />
    </>
  );
}
