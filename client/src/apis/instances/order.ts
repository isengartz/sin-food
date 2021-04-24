import axios from 'axios';
import AxiosClient from '../clients/AxiosClient';

import { API_ORDER_SERVICE_BASE_URL } from '../../util/constants';

export const axiosOrderInstance = axios.create({
  baseURL: API_ORDER_SERVICE_BASE_URL,
});

export default new AxiosClient(axiosOrderInstance);
