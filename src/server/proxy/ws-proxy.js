/* eslint-disable */
var W3CWebsocket    = require('websocket').w3cwebsocket,
    EventEmitter    = require('events'),
    util            = require('util'),
    URL             = require('url'),
    url             = require('./url');

var WsProxy = (function () {

    var MAX_TOMCAT_FRAME_SIZE = 2330551;

    function WsProxy (options) {
        options             = options           || {};
        options.remote      = options.remote    || {};

        this.options  = {
            remote  : {
                port        : options.remote.port,
                uri         : options.remote.uri,
                protocol    : options.remote.protocol,
                rejectUnauthorized: false
            }
        };
    }

    util.inherits(WsProxy, EventEmitter);

    WsProxy.prototype.handler = function (ws) {
        var remoteWs = new W3CWebsocket(
            url(this.options.remote, '/websocket?' + URL.parse(ws.upgradeReq.url).query),
            null, null, null, { rejectUnauthorized : false },
            { maxReceivedFrameSize: MAX_TOMCAT_FRAME_SIZE }
        );

        this.emit('client.open');
        remoteWs.onopen = function () {
            this.emit('remote.open');
        }.bind(this);

        remoteWs.onmessage = function (msg) {
            this.emit('remote.message', msg.data);
            ws.send(msg.data);
        }.bind(this);

        remoteWs.onclose = function (e) {
            var code = e.code,
                reason = e.reason;

            console.log("WebSocket closed (" + code + ") reason: " + reason);
            if (reason === "WebSocket connection failed. See server logs for further details") {
                console.log("The webserver may not have the following set in the delta.profile");
                console.log("export SEC_WS_CHECKORIGIN=false");
            }

            this.emit('remote.close', e);
            if (code === 1009 && reason.startsWith('Frame size of ')) {
                MAX_TOMCAT_FRAME_SIZE = parseInt(reason.substr(14).split(' ')[0]) + 100;
            }
            // Following error codes taken from ws ErrorCodes
            if (
                ((code >= 1000 && code <= 1011) &&
                (code !== 1004 && code !== 1005 && code !== 1006)) ||
                (code >= 3000 && code <= 4999)) {
                ws.close(code, reason);
            } else {
                ws.close();
            }
        }.bind(this);

        ws.on('message', function (msg) {
            this.emit('client.message', msg);
            remoteWs.send(toArrayBuffer(msg), {
                binary: true,
                mask: false
            });
        }.bind(this));

        ws.on('close', function () {
            this.emit('client.close');
            remoteWs.close();
        }.bind(this));
    };

    function toArrayBuffer(buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }

    return WsProxy;
}());

module.exports = WsProxy;
