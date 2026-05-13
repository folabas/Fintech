import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}

export default function Logo({ size = 'md', dark = false }: LogoProps) {
  const sizes = {
    sm: { icon: 32, brandName: 15, tagline: 9 },
    md: { icon: 42, brandName: 18, tagline: 10 },
    lg: { icon: 56, brandName: 24, tagline: 12 },
  };
  const s = sizes[size];

  return (
    <div className="logo-lockup" style={{ textDecoration: 'none' }}>
      {/* Vault Icon */}
      <div
        className="logo-icon"
        style={{
          width: s.icon,
          height: s.icon,
          background: dark ? '#fff' : 'var(--navy-900)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width={s.icon * 0.55}
          height={s.icon * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield/Vault icon */}
          <path
            d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
            fill={dark ? 'var(--navy-900)' : 'rgba(255,255,255,0.9)'}
          />
          <circle cx="12" cy="12" r="3" fill={dark ? 'var(--crimson-500)' : 'var(--crimson-400)'} />
          <path
            d="M12 9V15M9 12H15"
            stroke={dark ? 'var(--crimson-500)' : 'var(--navy-900)'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="logo-text">
        <span
          className="brand-name"
          style={{ fontSize: s.brandName, color: dark ? 'var(--white)' : 'var(--navy-900)' }}
        >
          APEX<span style={{ color: 'var(--crimson-500)' }}>VAULT</span>
        </span>
        <span
          className="brand-tagline"
          style={{ fontSize: s.tagline, color: dark ? 'rgba(255,255,255,0.6)' : 'var(--gray-500)' }}
        >
          FINANCE BANK
        </span>
      </div>
    </div>
  );
}
