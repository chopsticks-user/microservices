### Fix Terraform taking too long to install ESO during development due to networking issues

Suppose minikube has been started

```bash
minikube addons list

minikube addons enable default-storageclass

minikube addons enable storage-provisioner

minikube stop

minikube start

kubectl get pods -n kube-system # should see provisioner or whatever pods related to the addons
```

### Fix Minikube "Enabling 'default-storageclass' returned an error"

```bash
minikube delete --all --purge
```

