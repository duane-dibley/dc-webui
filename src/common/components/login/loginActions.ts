import { AnyAction } from 'redux';
import { LOGIN_CLICK } from '@store';

export function loginClick(user: string, pass: string, remember: boolean): AnyAction {
  return { type: LOGIN_CLICK, payload: { user, pass, remember } };
}
