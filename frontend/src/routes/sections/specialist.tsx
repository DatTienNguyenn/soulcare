import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import SpecialistLayout from 'src/layouts/specialist';
import { LoadingScreen } from 'src/components/loading-screen';
import RoleBasedGuard from 'src/auth/guard/role-based-guard';

// ----------------------------------------------------------------------

const SpecialistDashboardPage = lazy(() => import('src/pages/specialist/specialist-dashboard'));
const SpecialistAnalyticsPage = lazy(() => import('src/pages/specialist/specialist-analytics'));

// ----------------------------------------------------------------------

export const specialistRoutes = [
  {
    path: 'specialist',
    element: (
      <RoleBasedGuard roles={['SPECIALIST', 'specialist']}>
        <SpecialistLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </SpecialistLayout>
      </RoleBasedGuard>
    ),
    children: [
      { element: <SpecialistDashboardPage />, index: true },
      { path: 'analytics', element: <SpecialistAnalyticsPage /> },
    ],
  },
];
