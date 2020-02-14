/* eslint-env browser */
import React, { useEffect } from 'react';
import { hydrate } from 'react-dom';
import { AnyAction, applyMiddleware, createStore, Store } from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import App from '@common';
import rootSaga from '@sagas';
import AppReducer /* , { INIT_CLIENT } */ from '@store';
import { IStore } from '@store-model';
import { IContext, IIsoStyle } from '@misc';
// import { Client, IWebClient } from '@web';

// Setting in rootSaga for now
// const host: string = 'dev1';
// const port: number = 19400;
// const secure: boolean = false;
// const fromURL: boolean = false;
// const useBinary: boolean = false;
// const client: IWebClient = new Client({ host, port, secure, fromURL }, useBinary);

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

// Dispatch event to set client on store - setting in rootSaga for now
// store.dispatch({ type: INIT_CLIENT, client });

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

hydrate(
  <Main />,
  document.getElementById('appdiv')
);
