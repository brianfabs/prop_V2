import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRoofingOptions, fetchLoanOptions } from '../services/firebase';
import { db } from '../firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const badges = [
  { icon: '🏅', text: 'Licensed & Insured' },
  { icon: '⭐', text: 'A+ BBB Rating' },
  { icon: '⏳', text: '25+ Years Experience' },
];

const ProposalView: React.FC = () => {
  const { id } = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [roofingOptions, setRoofingOptions] = useState<any[]>([]);
  const [loanOptions, setLoanOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [roof, loans] = await Promise.all([
          fetchRoofingOptions(),
          fetchLoanOptions(),
        ]);
        setRoofingOptions(roof);
        setLoanOptions(loans);
        if (id) {
          const proposalDoc = await getDoc(doc(db, 'proposals', id));
          setProposal(proposalDoc.exists() ? { id: proposalDoc.id, ...proposalDoc.data() } : null);
        }
      } catch (err: any) {
        setError('Failed to load proposal. Please check your network and Firestore rules.');
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  // Helper: get price per square based on squares
  const getPricePerSquare = (option: any) =>
    proposal && proposal.squares >= 16 ? option.pricePerSquare : option.pricePerSquareUnder16;

  // Helper: calculate total price
  const getTotalPrice = (option: any) =>
    proposal ? getPricePerSquare(option) * proposal.squares : 0;

  // Helper: format proposal date
  const getProposalDate = () => {
    if (!proposal || !proposal.createdAt) return 'N/A';
    if (proposal.createdAt.seconds) {
      return new Date(proposal.createdAt.seconds * 1000).toLocaleDateString();
    }
    if (typeof proposal.createdAt === 'string') {
      return proposal.createdAt;
    }
    return 'N/A';
  };

  return (
    <main className="w-screen min-h-screen flex flex-col bg-gray-100 items-center py-6 px-2">
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col items-center mb-6">
        <span className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-2 mt-4">
          Global Roofing
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-3 text-center">Your Roofing Investment Proposal</h1>
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {badges.map((badge, i) => (
            <span key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-700">
              <span className="text-lg">{badge.icon}</span> {badge.text}
            </span>
          ))}
        </div>
        <hr className="w-full border-t border-gray-200 mb-6" />
      </header>

      {/* Error State */}
      {error && (
        <div className="w-full max-w-2xl bg-red-100 text-red-700 rounded-lg p-4 mb-6 text-center">{error}</div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="w-full max-w-2xl bg-white rounded-lg p-8 shadow text-center text-gray-500 mb-6">Loading proposal...</div>
      )}

      {/* Main Content */}
      {!loading && proposal && (
        <>
          {/* Project Overview */}
          <section className="w-full max-w-5xl bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 text-center">Project Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Customer Details
                </div>
                <div><span className="font-medium">Name:</span> {proposal.customerName || 'N/A'}</div>
                <div><span className="font-medium">Property Address:</span> {proposal.address || 'N/A'}</div>
                <div><span className="font-medium">Roof Size:</span> {proposal.squares !== undefined ? proposal.squares + ' squares' : 'N/A'}</div>
              </div>
              {/* Project Timeline */}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Project Timeline
                </div>
                <div><span className="font-medium">Proposal Date:</span> {getProposalDate()}</div>
                <div><span className="font-medium">Estimated Start:</span> Within 2-3 weeks</div>
                <div><span className="font-medium">Project Duration:</span> 1-3 days</div>
              </div>
            </div>
          </section>

          {/* Roofing Options */}
          <section className="w-full max-w-5xl bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-6 text-center">Your Roofing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roofingOptions.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">No roofing options available.</div>
              ) : (
                roofingOptions.map((option, idx) => (
                  <div key={option.id || idx} className="flex flex-col bg-gray-50 rounded-lg shadow-sm p-4">
                    <div className={`rounded-t-lg px-4 py-3 font-semibold text-white text-lg text-center ${idx === 0 ? 'bg-blue-900' : idx === 1 ? 'bg-blue-800' : 'bg-blue-700'}`}>{option.title || 'Option'}</div>
                    <div className="px-4 py-3 text-2xl font-bold text-blue-900 text-center">${getTotalPrice(option).toLocaleString()}</div>
                    <div className="px-4 text-sm text-gray-600 text-center mb-2">${getPricePerSquare(option).toLocaleString()} per square</div>
                    <div className="w-full h-28 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">Image</div>
                    <div className="px-2 text-gray-700 text-sm mb-2">{option.description || 'No description available.'}</div>
                    <div className="px-2 text-gray-700 text-sm mb-2">
                      <span className="font-semibold text-blue-900">Warranty</span><br />
                      {option.warranty || 'No warranty info.'}
                    </div>
                    <div className="px-2 mt-auto">
                      <div className="font-medium text-gray-700 mb-1 text-[12px] text-gray-900/70">Financing Options</div>
                      <select className="input-field">
                        <option>Select financing option</option>
                        {loanOptions.map((loan: any) => (
                          <option key={loan.id} value={loan.id}>{loan.name || 'Option'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}

      {/* Fallback if no proposal found and not loading */}
      {!loading && !proposal && !error && (
        <div className="w-full max-w-2xl bg-white rounded-lg p-8 shadow text-center text-gray-500 mb-6">Proposal not found or missing data.</div>
      )}

      {/* Footer Disclaimer */}
      <footer className="w-full max-w-5xl mx-auto text-xs text-gray-500 text-center pb-8 px-2">
        <div className="mb-1">This proposal is valid for 30 days from the date of creation.</div>
        <div>All prices include materials and labor. Additional charges may apply for permits and disposal.</div>
      </footer>

      {/* Debug Panel */}
      <div className="w-full max-w-5xl mx-auto mt-4 bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto">
        <div className="mb-2 font-bold text-pink-300">Debug Panel</div>
        <div><span className="font-semibold text-blue-300">loading:</span> {JSON.stringify(loading)}</div>
        <div><span className="font-semibold text-blue-300">error:</span> {JSON.stringify(error)}</div>
        <div><span className="font-semibold text-blue-300">proposal:</span> <pre className="whitespace-pre-wrap">{JSON.stringify(proposal, null, 2)}</pre></div>
        <div><span className="font-semibold text-blue-300">roofingOptions:</span> <pre className="whitespace-pre-wrap">{JSON.stringify(roofingOptions, null, 2)}</pre></div>
        <div><span className="font-semibold text-blue-300">loanOptions:</span> <pre className="whitespace-pre-wrap">{JSON.stringify(loanOptions, null, 2)}</pre></div>
      </div>
    </main>
  );
};

export default ProposalView; 