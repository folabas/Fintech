'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function InternationalTransferPage() {
  const { processTransfer } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    amount: '',
    accountName: '',
    accountNumber: '',
    description: '',
    bankName: '',
    swiftCode: '',
    routingNumber: '',
    bankAddress: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!form.accountName.trim()) { setError('Please enter account name'); return; }
    if (!form.accountNumber.trim()) { setError('Please enter account number'); return; }
    if (!form.bankName.trim()) { setError('Please enter bank name'); return; }
    if (!form.swiftCode.trim()) { setError('Please enter SWIFT code'); return; }
    if (!form.bankAddress.trim()) { setError('Please enter bank address'); return; }

    setSubmitting(true);
    try {
      processTransfer(
        amount,
        form.accountNumber,
        form.bankName,
        form.description || 'International Transfer',
        {
          beneficiaryName: form.accountName,
          swiftCode: form.swiftCode,
          routingNumber: form.routingNumber,
          bankAddress: form.bankAddress,
          transferType: 'international',
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
        <h1 className="transfer-title">International Transfer</h1>
        <p className="transfer-subtitle">Send money to bank accounts outside the country</p>
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
            <label className="transfer-form-label">Account Name</label>
            <input
              type="text"
              name="accountName"
              className="transfer-form-input"
              placeholder="Enter account name"
              value={form.accountName}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              className="transfer-form-input"
              placeholder="Enter account number"
              value={form.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Description</label>
            <input
              type="text"
              name="description"
              className="transfer-form-input"
              placeholder="Optional description"
              value={form.description}
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
            <label className="transfer-form-label">SWIFT Code</label>
            <input
              type="text"
              name="swiftCode"
              className="transfer-form-input"
              placeholder="Enter SWIFT code"
              value={form.swiftCode}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Routing / IBAN Number</label>
            <input
              type="text"
              name="routingNumber"
              className="transfer-form-input"
              placeholder="Enter routing or IBAN number"
              value={form.routingNumber}
              onChange={handleChange}
            />
          </div>

          <div className="transfer-form-group">
            <label className="transfer-form-label">Bank Address</label>
            <input
              type="text"
              name="bankAddress"
              className="transfer-form-input"
              placeholder="Enter bank address"
              value={form.bankAddress}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="proceed-btn"
            disabled={submitting}
          >
            {submitting ? <><span className="spinner" /> Processing...</> : 'Proceed'}
          </button>
        </form>
      </div>
    </div>
  );
}
