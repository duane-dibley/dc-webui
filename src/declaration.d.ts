declare module '*.css';
declare module '*.scss';
declare module '*.styl';

declare module 'isomorphic-style-loader/StyleContext';
declare module 'isomorphic-style-loader/withStyles';

declare module 'kdb';
declare module 'web' {

  const Client: IWebClient;
  export { Client };

}
