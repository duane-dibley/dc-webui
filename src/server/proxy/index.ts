import fs from 'fs';
import http from 'http';
import https from 'https';
import express, { Application } from 'express';
import expressws from 'express-ws';
import bodyParser from 'body-parser';
import URL from 'url';
import path from 'path';
//
import url from './url';
import WsProxy from './ws-proxy';

if (process.argv.length < 5) {
  console.log('Must provide [http | https] [hostname] [port] as parameters');
  //
  // return;
}

const appDir: string = path.dirname(require.main.filename);

const params: any = {
  remote: {
    uri: process.argv[3],
    port: process.argv[4],
    protocol: process.argv[2],
    rejectUnauthorized: false

  },
  local: {
    port: 3000
  },
  https: {
    key: path.join(appDir, 'key.pem'),
    cert: path.join(appDir, 'cert.pem')
  },
  client: '../../dist/public'
};

const AxProxy: any = ((): (opts: any) => void => {

  // disable eslint no-shadow rule
  // eslint-disable-next-line
  function AxProxy(opts: any) {
    const options: any = opts || {};
    options.remote = opts.remote || {};
    options.local = opts.local || { port: 3000 };
    options.https = opts.https || {};

    this.options = {
      client: options.client || '../client',
      remote: {
        port: options.remote.port,
        uri: options.remote.uri,
        protocol: options.remote.protocol || 'https',
        rejectUnauthorized: false

      },
      local: {
        port: options.local.port
      },
      https: {
        key: options.https.key,
        cert: options.https.cert
      }
    };

    this.app = createApp(this.options);
    this.server = createServer(this.options, this.app);
    expressws(this.app, this.server);

    this.wsProxy = new WsProxy({
      remote: {
        protocol: this.options.remote.protocol === 'https' ? 'wss' : 'ws',
        uri: this.options.remote.uri,
        port: this.options.remote.port,
        rejectUnauthorized: false
      }
    });

    this.app.ws('/websocket', this.wsProxy.handler.bind(this.wsProxy));

    this.listening = false;
  }

  AxProxy.ROOT = '/control/';

  AxProxy.prototype.listen = (): any => {
    if ((this as any).listening) {
      this.close();
    }
    (this as any).server.listen((this as any).options.local.port);
    (this as any).listening = true;
    console.log(`Listening on port ${(this as any).options.local.port}`);
    return (this as any).server;
  };

  AxProxy.prototype.close = (): any => {
    if ((this as any).listening) {
      // If close is called when the server is not listening then
      // an error will be thrown
      (this as any).server.close();
      (this as any).listening = false;
    }
    return (this as any).server;
  };

  function createApp(options: any): Application {
    const app: Application = express();

    remoteRedirect(options.remote, app, '/dashboards');
    remoteFetch(options, app, '/comm/kdb.js');
    remoteFetch(options, app, '/comm/client.js');

    app.use('/services', bodyParser.text());

    app.post('/services', (req: any, res: any) => {
      const sender: any = options.remote.protocol === 'https' ? https : http;
      const { headers } = req;

      headers.host = `${options.remote.uri}:${options.remote.port}`;
      headers.origin = `${options.remote.protocol}://${options.remote.uri}:${options.remote.port}`;
      headers.rejectUnauthorized = false;
      headers.referer = url(options.remote, URL.parse(req.headers.referer).pathname);

      const r: any = sender.request({
        host: options.remote.uri,
        port: options.remote.port,
        path: '/services',
        method: req.method,
        headers,
        rejectUnauthorized: false
      }, (ret: any) => {
        ret.on('data', (chunk: any) => {
          res.send(chunk);
        });
      });

      r.write(req.body);
      r.end();
    });

    app.use('/kxlogon', bodyParser.json());

    app.post('/kxlogon', (req: any, res: any) => {
      const sender: any = options.remote.protocol === 'https' ? https : http;
      const { headers } = req;

      headers.host = `${options.remote.uri}:${options.remote.port}`;
      headers.origin = `${options.remote.protocol}://${options.remote.uri}:${options.remote.port}`;
      headers.rejectUnauthorized = false;
      headers.referer = url(options.remote, URL.parse(req.headers.referer).pathname);

      const r: any = sender.request({
        host: options.remote.uri,
        port: options.remote.port,
        path: '/kxlogon',
        method: req.method,
        headers,
        rejectUnauthorized: false
      }, (ret: any) => {
        ret.on('data', (chunk: any) => {
          res.send(chunk);
        });
      });

      r.write(JSON.stringify(req.body));
      r.end();
    });

    app.get('/', (req: any, res: any) => {
      res.redirect(AxProxy.ROOT);
    });

    app.use('/control', express.static(options.client, { dotfiles: 'allow' }));
    return app;
  }

  function createServer(options: any, router: any): any {
    if (options.remote.protocol === 'https') {
      return https.createServer({
        key: fs.readFileSync(options.https.key),
        cert: fs.readFileSync(options.https.cert)
      }, router);
    }
    return http.createServer(router);
  }

  function remoteRedirect(config: any, router: any, resource: any): any {
    router.get(resource, (req: any, res: any) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.redirect(url(config, resource));
    });
  }

  function remoteFetch(options: any, app: any, resource: any): void {
    app.get(resource, (req: any, res: any) => {
      const sender: any = options.remote.protocol === 'https' ? https : http;
      const { headers } = req;

      headers.host = `${options.remote.uri}:${options.remote.port}`;
      headers.origin = `${options.remote.protocol}://${options.remote.uri}:${options.remote.port}`;

      headers.referer = url(options.remote, URL.parse(req.headers.referer).pathname);
      // The following encoding means do not compress or otherwise mess with the content
      headers['accept-encoding'] = 'identity';

      let result: string = '';

      const r: any = sender.request({
        host: options.remote.uri,
        port: options.remote.port,
        path: resource,
        method: req.method,
        rejectUnauthorized: false,
        headers
      }, (ret: any) => {
        ret.on('data', (chunk: any) => {
          result += chunk;
        });
        ret.on('end', () => {
          res.set('Content-Type', r.headers['content-type']);
          res.send(result);
        });
      });

      // r.write(JSON.stringify(req.body));
      r.end();
    });
  }

  return AxProxy;
})();

module.exports = AxProxy;

const proxy: any = new AxProxy(params);
proxy.listen();
