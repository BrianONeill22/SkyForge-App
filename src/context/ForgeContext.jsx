import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import { useForgeLedger } from '../hooks/useForgeLedger';
import { useAuth } from '../hooks/useAuth';
import { useCloudSync } from '../hooks/useCloudSync';

const ToastContext = createContext(null);
const LedgerContext = createContext(null);
const AuthContext = createContext(null);
const CloudContext = createContext(null);

export function ForgeProvider({ children }) {
  const toast = useToast();
  const ledger = useForgeLedger({ showToast: toast.showToast });
  const auth = useAuth({
    managedUsers: ledger.managedUsers,
    setManagedUserOnline: ledger.setManagedUserOnline,
    showToast: toast.showToast
  });
  const cloud = useCloudSync({
    ledgerSnapshot: ledger.ledgerSnapshot,
    applyRemoteSnapshot: ledger.applyLedgerData,
    workerProfile: auth.workerProfile,
    profileOnlineStatus: auth.profileOnlineStatus
  });

  return (
    <ToastContext.Provider value={toast}>
      <LedgerContext.Provider value={ledger}>
        <AuthContext.Provider value={auth}>
          <CloudContext.Provider value={cloud}>{children}</CloudContext.Provider>
        </AuthContext.Provider>
      </LedgerContext.Provider>
    </ToastContext.Provider>
  );
}

export function useForgeToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useForgeToast must be used within ForgeProvider');
  return ctx;
}

export function useForgeLedgerContext() {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error('useForgeLedgerContext must be used within ForgeProvider');
  return ctx;
}

export function useForgeAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useForgeAuth must be used within ForgeProvider');
  return ctx;
}

export function useForgeCloud() {
  const ctx = useContext(CloudContext);
  if (!ctx) throw new Error('useForgeCloud must be used within ForgeProvider');
  return ctx;
}
