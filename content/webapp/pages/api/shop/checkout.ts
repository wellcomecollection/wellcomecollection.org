import { NextApiRequest, NextApiResponse } from 'next';

import { createShopCheckout } from '@weco/content/services/shopify';

type CheckoutRequestBody = {
  items: { variantId: string; quantity: number }[];
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const body = req.body as CheckoutRequestBody;

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    res.status(400).json({ error: 'items array is required' });
    return;
  }

  try {
    const checkoutUrl = await createShopCheckout(body.items);

    if (!checkoutUrl) {
      res.status(500).json({ error: 'Failed to create checkout' });
      return;
    }

    res.status(200).json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
};

export default handler;
