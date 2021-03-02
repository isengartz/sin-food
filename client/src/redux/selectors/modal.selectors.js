import { createSelector } from 'reselect';

const selectModals = (state) =>{
  console.debug(state)
  return  state.modals
};

export const selectLoginModal = createSelector([selectModals], (modals) => modals.loginModal);
