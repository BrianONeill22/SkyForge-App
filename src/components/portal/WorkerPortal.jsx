import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Coins,
  Flame,
  Hammer,
  Lock,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../context/ForgeContext';
import DashboardTab from './dashboard/DashboardTab';
import OrdersTab from './orders/OrdersTab';
import StockTab from './stock/StockTab';
import PricingTab from './pricing/PricingTab';
import ProfilesTab from './profiles/ProfilesTab';
import SmeltRecipesModal from './stock/SmeltRecipesModal';
import SmeltBatchModal from './stock/SmeltBatchModal';
import RecordSaleModal from './dashboard/RecordSaleModal';
import RecordPurchaseModal from './dashboard/RecordPurchaseModal';

const WORKER_TABS = [
  { id: 'dashboard', label: 'Sales & Profits', shortLabel: 'Sales', icon: TrendingUp },
  { id: 'orders', label: 'Orders & Deliveries', shortLabel: 'Orders', icon: Truck },
  { id: 'stock', label: 'Vault & Stock', shortLabel: 'Vault', icon: Package },
  { id: 'pricing', label: 'Recipes & Margin', shortLabel: 'Pricing', icon: Hammer },
  { id: 'profiles', label: 'Profiles & Access', shortLabel: 'Profiles', icon: Users }
];

const VALID_TAB_IDS = new Set(WORKER_TABS.map((t) => t.id));
const TAB_STORAGE_KEY = 'skyforge_active_portal_tab';

