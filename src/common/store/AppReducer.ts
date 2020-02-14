import { AnyAction, Reducer } from 'redux';
// import { LOGIN_CLICK, INIT_CLIENT } from '@store';
import { IAppStore } from '@store-model';

const initState: IAppStore = {
  context: { insertCss: (): void => { } },
  client: null,
  url: ''
};

const reducer: Reducer<IAppStore, AnyAction> = (state: IAppStore = initState, action: AnyAction) => {
  switch (action.type) {

    // Setting in rootSaga for now
    // case INIT_CLIENT: {
    //   const { client } = action;
    //   return Object.assign(state, { client });
    // }

    // Setting in rootSaga for now
    // case LOGIN_CLICK:
    //   return state;


    default:
      return state;

  }
};

export default reducer;
