import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-5xl font-bold text-high-tech-blue">24/7 AI Receptionist for your Business</h1>
      <p className="mt-4 text-lg text-slate-600">The future of customer interaction is here.</p>
      <button className="mt-8 px-8 py-3 text-lg font-semibold text-white bg-high-tech-blue rounded-lg shadow-lg hover:bg-opacity-90 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
