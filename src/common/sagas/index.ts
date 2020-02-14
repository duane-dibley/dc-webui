import { all, takeLatest } from 'redux-saga/effects';
import { LOGIN_CLICK } from '@store';

function* loginClick(): Generator {
  yield takeLatest(
    LOGIN_CLICK,
    onLoginClick
  );
}

function* onLoginClick(): Generator {
  yield 1;
  //
  // return yield fetch('/login')
  //   .then((res: any) => res.json())
  //   .catch((err: any) => console.error('catch', err));
}

export default function* rootSaga(): Generator {
  yield all([
    loginClick()
  ]);
}
