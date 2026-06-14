import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import PatientReportingView from 'src/sections/admin/patient-reporting/view';

// ----------------------------------------------------------------------

export default function PatientReportingPage() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('admin.patientReporting.title')}</title>
      </Helmet>

      <PatientReportingView />
    </>
  );
}
