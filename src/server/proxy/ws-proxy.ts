import { w3cwebsocket, IMessageEvent, ICloseEvent } from 'websocket';
import EventEmitter from 'events';
import util from 'util';
import URL from 'url';
//
import url from './url';

const WsProxy: any = ((): (opts: any) => void => {

  let MAX_TOMCAT_FRAME_SIZE: number = 2330551;

  // disable eslint no-shadow rule
  // eslint-disable-next-line
  function WsProxy(opts: any): void {
    const options: any = opts || {};
    options.remote = opts.remote || {};

    this.options = {
      remote: {
        port: options.remote.port,
        protocol: options.remote.protocol,
        rejectUnauthorized: false,
        uri: options.remote.uri,
      }
    };
  }

  util.inherits(WsProxy, EventEmitter);

  WsProxy.prototype.handler = (ws: any): void => {

    /* * * * * * * * * * Event Listeners * * * * * * * * * */

    function onClose(e: ICloseEvent): void {
      const { code, reason } = e;

      console.log(`WebSocket closed (${code}) reason: + reason`);

      if (reason === 'WebSocket connection failed. See server logs for further details') {
        console.log('The webserver may not have the following set in the delta.profile');
        console.log('export SEC_WS_CHECKORIGIN=false');
      }

      this.emit('remote.close', e);

      if (code === 1009 && reason.startsWith('Frame size of ')) {
        MAX_TOMCAT_FRAME_SIZE = parseInt(reason.substr(14).split(' ')[0]) + 100;
      }

      // Following error codes taken from ws ErrorCodes
      if (((code >= 1000 && code <= 1011) && (code !== 1004 && code !== 1005 && code !== 1006)) || (code >= 3000 && code <= 4999)) {
        ws.close(code, reason);
      } else {
        ws.close();
      }
    }

    function onMessage(msg: IMessageEvent): void {
      this.emit('remote.message', msg.data);
      ws.send(msg.data);
    }

    function onOpen(): void {
      this.emit('remote.open');
    }

    function wsOnClose(): void {
      this.emit('client.close');
      remoteWs.close();
    }

    function wsOnMessage(msg: IMessageEvent): void {
      this.emit('client.message', msg);
      remoteWs.send(
        toArrayBuffer(msg)
        // TODO - intellisense not allowing second param
        // , {
        //   binary: true,
        //   mask: false
        // }
      );
    }

    /* * * * * * * * * * Proxy config * * * * * * * * * */

    const remoteWs: w3cwebsocket = new w3cwebsocket(
      url((this as any).options.remote, `/websocket?${URL.parse(ws.upgradeReq.url).query}`),
      null, null, null, { rejectUnauthorized: false },
      { maxReceivedFrameSize: MAX_TOMCAT_FRAME_SIZE }
    );

    (this as any).emit('client.open');

    remoteWs.onopen = onOpen.bind(this);
    remoteWs.onmessage = onMessage.bind(this);
    remoteWs.onclose = onClose.bind(this);

    ws.on('message', wsOnMessage.bind(this));
    ws.on('close', wsOnClose.bind(this));

  };

  function toArrayBuffer(buf: any): ArrayBuffer {
    const ab: ArrayBuffer = new ArrayBuffer(buf.length);
    const view: Uint8Array = new Uint8Array(ab);

    for (let i: number = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    return ab;
  }

  return WsProxy;

})();

export default WsProxy;
