import { clearGlobalErrorMessage, clearUserErrors } from '../../redux/action-creators'

export type ErrorClearFunc = typeof clearGlobalErrorMessage | typeof clearUserErrors;
