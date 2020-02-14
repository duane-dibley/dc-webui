import { AnyAction } from 'redux';
import { LOGIN_CLICK } from '@store';

export function loginClick(email: string, password: string, remember: string): AnyAction {
  return { type: LOGIN_CLICK, ...{ email, password, remember } };
}
