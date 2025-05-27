import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main className="w-screen h-screen min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <form
          onSubmit={handleLogin}
          className="bg-white w-full max-w-sm rounded-xl shadow-lg px-6 py-8 sm:px-10 sm:py-10 flex flex-col gap-5"
        >
          <div className="flex flex-col items-center mb-2">
            {/* Logo placeholder */}
            <span className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-2">
              Global Roofing
              {/* <img src="/logo.png" alt="Global Roofing" className="h-8" /> */}
            </span>
          </div>
          <div className="w-full">
            <label htmlFor="email" className="block text-[12px] text-gray-900/70 font-medium mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field mt-1"
              autoComplete="email"
            />
          </div>
          <div className="w-full">
            <label htmlFor="password" className="block text-[12px] text-gray-900/70 font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input-field mt-1"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition-colors mt-2"
          >
            Sign In
          </button>
          <div className="text-center mt-2">
            <a href="#" className="text-blue-900 underline text-sm hover:text-blue-700">Forgot your password?</a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login; 