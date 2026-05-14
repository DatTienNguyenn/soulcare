import { Helmet } from 'react-helmet-async';

import DrawView from 'src/sections/draw/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>My Canvas</title>
      </Helmet>

      <DrawView />
    </>
  );
}
