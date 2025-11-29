import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: '{{CLIENT_SECRET}}', // This will be fetched from the server
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Upgrade to Pro</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                <X className="h-6 w-6 text-slate-600" />
              </button>
            </div>
            <div className="p-8">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm />
              </Elements>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
