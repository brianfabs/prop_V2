import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '../components/Button';
import IconButton from '../components/IconButton';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError('Could not send reset email. Please check your email address or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center font-sans bg-cover bg-center relative"
      style={{ backgroundImage: 'url(https://getglobalroofing.com/wp-content/uploads/2025/01/AdobeStock_2619622-scaled.jpeg)' }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-0" aria-hidden="true" />
      <section className="flex flex-1 flex-col justify-center items-center w-full px-2 py-8 z-10">
        <div className="w-full max-w-[500px] mx-auto rounded-xl bg-white p-6 border border-primary/24 space-y-4 flex flex-col items-center">
          {/* Logo */}
          <img src="/global-roofing-logo.png" alt="Global Roofing Logo" className="h-16 mb-2 mt-2" />
          {/* Header Group */}
          <div className="w-full flex flex-col items-center space-y-1">
            <h1 className="text-3xl font-medium text-primary text-center">Forgot Password</h1>
            <p className="text-base font-normal text-muted text-center">Enter your email to reset your password.</p>
          </div>
          {sent ? (
            <>
              <div className="w-full text-green-600 bg-green-50 rounded-md px-3 py-2 text-center">
                If an account exists for <span className="font-medium">{email}</span>, a password reset link has been sent.
              </div>
              <div className="w-full flex justify-center mt-4">
                <button
                  type="button"
                  className="text-primary text-sm hover:text-primary-dark hover:underline transition-colors duration-200 bg-transparent border-0 p-0 focus:outline-none active:border-0"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
              <div className="w-full">
                <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                  autoComplete="email"
                  aria-label="Email Address"
                />
              </div>
              {error && <div className="text-red-500 text-sm text-center bg-red-50 rounded-md px-3 py-2 mt-2">{error}</div>}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <div className="w-full flex justify-center mt-4">
                <button
                  type="button"
                  className="text-primary text-sm hover:text-primary-dark hover:underline transition-colors duration-200 bg-transparent border-0 p-0 focus:outline-none active:border-0"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword; 