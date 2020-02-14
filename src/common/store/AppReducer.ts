import { AnyAction, Reducer } from 'redux';
import { LOGIN_CLICK, INIT_CLIENT } from '@store';

const initState: IAppState = {
  context: { insertCss: (): void => { } },
  client: null,
  url: ''
};

const reducer: Reducer<IAppState, AnyAction> = (state: IAppState = initState, action: AnyAction) => {
  switch (action.type) {

    case INIT_CLIENT: {
      const { client } = action;
      return Object.assign(state, { client });
    }

    case LOGIN_CLICK:
      console.log(LOGIN_CLICK);
      return state;


    default:
      return state;

  }
};

export default reducer;
