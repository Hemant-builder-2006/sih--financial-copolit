import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/webhooks/stripe - Handle Stripe payment webhooks
router.post('/stripe', (req: Request, res: Response) => {
  // TODO: Implement Stripe webhook logic
  res.json({ message: 'Stripe webhook endpoint - TODO' });
});

export default router;
