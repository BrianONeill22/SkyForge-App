import React, { useState, useMemo } from 'react';
import { Hammer, Lock, Package, TrendingUp, Truck, Users } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../context/ForgeContext';
import DashboardTab from './dashboard/DashboardTab';
import OrdersTab from './orders/OrdersTab';
import StockTab from './stock/StockTab';
import PricingTab from './pricing/PricingTab';
import ProfilesTab from './profiles/ProfilesTab';
import SmeltRecipesModal from './stock/SmeltRecipesModal';

const WORKER_TABS = [
  { id: 'dashboard', label: 'Sales & Profits', icon: TrendingUp },
  { id: 'orders', label: 'Orders & Deliveries', icon: Truck },
  { id: 'stock', label: 'Vault & Stock', icon: Package },
  { id: 'pricing', label: 'Recipes & Margin', icon: Hammer },
  { id: 'profiles', label: 'Profiles & Access', icon: Users }
];

export default function WorkerPortal({ onOpenUsersModal, onOpenAdminSidebar }) {
  const {
    workerProfile,
    canLogSalesPurchases,
    canManageOrders,
    canEditStock,
    canEditRecipes
  } = useForgeAuth();
  const { orders, supplyRecords, resolvedMaterials } = useForgeLedgerContext();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSmeltModal, setShowSmeltModal] = useState(false);

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

  if (!workerProfile) return null;

  const isViewOnly = !canLogSalesPurchases && !canManageOrders && !canEditStock && !canEditRecipes;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Clean Portal Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#141418] border border-zinc-800/90">
          {WORKER_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const badge = tabBadges[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/90'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums ${
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

        {isViewOnly && (
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> View-Only Mode
          </span>
        )}
      </div>

      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'stock' && <StockTab onOpenSmeltRecipes={() => setShowSmeltModal(true)} />}
      {activeTab === 'pricing' && (
        <PricingTab onOpenSmeltRecipes={() => setShowSmeltModal(true)} />
      )}
      {activeTab === 'profiles' && (
        <ProfilesTab
          onOpenUsersModal={onOpenUsersModal}
          onOpenAdminSidebar={onOpenAdminSidebar}
        />
      )}

      {showSmeltModal && <SmeltRecipesModal onClose={() => setShowSmeltModal(false)} />}
    </div>
  );
}
