import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import AnalyticsView from 'src/sections/analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('pages.analytics.title')}</title>
      </Helmet>

      <AnalyticsView />
    </>
  );
}
