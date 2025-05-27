import { db } from '../firebase/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

export async function fetchRoofingOptions() {
  const snapshot = await getDocs(collection(db, 'roofing_options'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchLoanOptions() {
  const snapshot = await getDocs(collection(db, 'loan_options'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} 