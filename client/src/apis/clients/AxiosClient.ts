import AbstractClient from './AbstractClient';
import { AxiosInstance, AxiosPromise } from 'axios';

class AxiosClient extends AbstractClient<AxiosInstance, AxiosPromise> {
  public request(config = {}): AxiosPromise {
    return this.instance(config);
  }

  public get(url: string): AxiosPromise {
    return this.instance.get(url);
  }

  public post(url: string, params = {}): AxiosPromise {
    return this.instance.post(url, params);
  }

  public put(url: string, params = {}): AxiosPromise {
    return this.instance.put(url, params);
  }

  public patch(url: string, params = {}): AxiosPromise {
    return this.instance.patch(url, params);
  }

  public delete(url: string): AxiosPromise {
    return this.instance.delete(url);
  }
}

export default AxiosClient;
