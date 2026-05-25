import { Navigate, useRoutes } from 'react-router-dom';

import { RoleBasedRedirect } from 'src/auth/guard/role-based-redirect';

import { mainRoutes } from './main';
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { adminRoutes } from './admin';
import { specialistRoutes } from './specialist';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <RoleBasedRedirect />,
    },

    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Specialist routes
    ...specialistRoutes,

    // Admin routes
    ...adminRoutes,

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
