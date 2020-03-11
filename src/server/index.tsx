// import express, { Application, Request, Response /* , NextFunction */ } from 'express';
// import path from 'path';
// import React from 'react';
// import { renderToString } from 'react-dom/server';
// import { AnyAction, createStore, Store } from 'redux';
// import serialize from 'serialize-javascript';
// import { ServerStyleSheets } from '@material-ui/core/styles';
// //
// import App from '@common';
// import { IContext, IIsoStyle } from '@misc';
// import AppReducer, { INIT_SERVER } from '@store';
// import { IStore } from '@store-model';
// import { IProxyOptions } from 'AxProxy';
// //
// import bodyParser from 'body-parser';
// import expressWs from 'express-ws';
// import fs from 'fs';
// import http, { Server as HttpServer, ClientRequest, IncomingMessage } from 'http';
// import https, { Server as HttpsServer } from 'https';
// import URL from 'url';
// import WsProxy from './proxy/ws-proxy';
// import Url from './proxy/url';

// /* * * * * * * * * * Application * * * * * * * * * */

// // const app: Application = express();
// // app.use(express.static(path.resolve(__dirname)));
// // // eslint-disable-next-line
// // app.listen(5000, () => console.log('server running on port 5000'));

// const appDir: string = path.resolve(__dirname, 'public');

// const options: IProxyOptions = {
//   remote: {
//     port: process.argv[4],
//     protocol: process.argv[2],
//     rejectUnauthorized: false,
//     uri: process.argv[3]
//   },
//   local: {
//     port: 5000
//   },
//   https: {
//     key: path.join(appDir, 'key.pem'),
//     cert: path.join(appDir, 'cert.pem')
//   },
//   // client: '../DeltaControlWebUI/dist'
// };

// const appBase: Application = express();
// appBase.use(express.static(path.resolve(__dirname)));

// const server: HttpsServer | HttpServer = options.remote.protocol === 'https' ? https.createServer({
//   key: fs.readFileSync(options.https.key),
//   cert: fs.readFileSync(options.https.cert)
// }, appBase) : http.createServer(appBase);

// const AxProxy: any = ((): any => {

//   // eslint-disable-next-line
//   function AxProxy(opts: IProxyOptions): void {
//     // const appBase: Application = express();

//     createApp(appBase);

//     const { app } = expressWs(appBase, server);

//     this.wsProxy = new WsProxy({
//       remote: {
//         protocol: options.remote.protocol === 'https' ? 'wss' : 'ws',
//         uri: options.remote.uri,
//         port: options.remote.port,
//         rejectUnauthorized: false
//       }
//     });

//     app.ws('/websocket', this.wsProxy.handler.bind(this.wsProxy));
//   }

//   AxProxy.prototype.listen = (): HttpsServer | HttpServer => {
//     // if (this.listening) {
//     //   this.close();
//     // }
//     server.listen(options.local.port);
//     // this.listening = true;
//     console.log(`Listening on port ${options.local.port}`);
//     return server;
//   };

//   return AxProxy;

// })();

// const proxy: any = new AxProxy(options);
// proxy.listen(5000, () => console.log('server running on port 5000'));

// // console.log('LOGGING FROM SERVER', { appDir, options, wsProxy });

// /* * * * * * * * * * Middleware * * * * * * * * * */

// // app.use((req: Request, res: Response, next: NextFunction) => { next(); });

// /* * * * * * * * * * Routes * * * * * * * * * */

// function createApp(app: Application): void {

//   remoteFetch(app, '/comm/kdb.js');
//   remoteFetch(app, '/comm/client.js');

//   // default route
//   app.get('/', (req: Request, res: Response) => {
//     // TODO - introduce login/auth/smal logic
//     res.redirect('/login');
//   });

//   // editor application route
//   app.get('/editor', (req: Request, res: Response) => {
//     const { url } = req;
//     res.end(htmlTemplate(
//       renderToString(route(url)),
//       sheets.toString(),
//       store.getState(),
//       // css
//     ));
//   });

//   // login page route
//   app.get('/login', (req: Request, res: Response) => {
//     const { url } = req;
//     res.send(htmlTemplate(
//       renderToString(route(url)),
//       sheets.toString(),
//       store.getState(),
//       // css
//     ));
//   });

