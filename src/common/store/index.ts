import { combineReducers, Reducer, AnyAction } from 'redux';
//
import { IStore } from '@store-model';
import app from './AppReducer';
import initData from './InitDataReducer';

const reducer: Reducer<IStore, AnyAction> = combineReducers({ app, initData });

export default reducer;

/* * * * * * * * * * Action types * * * * * * * * * */
export const INIT_CLIENT: string = 'INIT_CLIENT';
export const INIT_SERVER: string = 'INIT_SERVER';
export const LOGIN_CLICK: string = 'LOGIN_CLICK';
