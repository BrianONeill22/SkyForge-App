import React, { useState } from 'react';
import { Flame, Plus } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import CatalogRecipeBoard from './CatalogRecipeBoard';
import NewCatalogItemForm from './NewCatalogItemForm';
import EditCatalogItemModal from './EditCatalogItemModal';

export default function PricingTab({ onOpenSmeltRecipes }) {
  const { profitMarginPct, setProfitMarginPct, buyBackRatePct, setBuyBackRatePct } =
    useForgeLedgerContext();
  const { canEditRecipes } = useForgeAuth();
  const [editingItem, setEditingItem] = useState(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-200">Forge Profit Margin</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold tabular-nums">
              +{profitMarginPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            disabled={!canEditRecipes}
            value={profitMarginPct}
            onChange={(e) => setProfitMarginPct(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="lg:col-span-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-200">Customer Buy-Back Rate</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold tabular-nums">
              {buyBackRatePct}% of cost
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            disabled={!canEditRecipes}
            value={buyBackRatePct}
            onChange={(e) => setBuyBackRatePct(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="lg:col-span-4 flex flex-wrap items-center justify-end gap-2">
          {canEditRecipes && (
            <button
              type="button"
              onClick={() => setShowNewItemForm((prev) => !prev)}
              className={`px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                showNewItemForm
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showNewItemForm ? 'Hide Builder' : 'New Item / Set'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenSmeltRecipes}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Smelt Recipes</span>
          </button>
        </div>
      </div>

      {showNewItemForm && canEditRecipes && (
        <NewCatalogItemForm onClose={() => setShowNewItemForm(false)} />
      )}

      <CatalogRecipeBoard onEditItem={setEditingItem} />

      {editingItem && canEditRecipes && (
        <EditCatalogItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
