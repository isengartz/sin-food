/* eslint-disable @typescript-eslint/indent */
import { BadRequestError, PaymentMethod } from '@sin-nombre/sinfood-common';
import { stripe } from './stripe';

/**
 *
 * @param method
 * @param price
 * @param token
 */
export const handlePaymentMethod = async (
  method: PaymentMethod,
  price: number,
  token?: string,
): Promise<{ success: boolean; id?: string }> => {
  if (!token && method !== PaymentMethod.CASH) {
    throw new BadRequestError('Missing Payment method token');
  }
  let charge;
  switch (method) {
    case PaymentMethod.STRIPE:
      charge = await handleStripeCharge(price, token!);
      return charge;
    case PaymentMethod.PAYPAL:
    case PaymentMethod.CASH:
      return handleCashCharge();
    default:
      throw new BadRequestError('Not a Valid Payment method');
  }
};

/**
 *
 * @param price
 * @param token
 */
const handleStripeCharge = async (price: number, token: string) => {
  const charge = await stripe.charges?.create({
    amount: price * 100,
    currency: 'eur',
    source: token,
  });
  return { id: charge.id, success: true };
};

const handleCashCharge = () => {
  return { success: true };
};
