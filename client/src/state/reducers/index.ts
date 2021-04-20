import { combineReducers } from 'redux';
import userReducer from './userReducer';
import modalReducer from './modalReducer';
import utilReducer from './utilReducer';
import restaurantReducer from './restaurantReducer';
import menuReducer from './menuReducer';
import orderReducer from './orderReducer';

const reducers = combineReducers({
  user: userReducer,
  modals: modalReducer,
  utility: utilReducer,
  restaurants: restaurantReducer,
  menu: menuReducer,
  order: orderReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
