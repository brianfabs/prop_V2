import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc as firestoreDoc, getDoc as firestoreGetDoc } from 'firebase/firestore';
import { useRoofingOptions } from '../context/RoofingOptionsContext';
import { StatCard } from '../components/StatCard';
import { RecentUsersTable } from '../components/RecentUsersTable';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<{ fullName: string; email: string }[]>([]);
  const [totalLoanOptions, setTotalLoanOptions] = useState<number>(0);
  const { options: contentOptions } = useRoofingOptions();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        setUserName('');
        setUserEmail('');
        setLoading(false);
        return;
      }
      try {
        const userDoc = await firestoreGetDoc(firestoreDoc(db, 'users', user.uid));
        let fullName = '';
        if (userDoc.exists && userDoc.exists()) {
          const data = userDoc.data();
          fullName = data.fullName || '';
        }
        setUserName(fullName);
        setUserEmail(user.email || '');
      } catch {
        setUserName('');
        setUserEmail(user.email || '');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch total users and recent users
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(snapshot.size);
        // Get last 3 users by creation (assuming order by id for now)
        const users = snapshot.docs.map(doc => doc.data() as any);
        // If you have a createdAt field, sort by it. Otherwise, just take last 3.
        const sorted = users
          .filter(u => u.fullName && u.email)
          .reverse()
          .slice(0, 3)
          .map(u => ({ fullName: u.fullName, email: u.email }));
        setRecentUsers(sorted);
      } catch {
        setTotalUsers(0);
        setRecentUsers([]);
      }
    };
    // Fetch total loan options
    const fetchLoanOptions = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'loanOptions'));
        setTotalLoanOptions(snapshot.size);
      } catch {
        setTotalLoanOptions(0);
      }
    };
    fetchUsers();
    fetchLoanOptions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-[1000px] space-y-6 bg-white">
      <div className="space-y-1 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
        <div className="text-gray-600 text-base">Welcome, {userName || 'Admin'}!</div>
      </div>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-start">
          <StatCard label="Users" value={totalUsers} description="Total registered users" className="p-4 rounded" />
          <StatCard label="Content Options" value={contentOptions?.length || 0} description="Total roofing options" className="p-4 rounded" />
          <StatCard label="Loan Options" value={totalLoanOptions} description="Total loan options" className="p-4 rounded" />
        </div>
      </section>
      <section>
        <h2 className="font-semibold text-lg text-gray-900 mb-3">Recent Users</h2>
        <RecentUsersTable users={recentUsers} />
      </section>
    </section>
  );
};

export default AdminDashboard; 