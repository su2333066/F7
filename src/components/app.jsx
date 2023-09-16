import React from 'react';

import { App, View } from 'framework7-react';

import routes from '../js/routes';
import store from '../js/store';
import useSWR from 'swr';
import fetcher from '../util/fetcher';
import { object } from 'prop-types';

const MyApp = () => {
  // Framework7 Parameters
  const f7params = {
    name: 'Portfolio', // App name
    theme: 'auto', // Automatic theme detection
    // App store
    store: store,
    // App routes
    routes: routes,
  };

  return (
    <App {...f7params}>
      {/* Your main view, should have "view-main" class */}
      <View main className="safe-areas" url={'/'} />
    </App>
  );
};
export default MyApp;
