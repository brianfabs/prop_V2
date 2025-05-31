import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLoanOptions } from '../services/firebase';
import { db, auth } from '../firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useRoofingOptions } from '../context/RoofingOptionsContext';
import Drawer from '../components/Drawer';
import { Button } from '../components/Button';
import { onAuthStateChanged } from 'firebase/auth';

const badges = [
  { icon: '🏅', text: 'Licensed & Insured' },
  { icon: '⭐', text: 'A+ BBB Rating' },
  { icon: '⏳', text: '25+ Years Experience' },
];

const ProposalView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<any>(null);
  const [loanOptions, setLoanOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { options: roofingOptions } = useRoofingOptions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedFinancing, setSelectedFinancing] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        setUserName('');
        setUserEmail('');
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const loans = await fetchLoanOptions();
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

  // Handler for option selection
  const handleOptionToggle = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((opt) => opt !== id) : [...prev, id]
    );
  };

  const handleFinancingChange = (loanId: string) => {
    setSelectedFinancing(loanId);
  };

  // For initial selection, select all by default
  useEffect(() => {
    if (roofingOptions.length > 0) {
      setSelectedOptions(roofingOptions.map((opt: any) => opt.id || opt.key));
    }
  }, [roofingOptions]);

  // Helper: calculate monthly payment based on selected loan
  function getMonthlyPayment(total: number, loan: any) {
    if (!loan || !loan.term || !loan.interestRate) return null;
    const r = loan.interestRate / 100 / 12;
    const n = loan.term;
    if (r === 0) return (total / n).toFixed(2);
    return ((total * r) / (1 - Math.pow(1 + r, -n))).toFixed(2);
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Return to Dashboard Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          aria-label="Return to Dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded"
          onClick={() => navigate('/dashboard')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Return to Dashboard
        </Button>
      </div>
      <div className={`relative flex-1 transition-all duration-500 ease-in-out ${drawerOpen ? 'mr-[33.333vw]' : ''} bg-white`}>
        {/* Top-right Drawer Button */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="primary"
            aria-label="Open Options Drawer"
            className="flex items-center justify-center px-2 py-2 rounded"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <circle cx="4" cy="12" r="2" fill="white" stroke="white" />
              <circle cx="12" cy="8" r="2" fill="white" stroke="white" />
              <circle cx="20" cy="16" r="2" fill="white" stroke="white" />
            </svg>
          </Button>
        </div>
        {/* Drawer */}
        <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-primary mb-2">PDF Roofing Options</h2>
            <p className="text-base text-muted mb-2">Select the roofing options to include in your downloadable proposal.</p>
            <div className="flex flex-col gap-2 mb-3">
              {roofingOptions.map((option: any) => {
                const optionId = option.id || option.key;
                return (
                  <label key={optionId} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(optionId)}
                      onChange={() => handleOptionToggle(optionId)}
                      className="accent-primary w-4 h-4 rounded border border-primary"
                      aria-label={`Select ${option.title || 'Option'}`}
                    />
                    <span className="font-medium text-gray-800 text-sm">{option.title || 'Option'}</span>
                  </label>
                );
              })}
            </div>
            <div>
              <h3 className="text-base font-medium text-primary mb-2">Financing Option</h3>
              <p className="text-xs text-muted mb-2">Choose a financing option to display in your proposal.</p>
              <select
                className="input-field w-full text-sm"
                value={selectedFinancing}
                onChange={e => handleFinancingChange(e.target.value)}
                aria-label="Select financing option"
              >
                <option value="">Select financing option</option>
                {loanOptions.map((loan: any) => (
                  <option key={loan.id} value={loan.id}>{loan.name || loan['test name'] || 'Option'}</option>
                ))}
              </select>
            </div>
          </div>
        </Drawer>
        <section className="w-full max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center space-y-4 pb-0">
            {/* Logo */}
            <div className="w-full flex items-center justify-center">
              <img 
                src="/global-roofing-logo.png" 
                alt="Global Roofing Logo" 
                className="h-16 w-auto"
              />
            </div>
            {/* Main Title */}
            <div className="w-full text-center">
              <h1 className="text-3xl font-medium text-primary mb-2">Roofing Investment Proposal</h1>
              <p className="text-base text-muted max-w-2xl mx-auto font-normal">A comprehensive solution designed to protect and enhance your home's value.</p>
            </div>
            {/* Trust Badges */}
            <div className="w-full">
              <div className="flex flex-wrap justify-center gap-3">
                {badges.map((badge, i) => (
                  <span 
                    key={i} 
                    className="flex items-center gap-2 bg-white border border-primary/10 rounded px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200"
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <span>{badge.text}</span>
                  </span>
                ))}
              </div>
            </div>
            {/* Divider */}
            <div className="w-full">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          </div>
          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-700 rounded p-4 text-center border border-red-200 text-base font-medium">{error}</div>
          )}
          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded p-4 text-center text-gray-500 border border-gray-200 text-base">Loading proposal...</div>
          )}
          {/* Main Content */}
          {!loading && proposal && (
            <React.Fragment>
              {/* Project Overview */}
              <section className="mt-4">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-medium text-primary mb-2">Project Overview</h2>
                  <p className="text-base text-muted max-w-2xl mx-auto">A summary of your project details and timeline.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Details */}
                  <article className="rounded-md bg-white p-4 border border-primary/24 border-[1px] space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary/10 rounded-full p-1 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </span>
                      <h3 className="text-lg font-medium text-primary mb-2">Customer Details</h3>
                    </div>
                    <div className="border-b border-primary/10 mb-4" />
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1">Name</div>
                        <div className="text-base text-gray-700 font-normal">{proposal.customerName || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1">Roof Size</div>
                        <div className="text-base text-gray-700 font-normal">{proposal.squares !== undefined ? proposal.squares + ' squares' : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1">Property Address</div>
                        <div className="text-base text-gray-700 font-normal">{proposal.address || 'N/A'}</div>
                      </div>
                    </div>
                  </article>
                  {/* Project Timeline */}
                  <article className="rounded-md bg-white p-4 border border-primary/24 border-[1px] space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary/10 rounded-full p-1 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </span>
                      <h3 className="text-lg font-medium text-primary mb-2">Project Timeline</h3>
                    </div>
                    <div className="border-b border-primary/10 mb-4" />
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1">Proposal Date</div>
                        <div className="text-base text-gray-700 font-normal">{getProposalDate()}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1">Estimated Start</div>
                        <div className="text-base text-gray-700 font-normal">Within 2–3 weeks</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-muted mb-1">Project Duration</div>
                        <div className="text-base text-gray-700 font-normal">1–3 days</div>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
              {/* Roofing Options */}
              <section className="space-y-4 mt-4">
                <div className="text-center">
                  <h2 className="text-2xl font-medium text-primary mb-2">Your Roofing Options</h2>
                  <p className="text-base text-muted max-w-2xl mx-auto">Select from our premium roofing solutions, each crafted to deliver outstanding protection and value for your home.</p>
                </div>
                {/* Responsive Roofing Options Grid */}
                {
                  (() => {
                    const visibleOptions = roofingOptions.filter((option: any) => selectedOptions.includes(option.id || option.key));
                    let gridCols = 'grid-cols-1';
                    if (visibleOptions.length === 2) gridCols = 'grid-cols-1 md:grid-cols-2';
                    else if (visibleOptions.length >= 3) gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
                    return (
                      <div className={`grid ${gridCols} gap-4`}>
                        {roofingOptions.length === 0 ? (
                          <div className="col-span-3 text-center text-gray-500">No roofing options available.</div>
                        ) : (
                          visibleOptions.map((option: any) => (
                            <div
                              key={option.id}
                              className="group rounded bg-white border border-primary/24 flex flex-col transition-all duration-300 space-y-2"
                            >
                              {/* Header with gradient background */}
                              <div className={`p-4 text-center relative overflow-hidden rounded-t bg-gradient-to-br from-primary to-primary-dark`}>
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                <h3 className="text-xl font-medium text-white mb-1">{option.title || 'Roofing Option'}</h3>
                                <div className="text-xs font-medium uppercase tracking-wide text-white">Premium Roofing Solution</div>
                              </div>
                              {/* Price Section */}
                              <div className="p-4 bg-gray-50 border-b border-primary/10">
                                <div className="text-3xl font-bold text-primary text-center mb-1">
                                  ${getTotalPrice(option).toLocaleString()}
                                </div>
                                {(() => {
                                  const selectedLoan = loanOptions.find(l => l.id === selectedFinancing);
                                  const monthly = getMonthlyPayment(getTotalPrice(option), selectedLoan);
                                  return selectedLoan && monthly ? (
                                    <div className="text-base text-primary text-center mb-1">
                                      ≈ ${monthly} /mo
                                      <span className="text-xs text-muted"> for {selectedLoan.term} months @ {selectedLoan.interestRate}%</span>
                                    </div>
                                  ) : null;
                                })()}
                                <div className="text-sm text-muted text-center flex items-center justify-center gap-2">
                                  <span>${getPricePerSquare(option).toLocaleString()} per square</span>
                                  <span className="text-xs text-gray-400">|</span>
                                  <span className="text-xs text-gray-500">Includes materials and labor</span>
                                </div>
                              </div>
                              {/* Image Section */}
                              <div className="relative w-full h-36 bg-gray-50 overflow-hidden rounded-b">
                                {option.imageUrl ? (
                                  <img
                                    src={option.imageUrl}
                                    alt={option.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              {/* Content Section */}
                              <div className="flex-1 p-4 flex flex-col space-y-2">
                                <div className="text-base text-gray-700 mb-3 leading-relaxed">{option.description || 'No description available.'}</div>
                                {/* Features List */}
                                <div className="space-y-2 mb-3">
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <span className="text-base text-gray-700">Premium quality materials</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <span className="text-base text-gray-700">Expert installation</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <span className="text-base text-gray-700">Comprehensive warranty</span>
                                  </div>
                                </div>
                                {/* Warranty Section */}
                                <div className="bg-primary/10 rounded p-3 mb-3">
                                  <div className="text-xs font-medium uppercase tracking-wide text-primary mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Warranty Coverage
                                  </div>
                                  <div className="text-base text-gray-700 leading-relaxed">{option.warranty || 'No warranty information available.'}</div>
                                </div>
                              </div>
                              {/* Footer Badges */}
                              <div className="p-4 bg-gray-50 border-t border-primary/10 rounded-b">
                                <div className="flex flex-wrap gap-2 justify-center">
                                  <span className="flex items-center gap-1.5 bg-white border border-primary/10 rounded px-3 py-1 text-xs text-gray-700">
                                    <span className="text-primary">✓</span> Licensed & Insured
                                  </span>
                                  <span className="flex items-center gap-1.5 bg-white border border-primary/10 rounded px-3 py-1 text-xs text-gray-700">
                                    <span className="text-primary">✓</span> A+ BBB Rating
                                  </span>
                                  <span className="flex items-center gap-1.5 bg-white border border-primary/10 rounded px-3 py-1 text-xs text-gray-700">
                                    <span className="text-primary">✓</span> 25+ Years Experience
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })()
                }
              </section>
              {/* Trust Badges */}
              <section className="flex flex-wrap justify-center gap-3 mt-4">
                {badges.map((badge, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-white border border-primary/10 rounded px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200"
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <span>{badge.text}</span>
                  </span>
                ))}
              </section>
            </React.Fragment>
          )}
          {/* Fallback if no proposal found and not loading */}
          {!loading && !proposal && !error && (
            <div className="bg-white rounded p-4 text-center text-gray-500 border border-gray-200">Proposal not found or missing data.</div>
          )}
          {/* Footer Disclaimer */}
          <footer className="w-full max-w-4xl mx-auto text-xs text-muted text-center pt-6">
            <div className="mb-1">This proposal is valid for 30 days from the date of creation.</div>
            <div>All prices include materials and labor. Additional fees may apply for permits and disposal.</div>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default ProposalView; 