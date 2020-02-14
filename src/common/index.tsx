import StyleContext from 'isomorphic-style-loader/StyleContext';
import React from 'react';
import { Store } from 'redux';
//
import { BrowserRouterHoc, ContextProvidorHoc, StaticRouterHoc, StoreProviderHoc, ThemeProviderHoc } from '@hoc';
import { IContext } from '@misc';
import AppRoutes from '@routes';

export default function app(props: IProps): JSX.Element {
  const { context, store, url } = props;
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
/* * * * * * * * * * Props interface * * * * * * * * * */

interface IProps {
  context: IContext;
  store: Store;
  url?: string;
}
