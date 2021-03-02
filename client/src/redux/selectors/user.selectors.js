import { createSelector } from 'reselect'

const userSelector = (state) => state.user

export const selectUser = createSelector([userSelector], (user) => user.currentUser)
export const selectUserErrors = createSelector([userSelector], (user) => user.errors)
