import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import { SpecialistSettingsView } from 'src/sections/specialist';

// -------------------------------------------------------

export default function SpecialistSettingsPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('specialist.setting.title')}</title>
      </Helmet>

      <SpecialistSettingsView />
    </>
  );
}
