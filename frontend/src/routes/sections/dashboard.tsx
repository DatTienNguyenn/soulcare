import { Children, lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import path from 'path';

// ----------------------------------------------------------------------

const DiaryPage = lazy(() => import('src/pages/dashboard/diary'));
const DrawPage = lazy(() => import('src/pages/dashboard/draw'));
const SelfTestPage = lazy(() => import('src/pages/dashboard/self-test'));
const SelfTestHistoryPage = lazy(() => import('src/pages/dashboard/self-test-history'));
const AnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      // <AuthGuard>
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
      // </AuthGuard>
    ),
    children: [
      { element: <DiaryPage />, index: true },
      { path: 'diary', element: <DiaryPage /> },
      { path: 'canvas', element: <DrawPage /> },
      {
        path: 'self-test',
        children: [
          { element: <SelfTestPage />, index: true },
          { path: 'history', element: <SelfTestHistoryPage /> },
        ],
      },
      {
        path: 'analytics',
        children: [{ element: <AnalyticsPage />, index: true }],
      },
    ],
  },
];
