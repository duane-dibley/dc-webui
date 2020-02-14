import StyleContext from 'isomorphic-style-loader/StyleContext';
import React from 'react';
import { AnyAction, createStore, Store } from 'redux';
import { BrowserRouterHoc, ContextProvidorHoc, StaticRouterHoc, StoreProviderHoc, ThemeProviderHoc } from '@hoc';
import AppRoutes from '@routes';
import AppReducer from '@store';

const store: Store<IStore, AnyAction> = createStore(AppReducer);

export default function app(props: IAppState): JSX.Element {
  const { context, url } = props;
  const { insertCss } = context;

  // server
  if (url) {
    return ThemeProviderHoc(
      StoreProviderHoc(
        StaticRouterHoc(
          <StyleContext.Provider value={{ insertCss }}>
            <ContextProvidorHoc context={context}>
              <AppRoutes />
            </ContextProvidorHoc>
          </StyleContext.Provider>,
          url,
          context
        ),
        store
      )
    );
  }

  // client
  return ThemeProviderHoc(
    StoreProviderHoc(
      BrowserRouterHoc(
        <StyleContext.Provider value={{ insertCss }}>
          <ContextProvidorHoc context={context}>
            <AppRoutes />
          </ContextProvidorHoc>
        </StyleContext.Provider>
      ),
      store
    )
  );
}
