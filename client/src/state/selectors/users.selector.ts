import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const selectUser = (state: RootState) => state.user;

export const selectCurrentUser = createSelector(
  selectUser,
  (user) => user.currentUser,
);

export const selectUserIsAuthenticating = createSelector(
  selectUser,
  (user) => user.authenticating,
);

export const selectCurrentUserAddresses = createSelector(
  selectUser,
  (user) => user.addresses || [],
);

export const selectCurrentUserAddressesFormatted = createSelector(
  selectUser,
  (user) =>
    user.addresses?.map((address) => ({
      value: address.id,
      text: address.full_address,
    })) || [],
);

export const selectUserErrors = createSelector(
  selectUser,
  (user) => user.errors,
);
