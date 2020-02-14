declare module '*.css';
declare module '*.scss';
declare module '*.styl';

declare module 'isomorphic-style-loader/StyleContext';
declare module 'isomorphic-style-loader/withStyles';

declare module '@web' {

  import { Subscribe } from 'redux-saga';

  interface IWebClient {
    user(): void;
    systemConfig(): void;
    clientId(): void;
    tokenKey(): void;
    clientLoggingEnabled(): void;
    login(user: string, pass: string): void;
    loginWithTokenKey(tokenKey: string): void;
    register(): void;
    request(service: string, result: () => void, fault: () => void): void;
    appMsgRequest(service: string, result: () => void, fault: () => void, appMsg: string): void;
    post(service: string, result: () => void, fault: () => void): void;
    // Angular BehaviorSubject
    /* eslint-disable-next-line */
    status: {
      CONNECTED: number;
      CONNECTING: number;
      EXPIRED: number;
      FAULT: number;
      LOGGED_IN: number;
      LOGGED_OUT: number;
      RESET: number;
      RESET_FAIL: number;
      RESET_SUCCESS: number;
      // This isn't right **********
      _subscribe: any;
    };
    isAuthenticated(): void;
    // TODO - separate IWebClientConnection
    /* eslint-disable-next-line */
    connection: any;
    logout(): void;
    new(details: { host: string; port: number; secure: boolean; fromURL: boolean }, useBinary: boolean): any;
    ssoLogout(logoutType: string): void;
    resetPassword(user: string, old: string, pass: string): void;
    base64DeltaClient(): void;
  }

  const Client: IWebClient;

  export { Client, IWebClient };

}

declare module '@store-model' {

  import { IWebClient } from '@web';
  import { IContext } from '@misc';

  interface IAppStore {
    client: IWebClient;
    context: IContext;
    url: string;
  }

  interface IInitDataStore {
    message: string;
  }

  interface IStore {
    app: IAppStore;
    initData: IInitDataStore;
  }

}

declare module '@misc' {

  import { IStore } from '@store-model';

  interface IContext {
    insertCss(): void;
  }

  interface IIsoStyle {
    _getContent?(): string;
    _getCss?(): string;
    _insertCss?(): void;
  }

  export { IContext, IIsoStyle };

}
