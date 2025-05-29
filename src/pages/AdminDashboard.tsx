import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import { auth, db } from '../firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc as firestoreDoc, getDoc as firestoreGetDoc } from 'firebase/firestore';

const sidebarLinks = [
  { label: 'Dashboard', icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
    ), active: true },
  { label: 'User Management', icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" /></svg>
    ) },
  { label: 'Content Management', icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
    ) },
  { label: 'Loan Options', icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
    ) },
];

const cards = [
  {
    title: 'Users',
    description: 'Manage user accounts and permissions',
    button: 'Manage Users',
    icon: (
      <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" /></svg>
    ),
    bg: 'bg-blue-50',
    action: '#',
  },
  {
    title: 'Content',
    description: 'Manage roofing options and content',
    button: 'Manage Content',
    icon: (
      <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
    ),
    bg: 'bg-green-50',
    action: '#',
  },
  {
    title: 'Loan Options',
    description: 'Manage financing options for proposals',
    button: 'Manage Loans',
    icon: (
      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
    ),
    bg: 'bg-gray-50',
    action: '#',
  },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        setUserName('');
        setUserEmail('');
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
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="w-screen min-h-screen flex flex-col bg-gray-50">
      <HeaderNav userName={userName} userEmail={userEmail} onLogout={() => navigate('/login')} />
      <div className="flex flex-1 pt-30">
        {/* Sidebar */}
        <aside className="w-60 min-h-[90vh] bg-white flex flex-col p-6 justify-between sticky top-0 left-0 z-20" style={{padding: '24px 0 24px 24px', borderTopRightRadius: '16px', borderBottomRightRadius: '16px'}}>
          {/* Sidebar Header */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">Global Roofing</span>
            </div>
            <nav className="flex flex-col gap-0.5">
              {sidebarLinks.map((link, idx) => (
                <button
                  key={link.label}
                  type="button"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${link.active ? 'bg-blue-900 text-white font-bold' : 'text-gray-700'} `}
                  onClick={() => {
                    if (link.label === 'Dashboard') navigate('/admin');
                    else if (link.label === 'User Management') navigate('/admin/user-management');
                    else if (link.label === 'Content Management') navigate('/admin/content-management');
                    else if (link.label === 'Loan Options') navigate('/admin/loan-options');
                  }}
                >
                  {/* Semantic outlined icons for each tab */}
                  {link.label === 'Dashboard' && (
                    <svg className={`w-6 h-6 ${link.active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
                  )}
                  {link.label === 'User Management' && (
                    <svg className={`w-6 h-6 ${link.active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" /></svg>
                  )}
                  {link.label === 'Content Management' && (
                    <svg className={`w-6 h-6 ${link.active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  )}
                  {link.label === 'Loan Options' && (
                    <svg className={`w-6 h-6 ${link.active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
                  )}
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
          <div className="max-w-7xl w-full px-6 py-8 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
                <div className="text-gray-600 text-base">Welcome to the Global Roofing Admin Panel</div>
              </div>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full flex items-center gap-2 shadow-sm transition-colors"
                onClick={() => navigate('/dashboard')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back to Dashboard
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map(card => (
                <div key={card.title} className="rounded-2xl shadow bg-white p-6 flex flex-col items-start" style={{minHeight: '200px'}}>
                  <div className="mb-4">{card.icon}</div>
                  <div className="text-xl font-bold mb-1 text-gray-900">{card.title}</div>
                  <div className="text-gray-600 mb-4">{card.description}</div>
                  {card.button === 'Manage Content' ? (
                    <button
                      className="mt-auto px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors"
                      onClick={() => navigate('/admin/content-management')}
                    >
                      {card.button}
                    </button>
                  ) : (
                    <a
                      href={card.action}
                      className="mt-auto px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors"
                    >
                      {card.button}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 