import axios from 'axios';
import AxiosClient from '../clients/AxiosClient';

import { API_PAYMENT_SERVICE_BASE_URL } from '../../util/constants';

export const axiosPaymentInstance = axios.create({
  baseURL: API_PAYMENT_SERVICE_BASE_URL,
});

export default new AxiosClient(axiosPaymentInstance);
