'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function ProfilePage() {
  const { user, stubData, profilePic, setProfilePic, updateProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    phoneNumber: '',
    address: '',
  });

  if (!user) return null;

  const initials = user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePic(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setProfilePic(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const startEditing = () => {
    if (!user) return;
    setForm({
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      maritalStatus: user.maritalStatus,
      occupation: user.occupation,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
    setEditing(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updateProfile(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <Link href="/dashboard" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="profile-header">
        <div className="profile-avatar-wrap">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar">{initials}</div>
          )}
          <button className="profile-pic-btn" onClick={() => fileRef.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
          {profilePic && (
            <button className="profile-pic-remove" onClick={handleRemove}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <div>
          <h1 className="profile-name">{user.fullName}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2 className="profile-card-title">Account Details</h2>
          <div className="profile-details">
            {[
              { label: 'Account ID', value: user.accountId },
              { label: 'Account Balance', value: formatCurrency(stubData?.accountBalance ?? user.accountBalance) },
              { label: 'Ledger Balance', value: formatCurrency(stubData?.ledgerBalance ?? user.ledgerBalance) },
              { label: 'Transfer Mode', value: user.transferMode },
              { label: 'Member Since', value: user.since },
            ].map(({ label, value }) => (
              <div key={label} className="profile-detail-row">
                <span className="profile-detail-label">{label}</span>
                <span className="profile-detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">Personal Information</h2>
            {!editing && (
              <button className="profile-edit-btn" onClick={startEditing}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            )}
          </div>
          <div className="profile-details">
            {[
              { label: 'Date of Birth', key: 'dateOfBirth', type: 'text' },
              { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
              { label: 'Marital Status', key: 'maritalStatus', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
              { label: 'Occupation', key: 'occupation', type: 'text' },
              { label: 'Phone Number', key: 'phoneNumber', type: 'text' },
              { label: 'Address', key: 'address', type: 'text' },
            ].map(({ label, key, type, options }) => (
              <div key={key} className="profile-detail-row">
                <span className="profile-detail-label">{label}</span>
                {editing ? (
                  type === 'select' ? (
                    <select
                      className="profile-input"
                      value={form[key as keyof typeof form]}
                      onChange={e => handleChange(key, e.target.value)}
                    >
                      {options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      className="profile-input"
                      type="text"
                      value={form[key as keyof typeof form]}
                      onChange={e => handleChange(key, e.target.value)}
                    />
                  )
                ) : (
                  <span className="profile-detail-value">{user[key as keyof typeof user]}</span>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="profile-form-actions">
              <button className="profile-btn profile-btn-primary" onClick={handleSave}>Update</button>
              <button className="profile-btn profile-btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </div>

        <div className="profile-card">
          <h2 className="profile-card-title">Card Information</h2>
          <div className="profile-details">
            {[
              { label: 'Card Type', value: user.cardType.toUpperCase() },
              { label: 'Card Number', value: user.cardNumber },
              { label: 'Expiry Date', value: user.cardExpiry },
            ].map(({ label, value }) => (
              <div key={label} className="profile-detail-row">
                <span className="profile-detail-label">{label}</span>
                <span className="profile-detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
