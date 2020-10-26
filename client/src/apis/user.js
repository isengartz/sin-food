// import AxiosFactory from './AxiosFactory';
// const axios = new AxiosFactory('/api/v1/users/').getInstance();
// export default axios;

import axios from "axios";
const instance = axios.create({
    baseURL:'/api/v1/users/'
})

export default instance;
