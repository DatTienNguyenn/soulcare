import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import { SpecialistBookingView } from 'src/sections/specialist';

// -------------------------------------------------------

export default function SpecialistDashboardPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('specialist.bookings.pageTitle')}</title>
      </Helmet>

      <SpecialistBookingView />
    </>
  );
}
