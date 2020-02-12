import React from 'react';
import { Provider } from 'react-redux';
import { AnyAction, Store } from 'redux';

export default function hoc(WrappedComponent: JSX.Element, store?: Store<IStore, AnyAction>): JSX.Element {
  return (
    <Provider store={store}>
      {WrappedComponent}
    </Provider>
  );
}
