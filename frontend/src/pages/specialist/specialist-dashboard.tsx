import { Helmet } from 'react-helmet-async';

import { SpecialistBookingView } from 'src/sections/specialist';

// -------------------------------------------------------

export default function SpecialistDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Specialist Dashboard | SoulCare</title>
      </Helmet>

      <SpecialistBookingView />
    </>
  );
}
