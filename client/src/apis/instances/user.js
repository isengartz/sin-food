import axios from 'axios'
import { AxiosClient } from '../clients/AxiosClient'
import { API_USER_SERVICE_BASE_URL } from '../consts'

const instance = axios.create({
  baseURL: API_USER_SERVICE_BASE_URL,
})

export default new AxiosClient(instance)
