import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import Layout from '../layout/Layout';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// IMPORTANT: Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || ''); 

const PaymentPage: React.FC = () => {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: '{{CLIENT_SECRET}}', // This will be fetched from the server
  };

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 mb-6">Select a plan to activate your AI receptionist.</p>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      </div>
    </Layout>
  );
};

export default PaymentPage;
