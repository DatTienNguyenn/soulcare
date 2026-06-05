import { Helmet } from 'react-helmet-async';

import PatientReportingView from 'src/sections/admin/patient-reporting/view';

// ----------------------------------------------------------------------

export default function PatientReportingPage() {
  return (
    <>
      <Helmet>
        <title>Patient Reporting | Admin</title>
      </Helmet>

      <PatientReportingView />
    </>
  );
}
