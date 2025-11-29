import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate('/dashboard/overview');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Sign in to Arc AI</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
            <input type="email" name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-high-tech-blue focus:ring-high-tech-blue sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" name="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-high-tech-blue focus:ring-high-tech-blue sm:text-sm" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button type="submit" className="w-full bg-high-tech-blue text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-all">Sign In</button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? <Link to="/register" className="font-medium text-high-tech-blue hover:text-opacity-80">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
