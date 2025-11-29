import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import PaymentModal from '../../components/payment/PaymentModal';

const PricingCard: React.FC<{ plan: string; price: string; features: string[]; isPro?: boolean; onSubscribe: () => void }> = ({ plan, price, features, isPro, onSubscribe }) => (
  <div className={`border rounded-lg p-8 flex flex-col ${isPro ? 'bg-high-tech-blue text-white shadow-2xl' : 'bg-white'}`}>
    <h3 className="text-2xl font-semibold">{plan}</h3>
    <p className="mt-4">
      <span className="text-4xl font-bold">{price}</span>
      <span className="text-lg ml-1">/ month</span>
    </p>
    <ul className="mt-8 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <CheckCircle className={`h-6 w-6 ${isPro ? 'text-sky-400' : 'text-green-500'}`} />
          <span className="ml-3">{feature}</span>
        </li>
      ))}
    </ul>
    <div className="flex-grow" />
    <button 
      onClick={onSubscribe}
      className={`mt-8 w-full py-3 font-semibold rounded-lg transition-all ${isPro ? 'bg-white text-high-tech-blue hover:bg-slate-200' : 'bg-high-tech-blue text-white hover:bg-opacity-90'}`}>
      {isPro ? 'Subscribe to Pro' : 'Current Plan'}
    </button>
  </div>
);

const Billing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const freeFeatures = ['50 conversations/month', 'Basic AI persona', 'Email support'];
  const proFeatures = ['Unlimited conversations', 'Advanced AI persona', 'Priority support', 'API access'];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Billing & Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PricingCard plan="Free" price="$0" features={freeFeatures} onSubscribe={() => {}} />
        <PricingCard plan="Pro" price="$49" features={proFeatures} isPro onSubscribe={() => setIsModalOpen(true)} />
      </div>
      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Billing;
