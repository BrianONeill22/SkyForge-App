import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useForgeLedgerContext } from '../../../context/ForgeContext';

export default function NewCatalogItemForm() {
  const {
    categories,
    subCategories,
    resolvedMaterials,
    materialMap,
    enrichedCatalog,
    createCatalogItem
  } = useForgeLedgerContext();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Weapons');
  const [subCategory, setSubCategory] = useState('Iron');
  const [description, setDescription] = useState('');

  const [matSearch, setMatSearch] = useState('');
  const [matId, setMatId] = useState('mat_iron_ingot');
  const [matQty, setMatQty] = useState(1);
  const [recipe, setRecipe] = useState([]);

  const [setSearch, setSetSearch] = useState('');
  const [setPieceId, setSetPieceId] = useState('');
  const [setPieceQty, setSetPieceQty] = useState(1);
  const [setPieces, setSetPieces] = useState([]);

  const handleAddMaterial = () => {
    if (!matId) return;
    const qty = Math.max(1, Number(matQty) || 1);
    setRecipe((prev) => {
      const existing = prev.find((r) => r.materialId === matId);
      if (existing) {
        return prev.map((r) => (r.materialId === matId ? { ...r, qty: r.qty + qty } : r));
      }
      return [...prev, { materialId: matId, qty }];
    });
  };

  const handleAddSetPiece = () => {
    if (!setPieceId) return;
    const qty = Math.max(1, Number(setPieceQty) || 1);
    setSetPieces((prev) => {
      const existing = prev.find((p) => p.itemId === setPieceId);
      if (existing) {
        return prev.map((p) => (p.itemId === setPieceId ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { itemId: setPieceId, qty }];
    });
    setSetPieceId('');
    setSetPieceQty(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalBundleItems =
      setPieces.length === 0 && setPieceId
        ? [{ itemId: setPieceId, qty: Math.max(1, Number(setPieceQty) || 1) }]
        : [...setPieces];

    const ok = createCatalogItem({
      name,
      category,
      subCategory,
      description,
      recipe,
      bundleItems: finalBundleItems
    });
    if (ok) {
      setName('');
      setDescription('');
      setRecipe([]);
      setSetPieces([]);
      setSetPieceId('');
      setSetPieceQty(1);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-serif font-bold text-amber-200">
          Forge New Catalog Item, Recipe, or Armor Set
        </h3>
        <span className="text-[11px] text-zinc-400">
          Add raw materials, bundle multiple items into an Armor Set, or both.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item or Set name (e.g. Full Ebony Armor Set)"
          className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/60"
        />
        <select
          value={category}
          onChange={(e) => {
            const c = e.target.value;
            setCategory(c);
            setSubCategory((subCategories[c] || [])[0] || '');
          }}
          className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
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
          className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
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
          placeholder="Short description..."
          className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            1. Raw Materials &amp; Ingots Used
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={matSearch}
                onChange={(e) => setMatSearch(e.target.value)}
                placeholder="Search materials..."
                className="w-36 pl-8 pr-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
              />
            </div>
            <select
              value={matId}
              onChange={(e) => setMatId(e.target.value)}
              className="flex-1 min-w-[140px] px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            >
              {resolvedMaterials
                .filter(
                  (m) =>
                    !matSearch.trim() ||
                    m.name.toLowerCase().includes(matSearch.toLowerCase()) ||
                    m.category.toLowerCase().includes(matSearch.toLowerCase())
                )
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.buyPrice}g)
                  </option>
                ))}
            </select>
            <input
              type="number"
              min="1"
              value={matQty}
              onChange={(e) => setMatQty(e.target.value)}
              className="w-16 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddMaterial}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
            >
              + Material
            </button>
          </div>

          {recipe.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recipe.map((r) => (
                <span
                  key={r.materialId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                >
                  <span>
                    {r.qty}x {materialMap[r.materialId]?.name || r.materialId}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setRecipe((prev) => prev.filter((x) => x.materialId !== r.materialId))
                    }
                    className="text-zinc-500 hover:text-red-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-amber-500/25 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
            2. Bundle Multiple Items (Armor Set / Kit)
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={setSearch}
                onChange={(e) => setSetSearch(e.target.value)}
                placeholder="Search armor/wares..."
                className="w-36 pl-8 pr-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
              />
            </div>
            <select
              value={setPieceId}
              onChange={(e) => setSetPieceId(e.target.value)}
              className="flex-1 min-w-[140px] px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            >
              <option value="">-- Select Set Piece --</option>
              {enrichedCatalog
                .filter(
                  (c) =>
                    !setSearch.trim() ||
                    c.name.toLowerCase().includes(setSearch.toLowerCase()) ||
                    c.category.toLowerCase().includes(setSearch.toLowerCase()) ||
                    (c.subCategory || '').toLowerCase().includes(setSearch.toLowerCase())
                )
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Cost: {c.materialCost}g)
                  </option>
                ))}
            </select>
            <input
              type="number"
              min="1"
              value={setPieceQty}
              onChange={(e) => setSetPieceQty(e.target.value)}
              className="w-16 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSetPiece}
              className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-200 cursor-pointer"
            >
              + Add Piece
            </button>
          </div>

          {setPieces.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {setPieces.map((p) => {
                const pieceObj = enrichedCatalog.find((c) => c.id === p.itemId);
                return (
                  <span
                    key={p.itemId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/50 border border-amber-500/40 text-xs text-amber-100"
                  >
                    <span>
                      {p.qty}x {pieceObj?.name || p.itemId}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSetPieces((prev) => prev.filter((x) => x.itemId !== p.itemId))
                      }
                      className="text-amber-300/70 hover:text-red-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
      >
        Create Catalog Item
      </button>
    </form>
  );
}
