import React from 'react';
import { Lock, LogOut, Sliders, Users } from 'lucide-react';
import { ROLE_PRESETS } from '../../data/roles';
import { useForgeAuth, useForgeCloud } from '../../context/ForgeContext';
import WuuthradBannerIcon from '../common/WuuthradBannerIcon';

export default function Header({ onOpenAdminSidebar, onSignOut }) {
  const {
    workerProfile,
    viewMode,
    setViewMode,
    profileOnlineStatus,
    activeUserRecord,
    effectiveRole,
    effectiveAdminUnlocked
  } = useForgeAuth();
  const { cloudStatus, cloudErrorMsg, presenceStats } = useForgeCloud();

  return (
    <header className="sticky top-0 z-30 bg-[#121215]/95 backdrop-blur border-b border-zinc-800/90">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setViewMode('public');
          }}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <WuuthradBannerIcon className="w-8 h-8 shrink-0 group-hover:scale-105 transition-transform" />
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-base sm:text-lg font-serif font-bold tracking-wide text-amber-200">
              THE SKYFORGE
            </h1>
            <span className="text-[11px] text-zinc-500 hidden md:inline">
              Whiterun Armory &amp; Smelting Ledger
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Multi-Device Sync Pill */}
          <div
            title={
              cloudErrorMsg || 'All user accounts, prices, stock & orders sync live across devices'
            }
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
              cloudStatus === 'synced'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : cloudStatus === 'connecting'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                cloudStatus === 'synced'
                  ? 'bg-emerald-400 animate-pulse'
                  : cloudStatus === 'connecting'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-zinc-500'
              }`}
            />
            <span>
              {cloudStatus === 'synced'
                ? 'Live Sync'
                : cloudStatus === 'connecting'
                ? 'Syncing...'
                : 'Local Session'}
            </span>
          </div>

          {/* Active Profiles & Viewers Counter */}
          <div
            title="Live active profiles & total people viewing The Skyforge right now"
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300"
          >
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <strong className="text-amber-200">{presenceStats.activeProfilesCount}</strong>{' '}
              <span className="text-zinc-400">
                {presenceStats.activeProfilesCount === 1 ? 'Profile' : 'Profiles'}
              </span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-zinc-400" />
              <strong className="text-zinc-100">{presenceStats.viewersCount}</strong>{' '}
              <span className="text-zinc-400">Viewing</span>
            </span>
          </div>

          {workerProfile ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setViewMode((prev) => (prev === 'public' ? 'worker' : 'public'));
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-xs font-semibold text-amber-200 cursor-pointer"
              >
                {viewMode === 'public' ? 'Back to Forge Portal' : 'Public Price List'}
              </button>

              {effectiveAdminUnlocked && (
                <button
                  type="button"
                  onClick={onOpenAdminSidebar}
                  className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900/80 border border-red-500/50 text-xs font-semibold text-amber-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Menu</span>
                </button>
              )}

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    profileOnlineStatus ? 'bg-emerald-400' : 'bg-zinc-500'
                  }`}
                />
                <span className="font-semibold text-zinc-200">
                  {activeUserRecord?.displayName || workerProfile.name}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    effectiveRole === 'admin' || effectiveAdminUnlocked
                      ? 'bg-amber-500/20 text-amber-300'
                      : effectiveRole === 'harbinger'
                      ? 'bg-red-500/20 text-red-300'
                      : effectiveRole === 'smith'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {effectiveAdminUnlocked && effectiveRole !== 'admin'
                    ? `${ROLE_PRESETS[effectiveRole]?.label || effectiveRole} • Admin`
                    : ROLE_PRESETS[effectiveRole]?.label || effectiveRole}
                </span>
              </div>

              <button
                type="button"
                onClick={onSignOut}
                title="Sign Out"
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'login' ? 'public' : 'login')}
              className="px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{viewMode === 'login' ? 'Back to Price List' : 'Smith Access'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
