import React, { useState } from 'react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import CatalogRecipeBoard from './CatalogRecipeBoard';
import NewCatalogItemForm from './NewCatalogItemForm';
import EditCatalogItemModal from './EditCatalogItemModal';

export default function PricingTab({ onOpenSmeltRecipes }) {
  const { profitMarginPct, setProfitMarginPct, buyBackRatePct, setBuyBackRatePct } =
    useForgeLedgerContext();
  const { canEditRecipes } = useForgeAuth();
  const [editingItem, setEditingItem] = useState(null);

  return (
    <div className="space-y-4">
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-zinc-200">Forge Profit Margin (%)</span>
            <span className="font-bold text-amber-300">{profitMarginPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            disabled={!canEditRecipes}
            value={profitMarginPct}
            onChange={(e) => setProfitMarginPct(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-zinc-200">
              Customer Buy-Back Rate (% of Cost)
            </span>
            <span className="font-bold text-emerald-300">{buyBackRatePct}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            disabled={!canEditRecipes}
            value={buyBackRatePct}
            onChange={(e) => setBuyBackRatePct(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onOpenSmeltRecipes}
            className="px-4 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 cursor-pointer"
          >
            Smelting Recipes Quick-Editor
          </button>
        </div>
      </div>

      <CatalogRecipeBoard onEditItem={setEditingItem} />

      {canEditRecipes && <NewCatalogItemForm />}

      {editingItem && canEditRecipes && (
        <EditCatalogItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
