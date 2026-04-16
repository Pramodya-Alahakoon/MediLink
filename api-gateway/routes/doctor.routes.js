import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  createProxyMiddleware({
    target: process.env.DOCTOR_SERVICE,
    changeOrigin: true,
    // Express strips the mount prefix (/api/doctor or /api/doctors) before the
    // proxy sees it, so pathname is "/" or "/user/xyz" etc.
    // Doctor-service expects everything under /api/doctors/...
    pathRewrite: (pathname) => {
      return `/api/doctors${pathname === "/" ? "" : pathname}`;
    },
  })
);

export default router;
