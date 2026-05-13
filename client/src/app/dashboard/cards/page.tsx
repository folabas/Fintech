'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function formatCardNumber(n: string) {
  const digits = n.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

const cardGradients: Record<string, string> = {
  visa: 'linear-gradient(135deg, #1a1f71 0%, #1a3a8a 50%, #2c5f9e 100%)',
  verve: 'linear-gradient(135deg, #cc0000 0%, #e62e00 50%, #ff6600 100%)',
  mastercard: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
};

export default function CardsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="cards-page">
      <div className="cards-header">
        <Link href="/dashboard" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="cards-title">My Bank Cards</h1>
        <p className="cards-subtitle">Your virtual and physical cards</p>
      </div>

      <div
        className="atm-card cards-main-card"
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

      <div className="cards-details-card">
        <div className="profile-card-title">Card Details</div>
        <div className="account-info-list">
          <div className="account-info-row">
            <span className="account-info-label">Card Network</span>
            <span className="account-info-value">{user.cardType.toUpperCase()}</span>
          </div>
          <div className="account-info-row">
            <span className="account-info-label">Card Number</span>
            <span className="account-info-value">{formatCardNumber(user.cardNumber)}</span>
          </div>
          <div className="account-info-row">
            <span className="account-info-label">Expiry Date</span>
            <span className="account-info-value">{user.cardExpiry}</span>
          </div>
          <div className="account-info-row">
            <span className="account-info-label">Card Holder</span>
            <span className="account-info-value">{user.fullName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
