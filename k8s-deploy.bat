@echo off
echo ============================================
echo  MediLink - Kubernetes Local Deployment
echo ============================================
echo.

echo [Step 1/3] Building Docker images...
echo.

docker build -t medilink-auth-service ./auth-service
docker build -t medilink-patient-service ./patient-service
docker build -t medilink-doctor-service ./doctor-service
docker build -t medilink-appointment-service ./appointment-service
docker build -t medilink-payment-service ./payment-service
docker build -t medilink-notification-service ./notification-service
docker build -t medilink-telemedicine-service ./telemedicine-service
docker build -t medilink-ai-symptom-service ./ai-symptom-service
docker build -t medilink-api-gateway ./api-gateway
docker build -t medilink-client ./client

echo.
echo [Step 2/3] Creating namespace and applying K8s manifests...
echo.

kubectl apply -f k8s-local/namespace.yaml
kubectl apply -f k8s-local/rabbitmq/
kubectl apply -f k8s-local/auth-service/
kubectl apply -f k8s-local/patient-service/
kubectl apply -f k8s-local/doctor-service/
kubectl apply -f k8s-local/appointment-service/
kubectl apply -f k8s-local/payment-service/
kubectl apply -f k8s-local/notification-service/
kubectl apply -f k8s-local/telemedicine-service/
kubectl apply -f k8s-local/ai-symptom-service/
kubectl apply -f k8s-local/api-gateway/
kubectl apply -f k8s-local/client/

echo.
echo [Step 3/3] Verifying deployment...
echo.

timeout /t 10 /nobreak >nul

echo --- PODS ---
kubectl get pods -n medilink
echo.
echo --- SERVICES ---
kubectl get svc -n medilink
echo.
echo --- DEPLOYMENTS ---
kubectl get deployments -n medilink
echo.
echo ============================================
echo  Deployment complete!
echo  Client:      http://localhost:30000
echo  API Gateway: http://localhost:30001
echo ============================================
