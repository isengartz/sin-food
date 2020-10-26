import { CLEAR_ERROR, HAS_ERROR } from "../actions/types/utilTypes";

const defaultState = { errors: [], loading: false };

export default (state = defaultState, action) => {
  switch (action.type) {
    case HAS_ERROR:
      return { ...state, errors: action.payload };
    case CLEAR_ERROR:
      return { ...state, errors: [] };
    default:
      return state;
  }
};
