import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import { TherapyBookingView } from 'src/sections/booking';

// -------------------------------------------------------

export default function TherapyBookingPage() {
  const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title>{t('pages.treatmentBooking.title')}</title>
      </Helmet>
      <TherapyBookingView />
    </>
  );
}