function getInitialPortalTab() {
  try {
    const hashTab = window.location.hash.replace(/^#\/?/, '').trim();
    if (VALID_TAB_IDS.has(hashTab)) return hashTab;
    const saved = window.sessionStorage.getItem(TAB_STORAGE_KEY);
    if (saved && VALID_TAB_IDS.has(saved)) return saved;
  } catch {
    // ignore storage/hash read errors
  }
  return 'dashboard';
}

export default function WorkerPortal({ onOpenUsersModal, onOpenAdminSidebar }) {
  const {
    workerProfile,
    canLogSalesPurchases,
    canManageOrders,
    canEditStock,
    canEditRecipes
  } = useForgeAuth();
  const { orders, supplyRecords, resolvedMaterials, smeltableVaultIngots } = useForgeLedgerContext();

  const [activeTab, setActiveTabState] = useState(getInitialPortalTab);
  const [showSmeltRecipesModal, setShowSmeltRecipesModal] = useState(false);
  const [showRecordSaleModal, setShowRecordSaleModal] = useState(false);
  const [showRecordPurchaseModal, setShowRecordPurchaseModal] = useState(false);
  const [smeltModalIngotId, setSmeltModalIngotId] = useState(null);

  const setActiveTab = useCallback((tabId) => {
    if (!VALID_TAB_IDS.has(tabId)) return;
    setActiveTabState(tabId);
    try {
      window.sessionStorage.setItem(TAB_STORAGE_KEY, tabId);
      if (window.location.hash !== `#${tabId}`) {
        window.history.replaceState(null, '', `#${tabId}`);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hashTab = window.location.hash.replace(/^#\/?/, '').trim();
      if (VALID_TAB_IDS.has(hashTab)) {
        setActiveTabState(hashTab);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const tabBadges = useMemo(() => {
    const pendingOrdersCount =
      orders.filter((o) => o.status === 'pending').length +
      supplyRecords.filter((s) => s.status === 'pending').length;
    const lowStockCount = resolvedMaterials.filter(
      (m) => (Number(m.stock) || 0) <= (m.lowThreshold ?? 5)
    ).length;
    return {
      orders: pendingOrdersCount,
      stock: lowStockCount
    };
  }, [orders, supplyRecords, resolvedMaterials]);

  const handleOpenSmeltBatch = useCallback(
    (ingotId) => {
      setSmeltModalIngotId(ingotId || smeltableVaultIngots[0]?.id || 'mat_iron_ingot');
    },
    [smeltableVaultIngots]
  );

  if (!workerProfile) return null;

  const isViewOnly = !canLogSalesPurchases && !canManageOrders && !canEditStock && !canEditRecipes;
  const hasQuickActions = canLogSalesPurchases || canEditStock;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-24 lg:pb-8">
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Desktop Left Navigation Rail */}
        <aside className="hidden lg:flex flex-col gap-4 w-56 shrink-0 sticky top-[72px]">
          <nav
            aria-label="Portal sections"
            className="bg-[#141418] border border-zinc-800/90 rounded-xl p-2 space-y-1 shadow-lg shadow-black/20"
          >
            <div className="px-2.5 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Forge Workspace
            </div>
            {WORKER_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              const badge = tabBadges[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20'
                      : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/90'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </span>
                  {badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums shrink-0 ${
                        active
                          ? 'bg-zinc-950/20 text-zinc-950'
                          : tab.id === 'orders'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Persistent Quick Actions */}
          {hasQuickActions && (
            <div className="bg-[#141418] border border-zinc-800/90 rounded-xl p-2.5 space-y-2 shadow-lg shadow-black/20">
              <div className="px-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Quick Actions
              </div>
              {canLogSalesPurchases && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRecordSaleModal(true)}
                    className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm shadow-amber-500/20"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Quick Sale</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRecordPurchaseModal(true)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Log Purchase</span>
                  </button>
                </>
              )}
              {canEditStock && (
                <button
                  type="button"
                  onClick={() => handleOpenSmeltBatch()}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-amber-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Smelt Ingots</span>
                </button>
              )}
            </div>
          )}

          {isViewOnly && (
            <div className="px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-semibold flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>View-Only Mode</span>
            </div>
          )}
        </aside>

        {/* Main Workspace Content */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Mobile / Tablet Quick Action Strip */}
          {(hasQuickActions || isViewOnly) && (
            <div className="flex lg:hidden flex-wrap items-center justify-between gap-2 bg-[#141418] border border-zinc-800/90 rounded-xl p-2.5">
              {hasQuickActions ? (
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {canLogSalesPurchases && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowRecordSaleModal(true)}
                        className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Quick Sale</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRecordPurchaseModal(true)}
                        className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Purchase</span>
                      </button>
                    </>
                  )}
                  {canEditStock && (
                    <button
                      type="button"
                      onClick={() => handleOpenSmeltBatch()}
                      className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Smelt</span>
                    </button>
                  )}
                </div>
              ) : null}

              {isViewOnly && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> View-Only Mode
                </span>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardTab
              onOpenQuickSale={() => setShowRecordSaleModal(true)}
              onOpenLogPurchase={() => setShowRecordPurchaseModal(true)}
              onNavigateTab={setActiveTab}
            />
          )}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'stock' && (
            <StockTab
              onOpenSmeltRecipes={() => setShowSmeltRecipesModal(true)}
              onOpenSmeltBatch={handleOpenSmeltBatch}
            />
          )}
          {activeTab === 'pricing' && (
            <PricingTab onOpenSmeltRecipes={() => setShowSmeltRecipesModal(true)} />
          )}
          {activeTab === 'profiles' && (
            <ProfilesTab
              onOpenUsersModal={onOpenUsersModal}
              onOpenAdminSidebar={onOpenAdminSidebar}
            />
          )}
        </div>
      </div>

      {/* Mobile & Tablet Sticky Bottom Tab Bar */}
      <nav
        aria-label="Mobile portal navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#111114]/95 backdrop-blur-md border-t border-zinc-800/90 px-2 py-1.5 shadow-2xl shadow-black/60"
      >
        <div className="grid grid-cols-5 gap-1 max-w-xl mx-auto">
          {WORKER_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const badge = tabBadges[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-bold flex items-center justify-center tabular-nums">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-full">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Portal-Wide Modals */}
      {showRecordSaleModal && canLogSalesPurchases && (
        <RecordSaleModal onClose={() => setShowRecordSaleModal(false)} />
      )}
      {showRecordPurchaseModal && canLogSalesPurchases && (
        <RecordPurchaseModal onClose={() => setShowRecordPurchaseModal(false)} />
      )}
      {smeltModalIngotId && canEditStock && (
        <SmeltBatchModal
          initialIngotId={smeltModalIngotId}
          onClose={() => setSmeltModalIngotId(null)}
        />
      )}
      {showSmeltRecipesModal && (
        <SmeltRecipesModal onClose={() => setShowSmeltRecipesModal(false)} />
      )}
    </div>
  );
}
