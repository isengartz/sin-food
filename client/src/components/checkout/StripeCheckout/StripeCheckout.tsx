import React, { useRef, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import { Typography } from 'antd';

const options = {
  style: {
    base: {
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

/**
 * Shows stripe's form validation errors
 * @param children
 * @constructor
 */
const ErrorMessage: React.FC = ({ children }) => (
  <div style={{ padding: '5px' }} className="ErrorMessage" role="alert">
    {children}
  </div>
);

interface StripeCheckoutProps {
  onFinish?: (token: string) => void;
  loading: boolean;
}

/**
 * Stripe Pay with Card component
 * @param loading
 * @param onFinish
 * @constructor
 */
const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  loading = false,
  onFinish,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<any>(null);
  const [cardComplete, setCardComplete] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * On form submission
   * @param event
   */
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement('card')!.focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    // Create a payment method id
    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement) as StripeCardElement,
    });

    setProcessing(false);

    if (payload.error) {
      setError(payload.error);
    } else {
      if (onFinish) {
        // Return the id back to parent component
        onFinish(payload.paymentMethod.id);
      }
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <label>
          <CardElement
            onChange={(e) => {
              setError(e.error);
              setCardComplete(e.complete);
            }}
            options={options}
          />
        </label>
        {error && (
          <ErrorMessage>
            <Typography.Text type="danger">{error.message}</Typography.Text>
          </ErrorMessage>
        )}
        <button
          style={{ marginTop: '20px' }}
          type="submit"
          className="ant-btn ant-btn-primary ant-btn-lg"
          disabled={!stripe || processing || loading}
        >
          {processing || loading ? 'Processing...' : 'Complete'}
        </button>
      </div>
    </form>
  );
};

export default StripeCheckout;
