import React from 'react';
import { Lock, LogOut, Sliders, Store, LayoutDashboard, Users } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-[#111114]/90 backdrop-blur-md border-b border-zinc-800/80 shadow-lg shadow-black/20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setViewMode('public');
          }}
          className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
        >
          <WuuthradBannerIcon className="w-8 h-8 shrink-0 group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]" />
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2.5">
            <h1 className="text-base sm:text-lg font-serif font-bold tracking-wider text-amber-200 leading-none">
              THE SKYFORGE
            </h1>
            <span className="text-[11px] text-zinc-500 hidden lg:inline">
              Whiterun Armory &amp; Smelting Ledger
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Live Sync + Presence Cluster */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800/90 text-[11px]">
            <span
              title={
                cloudErrorMsg ||
                'All user accounts, prices, stock & orders sync live across devices'
              }
              className="flex items-center gap-1.5 pr-2 border-r border-zinc-800"
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
              <span
                className={
                  cloudStatus === 'synced'
                    ? 'text-emerald-300 font-medium'
                    : cloudStatus === 'connecting'
                    ? 'text-amber-300 font-medium'
                    : 'text-zinc-400'
                }
              >
                {cloudStatus === 'synced'
                  ? 'Live'
                  : cloudStatus === 'connecting'
                  ? 'Syncing'
                  : 'Local'}
              </span>
            </span>

            <span
              title="Live active profiles & total people viewing The Skyforge right now"
              className="flex items-center gap-2 text-zinc-400 pl-0.5 tabular-nums"
            >
              <span>
                <strong className="text-amber-200">{presenceStats.activeProfilesCount}</strong>{' '}
                active
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-zinc-500" />
                <strong className="text-zinc-200">{presenceStats.viewersCount}</strong>
              </span>
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
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-500/50 text-xs font-semibold text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {viewMode === 'public' ? (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Forge Portal</span>
                  </>
                ) : (
                  <>
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                    <span>Price List</span>
                  </>
                )}
              </button>

              {effectiveAdminUnlocked && (
                <button
                  type="button"
                  onClick={onOpenAdminSidebar}
                  className="px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-red-500/40 text-xs font-semibold text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}

              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    profileOnlineStatus ? 'bg-emerald-400' : 'bg-zinc-500'
                  }`}
                />
                <span className="font-semibold text-zinc-200 max-w-[120px] truncate">
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
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'login' ? 'public' : 'login')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 flex items-center gap-2 transition-colors cursor-pointer"
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
