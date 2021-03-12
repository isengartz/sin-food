abstract class AbstractClient<T, TR> {
  protected instance: T;

  public constructor(instance: T) {
    this.instance = instance;
  }
  public abstract request(): TR;
  public abstract get(url: string): TR;
  public abstract post(url: string, params?: Object | null): TR;
  public abstract put(url: string, params: Object): TR;
  public abstract patch(url: string, params: Object): TR;
  public abstract delete(url: string): TR;
}

export default AbstractClient;