//   // kxlogin from index.js
//   app.use('/kxlogon', bodyParser.json());

//   app.post('/kxlogon', (req: Request, res: Response) => {
//     const sender: typeof import('https') | typeof import('http') = options.remote.protocol === 'https' ? https : http;
//     const { headers } = req;

//     headers.host = `${options.remote.uri}:${options.remote.port}`;
//     headers.origin = `${options.remote.protocol}://${options.remote.uri}:${options.remote.port}`;
//     headers.rejectUnauthorized = 'false';
//     headers.referer = Url(options.remote, URL.parse(req.headers.referer).pathname);

//     const r: ClientRequest = sender.request({
//       host: options.remote.uri,
//       port: options.remote.port,
//       path: '/kxlogon',
//       method: req.method,
//       headers,
//       rejectUnauthorized: false
//     }, (ret: IncomingMessage) => {
//       ret.on('data', (chunk: any) => {
//         res.send(chunk);
//       });
//     });

//     r.write(JSON.stringify(req.body));
//     r.end();
//   });

// }

// function remoteFetch(app: Application, resource: string): void {
//   app.get(resource, (req: Request, res: Response) => {
//     const sender: typeof import('https') | typeof import('http') = options.remote.protocol === 'https' ? https : http;
//     const { headers } = req;

//     headers.host = `${options.remote.uri}:${options.remote.port}`;
//     headers.origin = `${options.remote.protocol}://${options.remote.uri}:${options.remote.port}`;
//     headers.referer = Url(options.remote, URL.parse(req.headers.referer).pathname);
//     // The following encoding means do not compress or otherwise mess with the content
//     headers['accept-encoding'] = 'identity';

//     let result: string = '';

//     const r: ClientRequest = sender.request({
//       host: options.remote.uri,
//       port: options.remote.port,
//       path: resource,
//       method: req.method,
//       rejectUnauthorized: false,
//       headers
//     }, (ret: IncomingMessage) => {
//       ret.on('data', (chunk: any) => {
//         result += chunk;
//       });
//       ret.on('end', () => {
//         res.set('Content-Type', ret.headers['content-type']);
//         res.send(result);
//       });
//     });

//     r.end();
//   });
// }

// /* * * * * * * * * * Workflow * * * * * * * * * */

// const css: Set<string> = new Set();
// const context: IContext = { insertCss };
// const sheets: ServerStyleSheets = new ServerStyleSheets();

// // Redux store
// const store: Store<IStore, AnyAction> = createStore(AppReducer);
// store.dispatch({ type: INIT_SERVER, message: 'Init message from server' });

// function route(url: string): JSX.Element {
//   return sheets.collect(<App context={context} store={store} url={url} />);
// }

// function insertCss(...styles: IIsoStyle[]): void {
//   styles.forEach((s: IIsoStyle) => css.add(s._getCss()));
// }

// /* * * * * * * * * * Tools * * * * * * * * * */

// function htmlTemplate(el: string, theme: string, initState: IStore, /* css: Set<string> */): string {
//   return `
//         <!DOCTYPE html>
//         <html>

//           <head>
//             <meta charset="utf-8">
//             <title>React SSR</title>
//             <style id="jss-server-side">${theme}</style>
//             <style type="text/css">${[...css].join('')}</style>
//           </head>

//           <body>
//             <div id="appdiv">${el}</div>

//             <script>
//               window.INIT_DATA = ${serialize(initState, { isJSON: true })}
//             </script>

//             <script src="public/client.bundle.js"></script>
//           </body>

//         </html>
//     `;
// }

// /* * * * * * * * * * Non SSR * * * * * * * * * */

// // function htmlTemplate(el: string, theme: string, /* initState: IStore, css: Set<string> */): string {
// //   return `
// //         <!DOCTYPE html>
// //         <html>

// //           <head>
// //             <meta charset="utf-8">
// //             <title>React SSR</title>
// //             <style id="jss-server-side">${theme}</style>
// //             <style type="text/css">${[...css].join('')}</style>
// //           </head>

// //           <body>
// //             <div id="appdiv"></div>
// //             <script src="public/client.bundle.js"></script>
// //           </body>

// //         </html>
// //     `;
// // }
