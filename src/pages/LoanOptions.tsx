import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc as firestoreDoc, getDoc as firestoreGetDoc, collection, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { LoanOptionsTable } from '../components/LoanOptionsTable';
import { LoanOptionModal } from '../components/LoanOptionModal';
import { Button } from '../components/Button';

interface LoanOption {
  id?: string;
  name: string;
  term: number;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  description?: string;
}

const LoanOptions: React.FC = () => {
  const navigate = useNavigate();
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>("add");
  const [selectedOption, setSelectedOption] = useState<LoanOption | null>(null);

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
    const fetchLoanOptions = async () => {
      try {
        const loanOptionsCollection = collection(db, 'loanOptions');
        const loanOptionsSnapshot = await getDocs(loanOptionsCollection);
        const optionsList = loanOptionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLoanOptions(optionsList);
      } catch (error) {
        console.error('Error fetching loan options:', error);
      }
    };

    fetchLoanOptions();
  }, []);

  const handleDeleteOption = async (option: LoanOption) => {
    try {
      if (!option.id) return;
      await updateDoc(firestoreDoc(db, 'loanOptions', option.id), { status: 'inactive' });
      setLoanOptions(loanOptions.filter(o => o.id !== option.id));
    } catch (error) {
      console.error('Error deleting loan option:', error);
    }
  };

  const handleSaveOption = async (option: LoanOption) => {
    try {
      if (option.id) {
        await updateDoc(firestoreDoc(db, 'loanOptions', option.id), option);
        setLoanOptions(loanOptions.map(o => o.id === option.id ? option : o));
      } else {
        const docRef = await addDoc(collection(db, 'loanOptions'), option);
        setLoanOptions([...loanOptions, { ...option, id: docRef.id }]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving loan option:', error);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50 min-h-screen">
      <section className="w-full max-w-6xl mx-auto space-y-8">
        <div className="flex flex-row items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Loan Options</h1>
            <div className="text-gray-600 text-base">Manage financing options and terms</div>
          </div>
          <Button variant="primary" onClick={() => { setModalMode('add'); setSelectedOption(null); setModalOpen(true); }}>Add Loan Option</Button>
        </div>
        <LoanOptionsTable
          loanOptions={loanOptions}
          onEdit={(option: LoanOption) => { setModalMode('edit'); setSelectedOption(option); setModalOpen(true); }}
          onDelete={handleDeleteOption}
        />
      </section>
      <LoanOptionModal
        open={modalOpen}
        mode={modalMode}
        option={selectedOption}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveOption}
      />
    </main>
  );
};

export default LoanOptions; 