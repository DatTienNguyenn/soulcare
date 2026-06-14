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
};

// ----------------------------------------------------------------------

export function useAdminNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // ADMIN MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('admin.management'),
        items: [
          {
            title: t('testManagement.title'),
            path: paths.admin.testManagement,
            icon: ICONS.dashboard,
          },
          {
            title: t('userManagement.title'),
            path: paths.admin.userManagement,
            icon: ICONS.user,
          },
          {
            title: t('pages.analytics.title'),
            path: paths.admin.analytics,
            icon: ICONS.analytics,
          },
          {
            title: t('admin.patientReporting.title'),
            path: paths.admin.sessionReporting,
            icon: ICONS.label,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
