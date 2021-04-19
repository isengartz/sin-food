import axios from 'axios';
import AxiosClient from '../clients/AxiosClient';

import { API_MENU_SERVICE_BASE_URL } from '../../util/constants';

export const menuQueryInstance = axios.create({
  baseURL: API_MENU_SERVICE_BASE_URL,
});

export default new AxiosClient(menuQueryInstance);
