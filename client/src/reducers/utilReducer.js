import { CLEAR_ERROR, HAS_ERROR } from "../actions/types/utilTypes";

const defaultState = { errors: [], statusCode:null, loading: false };

export default (state = defaultState, action) => {
  switch (action.type) {
    case HAS_ERROR:
      return { ...state, errors: action.payload, statusCode: action.statusCode };
    case CLEAR_ERROR:
      return { ...state, errors: [], statusCode: null };
    default:
      return state;
  }
};
