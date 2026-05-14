import { Helmet } from 'react-helmet-async';

import UserManagementView from 'src/sections/admin/user-management/view';

// ----------------------------------------------------------------------

export default function UserManagementPage() {
  return (
    <>
      <Helmet>
        <title>User Management | Admin</title>
      </Helmet>

      <UserManagementView />
    </>
  );
}
