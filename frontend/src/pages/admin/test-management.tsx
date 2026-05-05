import { Helmet } from 'react-helmet-async';

import TestManagementView from 'src/sections/admin/test-management/view';

// ----------------------------------------------------------------------

export default function TestManagementPage() {
  return (
    <>
      <Helmet>
        <title>Test Management | Admin</title>
      </Helmet>

      <TestManagementView />
    </>
  );
}
