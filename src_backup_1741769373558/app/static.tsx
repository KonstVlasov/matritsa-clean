import { configureStore } from '@reduxjs/toolkit';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { BootstrapUI } from '#containers/bootstrap-ui';
import { reducer } from './reducer';

export function bootstrapStatic(app: ReactElement) {
  const store = configureStore({
    reducer: reducer,
  });

  return () => (
    <Provider store={store}>
      <BootstrapUI>{app}</BootstrapUI>
    </Provider>
  );
}
