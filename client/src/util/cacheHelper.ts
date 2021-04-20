import localForage from 'localforage';

export class CacheHelper {
  private instance: LocalForage;

  constructor(instanceName = 'fileCache') {
    this.instance = localForage.createInstance({
      name: instanceName,
    });
  }

  public async getItem<T>(key: string) {
    return await this.instance.getItem<T>(key);
  }

  public async setItem(key: string, data: any) {
    await this.instance.setItem(key, data);
  }

  public async delItem(key: string) {
    await this.instance.removeItem(key);
  }
}
