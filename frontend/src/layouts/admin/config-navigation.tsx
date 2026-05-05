import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  lock: icon('ic_lock'),
  blank: icon('ic_blank'),
  label: icon('ic_label'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useAdminNavData() {
  const data = useMemo(
    () => [
      // ADMIN MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'Test Management',
            path: paths.admin.testManagement,
            icon: ICONS.dashboard,
          },
          {
            title: 'User Management',
            path: paths.admin.userManagement,
            icon: ICONS.user,
          },
          {
            title: 'Analytics',
            path: paths.admin.analytics,
            icon: ICONS.analytics,
          },
        ],
      },
    ],
    []
  );

  return data;
}
