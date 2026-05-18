import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import DrawingHistoryView from 'src/sections/draw/history/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title>{t('pages.drawingHistory.title', 'Drawing History')}</title>
      </Helmet>

      <DrawingHistoryView />
    </>
  );
}
