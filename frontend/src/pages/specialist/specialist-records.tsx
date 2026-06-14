import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import { SpecialistEHRView } from 'src/sections/specialist/';

// -------------------------------------------------------

export default function SpecialistRecordsPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('specialist.recordTitle')}</title>
      </Helmet>

      <SpecialistEHRView />
    </>
  );
}
