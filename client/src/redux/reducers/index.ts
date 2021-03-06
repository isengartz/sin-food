import { combineReducers } from 'redux';
import userReducer from './userReducer';
import modalReducer from './modalReducer';

const reducers = combineReducers({
  user: userReducer,
  modals: modalReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
