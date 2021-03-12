import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const selectUtility = (state: RootState) => state.utility;

export const selectGlobalErrorMessages = createSelector(
  selectUtility,
  (util) => util.errors,
);
