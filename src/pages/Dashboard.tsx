import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import ActionButton from '../components/ActionButton';
import TableActionsMenu from '../components/TableActionsMenu';
import HeaderNav from '../components/HeaderNav';
import { useRoofingOptions } from '../context/RoofingOptionsContext';
import CreateProposalModal from '../components/CreateProposalModal';
import { Button } from '../components/Button';
import EditProposalModal from './EditProposal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProposalId, setEditProposalId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);
      if (!user || !user.email) {
        setProposals([]);
        setUserName('');
        setUserEmail('');
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let fullName = '';
        if (userDoc.exists && userDoc.exists()) {
          const data = userDoc.data();
          fullName = data.fullName || '';
        }
        if (!fullName && user.displayName) {
          fullName = user.displayName;
        }
        setUserName(fullName);
        setUserEmail(user.email || '');
        const snapshot = await getDocs(collection(db, 'proposals'));
        const allProposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProposals(allProposals.filter((p: any) => p.createdBy === user.email));
      } catch (err: any) {
        setError('Failed to load proposals. Check your Firestore rules and network connection.');
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
      <HeaderNav userName={userName} userEmail={userEmail} onLogout={handleLogout} />
      {/* Main Content */}
      <section className="flex flex-1 flex-col w-full px-2 sm:px-4 py-8 bg-white pt-20">
        <div className="w-full max-w-5xl mx-auto">
          <div className="w-full flex flex-row items-end justify-between gap-6 mb-3">
            <h1 className="text-left text-primary-dark flex items-center gap-2" style={{ fontSize: '2.4em', fontWeight: 300 }}>
              Proposals Created
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-white text-primary text-base font-semibold border border-primary/20">
                {proposals.length}
              </span>
            </h1>
            <Button
              variant="primary"
              className="max-w-xs text-center"
              style={{ alignSelf: 'flex-start' }}
              onClick={e => { e.preventDefault && e.preventDefault(); setShowCreateModal(true); }}
            >
              Create New Proposal
            </Button>
          </div>
          <div className="w-full overflow-auto">
            {error && (
              <div className="text-red-600 text-center py-2">{error}</div>
            )}
            <div className="bg-white rounded w-full min-w-[600px]">
              <table className="w-full table-auto text-left border-collapse bg-white">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr>
                    <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-left whitespace-nowrap">Customer Name</th>
                    <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-left whitespace-nowrap">Address</th>
                    <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Squares</th>
                    <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-left whitespace-nowrap">Created By</th>
                    <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Created Date</th>
                    <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading proposals...</td></tr>
                  ) : proposals.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">No proposals found.</td></tr>
                  ) : proposals.map((proposal, idx) => (
                    <tr key={proposal.id} className="bg-white border-b border-primary border-opacity-10 last:border-b-0">
                      <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-left">{proposal.customerName}</td>
                      <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-left">{proposal.address}</td>
                      <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-right font-mono">{proposal.squares}</td>
                      <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-left">{proposal.createdBy}</td>
                      <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-right">
                        {proposal.createdAt && proposal.createdAt.seconds
                          ? new Date(proposal.createdAt.seconds * 1000).toLocaleDateString()
                          : typeof proposal.createdAt === 'string'
                          ? proposal.createdAt
                          : 'N/A'}
                      </td>
                      <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-right flex gap-2 items-center justify-end">
                        <TableActionsMenu
                          key={proposal.id + location.pathname}
                          proposalId={proposal.id}
                          onDelete={() => openDeleteModal(proposal)}
                          onEdit={(id) => { setEditProposalId(id); setEditModalOpen(true); }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gray-50 rounded shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            {/* Close Icon */}
            <button
              className="absolute top-3 right-3 w-10 h-10 p-3 flex items-center justify-center text-gray-400 hover:text-gray-700 text-xl font-bold rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={closeDeleteModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Delete Proposal</h3>
            <p className="text-gray-700 mb-6 text-center">Are you sure you want to delete the proposal for <span className="font-semibold">{proposalToDelete?.customerName}</span>? This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button type="button" variant="primary" className="w-full sm:w-auto bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      <CreateProposalModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // re-fetch proposals
          const fetchProposals = async () => {
            setLoading(true);
            setError(null);
            try {
              const user = auth.currentUser;
              if (!user || !user.email) {
                setProposals([]);
                setLoading(false);
                return;
              }
              const snapshot = await getDocs(collection(db, 'proposals'));
              const allProposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setProposals(allProposals.filter((p: any) => p.createdBy === user.email));
            } catch (err: any) {
              setError('Failed to load proposals. Check your Firestore rules and network connection.');
            }
            setLoading(false);
          };
          fetchProposals();
        }}
      />
      <EditProposalModal
        open={editModalOpen}
        proposalId={editProposalId}
        onClose={() => setEditModalOpen(false)}
        onSuccess={async () => {
          setEditModalOpen(false);
          setLoading(true);
          setError(null);
          try {
            const user = auth.currentUser;
            if (!user || !user.email) {
              setProposals([]);
              setLoading(false);
              return;
            }
            const snapshot = await getDocs(collection(db, 'proposals'));
            const allProposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProposals(allProposals.filter((p: any) => p.createdBy === user.email));
          } catch (err: any) {
            setError('Failed to load proposals. Check your Firestore rules and network connection.');
          }
          setLoading(false);
        }}
      />
    </main>
  );
};

export default Dashboard; 