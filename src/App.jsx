import React, { useState } from 'react';
import { ForgeProvider, useForgeAuth } from './context/ForgeContext';
import { useDocumentBranding } from './hooks/useDocumentBranding';
import ForgeErrorBoundary from './components/common/ForgeErrorBoundary';
import Toast from './components/common/Toast';
import Header from './components/layout/Header';
import PublicPriceList from './components/public/PublicPriceList';
import LoginView from './components/auth/LoginView';
import WorkerPortal from './components/portal/WorkerPortal';
import AdminSidebarDrawer from './components/admin/AdminSidebarDrawer';
import ManageUsersModal from './components/admin/ManageUsersModal';
import ExportCsvModal from './components/admin/ExportCsvModal';
import ResetConfirmModal from './components/admin/ResetConfirmModal';

function SkyforgeShell() {
  useDocumentBranding();

  const { viewMode, workerProfile, effectiveAdminUnlocked, signOut } = useForgeAuth();

  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSignOut = () => {
    setShowAdminSidebar(false);
    setShowUsersModal(false);
    setShowExportModal(false);
    setShowResetModal(false);
    signOut();
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Toast />

      <Header
        onOpenAdminSidebar={() => setShowAdminSidebar(true)}
        onSignOut={handleSignOut}
      />

      {viewMode === 'public' && <PublicPriceList />}
      {viewMode === 'login' && <LoginView />}
      {viewMode === 'worker' && workerProfile && (
        <WorkerPortal
          onOpenUsersModal={() => setShowUsersModal(true)}
          onOpenAdminSidebar={() => setShowAdminSidebar(true)}
        />
      )}

      {showAdminSidebar && effectiveAdminUnlocked && (
        <AdminSidebarDrawer
          onClose={() => setShowAdminSidebar(false)}
          onOpenUsersModal={() => setShowUsersModal(true)}
          onOpenExportModal={() => setShowExportModal(true)}
          onOpenResetModal={() => setShowResetModal(true)}
        />
      )}

      {showUsersModal && effectiveAdminUnlocked && (
        <ManageUsersModal onClose={() => setShowUsersModal(false)} />
      )}

      {showExportModal && effectiveAdminUnlocked && (
        <ExportCsvModal onClose={() => setShowExportModal(false)} />
      )}

      {showResetModal && effectiveAdminUnlocked && (
        <ResetConfirmModal
          onClose={() => setShowResetModal(false)}
          onAfterReset={() => setShowAdminSidebar(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ForgeErrorBoundary>
      <ForgeProvider>
        <SkyforgeShell />
      </ForgeProvider>
    </ForgeErrorBoundary>
  );
}
