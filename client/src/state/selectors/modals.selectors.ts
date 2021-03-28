import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const selectModals = (state: RootState) => state.modals;

export const selectUserLoginModal = createSelector(
  selectModals,
  (modals) => modals.userLoginModal,
);

export const selectUserAddressModal = createSelector(
  selectModals,
  (modals) => modals.userAddressModal,
);
