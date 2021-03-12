import { combineReducers } from 'redux';
import userReducer from './userReducer';
import modalReducer from './modalReducer';
import utilReducer from './utilReducer';

const reducers = combineReducers({
  user: userReducer,
  modals: modalReducer,
  utility: utilReducer
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
