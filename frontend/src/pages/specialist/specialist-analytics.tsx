import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import { SpecialistAnalyticsView } from 'src/sections/specialist';

// -------------------------------------------------------

export default function SpecialistAnalyticsPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('specialist.analytics.pageTitle')}</title>
      </Helmet>

      <SpecialistAnalyticsView />
    </>
  );
}
