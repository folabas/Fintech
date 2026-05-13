'use client';

import Link from 'next/link';
import { use } from 'react';
import { useAuth } from '@/context/AuthContext';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function TransactionDetailPage({ params }: { params: Promise<{ refNo: string }> }) {
  const { refNo } = use(params);
  const { stubData } = useAuth();
  const transaction = stubData?.transactions.find(t => t.refNo === refNo);

  if (!transaction) {
    return (
      <div className="statement-page">
        <Link href="/dashboard/statement" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Statement
        </Link>
        <h1 className="statement-title" style={{ marginTop: 16 }}>Transaction not found</h1>
      </div>
    );
  }

  const details = [
    { label: 'Reference Number', value: transaction.refNo },
    { label: 'Amount', value: `${transaction.type === 'credit' ? '+' : '-'}${formatCurrency(transaction.amount)}` },
    { label: 'Receiving Account', value: transaction.receivingAccount },
    { label: 'Bank', value: transaction.bank },
    { label: 'Type', value: transaction.type === 'credit' ? 'Credit' : 'Debit' },
    { label: 'Description', value: transaction.description },
  ];

  return (
    <div className="statement-page">
      <Link href="/dashboard/statement" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Statement
      </Link>

      <div className="txn-detail-card">
        <div className={`txn-detail-type ${transaction.type}`}>
          {transaction.type === 'credit' ? 'Credit' : 'Debit'}
        </div>
        <div className={`txn-detail-amount ${transaction.type}`}>
          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>

        <div className="txn-detail-divider" />

        <div className="txn-detail-grid">
          {details.map(({ label, value }) => (
            <div key={label} className="txn-detail-row">
              <span className="txn-detail-label">{label}</span>
              <span className="txn-detail-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
