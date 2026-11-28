import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useForgeLedgerContext } from '../../../context/ForgeContext';
import { roundToNearestFive, createId } from '../../../utils/formatters';

export default function CustomSaleItemBuilder({ onAddCustomLine, onDraftChange }) {
  const { resolvedMaterials, materialMap, categories, subCategories, profitMarginPct } =
    useForgeLedgerContext();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Weapons');
  const [subCategory, setSubCategory] = useState('Iron');
  const [qty, setQty] = useState(1);
  const [matSearch, setMatSearch] = useState('');
  const [recipe, setRecipe] = useState([]);
  const [priceOverride, setPriceOverride] = useState('');
  const [saveToRecipes, setSaveToRecipes] = useState(true);

  const pricing = useMemo(() => {
    const materialCost = recipe.reduce((sum, req) => {
      const mat = materialMap[req.materialId];
      return sum + (mat ? (Number(mat.buyPrice) || 0) * req.qty : 0);
    }, 0);
    const calculatedSellPrice = roundToNearestFive(
      materialCost * (1 + (Number(profitMarginPct) || 0) / 100)
    );
    const hasOverride =
      priceOverride !== '' &&
      !Number.isNaN(Number(priceOverride)) &&
      Number(priceOverride) >= 0;
    const finalSellPrice = hasOverride ? Math.round(Number(priceOverride)) : calculatedSellPrice;
    return { materialCost, calculatedSellPrice, finalSellPrice, hasOverride };
  }, [recipe, materialMap, profitMarginPct, priceOverride]);

  const filteredMaterials = useMemo(() => {
    const q = matSearch.trim().toLowerCase();
    return resolvedMaterials.filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }, [resolvedMaterials, matSearch]);

  const buildLine = () => {
    const cleanName = name.trim();
    if (!cleanName) return null;
    return {
      lineId: createId('sline'),
      mode: 'custom',
      itemName: cleanName,
      category: category || 'Unsorted',
      subCategory: subCategory || '',
      qty: Math.max(1, Number(qty) || 1),
      unitSell: pricing.finalSellPrice,
      unitCost: pricing.materialCost,
      hasOverride: pricing.hasOverride,
      recipe: [...recipe],
      saveToRecipes
    };
  };

  // Keep parent aware of whether a valid custom draft exists
  React.useEffect(() => {
    onDraftChange?.(buildLine);
  });

  const handleToggleOrIncrementMaterial = (matId) => {
    setRecipe((prev) => {
      const existing = prev.find((r) => r.materialId === matId);
      if (existing) {
        return prev.map((r) => (r.materialId === matId ? { ...r, qty: r.qty + 1 } : r));
      }
      return [...prev, { materialId: matId, qty: 1 }];
    });
  };

  const handleStepMaterialQty = (matId, delta) => {
    setRecipe((prev) =>
      prev
        .map((r) => (r.materialId === matId ? { ...r, qty: r.qty + delta } : r))
        .filter((r) => r.qty > 0)
    );
  };

  const handleAdd = () => {
    const line = buildLine();
    if (!line) return;
    onAddCustomLine(line);
    setName('');
    setQty(1);
    setRecipe([]);
    setPriceOverride('');
    setMatSearch('');
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-6">
          <label className="block text-[11px] text-zinc-400 mb-1">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Glass Mace"
            autoFocus
            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-[11px] text-zinc-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => {
              const c = e.target.value;
              setCategory(c);
              setSubCategory((subCategories[c] || [])[0] || '');
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <label className="block text-[11px] text-zinc-400 mb-1">Sub-Tier</label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          >
            <option value="">None</option>
            {(subCategories[category] || []).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Click-to-add materials */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-zinc-300">
            Click Materials Used (optional)
          </label>
          {recipe.length > 0 && (
            <span className="text-[11px] text-zinc-400">
              Cost: <strong className="text-zinc-100">{pricing.materialCost}g</strong>
            </span>
          )}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={matSearch}
            onChange={(e) => setMatSearch(e.target.value)}
            placeholder="Filter ingots, ores, leather..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="max-h-36 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {filteredMaterials.map((mat) => {
            const added = recipe.find((r) => r.materialId === mat.id);
            return (
              <button
                key={mat.id}
                type="button"
                onClick={() => handleToggleOrIncrementMaterial(mat.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  added
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-100'
                    : 'bg-zinc-950/70 border-zinc-800/90 hover:border-zinc-700 text-zinc-200'
                }`}
              >
                <span className="truncate font-medium">{mat.name}</span>
                <span className="shrink-0 text-[11px] text-zinc-400">
                  {added ? (
                    <strong className="text-amber-300">×{added.qty}</strong>
                  ) : (
                    `${mat.buyPrice}g`
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {recipe.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {recipe.map((r) => (
              <span
                key={r.materialId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-200"
              >
                <button
                  type="button"
                  onClick={() => handleStepMaterialQty(r.materialId, -1)}
                  className="px-1 text-zinc-400 hover:text-red-300 cursor-pointer"
                >
                  −
                </button>
                <span className="font-semibold text-amber-200">{r.qty}x</span>
                <span>{materialMap[r.materialId]?.name || r.materialId}</span>
                <button
                  type="button"
                  onClick={() => handleStepMaterialQty(r.materialId, 1)}
                  className="px-1 text-zinc-400 hover:text-amber-200 cursor-pointer"
                >
                  +
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price, qty & add */}
      <div className="grid grid-cols-12 gap-2 items-end pt-1">
        <div className="col-span-4">
          <label className="block text-[10px] uppercase text-zinc-400 mb-1">
            Sell Price ({profitMarginPct}% auto: {pricing.calculatedSellPrice}g)
          </label>
          <input
            type="number"
            min="0"
            value={priceOverride}
            onChange={(e) => setPriceOverride(e.target.value)}
            placeholder={`${pricing.calculatedSellPrice}g`}
            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-200 font-bold text-xs focus:outline-none focus:border-amber-500/60"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-[10px] uppercase text-zinc-400 mb-1">Qty</label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-bold text-xs focus:outline-none"
          />
        </div>
        <div className="col-span-5">
          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleAdd}
            className={`w-full py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors ${
              name.trim()
                ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 cursor-pointer'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Ticket</span>
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-emerald-300 cursor-pointer">
        <input
          type="checkbox"
          checked={saveToRecipes}
          onChange={(e) => setSaveToRecipes(e.target.checked)}
          className="accent-emerald-500"
        />
        <span>Save this new item &amp; recipe to catalog</span>
      </label>
    </div>
  );
}
