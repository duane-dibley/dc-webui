import { AnyAction, Reducer } from 'redux';

const initState: IInitDataState = {
  message: ''
};

const reducer: Reducer<IInitDataState, AnyAction> = (state: IInitDataState = initState, action: AnyAction) => {
  switch (action.type) {

    default:
      return state;

  }
};

export default reducer;
