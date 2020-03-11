import { AnyAction, Reducer } from 'redux';
import { IAppStore } from '@store-model';

const initState: IAppStore = {
  context: { insertCss: (): void => { } },
  client: null,
  url: ''
};

const reducer: Reducer<IAppStore, AnyAction> = (state: IAppStore = initState, action: AnyAction) => {
  switch (action.type) {

    default:
      return state;

  }
};

export default reducer;
