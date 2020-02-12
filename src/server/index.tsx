import express, { Application, Request, Response /* , NextFunction */ } from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
// import { AnyAction, createStore, Store } from 'redux';
// import serialize from 'serialize-javascript';
//
import { ServerStyleSheets } from '@material-ui/core/styles';
//
// import AppReducer from '@store';

// TODO - working client on server
// kdb is set on tsconfig and webpack paths/alias
// import { Client } from 'web';

// TODO - tidy with paths
import App from '../common/app';

/* * * * * * * * * * Application * * * * * * * * * */

const app: Application = express();
app.use(express.static(path.resolve(__dirname)));
// eslint-disable-next-line
app.listen(5000, () => console.log('server running on port 5000'));

/* * * * * * * * * * Middleware * * * * * * * * * */

// app.use((req: Request, res: Response, next: NextFunction) => { next(); });

/* * * * * * * * * * Routes * * * * * * * * * */

// default route
app.get('/', (req: Request, res: Response) => {
  // TODO - introduce login/auth/smal logic
  res.redirect('/login');
});

// editor application route
app.get('/editor', (req: Request, res: Response) => {
  const { url } = req;
  res.end(htmlTemplate(
    renderToString(route(url)),
    sheets.toString(),
    // store.getState(),
    // css
  ));
});

// login page route
app.get('/login', (req: Request, res: Response) => {
  const { url } = req;
  res.send(htmlTemplate(
    renderToString(route(url)),
    sheets.toString(),
    // store.getState(),
    // css
  ));
});

/* * * * * * * * * * Workflow * * * * * * * * * */

// TODO - working client on server
// const host: string = '';
// const port: number = 0;
// const secure: boolean = true;
// const fromURL: boolean = false;
// const useBinary: boolean = false;

// const client: IWebClient = new Client({ host, port, secure, fromURL }, useBinary);

const css: Set<string> = new Set();
const context: IContext = { insertCss };
const sheets: ServerStyleSheets = new ServerStyleSheets();
// const store: Store<IStore, AnyAction> = createStore(AppReducer);

function route(url: string): JSX.Element {
  return sheets.collect(<App context={context} url={url} />);
}

function insertCss(...styles: IIsoStyle[]): void {
  styles.forEach((s: IIsoStyle) => css.add(s._getCss()));
}

/* * * * * * * * * * Tools * * * * * * * * * */

function htmlTemplate(el: string, theme: string, /* initState: IStore, css: Set<string> */): string {
  // TODO - Server-side logic
  // <script src="public/kdb_4_3_0S5_22475.js"></script>
  // <script src="public/client_4_3_0S5_22475.js"></script>
  // <script>
  //   window.INIT_DATA = ${serialize(initState, { isJSON: true })}
  // </script>
  return `
        <!DOCTYPE html>
        <html>

          <head>
            <meta charset="utf-8">
            <title>React SSR</title>
            <style id="jss-server-side">${theme}</style>
            <style type="text/css">${[...css].join('')}</style>
          </head>

          <body>
            <div id="appdiv">${el}</div>
            <script src="public/client.bundle.js"></script>
          </body>

        </html>
    `;
}
