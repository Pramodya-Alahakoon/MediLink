import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.APPOINTMENT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/appointment": "" },
  })
);

export default router;
