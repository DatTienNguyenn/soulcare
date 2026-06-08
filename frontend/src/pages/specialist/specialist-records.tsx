import { Helmet } from 'react-helmet-async';

import { SpecialistEHRView } from 'src/sections/specialist/';

// -------------------------------------------------------

export default function SpecialistAnalyticsPage() {
  return (
    <>
      <Helmet>
        <title>Specialist Records | SoulCare</title>
      </Helmet>

      <SpecialistEHRView />
    </>
  );
}
