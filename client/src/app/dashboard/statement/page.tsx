'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function StatementPage() {
  const { stubData } = useAuth();
  const router = useRouter();
  const transactions = stubData?.transactions ?? [];

  return (
    <div className="statement-page">
      <div className="statement-header">
        <Link href="/dashboard" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="statement-title">Transaction Statement</h1>
        <p className="statement-subtitle">
          Showing {transactions.length} transactions &middot; Click a row for details
        </p>
      </div>

      <div className="statement-card">
        <div className="table-wrapper">
          <table className="stmt-table">
            <thead>
              <tr>
                <th>Ref No</th>
                <th>Amount</th>
                <th>Receiving Account</th>
                <th>Bank</th>
                <th>D/C</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, i) => (
                <tr
                  key={i}
                  className="stmt-row-clickable"
                  onClick={() => router.push(`/dashboard/statement/${txn.refNo}`)}
                >
                  <td className="cell-mono">{txn.refNo}</td>
                  <td className={`cell-amount ${txn.type === 'credit' ? 'positive' : 'negative'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </td>
                  <td className="cell-mono">{txn.receivingAccount}</td>
                  <td>{txn.bank}</td>
                  <td>
                    <span className={`dc-badge ${txn.type}`}>
                      {txn.type === 'credit' ? 'C' : 'D'}
                    </span>
                  </td>
                  <td>{txn.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
