import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import TestManagementView from 'src/sections/admin/test-management/view';

// ----------------------------------------------------------------------

export default function TestManagementPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('testManagement.title')}</title>
      </Helmet>

      <TestManagementView />
    </>
  );
}
