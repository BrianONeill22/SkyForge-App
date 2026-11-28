import React, { useState } from 'react';
import { Flame, RefreshCw } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';

export default function VaultQuickAdd({ onOpenSmeltBatch, onOpenSmeltRecipes }) {
  const { materialCategories, recalculateIngotCosts, addMaterial, addResourceCategory } =
    useForgeLedgerContext();
  const { canEditStock } = useForgeAuth();

  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState('Raw Ore');
  const [newMatPrice, setNewMatPrice] = useState(0);
  const [newResourceCatInput, setNewResourceCatInput] = useState('');

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!canEditStock) return;
    const ok = addMaterial({
      name: newMatName,
      category: newMatCategory,
      buyPrice: newMatPrice,
      stock: 0
    });
    if (ok) {
      setNewMatName('');
      setNewMatPrice(0);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!canEditStock) return;
    const trimmed = newResourceCatInput.trim();
    if (!trimmed) return;
    const ok = addResourceCategory(trimmed);
    if (ok) {
      setNewMatCategory(trimmed);
      setNewResourceCatInput('');
    }
  };

  return (
    <div className="xl:col-span-5 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-serif font-bold text-amber-200">
            Vault Tools &amp; Quick Add
          </h3>
          <p className="text-[11px] text-zinc-400">
            Sync smelted ingot prices or add new ores &amp; categories.
          </p>
        </div>
        {canEditStock && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenSmeltBatch}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Smelt Ingots</span>
            </button>
            <button
              type="button"
              onClick={recalculateIngotCosts}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalculate Ingots</span>
            </button>
            <button
              type="button"
              onClick={onOpenSmeltRecipes}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer"
            >
              Smelt Recipes
            </button>
          </div>
        )}
      </div>

      {canEditStock ? (
        <div className="space-y-2.5">
          <form onSubmit={handleAddMaterial} className="grid grid-cols-12 gap-2">
            <input
              type="text"
              value={newMatName}
              onChange={(e) => setNewMatName(e.target.value)}
              placeholder="New material name..."
              className="col-span-5 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <select
              value={newMatCategory}
              onChange={(e) => setNewMatCategory(e.target.value)}
              className="col-span-4 px-2 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            >
              {materialCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={newMatPrice}
              onChange={(e) => setNewMatPrice(e.target.value)}
              placeholder="Buy (g)"
              className="col-span-3 px-2 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <button
              type="submit"
              className="col-span-12 py-1.5 px-3 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
            >
              + Add Material to Vault
            </button>
          </form>

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newResourceCatInput}
              onChange={(e) => setNewResourceCatInput(e.target.value)}
              placeholder="New resource group (e.g. Gems)..."
              className="flex-1 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
            >
              + Group
            </button>
          </form>
        </div>
      ) : (
        <p className="text-xs text-zinc-500">
          Vault editing is restricted to Smiths &amp; Admins.
        </p>
      )}
    </div>
  );
}
