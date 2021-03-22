import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const selectUser = (state: RootState) => state.user;

export const selectCurrentUser = createSelector(
  selectUser,
  (user) => user.currentUser,
);

export const selectCurrentUserAddresses = createSelector(
  selectUser,
  (user) => user.currentUser?.addresses || [],
);

export const selectCurrentUserAddressesFormatted = createSelector(
  selectUser,
  (user) =>
    user.currentUser?.addresses?.map((address) => ({
      value: address.id!,
      text: address.full_address,
    })) || [],
);

export const selectUserErrors = createSelector(
  selectUser,
  (user) => user.errors,
);
