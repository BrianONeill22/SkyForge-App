import React, { useState } from 'react';
import { Hammer, Lock, Package, TrendingUp, Truck, Users } from 'lucide-react';
import { ROLE_PRESETS } from '../../data/roles';
import { useForgeAuth } from '../../context/ForgeContext';
import DashboardTab from './dashboard/DashboardTab';
import OrdersTab from './orders/OrdersTab';
import StockTab from './stock/StockTab';
import PricingTab from './pricing/PricingTab';
import ProfilesTab from './profiles/ProfilesTab';
import SmeltRecipesModal from './stock/SmeltRecipesModal';

const WORKER_TABS = [
  { id: 'dashboard', label: 'Sales & Profits', icon: TrendingUp },
  { id: 'orders', label: 'Orders & Deliveries', icon: Truck },
  { id: 'stock', label: 'Forge Stock & Ore', icon: Package },
  { id: 'pricing', label: 'Recipes & Margin', icon: Hammer },
  { id: 'profiles', label: 'Smith Profiles', icon: Users }
];

export default function WorkerPortal({ onOpenUsersModal, onOpenAdminSidebar }) {
  const {
    workerProfile,
    activeUserRecord,
    effectiveRole,
    canLogSalesPurchases,
    canManageOrders,
    canEditStock,
    canEditRecipes
  } = useForgeAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSmeltModal, setShowSmeltModal] = useState(false);

  if (!workerProfile) return null;

  const isViewOnly = !canLogSalesPurchases && !canManageOrders && !canEditStock && !canEditRecipes;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {WORKER_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-[#18181b] text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold uppercase text-[10px]">
            {ROLE_PRESETS[effectiveRole]?.label || effectiveRole}
          </span>
          <span>
            <strong className="text-zinc-200">
              {activeUserRecord?.displayName || workerProfile.name}
            </strong>
            {activeUserRecord?.username ? ` (@${activeUserRecord.username})` : ''}
          </span>
          {isViewOnly && (
            <span className="text-amber-300 font-semibold flex items-center gap-1 ml-1">
              <Lock className="w-3 h-3" /> View Only
            </span>
          )}
        </div>
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
