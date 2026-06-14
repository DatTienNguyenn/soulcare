import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';
import { useLocales } from 'src/locale/use-locales';

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
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // SPECIALIST MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('nav.management'),
        items: [
          {
            title: t('nav.settings'),
            path: paths.specialist.settings,
            icon: ICONS.user,
          },
          {
            title: t('nav.bookings'),
            path: paths.specialist.root,
            icon: ICONS.booking,
            children: [
              {
                title: t('nav.viewBookings'),
                path: paths.specialist.root,
              },
              {
                title: t('nav.calling'),
                path: paths.specialist.calling,
              },
              {
                title: t('nav.electronicRecords'),
                path: paths.specialist.electronicRecords,
              },
            ],
          },
          {
            title: t('nav.analytics'),
            path: paths.specialist.analytics,
            icon: ICONS.analytics,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
