import { Helmet } from 'react-helmet-async';

import { SpecialistAnalyticsView } from 'src/sections/specialist';

// -------------------------------------------------------

export default function SpecialistAnalyticsPage() {
  return (
    <>
      <Helmet>
        <title>Specialist Analytics | SoulCare</title>
      </Helmet>

      <SpecialistAnalyticsView />
    </>
  );
}
