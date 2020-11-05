import axios from 'axios';


export class AxiosClient {

  instance;
  constructor(instance=axios){
    this.instance=instance;
  }

   request(config={}) {
     return this.instance(config)

  }

  get(url){
    return this.instance.get(url);
  }


  post(url,params={}){
    return this.instance.post(url,params);
  }
  put(url,params={}){
    return this.instance.put(url,params);
  }
  patch(url,params={}){
    return this.instance.patch(url,params);
  }
  delete(url){
    return this.instance.delete(url);
  }
}
