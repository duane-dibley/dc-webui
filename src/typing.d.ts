/* * * * * * * * * * STORE * * * * * * * * * */
interface IAppState {
  context: IContext;
  url?: string;
}

interface IInitDataState {
  message: string;
}

interface IStore {
  app?: IAppState;
  initData?: IInitDataState;
}

/* * * * * * * * * * MISC * * * * * * * * * */
interface IContext {
  insertCss(): void;
}

interface IIsoStyle {
  _getContent?(): string;
  _getCss?(): string;
  _insertCss?(): void;
}

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
  status: any;
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

interface Window {
  INIT_DATA: IStore;
}
