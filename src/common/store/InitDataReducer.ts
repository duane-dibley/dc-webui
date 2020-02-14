import { AnyAction, Reducer } from 'redux';
import { INIT_SERVER } from '@store';

const initState: IInitDataState = {
  message: ''
};

const reducer: Reducer<IInitDataState, AnyAction> = (state: IInitDataState = initState, action: AnyAction) => {
  switch (action.type) {

    case INIT_SERVER: {
      const { message } = action;
      return Object.assign(state, { message });
    }

    default:
      return state;

  }
};

export default reducer;
