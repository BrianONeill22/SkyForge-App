import React, { useState } from 'react';
import { Flame, Layers, Plus } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import { ROUND_TO_FIVE_THRESHOLD } from '../../../utils/formatters';
import CatalogRecipeBoard from './CatalogRecipeBoard';
import NewCatalogItemForm from './NewCatalogItemForm';
import EditCatalogItemModal from './EditCatalogItemModal';

export default function PricingTab({ onOpenSmeltRecipes }) {
  const { profitMarginPct, setProfitMarginPct, buyBackRatePct, setBuyBackRatePct } =
    useForgeLedgerContext();
  const { canEditRecipes } = useForgeAuth();
  const [editingItem, setEditingItem] = useState(null);
  const [builderMode, setBuilderMode] = useState(null); // null | 'item' | 'set'

  const toggleBuilder = (mode) => {
    setBuilderMode((prev) => (prev === mode ? null : mode));
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-200">Forge Profit Margin</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="500"
                disabled={!canEditRecipes}
                value={profitMarginPct}
                onChange={(e) => setProfitMarginPct(Math.max(0, Number(e.target.value) || 0))}
                className="w-16 pl-2 pr-5 py-0.5 rounded bg-zinc-950 border border-amber-500/40 text-right text-xs font-bold text-amber-300 tabular-nums focus:outline-none"
              />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-amber-400">
                %
              </span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            disabled={!canEditRecipes}
            value={Math.min(200, profitMarginPct)}
            onChange={(e) => setProfitMarginPct(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="lg:col-span-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-200">Customer Buy-Back Rate</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                disabled={!canEditRecipes}
                value={buyBackRatePct}
                onChange={(e) =>
                  setBuyBackRatePct(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
                }
                className="w-16 pl-2 pr-5 py-0.5 rounded bg-zinc-950 border border-emerald-500/40 text-right text-xs font-bold text-emerald-300 tabular-nums focus:outline-none"
              />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400">
                %
              </span>
            </div>
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
            <>
              <button
                type="button"
                onClick={() => toggleBuilder('item')}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  builderMode === 'item'
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Item</span>
              </button>
              <button
                type="button"
                onClick={() => toggleBuilder('set')}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 border transition-colors cursor-pointer ${
                  builderMode === 'set'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>New Set</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onOpenSmeltRecipes}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Smelt</span>
          </button>
        </div>

        <div className="lg:col-span-12 pt-2 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
          <span>
            Auto prices snap to the nearest <strong className="text-amber-300">5g</strong> once{' '}
            <strong className="text-zinc-200">{ROUND_TO_FIVE_THRESHOLD}g+</strong>, and round to
            the nearest <strong className="text-zinc-200">1g</strong> below{' '}
            {ROUND_TO_FIVE_THRESHOLD}g so low-cost wares stay accurate.
          </span>
        </div>
      </div>

      {builderMode && canEditRecipes && (
        <NewCatalogItemForm initialMode={builderMode} onClose={() => setBuilderMode(null)} />
      )}

      <CatalogRecipeBoard
        onEditItem={setEditingItem}
        onCreateNewSet={() => setBuilderMode('set')}
      />

      {editingItem && canEditRecipes && (
        <EditCatalogItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
