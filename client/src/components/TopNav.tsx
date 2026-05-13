'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';

export default function TopNav() {
  const { user, profilePic, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user?.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'AV';

  return (
    <>
      <div className="header-bar" />
      <nav className="top-nav">
        <div className="top-nav-inner">
          <Link href={user ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>
            <Logo size="md" />
          </Link>

          {user ? (
            <div className="nav-actions">
              <Link href="/dashboard/profile" className="user-avatar-chip">
                <div className="avatar-circle">
                  {profilePic ? (
                    <img src={profilePic} alt="" className="avatar-img" />
                  ) : (
                    initials
                  )}
                </div>
                <span className="user-name-chip">{user.fullName.split(' ')[0]}</span>
              </Link>

              <button className="nav-icon-btn" onClick={handleLogout} title="Sign Out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="nav-actions">
              <Link href="/login">
                <button className="nav-action-btn primary">Sign In</button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
