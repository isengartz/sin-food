import { ErrorType } from '../../util/types/ErrorType';
import { UtilActions } from '../actions';
import { UtilTypes } from '../action-types';

export interface UtilReducerState {
  errors: ErrorType;
  notification: string | null;
}

const initialState: UtilReducerState = {
  errors: [],
  notification: '',
};

const reducer = (
  state: UtilReducerState = initialState,
  action: UtilActions,
) => {
  switch (action.type) {
    case UtilTypes.SET_GLOBAL_NOTIFICATION_MESSAGE:
      return { ...state, notification: action.payload };
    case UtilTypes.CLEAR_GLOBAL_NOTIFICATION_MESSAGE:
      return { ...state, notification: '' };
    case UtilTypes.SET_GLOBAL_ERROR_MESSAGE:
      return { ...state, errors: action.payload };
    case UtilTypes.CLEAR_GLOBAL_ERROR_MESSAGE:
      return { ...state, errors: [] };
    default:
      return state;
  }
};

export default reducer;
