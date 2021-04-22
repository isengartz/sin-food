import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const selectUtility = (state: RootState) => state.utility;

export const selectGlobalErrorMessages = createSelector(
  selectUtility,
  (util) => util.errors,
);

export const selectCheckoutIsLoading = (state: RootState) =>
  state.restaurants.loading || state.user.loading || state.order.loading;
