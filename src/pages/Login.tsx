import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../components/Button';
import IconButton from '../components/IconButton';
import { Checkbox } from '../components/Checkbox';

// Brand color
const BRAND_BLUE = 'text-[#173f7c]';
const BRAND_BG = 'bg-[#f8f9fa]';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid email or password. Please try again or contact IT support.');
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center font-sans bg-cover bg-center relative"
      style={{ backgroundImage: 'url(https://getglobalroofing.com/wp-content/uploads/2025/01/AdobeStock_2619622-scaled.jpeg)' }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0" aria-hidden="true" />
      <section className="flex flex-1 flex-col justify-center items-center w-full px-2 py-8 z-10">
        <div className="w-full max-w-[500px] mx-auto rounded-xl bg-white p-6 border border-primary/24 space-y-4 flex flex-col items-center">
          {/* Logo */}
          <img src="/global-roofing-logo.png" alt="Global Roofing Logo" className="h-16 mb-2 mt-2" />
          {/* Header Group */}
          <div className="w-full flex flex-col items-center space-y-1">
            <h1 className="text-3xl font-medium text-primary text-center">Global Roofing Team Portal</h1>
            <p className="text-base font-normal text-muted text-center">For authorized employees and contractors only.</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col w-full space-y-4">
            {/* Email */}
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
            {/* Password with visibility toggle */}
            <div className="w-full">
              <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 pr-10 text-base font-normal text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <span className="absolute inset-y-0 right-2 flex items-center">
                  <IconButton
                    icon={showPassword ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c1.657 0 3.22.403 4.575 1.125M19.07 4.93l-14.14 14.14" /></svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.67 1.67-1.17 2.414" /></svg>
                    )}
                    onClick={() => setShowPassword(v => !v)}
                    ariaLabel={showPassword ? 'Hide password' : 'Show password'}
                    className="ml-2 border-0 p-0 mr-1"
                  />
                </span>
              </div>
            </div>
            {/* Remember Me and Links */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                ariaLabel="Remember Me"
              >
                Remember Me
              </Checkbox>
            </div>
            {/* Error message */}
            {error && <div className="text-red-500 text-sm text-center bg-red-50 rounded-md px-3 py-2 mt-2">{error}</div>}
            {/* Sign In Button */}
            <Button type="submit" variant="primary" className="w-full">Sign In</Button>
            {/* Forgot Password Link */}
            <div className="w-full flex justify-center mt-2">
              <a href="#" className="text-primary text-sm hover:text-primary focus:underline transition-colors duration-200">Forgot your password?</a>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login; 