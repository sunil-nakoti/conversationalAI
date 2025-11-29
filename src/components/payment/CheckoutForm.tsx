import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiService } from '../../services/apiService';

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    try {
      const { data: { clientSecret } } = await apiService.post('/payments/create-payment-intent', {
        amount: 150000, // ₹1500.00 in paisa
        currency: 'inr',
      });

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card details not found.');
        setProcessing(false);
        return;
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message || 'An unexpected error occurred.');
        setSucceeded(false);
      } else {
        setError(null);
        setSucceeded(true);
        // Handle successful payment on the backend
        await apiService.post('/payments/success', { paymentIntentId: paymentResult.paymentIntent.id });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the payment.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <CardElement className="p-3 border border-gray-300 rounded-md" />
      </div>
      
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      {succeeded && <div className="text-green-500 text-sm mb-4">Payment successful!</div>}

      <button 
        disabled={processing || succeeded}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {processing ? 'Processing...' : 'Pay ₹1500'}
      </button>
    </form>
  );
};

export default CheckoutForm;
