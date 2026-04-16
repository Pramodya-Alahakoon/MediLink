import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/payment": "" },
  })
);

export default router;
