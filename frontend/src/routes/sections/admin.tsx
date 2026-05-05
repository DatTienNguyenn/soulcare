import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import AdminLayout from 'src/layouts/admin';

import { LoadingScreen } from 'src/components/loading-screen';
import RoleBasedGuard from 'src/auth/guard/role-based-guard';

// ----------------------------------------------------------------------

const TestManagementPage = lazy(() => import('src/pages/admin/test-management'));
const UserManagementPage = lazy(() => import('src/pages/admin/user-management'));
const AnalyticsPage = lazy(() => import('src/pages/admin/analytics'));

// ----------------------------------------------------------------------

export const adminRoutes = [
  {
    path: 'admin',
    element: (
      <RoleBasedGuard roles={['ADMIN', 'admin']}>
        <AdminLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </AdminLayout>
      </RoleBasedGuard>
    ),
    children: [
      { element: <TestManagementPage />, index: true },
      { path: 'test-management', element: <TestManagementPage /> },
      { path: 'user-management', element: <UserManagementPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
    ],
  },
];
