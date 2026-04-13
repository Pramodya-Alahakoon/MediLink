import express from 'express';
import * as webhookController from '../controllers/webhookController.js';

const router = express.Router();

// CRITICAL: Use express.raw() to capture raw body for Stripe signature verification
// This MUST be done before any JSON parsing
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook
);

export default router;
