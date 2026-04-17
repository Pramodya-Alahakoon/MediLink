const express = require("express");
const k8s = require("@kubernetes/client-node");
const path = require("path");

const app = express();
const PORT = 4500;

// Load K8s config from default kubeconfig
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

const NAMESPACE = "medilink";

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API: Get pods
app.get("/api/pods", async (req, res) => {
  try {
    const response = await coreApi.listNamespacedPod({ namespace: NAMESPACE });
    const pods = response.items.map((pod) => ({
      name: pod.metadata.name,
      status: pod.status.phase,
      ready: pod.status.containerStatuses?.[0]?.ready ? "Ready" : "Not Ready",
      restarts: pod.status.containerStatuses?.[0]?.restartCount || 0,
      image: pod.spec.containers[0].image,
      containerId: (pod.status.containerStatuses?.[0]?.containerID || "")
        .replace("containerd://", "")
        .substring(0, 12),
      age: getAge(pod.metadata.creationTimestamp),
      nodeName: pod.spec.nodeName,
    }));
    res.json(pods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get services
app.get("/api/services", async (req, res) => {
  try {
    const response = await coreApi.listNamespacedService({
      namespace: NAMESPACE,
    });
    const services = response.items.map((svc) => ({
      name: svc.metadata.name,
      type: svc.spec.type,
      clusterIP: svc.spec.clusterIP,
      ports: svc.spec.ports.map(
        (p) => `${p.port}${p.nodePort ? ":" + p.nodePort : ""}/${p.protocol}`,
      ),
      age: getAge(svc.metadata.creationTimestamp),
    }));
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get deployments
app.get("/api/deployments", async (req, res) => {
  try {
    const response = await appsApi.listNamespacedDeployment({
      namespace: NAMESPACE,
    });
    const deployments = response.items.map((dep) => ({
      name: dep.metadata.name,
      ready: `${dep.status.readyReplicas || 0}/${dep.spec.replicas}`,
      upToDate: dep.status.updatedReplicas || 0,
      available: dep.status.availableReplicas || 0,
      age: getAge(dep.metadata.creationTimestamp),
    }));
    res.json(deployments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Delete a pod
app.delete("/api/pods/:name", async (req, res) => {
  try {
    await coreApi.deleteNamespacedPod({
      name: req.params.name,
      namespace: NAMESPACE,
    });
    res.json({ message: `Pod ${req.params.name} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getAge(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

app.listen(PORT, () => {
  console.log(`\n============================================`);
  console.log(` MediLink K8s Dashboard`);
  console.log(` Running on http://localhost:${PORT}`);
  console.log(`============================================\n`);
});
