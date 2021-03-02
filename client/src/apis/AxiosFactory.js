import axios from "axios";
import { setError } from "../redux/actions/utilActions";
import store from "../redux/store";

class AxiosFactory {
  constructor(baseURL) {
    this.instance = axios.create({
      baseURL,
    });
    this.instance.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // Getting the errors from Express API
        const {
          response: {
            data: { errors },
          },
        } = error;
        store.dispatch(setError(errors));
          return ;
          return Promise.reject(error);
      }
    );
  }

  getInstance() {
    return this.instance;
  }
}

export default AxiosFactory;
