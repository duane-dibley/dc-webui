import { Client, IWebClient } from '@web';

export default function register(host: string, port: number, secure: boolean, fromURL: boolean, useBinary: boolean): IWebClient {
  const client: IWebClient = new Client({ host, port, secure, fromURL }, useBinary);
  setupClient(client);
  return client;
}

/* * * * * * * * * * Helpers * * * * * * * * * */

function setupClient(client: IWebClient): void {

  client.status._subscribe({

    complete: () => console.log('client subscribe - complete'),

    error: () => console.log('client subscribe - error'),

    next: (data: any) => {
      const { type } = data;
      switch (type) {

        case Client.status.CONNECTED:
          console.log('client subscribe - status CONNECTED', { type, status: Client.status });
          break;

        case Client.status.CONNECTING:
          console.log('client subscribe - status CONNECTING', { type, status: Client.status });
          break;

        case Client.status.EXPIRED:
          console.log('client subscribe - status EXPIRED', { type, status: Client.status });
          break;

        case Client.status.FAULT:
          console.log('client subscribe - status FAULT', { type, status: Client.status });
          break;

        case Client.status.LOGGED_IN:
          console.log('client subscribe - status LOGGED_IN', { type, status: Client.status });
          break;

        case Client.status.LOGGED_OUT:
          console.log('client subscribe - status LOGGED_OUT', { type, status: Client.status });
          break;

        case Client.status.RESET:
          console.log('client subscribe - status RESET', { type, status: Client.status });
          break;

        case Client.status.RESET_FAIL:
          console.log('client subscribe - status RESET_FAIL', { type, status: Client.status });
          break;

        case Client.status.RESET_SUCCESS:
          console.log('client subscribe - status CONNECTING', { type, status: Client.status });
          break;

        default:
          console.log('client subscribe - unable to determine client status', { type, status: Client.status });

      }
    }
  });

}
