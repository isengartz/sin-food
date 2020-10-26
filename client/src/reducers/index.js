import { combineReducers } from "redux";
import userReducer from "./userReducer";
import utilReducer from "./utilReducer";
import modalReducer from "./modalReducer";

const rootReducer = (state, action) => {
  return appReducer(state, action);
};
const appReducer = combineReducers({
  user: userReducer,
  util: utilReducer,
  modals: modalReducer,
});
export default rootReducer;
