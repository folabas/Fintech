'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadOrInitData, addAndSaveTransactions, processTransfer as processTransferFn, StubData, TransferDetails } from '@/lib/stubData';

export interface UserProfile {
  id: string;
  accountId: string;
  fullName: string;
  email: string;
  accountBalance: number;
  ledgerBalance: number;
  transferMode: 'WIRE' | 'ACH' | 'SWIFT';
  since: string;
  cardType: 'verve' | 'visa' | 'mastercard';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  staticBalance?: boolean;
  dateOfBirth: string;
  address: string;
  maritalStatus: string;
  gender: string;
  occupation: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  stubData: StubData | null;
  profilePic: string | null;
  setProfilePic: (url: string | null) => void;
  updateProfile: (fields: Partial<UserProfile>) => Promise<void>;
  processTransfer: (amount: number, receivingAccount: string, bank: string, description: string, transferDetails: TransferDetails) => StubData;
  login: (accountId: string, passcode: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const PROFILE_PIC_KEY = 'av_profile_pic';

function initAndAddTransactions(u: UserProfile): StubData {
  const isStatic = !!u.staticBalance;
  const data = loadOrInitData(u.id, u.accountBalance, isStatic);
  return addAndSaveTransactions(u.id, data, u.accountBalance, isStatic);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stubData, setStubData] = useState<StubData | null>(null);
  const [profilePic, setProfilePicState] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(PROFILE_PIC_KEY) : null
  );

  const updateProfile = useCallback(async (fields: Partial<UserProfile>) => {
    const tok = localStorage.getItem('av_token');
    if (!tok) return;
    const res = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body: JSON.stringify(fields),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
    }
  }, []);

  const setProfilePic = useCallback((url: string | null) => {
    if (url) {
      localStorage.setItem(PROFILE_PIC_KEY, url);
    } else {
      localStorage.removeItem(PROFILE_PIC_KEY);
    }
    setProfilePicState(url);
  }, []);

  const refreshStubData = useCallback((u: UserProfile) => {
    const data = initAndAddTransactions(u);
    setStubData(data);
  }, []);

  const fetchMe = useCallback(async (jwt: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setToken(jwt);
        refreshStubData(data);
      } else {
        localStorage.removeItem('av_token');
      }
    } catch {
      localStorage.removeItem('av_token');
    }
  }, [refreshStubData]);

  useEffect(() => {
    const saved = localStorage.getItem('av_token');
    if (saved) {
      fetchMe(saved).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = async (accountId: string, passcode: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, passcode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('av_token', data.token);
    setToken(data.token);
    setUser(data.user);
    refreshStubData(data.user);
  };

  const processTransferFnWrapper = useCallback((amount: number, receivingAccount: string, bank: string, description: string, transferDetails: TransferDetails) => {
    if (!user) throw new Error('Not authenticated');
    const updated = processTransferFn(user.id, amount, receivingAccount, bank, description, transferDetails);
    setStubData(updated);
    return updated;
  }, [user]);

  const logout = () => {
    localStorage.removeItem('av_token');
    setUser(null);
    setToken(null);
    setStubData(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, stubData, profilePic, setProfilePic, updateProfile, processTransfer: processTransferFnWrapper, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
