import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  createProxyMiddleware({
    target: process.env.PATIENT_SERVICE,
    changeOrigin: true,
    // Patient service mounts at /patients, /upload, /reports (not under /api/patient)
    pathRewrite: (pathname) => {
      if (pathname.startsWith("/api/patient")) {
        const next = pathname.slice("/api/patient".length) || "/";
        return next.startsWith("/") ? next : `/${next}`;
      }
      return pathname;
    },
    on: {
      // Forward the authenticated userId so downstream services never need the client to send it
      proxyReq: (proxyReq, req) => {
        if (req.user && req.user.userId) {
          proxyReq.setHeader("X-User-Id", String(req.user.userId));
        }
      },
    },
  })
);

export default router;
