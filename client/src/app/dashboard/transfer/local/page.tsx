'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LocalTransferPage() {
  const { processTransfer, user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    amount: '',
    beneficiaryName: '',
    beneficiaryAccount: '',
    bankName: '',
    narration: '',
    accountType: 'Savings',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const accountTypes = ['Savings', 'Current', 'Checking', 'Domiciliary', 'Fixed Deposit'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) { setError('Please enter a valid amount'); return; }
    if (!form.beneficiaryName.trim()) { setError('Please enter beneficiary name'); return; }
    if (!form.beneficiaryAccount.trim()) { setError('Please enter beneficiary account number'); return; }
    if (!form.bankName.trim()) { setError('Please enter bank name'); return; }

    setSubmitting(true);
    try {
      processTransfer(
        amount,
        form.beneficiaryAccount,
        form.bankName,
        form.narration || 'Local Transfer',
        {
          beneficiaryName: form.beneficiaryName,
          accountType: form.accountType,
          transferType: 'local',
        }
      );
      setSuccess('Transfer completed successfully! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="transfer-page">
      <div className="transfer-header">
        <Link href="/dashboard/transfer" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="transfer-title">Local Transfer</h1>
        <p className="transfer-subtitle">Send money to local bank accounts</p>
      </div>

      <div className="transfer-form-card">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="transfer-form-group">
            <label className="transfer-form-label">Amount</label>
            <input
              type="number"
              name="amount"
              className="transfer-form-input"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Beneficiary Account Name</label>
            <input
              type="text"
              name="beneficiaryName"
              className="transfer-form-input"
              placeholder="Enter beneficiary name"
              value={form.beneficiaryName}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Beneficiary Account Number</label>
            <input
              type="text"
              name="beneficiaryAccount"
              className="transfer-form-input"
              placeholder="Enter account number"
              value={form.beneficiaryAccount}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Bank Name</label>
            <input
              type="text"
              name="bankName"
              className="transfer-form-input"
              placeholder="Enter bank name"
              value={form.bankName}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Narration</label>
            <input
              type="text"
              name="narration"
              className="transfer-form-input"
              placeholder="Optional description"
              value={form.narration}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Account Type</label>
            <select
              name="accountType"
              className="transfer-form-input"
              value={form.accountType}
              onChange={handleChange}
            >
              {accountTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="proceed-btn"
            disabled={submitting}
          >
            {submitting ? <><span className="spinner" /> Processing...</> : 'Make Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}
