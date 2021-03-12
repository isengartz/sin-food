import axios from 'axios';
import AxiosClient from '../clients/AxiosClient';

import { API_USER_SERVICE_BASE_URL } from '../../util/constants';

export const axiosUserInstance = axios.create({
  baseURL: API_USER_SERVICE_BASE_URL,
});

export default new AxiosClient(axiosUserInstance);
