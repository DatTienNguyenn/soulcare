import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import SelfTestHistoryView from 'src/sections/self-test/history/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title>{t('pages.selfTestHistory.title')}</title>
      </Helmet>

      <SelfTestHistoryView />
    </>
  );
}
