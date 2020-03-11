var fs          = require('fs'),
    http        = require('http'),
    https       = require('https'),
    express     = require('express'),
    expressws   = require('express-ws'),
    bodyParser  = require('body-parser'),
    url         = require('./url'),
    Url         = require('url'),
    path        = require('path'),
    WsProxy     = require('./ws-proxy');

if (process.argv.length < 5) {
    console.log("Must provide [http | https] [hostname] [port] as parameters");
    // return;
}

var appDir = path.resolve(__dirname, '../dist');

var options = {
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
    client: path.join(appDir, 'public')
};

var AxProxy = (function () {

    function AxProxy(options) {
        options        = options || {};
        options.remote = options.remote || {};
        options.local  = options.local || { port: 3000 };
        options.https  = options.https || {};

        this.options = {
            client: options.client || '../client',
            remote: {
                port    : options.remote.port,
                uri     : options.remote.uri,
                protocol: options.remote.protocol || 'https',
                rejectUnauthorized: false

            },
            local: {
                port : options.local.port
            },
            https : {
                key : options.https.key,
                cert: options.https.cert
            }
        };

        this.app    = createApp(this.options);
        this.server = createServer(this.options, this.app);
        expressws(this.app, this.server);

        this.wsProxy = new WsProxy({
            remote: {
                protocol: this.options.remote.protocol === 'https' ? 'wss' : 'ws',
                uri     : this.options.remote.uri,
                port    : this.options.remote.port,
                rejectUnauthorized: false
            }
        });

        this.app.ws('/websocket', this.wsProxy.handler.bind(this.wsProxy));

        this.listening = false;
    }

    AxProxy.ROOT = '/control/';

    AxProxy.prototype.listen = function () {
        if (this.listening) {
            this.close();
        }
        this.server.listen(this.options.local.port);
        this.listening = true;
        console.log("Listening on port " + this.options.local.port);
        return this.server;
    };

    AxProxy.prototype.close = function () {
        if (this.listening) {
            // If close is called when the server is not listening then
            // an error will be thrown
            this.server.close();
            this.listening = false;
        }
        return this.server;
    };

    function createApp (options) {
        var app = express();

        remoteRedirect(options.remote, app, '/dashboards');
        remoteFetch(options, app, '/comm/kdb.js');
        remoteFetch(options, app, '/comm/client.js');

        app.use('/services', bodyParser.text());
        app.post('/services', function (req, res) {
            var sender = options.remote.protocol === 'https' ? https : http,
                headers = req.headers;
            headers.host       = options.remote.uri + ':' + options.remote.port;
            headers.origin     = options.remote.protocol + '://' + options.remote.uri + ':' + options.remote.port;
            headers.rejectUnauthorized = false;
            headers.referer    = url(options.remote, Url.parse(req.headers.referer).pathname);

            var r = sender.request({
                host : options.remote.uri,
                port : options.remote.port,
                path : '/services',
                method : req.method,
                headers : headers,
                rejectUnauthorized: false
            }, function (r) {
                r.on('data', function(chunk) {
                    res.send(chunk);
                });
            });
            r.write(req.body);
            r.end();
        });

        app.use('/kxlogon', bodyParser.json());
        app.post('/kxlogon', function (req, res) {
            var sender = options.remote.protocol === 'https' ? https : http,
                headers = req.headers;
            headers.host       = options.remote.uri + ':' + options.remote.port;
            headers.origin     = options.remote.protocol + '://' + options.remote.uri + ':' + options.remote.port;
            headers.rejectUnauthorized = false;
            headers.referer    = url(options.remote, Url.parse(req.headers.referer).pathname);

            var r = sender.request({
                host : options.remote.uri,
                port : options.remote.port,
                path : '/kxlogon',
                method : req.method,
                headers : headers,
                rejectUnauthorized: false
            }, function (r) {
                r.on('data', function(chunk) {
                    res.send(chunk);
                });
            });

            r.write(JSON.stringify(req.body));
            r.end();
        });
        app.get('/', function (req, res) {
            res.redirect(AxProxy.ROOT);
        });

        app.use('/control', express.static(options.client, { dotfiles: 'allow' }));
        return app;
    }

    function createServer (options, router) {
        if (options.remote.protocol === 'https') {
            return https.createServer({
                key: fs.readFileSync(options.https.key),
                cert: fs.readFileSync(options.https.cert)
            }, router);
        }
        return http.createServer(router);
    }

    function remoteRedirect (config, router, resource) {
        router.get(resource, function (req, res) {
            res.header('Access-Control-Allow-Origin', '*');
            res.redirect(url(config, resource));
        });
    }

    function remoteFetch (options, app, resource) {
        app.get(resource, function (req, res) {
            var sender = options.remote.protocol === 'https' ? https : http,
                headers = req.headers;
            headers.host       = options.remote.uri + ':' + options.remote.port;
            headers.origin     = options.remote.protocol + '://' + options.remote.uri + ':' + options.remote.port;
            headers.referer    = url(options.remote, Url.parse(req.headers.referer).pathname);
            // The following encoding means do not compress or otherwise mess with the content
            headers['accept-encoding'] = 'identity';
            var result = "";

            var r = sender.request({
                host : options.remote.uri,
                port : options.remote.port,
                path : resource,
                method : req.method,
                rejectUnauthorized : false,
                headers : headers
            }, function (r) {
                r.on('data', function(chunk) {
                    result = result + chunk;
                });
                r.on('end', function() {
                    res.set('Content-Type', r.headers['content-type']);
                    res.send(result);
                });
            });

            // r.write(JSON.stringify(req.body));
            r.end();
        });        
    }

    return AxProxy;
} ());

module.exports = AxProxy;

var proxy = new AxProxy(options);
proxy.listen();

