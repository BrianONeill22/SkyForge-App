import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SmithRosterPanel from './SmithRosterPanel';
import UserAccountsManager from './UserAccountsManager';

export default function ProfilesTab({ onOpenUsersModal, onOpenAdminSidebar }) {
  const { managedUsers } = useForgeLedgerContext();
  const {
    workerProfile,
    activeUserRecord,
    profileOnlineStatus,
    effectiveAdminUnlocked,
    toggleMyOnlineStatus,
    unlockAdmin
  } = useForgeAuth();

  const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    const res = unlockAdmin(adminPasscodeInput);
    if (res.ok) {
      setAdminPasscodeInput('');
      setAdminError('');
    } else {
      setAdminError(res.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full shrink-0 ${
              profileOnlineStatus
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                : 'bg-zinc-600'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-bold text-zinc-100">
                {activeUserRecord?.displayName || workerProfile.name}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  profileOnlineStatus
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {profileOnlineStatus ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Control whether your profile appears as active/online to others in the Skyforge.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMyOnlineStatus}
          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
            profileOnlineStatus
              ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/50 text-emerald-200'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
          }`}
        >
          {profileOnlineStatus ? 'Switch to Offline' : 'Switch to Online'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-serif font-bold text-amber-200">
                Master Admin Controls
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Unlock to manage User Accounts, Backups, CSV Spreadsheets, and Clean Resets.
              </p>
            </div>
            {effectiveAdminUnlocked ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 flex items-center gap-1 shrink-0">
                <Unlock className="w-3 h-3" />
                <span>Unlocked</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-1 shrink-0">
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </span>
            )}
          </div>

          {!effectiveAdminUnlocked ? (
            <form onSubmit={handleUnlockSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminPasscodeInput}
                  onChange={(e) => setAdminPasscodeInput(e.target.value)}
                  placeholder="Enter Master Admin Passcode..."
                  className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer shrink-0"
                >
                  Unlock
                </button>
              </div>
              {adminError && <p className="text-xs text-red-400">{adminError}</p>}
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-500/25 space-y-3">
              <p className="text-xs text-zinc-300">
                Master Admin privileges are active. Manage user accounts below or open the Admin
                Sidebar for backups and resets.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onOpenUsersModal}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                >
                  Manage Users ({managedUsers.length})
                </button>
                <button
                  type="button"
                  onClick={onOpenAdminSidebar}
                  className="px-4 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-xs font-bold text-amber-200 cursor-pointer"
                >
                  Open Admin Sidebar
                </button>
              </div>
            </div>
          )}
        </div>

        <SmithRosterPanel />
      </div>

      {effectiveAdminUnlocked && (
        <div className="bg-[#18181b] border border-amber-500/30 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-200">
              User Accounts &amp; Role Permissions
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Create login accounts and customize each member&apos;s role and permissions anytime.
            </p>
          </div>

          <UserAccountsManager showSearch />
        </div>
      )}
    </div>
  );
}
