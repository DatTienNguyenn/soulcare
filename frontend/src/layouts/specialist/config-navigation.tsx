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
  booking: icon('ic_booking'),
  settings: icon('ic_settings'),
};

// ----------------------------------------------------------------------

export function useSpecialistNavData() {
  const data = useMemo(
    () => [
      // SPECIALIST MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'Settings',
            path: paths.specialist.settings,
            icon: ICONS.user,
          },
          {
            title: 'Bookings',
            path: paths.specialist.root,
            icon: ICONS.booking,
            children: [
              {
                title: 'View Bookings',
                path: paths.specialist.root,
              },
              {
                title: 'Calling',
                path: paths.specialist.calling,
              },
              {
                title: 'Electronic Records',
                path: paths.specialist.electronicRecords,
              },
            ],
          },
          {
            title: 'Analytics',
            path: paths.specialist.analytics,
            icon: ICONS.analytics,
          },
        ],
      },
    ],
    []
  );

  return data;
}
