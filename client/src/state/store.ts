import { applyMiddleware, createStore, Dispatch } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './reducers';
import { AppThunk } from '../util/types/AppThunk';
import { OrderAction } from './actions';
import { CacheHelper } from '../util/cacheHelper';
import { StoredCartItemInterface } from '../util/interfaces/CartItemInterface';
import { OrderTypes } from './action-types';

export const preloadState = (): AppThunk => {
  return async (dispatch: Dispatch<OrderAction>) => {
    const cacheHelper = new CacheHelper();
    const cart = (await cacheHelper.getItem<{
      items: StoredCartItemInterface[];
      restaurant: string;
    }>('cart')) || { items: [], restaurant: '' };

    dispatch({ type: OrderTypes.INITIALIZE_CART_DATA, payload: cart });
  };
};

const store = createStore(reducers, {}, applyMiddleware(thunk, logger));

export type AppDispatch = typeof store.dispatch;
// @ts-ignore
store.dispatch(preloadState());
export { store };
