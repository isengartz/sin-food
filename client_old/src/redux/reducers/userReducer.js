import {
  GET_CURRENT_USER_ERROR,
  GET_CURRENT_USER_START,
  GET_CURRENT_USER_SUCCESS,
  LOG_OUT_USER, REGISTER_USER_ERROR, REGISTER_USER_START, REGISTER_USER_SUCCESS,
  SUCCESS_LOGIN, USER_LOGIN_ERROR, USER_LOGIN_START,
} from '../actions/types/userTypes'

const defaultState = {
  currentUser: null,
  isFetching: false,
  errors: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_CURRENT_USER_START:
    case USER_LOGIN_START:
    case REGISTER_USER_START:
      return { ...state, isFetching: true }
    case GET_CURRENT_USER_SUCCESS:
      return { ...state, currentUser: action.payload, isFetching: false }
    case GET_CURRENT_USER_ERROR:
      return { ...state, isFetching: false, errors: action.payload }
    case SUCCESS_LOGIN:
      return { ...state, currentUser: action.payload, isFetching: false }
    case USER_LOGIN_ERROR:
      return { ...state, isFetching: false, errors: action.payload }
    case LOG_OUT_USER:
      return { ...state, currentUser: null }
    case REGISTER_USER_SUCCESS:
      return { ...state, currentUser: action.payload, isFetching: false }
    case REGISTER_USER_ERROR:
      return { ...state, isFetching: false, errors: action.payload }
    default:
      return state
  }
};
