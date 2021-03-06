import { createSelector } from 'reselect'

const utilSelector = (state) => state.util

export const selectUtilErrors = createSelector([utilSelector], (util) => util.errors)
export const selectUtilNotification = createSelector([utilSelector], (util) => util.notification)

