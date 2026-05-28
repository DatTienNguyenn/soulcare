import { Helmet } from 'react-helmet-async';

import { SpecialistSettingsView } from 'src/sections/specialist';

// -------------------------------------------------------

export default function SpecialistSettingsPage() {
  return (
    <>
      <Helmet>
        <title>Settings | SoulCare</title>
      </Helmet>

      <SpecialistSettingsView />
    </>
  );
}
