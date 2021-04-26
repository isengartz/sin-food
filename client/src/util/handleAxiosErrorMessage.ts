import { AxiosError } from 'axios';
import { ErrorType } from './types/ErrorType';

export const handleAxiosErrorMessage = (e: AxiosError): ErrorType => {
  return e.response && e.response.data && e.response.data.errors
    ? e.response.data.errors
    : [{ message: e.message }];
};
