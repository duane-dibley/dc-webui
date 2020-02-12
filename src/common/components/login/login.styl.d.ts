declare namespace LoginStylModule {
  export interface ILoginStyl {
    avatar: string;
  }
}

declare const LoginStylModule: LoginStylModule.ILoginStyl & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoginStylModule.ILoginStyl;
};

export = LoginStylModule;
