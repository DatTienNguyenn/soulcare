import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import DiaryView from 'src/sections/diary/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title>{t('pages.diary.title')}</title>
      </Helmet>

      <DiaryView />
    </>
  );
}
