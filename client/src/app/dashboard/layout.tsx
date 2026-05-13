'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 32, height: 32, borderColor: 'var(--navy-900)', borderTopColor: 'transparent', border: '3px solid var(--navy-900)' }} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopNav />
      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <div className="accent-stripe" style={{ background: 'var(--navy-900)', height: 5 }} />
      <footer className="footer-bar">
        © 2025 ApexVault Finance Bank. All rights reserved. |{' '}
        <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a>
      </footer>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
