import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const selectUser = (state: RootState) => state.user;

export const selectCurrentUser = createSelector(
  selectUser,
  (user) => user.currentUser,
);

export const selectUserErrors = createSelector(
  selectUser,
  (user) => user.errors,
);
