/* eslint-env browser */
import React, { useEffect } from 'react';
import { hydrate } from 'react-dom';

import { Client } from 'web';

// TODO - tidy with paths
import App from '../common/app';

// const host: string = 'dev1';
// const port: number = 19400;
// const secure: boolean = false;
// const fromURL: boolean = false;
// const useBinary: boolean = false;
// const client: IWebClient = new Client({ host, port, secure, fromURL }, useBinary);


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

  return <App context={context} />;
}

hydrate(
  <Main />,
  document.getElementById('appdiv')
);
