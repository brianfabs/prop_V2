import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc as firestoreDoc, getDoc as firestoreGetDoc } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ email: '', fullName: '', password: '', role: 'user' });
  const [saving, setSaving] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    } catch (err) {
      setError('Failed to load users.');
    }
    setLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await addDoc(collection(db, 'users'), {
        email: form.email,
        fullName: form.fullName,
        role: form.role,
        // Do not store password in plaintext in production
      });
      setShowAddModal(false);
      setForm({ email: '', fullName: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setError('Failed to add user.');
    }
    setSaving(false);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'users', editUser.id), {
        email: form.email,
        fullName: form.fullName,
        role: form.role,
      });
      setShowEditModal(false);
      setEditUser(null);
      setForm({ email: '', fullName: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setError('Failed to update user.');
    }
    setSaving(false);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setSaving(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'users', deleteUserId));
      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user.');
    }
    setSaving(false);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setForm({ email: user.email, fullName: user.fullName, password: '', role: user.role });
    setShowEditModal(true);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const userRef = firestoreDoc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <section className="w-full max-w-[1000px] mx-auto space-y-8 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">User Management</h1>
      <div className="text-gray-600 text-base mb-6">Manage user accounts and permissions</div>
      <div className="bg-white rounded shadow-sm p-6">
        <button className="mb-6 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors" onClick={() => setShowAddModal(true)}>
          Add User
        </button>
        <div className="w-full overflow-x-auto">
          {error && <div className="text-red-600 text-center py-2">{error}</div>}
          <table className="w-full text-sm rounded overflow-hidden border-collapse border-spacing-0 bg-white min-w-[600px]">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-gray-200" style={{ borderBottom: '1px solid #e5e5e5' }}>
                <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Email</th>
                <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Full Name</th>
                <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Role</th>
                <th className="py-3 px-3 text-left font-semibold text-xs whitespace-nowrap text-gray-900/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No users found.</td></tr>
              ) : users.map((user, idx) => (
                <tr key={user.id} className={"border-b border-gray-100 last:border-b-0 even:bg-gray-50 transition"}>
                  <td className="py-3 px-2 sm:px-4 text-left">{user.email}</td>
                  <td className="py-3 px-2 sm:px-4 text-left">{user.fullName}</td>
                  <td className="py-3 px-2 sm:px-4 text-left">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm text-gray-900 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 flex gap-2 justify-center">
                    <button className="bg-blue-800 text-white px-4 py-1 rounded-full font-semibold hover:bg-blue-900" onClick={() => openEditModal(user)}>Edit</button>
                    <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-full font-semibold hover:bg-gray-300" onClick={() => setDeleteUserId(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gray-50 rounded shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 w-10 h-10 p-3 flex items-center justify-center text-gray-400 hover:text-gray-700 text-xl font-bold rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditUser(null); }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{showAddModal ? 'Add User' : 'Edit User'}</h3>
            <form onSubmit={showAddModal ? handleAddUser : handleEditUser} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter email address"
                className="input-field"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                disabled={showEditModal}
              />
              <input
                type="text"
                placeholder="Enter full name"
                className="input-field"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                required
              />
              {showAddModal && (
                <input
                  type="password"
                  placeholder="Enter password (min 6 characters)"
                  className="input-field"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              )}
              <select
                className="input-field"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors w-full"
                  disabled={saving}
                >
                  {showAddModal ? 'Add User' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors w-full"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditUser(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gray-50 rounded shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 w-10 h-10 p-3 flex items-center justify-center text-gray-400 hover:text-gray-700 text-xl font-bold rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setDeleteUserId(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Delete User</h3>
            <p className="text-gray-700 mb-6 text-center">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors w-full sm:w-auto"
                onClick={() => setDeleteUserId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors w-full sm:w-auto"
                onClick={handleDeleteUser}
                disabled={saving}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserManagement; 