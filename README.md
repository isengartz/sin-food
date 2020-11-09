# SinFood ( In Development )


An Event Based Microservices E-food Portal using Dockerized Images for Services and Kubernetes.


### Tech

* [Node.js] 
* [Express] 
* [Typescript] 
* [MongoDB] 
* [Docker] 
* [Kubernetes] 
* [ReactJS]
* [Redux]
* [AntDesign]


### Installation

Install [Ingress Nginx Controller]

```sh
# Windows / Mac
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/cloud/deploy.yaml
# Linux
$ minikube addons enable ingress
```

Define kubernetes secret keys

```sh
$ kubectl create secret generic admin-allow-password --from-literal ADMIN_ALLOW_PASSWORD=KEY
$ kubectl create secret generic jwt-secret --from-literal JWT_KEY=KEY
$ kubectl create secret generic transporter-email-username --from-literal TRANSPORTER_EMAIL_USERNAME=KEY
$ kubectl create secret generic transporter-email-password --from-literal TRANSPORTER_EMAIL_PASSWORD=KEY
```

Run Skaffold

```sh
$ cd/
$ skaffold dev
```





[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


  
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [Typescript]: <https://www.typescriptlang.org/>
   [MongoDB]: <https://www.mongodb.com/>
   [Docker]: <https://www.docker.com/>
   [Kubernetes]: <https://kubernetes.io/>
   [ReactJS]: <https://reactjs.org/>
   [Redux]: <https://redux.js.org/>
   [AntDesign]: <https://ant.design/>
   [Ingress Nginx Controller]: <https://kubernetes.github.io/ingress-nginx/deploy/>
    

