import { configureStore } from '@reduxjs/toolkit';
import { ReactElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BootstrapUI } from '#containers/bootstrap-ui';
import { JwtSlice } from '#features/jwt';
import { Deps, provideFetch } from '#services';
import { Api } from '#shared/api';
import { LifeCycle } from '#shared/react';
import { reducer } from './reducer';
import { appSaga } from './saga';

export function bootstrap(app: ReactElement) {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: reducer,
    middleware: getDefaults => getDefaults({ thunk: false }).concat(sagaMiddleware),
    devTools: import.meta.env.NODE_ENV !== 'production',
  });

  const fetch = provideFetch({
    jwtToken() {
      return JwtSlice.selectors.data(store.getState())?.accessToken ?? null;
    },
    onUnauthorized() {
      store.dispatch(JwtSlice.actions.logout({ reload: false }));
    },
  });

  const api = new Api({
    host: import.meta.env.API_HOST,
    fetch,
  });

  const deps: Deps = {
    api,
    fetch,
  };

  const runSagas = () => {
    sagaMiddleware.run(appSaga, deps);
  };

  const jsx = (
    <LifeCycle onMountSync={runSagas}>
      <Provider store={store}>
        <BootstrapUI>{app}</BootstrapUI>
      </Provider>
    </LifeCycle>
  );

  const container = document.querySelector('#root');

  if (!container) {
    // eslint-disable-next-line no-console
    console.error('Container element not found');
    return;
  }

  if (container.childNodes.length > 0) {
    // eslint-disable-next-line no-console
    console.log('hydrate started');
    hydrateRoot(container, jsx);
  } else {
    // eslint-disable-next-line no-console
    console.log('render started');
    createRoot(container).render(jsx);
  }
}
