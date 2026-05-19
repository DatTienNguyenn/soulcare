import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

import { useLocales } from 'src/locale';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'features',
        items: [
          { title: 'Diary', path: paths.dashboard.diary, icon: ICONS.calendar },
          {
            title: 'Canvas',
            path: paths.dashboard.canvas,
            icon: ICONS.chat,
            children: [
              {
                title: t('pages.draw.title'),
                path: paths.dashboard['canvas'],
              },
              {
                title: t('pages.drawHistory.title'),
                path: paths.dashboard['drawing-history'],
              },
            ],
          },
          {
            title: 'Self-test',
            path: paths.dashboard['self-test'],
            icon: ICONS.user,
            children: [
              {
                title: t('pages.selfTest.title'),
                path: paths.dashboard['self-test'],
              },
              {
                title: t('pages.selfTestHistory.title'),
                path: paths.dashboard['self-test-history'],
              },
            ],
          },
          {
            title: 'Treatment',
            path: paths.dashboard['treatment'],
            icon: ICONS.job,
            children: [
              {
                title: t('pages.treatmentBooking.title'),
                path: paths.dashboard['treatment-booking'],
              },
              {
                title: t('pages.treatmentHistory.title'),
                path: paths.dashboard['treatment-history'],
              },
            ],
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: t('pages.analytics.title'),
            path: paths.dashboard.analytics.root,
            icon: ICONS.analytics,
          },
        ],
      },
    ],
    []
  );

  return data;
}
