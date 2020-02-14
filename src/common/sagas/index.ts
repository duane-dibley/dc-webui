import { AnyAction } from 'redux';
import { SagaIterator } from 'redux-saga';
import { all, select, take, takeEvery, takeLatest, TakeEffect } from 'redux-saga/effects';
import { INIT_CLIENT, LOGIN_CLICK } from '@store';
import { IStore } from '@store-model';
import { Client, IWebClient } from '@web';
import setupClient from '../webclient';

/* * * * * * * * * * Client * * * * * * * * * */

const host: string = 'dev1';
const port: number = 19400;
const secure: boolean = false;
const fromURL: boolean = false;
const useBinary: boolean = true;
const client: IWebClient = setupClient(host, port, secure, fromURL, useBinary);

/* * * * * * * * * * Sagas * * * * * * * * * */

function* loginClick(): Generator {
  yield takeLatest(
    LOGIN_CLICK,
    onLoginClick
  );
}

/* * * * * * * * * * Workers * * * * * * * * * */

function* onLoginClick(action: AnyAction): Generator {
  const { user, pass } = action.payload;
  // const takeRes: TakeEffect = take(LOGIN_CLICK);
  const test: any = yield client.login(user, pass);
  console.log();
}

/* * * * * * * * * * Helpers * * * * * * * * * */

// function setupClient(): void { }

/* * * * * * * * * * Getters * * * * * * * * * */

// function getClient(state: IStore): {} {
//   return state.app.client;
// }


/* * * * * * * * * * default * * * * * * * * * */

export default function* rootSaga(): Generator {
  yield all([
    loginClick()
  ]);
}
