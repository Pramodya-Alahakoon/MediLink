@echo off
echo Stopping MediLink Kubernetes deployment...
kubectl delete namespace medilink
echo Done! All MediLink K8s resources removed.
