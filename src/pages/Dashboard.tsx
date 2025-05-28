import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ActionButton from '../components/ActionButton';
import TableActionsMenu from '../components/TableActionsMenu';
import HeaderNav from '../components/HeaderNav';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);
      if (!user || !user.email) {
        setProposals([]);
        setLoading(false);
        return;
      }
      try {
        const snapshot = await getDocs(collection(db, 'proposals'));
        const allProposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProposals(allProposals.filter((p: any) => p.createdBy === user.email));
        (window as any).dashboardDebug = {
          userEmail: user.email,
          allProposals,
          filteredProposals: allProposals.filter((p: any) => p.createdBy === user.email),
        };
      } catch (err: any) {
        setError('Failed to load proposals. Check your Firestore rules and network connection.');
        console.error('Error fetching proposals:', err);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const openDeleteModal = (proposal: any) => {
    setProposalToDelete(proposal);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProposalToDelete(null);
  };

  const handleDelete = async () => {
    if (!proposalToDelete) return;
    try {
      await deleteDoc(doc(db, 'proposals', proposalToDelete.id));
      setProposals(prev => prev.filter(p => p.id !== proposalToDelete.id));
      closeDeleteModal();
    } catch (err) {
      alert('Failed to delete proposal.');
    }
  };

  return (
    <main className="w-screen min-h-screen flex flex-col bg-white">
      <HeaderNav userName="Brian" onLogout={handleLogout} />
      {/* Main Content */}
      <section className="flex flex-1 flex-col items-center justify-center w-full px-2 sm:px-4 py-8 bg-white">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 w-full text-center">Proposals Dashboard</h1>
          <Link
            to="/create-proposal"
            className="mb-6 px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors w-full max-w-xs text-center"
          >
            Create New Proposal
          </Link>
          <div className="w-full overflow-x-auto">
            {error && (
              <div className="text-red-600 text-center py-2">{error}</div>
            )}
            <div className="bg-white rounded-lg shadow w-full min-w-[600px]">
              <table className="w-full text-sm border-none rounded-[10px] overflow-hidden border-collapse border-spacing-0">
                <thead>
                  <tr className="bg-white border-b" style={{ borderBottom: '1px solid #eeeeee' }}>
                    <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Customer Name</th>
                    <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Address</th>
                    <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Squares</th>
                    <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Created By</th>
                    <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Created Date</th>
                    <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading proposals...</td></tr>
                  ) : proposals.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">No proposals found.</td></tr>
                  ) : proposals.map((proposal) => (
                    <tr key={proposal.id} className="border-b last:border-b-0">
                      <td className="py-3 px-2 sm:px-4">{proposal.customerName}</td>
                      <td className="py-3 px-2 sm:px-4">{proposal.address}</td>
                      <td className="py-3 px-2 sm:px-4">{proposal.squares}</td>
                      <td className="py-3 px-2 sm:px-4">{proposal.createdBy}</td>
                      <td className="py-3 px-2 sm:px-4">
                        {proposal.createdAt && proposal.createdAt.seconds
                          ? new Date(proposal.createdAt.seconds * 1000).toLocaleDateString()
                          : typeof proposal.createdAt === 'string'
                          ? proposal.createdAt
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <TableActionsMenu key={proposal.id + location.pathname} proposalId={proposal.id} onDelete={() => openDeleteModal(proposal)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Debug Panel */}
      <div className="w-full max-w-5xl mx-auto mt-4 bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto">
        <div className="mb-2 font-bold text-pink-300">Debug Panel</div>
        <div><span className="font-semibold text-blue-300">Current User Email:</span> {auth.currentUser?.email || 'N/A'}</div>
        <div><span className="font-semibold text-blue-300">Proposals (filtered):</span> <pre className="whitespace-pre-wrap">{JSON.stringify(proposals, null, 2)}</pre></div>
        <div><span className="font-semibold text-blue-300">See window.dashboardDebug for more info.</span></div>
      </div>
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            {/* Close Icon */}
            <button
              className="absolute top-3 right-3 w-10 h-10 p-3 flex items-center justify-center text-gray-400 hover:text-gray-700 text-xl font-bold rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={closeDeleteModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Delete Proposal</h3>
            <p className="text-gray-700 mb-6 text-center">Are you sure you want to delete the proposal for <span className="font-semibold">{proposalToDelete?.customerName}</span>? This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors w-full sm:w-auto"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors w-full sm:w-auto"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard; 