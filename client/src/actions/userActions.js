import {
  GET_CURRENT_USER,
  LOG_OUT_USER,
  SUCCESS_LOGIN,
} from "./types/userTypes";
import userInstance from "../apis/instances/user";
import {ApiCaller} from "../apis/ApiCaller";

const userApi = new ApiCaller(userInstance);

// Tries to login the user
export const signInUser = (data) => ({
  type: SUCCESS_LOGIN,
  api: {
    apiCaller: userApi,
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
    apiCaller: userApi,
    method: "get",
    url: "currentUser",
    objectName: "currentUser",
  },
});

export const signout = () => ({
  type: LOG_OUT_USER,
  api: {
    apiCaller: userApi,
    method: 'post',
    url: 'signout'
  }
})
