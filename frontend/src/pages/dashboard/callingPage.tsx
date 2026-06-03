import { Helmet } from 'react-helmet-async';
import { useLocales } from 'src/locale/use-locales';

import CallingView from 'src/sections/calling/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useLocales();

  return (
    <>
      <Helmet>
        <title> Calling | WebRTC </title>
      </Helmet>

      <CallingView />
    </>
  );
}
