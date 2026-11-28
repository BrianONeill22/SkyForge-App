import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';

export default function VaultQuickAdd({ onClose }) {
  const { materialCategories, addMaterial, addResourceCategory } = useForgeLedgerContext();
  const { canEditStock } = useForgeAuth();

  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState(materialCategories[1] || materialCategories[0] || 'Raw Ore');
  const [newMatPrice, setNewMatPrice] = useState('');
  const [newMatStock, setNewMatStock] = useState('');
  const [newResourceCatInput, setNewResourceCatInput] = useState('');

  if (!canEditStock) return null;

  const handleAddMaterial = (e) => {
    e.preventDefault();
    const ok = addMaterial({
      name: newMatName,
      category: newMatCategory,
      buyPrice: Number(newMatPrice) || 0,
      stock: Number(newMatStock) || 0
    });
    if (ok) {
      setNewMatName('');
      setNewMatPrice('');
      setNewMatStock('');
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newResourceCatInput.trim();
    if (!trimmed) return;
    const ok = addResourceCategory(trimmed);
    if (ok) {
      setNewMatCategory(trimmed);
      setNewResourceCatInput('');
    }
  };

  return (
    <div className="bg-[#18181b] border border-amber-500/30 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-serif font-bold text-amber-200">
          Add Resource or Category to Vault
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <form onSubmit={handleAddMaterial} className="lg:col-span-8 grid grid-cols-12 gap-2">
          <input
            type="text"
            value={newMatName}
            onChange={(e) => setNewMatName(e.target.value)}
            placeholder="Material name (e.g. Flawless Diamond)..."
            autoFocus
            className="col-span-12 sm:col-span-4 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
          />
          <select
            value={newMatCategory}
            onChange={(e) => setNewMatCategory(e.target.value)}
            className="col-span-6 sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
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
            className="col-span-3 sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          />
          <input
            type="number"
            min="0"
            value={newMatStock}
            onChange={(e) => setNewMatStock(e.target.value)}
            placeholder="Stock"
            className="col-span-3 sm:col-span-1 px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none text-center"
          />
          <button
            type="submit"
            disabled={!newMatName.trim()}
            className={`col-span-12 sm:col-span-2 py-1.5 px-3 rounded-lg font-bold text-xs transition-colors ${
              newMatName.trim()
                ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            + Add
          </button>
        </form>

        <form onSubmit={handleAddCategory} className="lg:col-span-4 flex gap-2">
          <input
            type="text"
            value={newResourceCatInput}
            onChange={(e) => setNewResourceCatInput(e.target.value)}
            placeholder="New group (e.g. Gems)..."
            className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newResourceCatInput.trim()}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              newResourceCatInput.trim()
                ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-200 cursor-pointer'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            + Group
          </button>
        </form>
      </div>
    </div>
  );
}
