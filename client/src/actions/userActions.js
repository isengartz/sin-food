import {
  GET_CURRENT_USER,
  LOG_OUT_USER,
  SUCCESS_LOGIN,
} from "./types/userTypes";
import userApi from "../apis/user";

// Tries to login the user
export const signInUser = (data) => ({
  type: SUCCESS_LOGIN,
  api: {
    axios: userApi,
    method: "post",
    url: "login",
    objectName: "user",
    data: data,
  },
});

// Gets current users information
export const getCurrentUser = () => ({
  type: GET_CURRENT_USER,
  api: {
    axios: userApi,
    method: "get",
    url: "currentUser",
    objectName: "currentUser",
  },
});

export const signout = () => ({
  type: LOG_OUT_USER,
  api: {
    axios: userApi,
    method: 'post',
    url: 'signout'
  }
})
