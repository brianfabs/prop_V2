import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const navigate = useNavigate();

  const logDebug = (msg: string) => {
    setDebugLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugLog([]);
    logDebug('Attempting to create user with email: ' + email);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      logDebug('Auth: User created with UID: ' + user.uid);
      // Store additional user info in Firestore, including password (for testing only)
      logDebug('Attempting to write user info to Firestore (including password)...');
      await setDoc(doc(db, 'users', user.uid), {
        email,
        fullName,
        role,
        uid: user.uid,
        password, // WARNING: For testing only. Never store plain text passwords in production.
      });
      logDebug('Firestore: User document written successfully.');
      setSuccess('Account created successfully!');
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('user');
    } catch (err: any) {
      logDebug('Error: ' + (err.message || JSON.stringify(err)));
      setError(err.message || 'Account creation failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 sm:p-10"
      >
        <h2 className="text-2xl font-bold text-blue-900 text-center mb-4">Create Account</h2>
        <div className="w-full">
          <label className="block text-[12px] text-gray-900/70 font-medium mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="input-field mt-1"
            autoComplete="email"
          />
        </div>
        <div className="w-full">
          <label className="block text-[12px] text-gray-900/70 font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="input-field mt-1"
            autoComplete="new-password"
          />
        </div>
        <div className="w-full">
          <label className="block text-[12px] text-gray-900/70 font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            className="input-field mt-1"
            autoComplete="name"
          />
        </div>
        <div className="w-full">
          <label className="block text-[12px] text-gray-900/70 font-medium mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="input-field mt-1">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition-colors mt-2"
        >
          Create Account
        </button>
        {/* Enhanced debug window */}
        <pre className="mt-4 bg-gray-100 p-3 rounded text-xs max-h-40 overflow-y-auto">
          {debugLog.map((line, idx) => <div key={idx}>{line}</div>)}
        </pre>
      </form>
    </div>
  );
};

export default CreateAccount; 