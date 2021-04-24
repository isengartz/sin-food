import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { UtilReducerState } from '../reducers/utilReducer';

export const selectUtility = (state: RootState): UtilReducerState =>
  state.utility;

export const selectGlobalErrorMessages = createSelector(
  selectUtility,
  (util) => util.errors,
);

export const selectCheckoutIsLoading = (state: RootState) =>
  state.restaurants.loading || state.user!.loading || state.order!.loading;
