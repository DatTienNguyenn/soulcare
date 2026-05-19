import { Helmet } from 'react-helmet-async';

import { TreatmentHistoryView } from 'src/sections/booking';

import { useLocales } from 'src/locale/use-locales';

// -------------------------------------------------------

export default function TreatmentHistoryPage() {
  const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title>{t('pages.treatmentHistory.title')}</title>
      </Helmet>
      <TreatmentHistoryView />
    </>
  );
}
