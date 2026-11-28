import React, { useState, useMemo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';

export default function CatalogRecipeBoard({ onEditItem }) {
  const {
    categories,
    subCategories,
    catalogItems,
    enrichedCatalog,
    materialMap,
    addSubTier,
    removeSubTier,
    quickChangeItemSubCategory,
    deleteCatalogItem
  } = useForgeLedgerContext();
  const { canEditRecipes } = useForgeAuth();

  const [catFilter, setCatFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [inlineNewSubCat, setInlineNewSubCat] = useState('');

  const filteredItems = useMemo(() => {
    return enrichedCatalog.filter((item) => {
      if (catFilter !== 'All' && item.category !== catFilter) return false;
      if (subFilter !== 'All' && (item.subCategory || '') !== subFilter) return false;
      if (search.trim() && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [enrichedCatalog, catFilter, subFilter, search]);

  const handleAddTier = (e) => {
    e.preventDefault();
    if (!canEditRecipes || catFilter === 'All') return;
    if (addSubTier(catFilter, inlineNewSubCat)) {
      setInlineNewSubCat('');
    }
  };

  const handleRemoveTier = (catName, tierName) => {
    if (!canEditRecipes) return;
    removeSubTier(catName, tierName);
    if (subFilter === tierName) setSubFilter('All');
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCatFilter(cat);
                setSubFilter('All');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                catFilter === cat
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Filter recipes..."
          className="w-full sm:w-64"
          clearable={false}
        />
      </div>

      {catFilter !== 'All' && (
        <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase text-zinc-500 mr-1">
              {catFilter} Tiers:
            </span>
            <button
              type="button"
              onClick={() => setSubFilter('All')}
              className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                subFilter === 'All'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'bg-zinc-900 text-zinc-400'
              }`}
            >
              All
            </button>
            {(subCategories[catFilter] || []).map((tier) => (
              <span
                key={tier}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                  subFilter === tier
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                }`}
              >
                <button type="button" onClick={() => setSubFilter(tier)} className="cursor-pointer">
                  {tier}
                </button>
                {canEditRecipes && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(catFilter, tier)}
                    title={`Remove ${tier} tier`}
                    className="text-zinc-500 hover:text-red-400 ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {canEditRecipes && (
            <form onSubmit={handleAddTier} className="flex items-center gap-1.5">
              <input
                type="text"
                value={inlineNewSubCat}
                onChange={(e) => setInlineNewSubCat(e.target.value)}
                placeholder="New tier..."
                className="w-28 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                + Tier
              </button>
            </form>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-lg bg-zinc-950/75 border border-zinc-800/90 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-serif font-bold text-zinc-100">{item.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400">
                  {item.category}
                </span>
                {canEditRecipes ? (
                  <select
                    value={item.subCategory || ''}
                    onChange={(e) => quickChangeItemSubCategory(item.id, e.target.value)}
                    title="Change armor/item type"
                    className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/35 text-[10px] font-semibold text-amber-300 focus:outline-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-950 text-zinc-300">
                      No Type
                    </option>
                    {Array.from(
                      new Set([
                        ...(subCategories[item.category] || []),
                        ...(item.subCategory ? [item.subCategory] : [])
                      ])
                    ).map((t) => (
                      <option key={t} value={t} className="bg-zinc-950 text-amber-200">
                        {t}
                      </option>
                    ))}
                  </select>
                ) : (
                  item.subCategory && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-[10px] text-amber-300">
                      {item.subCategory}
                    </span>
                  )
                )}
              </div>
              <div className="text-[11px] text-zinc-400 truncate">
                {(item.bundleItems || []).length > 0
                  ? `Set Pieces: ${item.bundleItems
                      .map((p) => {
                        const child = catalogItems.find((c) => c.id === p.itemId);
                        return `${p.qty}x ${child?.name || p.itemId}`;
                      })
                      .join(' + ')}${
                      (item.recipe || []).length > 0
                        ? ` • Extra: ${item.recipe
                            .map(
                              (r) => `${r.qty}x ${materialMap[r.materialId]?.name || r.materialId}`
                            )
                            .join(' + ')}`
                        : ''
                    }`
                  : (item.recipe || []).length > 0
                  ? item.recipe
                      .map((r) => `${r.qty}x ${materialMap[r.materialId]?.name || r.materialId}`)
                      .join(' + ')
                  : 'No smelting/forging recipe assigned'}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto shrink-0">
              <div className="text-right text-[11px]">
                <div className="text-zinc-400">
                  Cost: <strong className="text-zinc-200">{item.materialCost}g</strong>
                </div>
                <div className="text-amber-300 font-bold">Sell: {item.sellPrice}g</div>
              </div>

              {canEditRecipes && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditItem({ ...item })}
                    title="Edit Recipe, Set Pieces & Price"
                    className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-300 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCatalogItem(item.id)}
                    title="Delete Item"
                    className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
