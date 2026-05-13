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

function formatCardNumber(n: string) {
  const digits = n.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

const cardGradients: Record<string, string> = {
  visa: 'linear-gradient(135deg, #1a1f71 0%, #1a3a8a 50%, #2c5f9e 100%)',
  verve: 'linear-gradient(135deg, #cc0000 0%, #e62e00 50%, #ff6600 100%)',
  mastercard: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
};

export default function DashboardPage() {
  const { user, stubData } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const balance = stubData?.accountBalance ?? user.accountBalance;
  const ledger = stubData?.ledgerBalance ?? user.ledgerBalance;
  const recentTxns = stubData?.transactions?.slice(0, 6) ?? [];

  return (
    <div className="dashboard-layout">
      {/* Account Balance Card */}
      <Link href="/dashboard/statement" className="balance-link">
        <div className="balance-card animate-fade-in-up stagger-1">
          <div className="balance-card-header">
            <div>
              <div className="balance-label">Account Balance</div>
              <div className="balance-amount">{formatCurrency(balance)}</div>
              <div className="balance-meta">
                <span className="positive">View Transaction Statement &rarr;</span>
              </div>
            </div>
            <div className="balance-card-indicator">
              <div className="indicator-dot active" />
              <div className="indicator-dot" />
              <div className="indicator-dot" />
            </div>
          </div>
        </div>
      </Link>

      {/* Ledger Balance Card */}
      <Link href="/dashboard/statement" className="balance-link">
        <div className="balance-card ledger animate-fade-in-up stagger-2">
          <div>
            <div className="balance-label">Ledger Balance</div>
            <div className="balance-amount">{formatCurrency(ledger)}</div>
            <div className="balance-meta">
              <span className="positive">View Transaction Statement &rarr;</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Transfer Mode Card */}
      <div className="balance-card transfer animate-fade-in-up stagger-3">
        <div className="transfer-mode-header">
          <div>
            <div className="transfer-mode-label">Transfer Mode</div>
            <div className="transfer-mode-value">{user.transferMode}</div>
            <div className="balance-meta">
              <span className="positive">Default transfer method</span>
            </div>
          </div>
          <button className="transfer-mode-toggle" aria-label="Toggle transfer mode">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ATM Card */}
      <div
        className="atm-card animate-fade-in-up stagger-4"
        style={{ background: cardGradients[user.cardType] || cardGradients.visa }}
      >
        <div className="atm-card-top">
          <span className="atm-card-bank">APEXVAULT</span>
          <span className="atm-card-network">{user.cardType.toUpperCase()}</span>
        </div>
        <div className="chip-icon" />
        <div className="atm-card-number">{formatCardNumber(user.cardNumber)}</div>
        <div className="atm-card-bottom">
          <div className="atm-card-field">
            <span className="atm-card-field-label">CARD HOLDER</span>
            <span className="atm-card-field-value">{user.fullName.toUpperCase()}</span>
          </div>
          <div className="atm-card-field">
            <span className="atm-card-field-label">VALID THRU</span>
            <span className="atm-card-field-value">{user.cardExpiry}</span>
          </div>
          <div className="atm-card-field">
            <span className="atm-card-field-label">CVC</span>
            <span className="atm-card-field-value">{user.cardCvc}</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="stats-card animate-fade-in-up stagger-5">
        <div className="stats-card-header">
          <div>
            <div className="stats-card-title">Recent Transactions</div>
            <div className="stats-date-range">Latest activity on your account</div>
          </div>
          <Link href="/dashboard/statement" className="view-all-link">View All &rarr;</Link>
        </div>
        <div className="txn-list">
          {recentTxns.map((txn, i) => (
            <div
              key={i}
              className="txn-row txn-row-clickable"
              onClick={() => router.push(`/dashboard/statement/${txn.refNo}`)}
            >
              <div className="txn-left">
                <span className="txn-desc">{txn.description}</span>
                <span className="txn-date">{txn.bank} &middot; {txn.receivingAccount}</span>
              </div>
              <div className="txn-right">
                <span className={`txn-amount ${txn.type === 'credit' ? 'positive' : 'negative'}`}>
                  {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                </span>
                <span className="txn-status">{txn.type === 'credit' ? 'Credit' : 'Debit'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Info */}
      <div className="stats-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="stats-card-title">Account Information</div>
        <div className="account-info-list">
          {[
            { label: 'Account Holder', value: user.fullName },
            { label: 'Account ID', value: user.accountId },
            { label: 'Email Address', value: user.email },
            { label: 'Member Since', value: user.since },
          ].map(({ label, value }) => (
            <div key={label} className="account-info-row">
              <span className="account-info-label">{label}</span>
              <span className="account-info-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
