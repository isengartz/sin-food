import axios from 'axios';
import AxiosClient from '../clients/AxiosClient';

import { API_QUERY_SERVICE_BASE_URL } from '../../util/constants';

export const axiosQueryInstance = axios.create({
  baseURL: API_QUERY_SERVICE_BASE_URL,
});

export default new AxiosClient(axiosQueryInstance);
