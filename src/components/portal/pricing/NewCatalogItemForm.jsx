import React, { useState, useMemo, useEffect } from 'react';
import { Hammer, Layers, Search, X } from 'lucide-react';
import { useForgeLedgerContext } from '../../../context/ForgeContext';
import { roundToNearestFive } from '../../../utils/formatters';

export default function NewCatalogItemForm({ initialMode = 'item', onClose }) {
  const {
    categories,
    subCategories,
    resolvedMaterials,
    materialMap,
    enrichedCatalog,
    profitMarginPct,
    createCatalogItem
  } = useForgeLedgerContext();

  const [builderMode, setBuilderMode] = useState(initialMode); // 'item' | 'set'
  const [name, setName] = useState('');
  const [category, setCategory] = useState(initialMode === 'set' ? 'Armor' : 'Weapons');
  const [subCategory, setSubCategory] = useState('Iron');
  const [description, setDescription] = useState('');
  const [manualPriceInput, setManualPriceInput] = useState('');

  const [matSearch, setMatSearch] = useState('');
  const [recipe, setRecipe] = useState([]);

  const [setSearch, setSetSearch] = useState('');
  const [setPieces, setSetPieces] = useState([]);

  useEffect(() => {
    setBuilderMode(initialMode);
    if (initialMode === 'set') {
      setCategory('Armor');
      setSubCategory((subCategories.Armor || [])[0] || '');
    }
  }, [initialMode, subCategories]);

  const filteredMaterials = useMemo(() => {
    const q = matSearch.trim().toLowerCase();
    return resolvedMaterials.filter(
      (m) => !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
    );
  }, [resolvedMaterials, matSearch]);

  const filteredPieces = useMemo(() => {
    const q = setSearch.trim().toLowerCase();
    return enrichedCatalog.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.subCategory || '').toLowerCase().includes(q)
    );
  }, [enrichedCatalog, setSearch]);

  const pricingPreview = useMemo(() => {
    const matsCost = recipe.reduce((sum, r) => {
      const m = materialMap[r.materialId];
      return sum + (m ? (Number(m.buyPrice) || 0) * r.qty : 0);
    }, 0);
    const piecesCost = setPieces.reduce((sum, p) => {
      const c = enrichedCatalog.find((x) => x.id === p.itemId);
      return sum + (c ? (Number(c.materialCost) || 0) * p.qty : 0);
    }, 0);
    const totalCost = matsCost + piecesCost;
    const autoPrice = roundToNearestFive(totalCost * (1 + (Number(profitMarginPct) || 0) / 100));
    const hasManual =
      manualPriceInput !== '' &&
      !Number.isNaN(Number(manualPriceInput)) &&
      Number(manualPriceInput) >= 0;
    const finalSell = hasManual ? Math.round(Number(manualPriceInput)) : autoPrice;
    return { totalCost, autoPrice, hasManual, finalSell };
  }, [recipe, setPieces, materialMap, enrichedCatalog, profitMarginPct, manualPriceInput]);

  const handleClickMaterial = (matId) => {
    setRecipe((prev) => {
      const existing = prev.find((r) => r.materialId === matId);
      if (existing) {
        return prev.map((r) => (r.materialId === matId ? { ...r, qty: r.qty + 1 } : r));
      }
      return [...prev, { materialId: matId, qty: 1 }];
    });
  };

  const handleStepMaterial = (matId, delta) => {
    setRecipe((prev) =>
      prev
        .map((r) => (r.materialId === matId ? { ...r, qty: r.qty + delta } : r))
        .filter((r) => r.qty > 0)
    );
  };

  const handleClickPiece = (itemId) => {
    setSetPieces((prev) => {
      const existing = prev.find((p) => p.itemId === itemId);
      if (existing) {
        return prev.map((p) => (p.itemId === itemId ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { itemId, qty: 1 }];
    });
  };

  const handleStepPiece = (itemId, delta) => {
    setSetPieces((prev) =>
      prev
        .map((p) => (p.itemId === itemId ? { ...p, qty: p.qty + delta } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = createCatalogItem({
      name,
      category,
      subCategory,
      description,
      recipe,
      bundleItems: setPieces,
      customPrice: pricingPreview.hasManual ? pricingPreview.finalSell : 0,
      useCustomPrice: pricingPreview.hasManual
    });
    if (ok) {
      setName('');
      setDescription('');
      setRecipe([]);
      setSetPieces([]);
      setManualPriceInput('');
      setMatSearch('');
      setSetSearch('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#18181b] border border-amber-500/35 rounded-xl p-4 space-y-3.5 shadow-lg shadow-black/20"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setBuilderMode('item')}
              className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 cursor-pointer ${
                builderMode === 'item'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>Single Item Recipe</span>
            </button>
            <button
              type="button"
              onClick={() => setBuilderMode('set')}
              className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 cursor-pointer ${
                builderMode === 'set'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Armor Set / Kit</span>
            </button>
          </div>
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            {builderMode === 'set'
              ? 'Click pieces below to bundle them into one complete Set.'
              : 'Click materials below to assign a forging recipe.'}
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            builderMode === 'set'
              ? 'Set name (e.g. Full Steel Plate Set)'
              : 'Item name (e.g. Dwarven War Axe)'
          }
          autoFocus
          className="md:col-span-4 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/60"
        />
        <select
          value={category}
          onChange={(e) => {
            const c = e.target.value;
            setCategory(c);
            setSubCategory((subCategories[c] || [])[0] || '');
          }}
          className="md:col-span-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="md:col-span-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
        >
          <option value="">-- No Tier --</option>
          {(subCategories[category] || []).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (optional)..."
          className="md:col-span-4 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
        />
      </div>

      {/* Click-to-add Pickers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Set Pieces Picker (Highlighted first in Set mode) */}
        <div
          className={`p-3.5 rounded-xl bg-zinc-950/80 border space-y-2.5 ${
            builderMode === 'set'
              ? 'order-1 border-amber-500/40'
              : 'order-2 border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              {builderMode === 'set'
                ? '1. Click Items to Bundle in Set'
                : 'Optional: Bundle Existing Items (Set / Kit)'}
            </span>
            {setPieces.length > 0 && (
              <span className="text-[11px] text-amber-200 font-semibold">
                {setPieces.reduce((s, p) => s + p.qty, 0)} pcs
              </span>
            )}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={setSearch}
              onChange={(e) => setSetSearch(e.target.value)}
              placeholder="Filter armor, shields, weapons..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="max-h-36 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {filteredPieces.map((c) => {
              const added = setPieces.find((p) => p.itemId === c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleClickPiece(c.id)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    added
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-100'
                      : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <span className="truncate font-medium">{c.name}</span>
                  <span className="shrink-0 text-[11px] tabular-nums">
                    {added ? (
                      <strong className="text-amber-300">×{added.qty}</strong>
                    ) : (
                      <span className="text-zinc-500">{c.materialCost}g</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {setPieces.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {setPieces.map((p) => {
                const pieceObj = enrichedCatalog.find((c) => c.id === p.itemId);
                return (
                  <span
                    key={p.itemId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-[11px] text-amber-100"
                  >
                    <button
                      type="button"
                      onClick={() => handleStepPiece(p.itemId, -1)}
                      className="px-1 text-amber-300/70 hover:text-red-300 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-bold">{p.qty}×</span>
                    <span>{pieceObj?.name || p.itemId}</span>
                    <button
                      type="button"
                      onClick={() => handleStepPiece(p.itemId, 1)}
                      className="px-1 text-amber-300/70 hover:text-amber-100 cursor-pointer"
                    >
                      +
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Raw Materials Picker */}
        <div
          className={`p-3.5 rounded-xl bg-zinc-950/80 border space-y-2.5 ${
            builderMode === 'item'
              ? 'order-1 border-amber-500/40'
              : 'order-2 border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              {builderMode === 'item'
                ? '1. Click Raw Materials & Ingots'
                : 'Optional: Extra Materials (Leather, Ingots)'}
            </span>
            {recipe.length > 0 && (
              <span className="text-[11px] text-zinc-400">
                {recipe.reduce((s, r) => s + r.qty, 0)} units
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
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="max-h-36 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {filteredMaterials.map((m) => {
              const added = recipe.find((r) => r.materialId === m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleClickMaterial(m.id)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    added
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-100'
                      : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <span className="truncate font-medium">{m.name}</span>
                  <span className="shrink-0 text-[11px] tabular-nums">
                    {added ? (
                      <strong className="text-amber-300">×{added.qty}</strong>
                    ) : (
                      <span className="text-zinc-500">{m.buyPrice}g</span>
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
                    onClick={() => handleStepMaterial(r.materialId, -1)}
                    className="px-1 text-zinc-400 hover:text-red-300 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-bold text-amber-200">{r.qty}×</span>
                  <span>{materialMap[r.materialId]?.name || r.materialId}</span>
                  <button
                    type="button"
                    onClick={() => handleStepMaterial(r.materialId, 1)}
                    className="px-1 text-zinc-400 hover:text-amber-200 cursor-pointer"
                  >
                    +
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing Preview + Optional Manual Price Override + Submit */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-4 text-xs tabular-nums">
          <div>
            <span className="text-zinc-500">Material Cost:</span>{' '}
            <strong className="text-zinc-200">{pricingPreview.totalCost}g</strong>
          </div>
          <div>
            <span className="text-zinc-500">Auto Sell ({profitMarginPct}%):</span>{' '}
            <strong className="text-amber-300">{pricingPreview.autoPrice}g</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-zinc-400">Manual Price (opt.):</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={manualPriceInput}
                onChange={(e) => setManualPriceInput(e.target.value)}
                placeholder={`${pricingPreview.autoPrice}`}
                className="w-20 pl-2 pr-5 py-1 rounded-lg bg-zinc-950 border border-zinc-700 focus:border-amber-500/60 text-right text-xs font-bold text-amber-200 focus:outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
                g
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className={`px-5 py-2 rounded-lg font-bold text-xs transition-colors ${
            name.trim()
              ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {builderMode === 'set' ? 'Create Armor Set / Kit' : 'Create Catalog Item'}
        </button>
      </div>
    </form>
  );
}
