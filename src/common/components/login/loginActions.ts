import { AnyAction } from 'redux';

export function loginClick(email: string, password: string, remember: string): AnyAction {
  return { type: 'LOGIN_CLICK' };
}
