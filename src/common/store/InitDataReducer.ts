import { AnyAction, Reducer } from 'redux';
import { INIT_SERVER } from '@store';
import { IInitDataStore } from '@store-model';

const initState: IInitDataStore = {
  message: ''
};

const reducer: Reducer<IInitDataStore, AnyAction> = (state: IInitDataStore = initState, action: AnyAction) => {
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
