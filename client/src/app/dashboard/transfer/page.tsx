'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TransferPage() {
  const router = useRouter();

  return (
    <div className="transfer-page">
      <div className="transfer-header">
        <Link href="/dashboard" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="transfer-title">Choose Transfer Type</h1>
        <p className="transfer-subtitle">Select the type of transfer you want to make</p>
      </div>

      <div className="transfer-type-grid">
        <button className="transfer-type-card" onClick={() => router.push('/dashboard/transfer/local')}>
          <div className="transfer-type-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M12 10v4M10 12h4" />
            </svg>
          </div>
          <h2 className="transfer-type-name">Local Transfer</h2>
          <p className="transfer-type-desc">Send money to local bank accounts within the country</p>
          <span className="transfer-type-action">Continue &rarr;</span>
        </button>

        <button className="transfer-type-card" onClick={() => router.push('/dashboard/transfer/international')}>
          <div className="transfer-type-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
          </div>
          <h2 className="transfer-type-name">International Transfer</h2>
          <p className="transfer-type-desc">Send money to bank accounts outside the country</p>
          <span className="transfer-type-action">Continue &rarr;</span>
        </button>
      </div>
    </div>
  );
}
