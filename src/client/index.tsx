/* eslint-env browser */
import React, { useEffect } from 'react';
import { hydrate, render } from 'react-dom';
import { AnyAction, applyMiddleware, createStore, Store } from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import App from '@common';
import rootSaga from '@sagas';
import AppReducer from '@store';
import { IStore } from '@store-model';
import { IContext, IIsoStyle } from '@misc';

// Grab the state from a global variable injected into the server-generated HTML
const initData: IStore = (window as any).INIT_DATA;
// Allow the passed state to be garbage-collected
delete (window as any).INIT_DATA;
// Create Saga middleware
const sagaMiddleware: SagaMiddleware = createSagaMiddleware();
// Create Redux store
const store: Store<IStore, AnyAction> = createStore(AppReducer, initData, applyMiddleware(sagaMiddleware));
// Run Saga
sagaMiddleware.run(rootSaga);
// Set context running through app
const context: IContext = { insertCss };

function insertCss(...styles: IIsoStyle[]): () => void {
  const removeCss: void[] = styles.map((x: IIsoStyle) => x._insertCss());
  return (): any => {
    removeCss.forEach((f: any) => f());
  };
}

function Main(): JSX.Element {
  // Remove theme applied on server
  useEffect(() => {
    const jssStyles: Element = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return <App context={context} store={store} />;
}

render(
  <Main />,
  document.getElementById('appdiv')
);
