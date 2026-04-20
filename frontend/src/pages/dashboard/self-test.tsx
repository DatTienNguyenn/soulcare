import { Helmet } from 'react-helmet-async';

import SelfTestView from 'src/sections/self-test/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Mental Health Self-Assessment</title>
      </Helmet>

      <SelfTestView />
    </>
  );
}
