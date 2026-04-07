# Payment Service - Kubernetes Deployment Guide

This folder contains Kubernetes manifests for deploying the MediLink Payment Service with Stripe integration.

## Files Overview

- **deployment.yaml** - Kubernetes Deployment with resource limits, health checks, and security policies
- **service.yaml** - ClusterIP Service for internal communication
- **configmap.yaml** - Non-sensitive configuration data (service URLs, log levels)
- **secret.yaml** - Sensitive data (API keys, database credentials) - **DO NOT commit to git**
- **serviceaccount.yaml** - ServiceAccount, Role, and RoleBinding for RBAC
- **hpa.yaml** - HorizontalPodAutoscaler for automatic scaling based on metrics
- **README.md** - This file

## Prerequisites

- Kubernetes cluster (1.24+)
- `kubectl` configured to access your cluster
- Docker image pushed to your registry: `your-registry/medilink/payment-service:latest`
- Stripe API keys (test or live)
- MongoDB Atlas or local MongoDB instance
- JWT secret key from your auth service

## Deployment Steps

### 1. Prepare Secrets

Edit `secret.yaml` with your actual credentials:

```bash
# Edit the secret file
vi k8s/payment-service/secret.yaml
```

Update the following fields:
- `mongo-uri` - Your MongoDB connection string
- `jwt-secret` - Same JWT secret from your auth service
- `stripe-secret-key` - Stripe secret key (sk_test_... or sk_live_...)
- `stripe-publishable-key` - Stripe publishable key (pk_test_... or pk_live_...)
- `stripe-webhook-secret` - Stripe webhook signing secret

### 2. Create Namespace (Optional but Recommended)

```bash
kubectl create namespace medilink
```

Then update the `namespace: default` field in all YAML files to `namespace: medilink`.

### 3. Deploy Manifests

```bash
# Apply all manifests
kubectl apply -f k8s/payment-service/

# Or apply individually:
kubectl apply -f k8s/payment-service/secret.yaml
kubectl apply -f k8s/payment-service/configmap.yaml
kubectl apply -f k8s/payment-service/serviceaccount.yaml
kubectl apply -f k8s/payment-service/deployment.yaml
kubectl apply -f k8s/payment-service/service.yaml
kubectl apply -f k8s/payment-service/hpa.yaml
```

### 4. Verify Deployment

```bash
# Check deployment status
kubectl get deployment payment-service
kubectl get pods -l app=payment-service

# Check logs
kubectl logs -l app=payment-service -f

# Check service
kubectl get svc payment-service

# Describe deployment (for troubleshooting)
kubectl describe deployment payment-service
```

## Configuration

### Environment Variables

The following environment variables are set from ConfigMap and Secrets:

| Variable | Source | Description |
|----------|--------|-------------|
| NODE_ENV | Hardcoded | Set to "production" |
| PORT | Hardcoded | Set to 3005 |
| MONGO_URI | Secret | MongoDB connection string |
| JWT_SECRET | Secret | JWT signing secret |
| STRIPE_SECRET_KEY | Secret | Stripe secret key |
| STRIPE_PUBLISHABLE_KEY | Secret | Stripe publishable key |
| STRIPE_WEBHOOK_SECRET | Secret | Stripe webhook secret |
| LOG_LEVEL | ConfigMap | Logging level (debug/info/warn/error) |
| AUTH_SERVICE_URL | ConfigMap | Auth service URL |
| APPOINTMENT_SERVICE_URL | ConfigMap | Appointment service URL |
| DOCTOR_SERVICE_URL | ConfigMap | Doctor service URL |
| PATIENT_SERVICE_URL | ConfigMap | Patient service URL |

## Security Features

- **Non-root User**: Container runs as nodejs user (UID 1001)
- **Read-only Filesystem**: Root filesystem is read-only with temp volumes
- **Security Context**: Drops all capabilities, disables privilege escalation
- **Resource Limits**: CPU (500m) and Memory (512Mi) limits set
- **Health Checks**: Liveness and readiness probes configured
- **RBAC**: ServiceAccount with minimal permissions
- **Pod Anti-affinity**: Pods spread across different nodes

## Scaling

The HPA (HorizontalPodAutoscaler) automatically scales the deployment based on:

- **CPU Utilization**: 70% target
- **Memory Utilization**: 80% target
- **Min Replicas**: 2
- **Max Replicas**: 10

Scaling policies:
- **Scale Up**: Fast (30s) with 100% increase or +4 pods
- **Scale Down**: Slow (300s) with 50% decrease

## Monitoring and Debugging

### Check Pod Status

```bash
kubectl get pods -l app=payment-service
kubectl describe pod <pod-name>
```

### View Logs

```bash
# Recent logs
kubectl logs deployment/payment-service

# Tail logs
kubectl logs -f deployment/payment-service

# Logs of specific pod
kubectl logs <pod-name>
```

### Port Forwarding

```bash
# Forward local port to service
kubectl port-forward svc/payment-service 3005:80

# Access at http://localhost:3005
```

### Execute Commands in Pod

```bash
kubectl exec -it <pod-name> -- /bin/sh
```

## Updating Configuration

### Update ConfigMap

```bash
kubectl edit configmap payment-service-config
# Or
kubectl apply -f k8s/payment-service/configmap.yaml
```

After updating ConfigMap, restart pods:
```bash
kubectl rollout restart deployment/payment-service
```

### Update Secrets

```bash
# Delete and recreate
kubectl delete secret payment-service-secrets
kubectl apply -f k8s/payment-service/secret.yaml

# Restart deployment
kubectl rollout restart deployment/payment-service
```

### Update Docker Image

```bash
# Update to new image version
kubectl set image deployment/payment-service \
  payment-service=your-registry/medilink/payment-service:v1.1.0
```

## Troubleshooting

### Pods not starting

```bash
# Check events
kubectl describe deployment payment-service

# Check logs
kubectl logs <pod-name>
```

### Service unreachable

```bash
# Check service endpoints
kubectl get endpoints payment-service

# Check DNS
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- nslookup payment-service
```

### Memory/CPU issues

```bash
# Check resource usage
kubectl top pods -l app=payment-service
kubectl top nodes

# Edit resource limits in deployment.yaml
```

## Production Deployment Checklist

- [ ] Stripe keys are set correctly (use live keys in production)
- [ ] MongoDB URI points to production database
- [ ] JWT secret matches auth service
- [ ] Image is pushed to production registry
- [ ] Replicas set to appropriate number (minimum 2-3)
- [ ] Resource limits reviewed and set
- [ ] Health checks configured
- [ ] Monitoring/logging set up
- [ ] HTTPS/TLS configured (via Ingress)
- [ ] Secrets are encrypted at rest
- [ ] Network policies configured
- [ ] Regular backups scheduled

## Rollback

```bash
# Check rollout history
kubectl rollout history deployment/payment-service

# Rollback to previous version
kubectl rollout undo deployment/payment-service

# Rollback to specific revision
kubectl rollout undo deployment/payment-service --to-revision=2
```

## Cleanup

To delete all payment service resources:

```bash
kubectl delete -f k8s/payment-service/
```

Or individually:
```bash
kubectl delete deployment payment-service
kubectl delete service payment-service
kubectl delete configmap payment-service-config
kubectl delete secret payment-service-secrets
kubectl delete serviceaccount payment-service
kubectl delete role payment-service
kubectl delete rolebinding payment-service
kubectl delete hpa payment-service-hpa
```

## References

- [Payment Service API Documentation](../../payment-service/README.md)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Stripe Documentation](https://stripe.com/docs)
