import React, { useState, useMemo } from 'react';
import { Edit3, Layers, Plus, RotateCcw } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';
import ConfirmDeleteButton from '../../common/ConfirmDeleteButton';

export default function CatalogRecipeBoard({ onEditItem, onCreateNewSet }) {
  const {
    categories,
    subCategories,
    catalogItems,
    enrichedCatalog,
    materialMap,
    addSubTier,
    removeSubTier,
    quickChangeItemSubCategory,
    setCatalogManualPrice,
    resetCatalogAutoPrice,
    deleteCatalogItem
  } = useForgeLedgerContext();
  const { canEditRecipes } = useForgeAuth();

  const [sectionTab, setSectionTab] = useState('all'); // 'all' | 'sets'
  const [catFilter, setCatFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('All');
  const [manualOnly, setManualOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [inlineNewSubCat, setInlineNewSubCat] = useState('');

  const setsCount = useMemo(
    () => enrichedCatalog.filter((item) => (item.bundleItems || []).length > 0).length,
    [enrichedCatalog]
  );

  const manualCount = useMemo(
    () => enrichedCatalog.filter((item) => Boolean(item.useCustomPrice)).length,
    [enrichedCatalog]
  );

  const filteredItems = useMemo(() => {
    return enrichedCatalog.filter((item) => {
      const isSet = (item.bundleItems || []).length > 0;
      if (sectionTab === 'sets' && !isSet) return false;
      if (sectionTab === 'all' && catFilter !== 'All' && item.category !== catFilter) return false;
      if (sectionTab === 'all' && subFilter !== 'All' && (item.subCategory || '') !== subFilter) {
        return false;
      }
      if (manualOnly && !item.useCustomPrice) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTier = (item.subCategory || '').toLowerCase().includes(q);
        if (!matchesName && !matchesTier) return false;
      }
      return true;
    });
  }, [enrichedCatalog, sectionTab, catFilter, subFilter, manualOnly, search]);

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
      {/* Top Section Bar: All Recipes vs Dedicated Sets & Kits */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setSectionTab('all')}
            className={`px-3.5 py-1.5 rounded font-semibold cursor-pointer ${
              sectionTab === 'all'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Recipes ({enrichedCatalog.length})
          </button>
          <button
            type="button"
            onClick={() => setSectionTab('sets')}
            className={`px-3.5 py-1.5 rounded font-semibold flex items-center gap-1.5 cursor-pointer ${
              sectionTab === 'sets'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sets &amp; Kits ({setsCount})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {manualCount > 0 && (
            <label className="flex items-center gap-1.5 text-[11px] text-amber-300 cursor-pointer">
              <input
                type="checkbox"
                checked={manualOnly}
                onChange={(e) => setManualOnly(e.target.checked)}
                className="accent-amber-500"
              />
              <span>Manual prices ({manualCount})</span>
            </label>
          )}
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={sectionTab === 'sets' ? 'Search sets...' : 'Filter recipes...'}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Category & Tier Filter Bar (for All Recipes section) */}
      {sectionTab === 'all' && (
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCatFilter(cat);
                  setSubFilter('All');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                  catFilter === cat
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
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
                    <button
                      type="button"
                      onClick={() => setSubFilter(tier)}
                      className="cursor-pointer"
                    >
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
        </>
      )}

      {/* Empty State (especially helpful for Sets & Kits) */}
      {filteredItems.length === 0 ? (
        <div className="py-10 text-center space-y-2.5 border border-dashed border-zinc-800 rounded-xl">
          {sectionTab === 'sets' ? (
            <>
              <Layers className="w-7 h-7 text-amber-400/70 mx-auto" />
              <p className="text-xs font-semibold text-zinc-200">
                {setsCount === 0
                  ? 'No Armor Sets or Kits created yet'
                  : 'No sets match your search.'}
              </p>
              <p className="text-[11px] text-zinc-500 max-w-md mx-auto">
                Bundle multiple weapons, shields, or armor pieces into a single Set with automatic
                combined costing — or set a custom manual bundle price.
              </p>
              {canEditRecipes && setsCount === 0 && (
                <button
                  type="button"
                  onClick={onCreateNewSet}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Your First Set</span>
                </button>
              )}
            </>
          ) : (
            <p className="text-xs text-zinc-500">No catalog recipes match your filter.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
          {filteredItems.map((item) => {
            const isSet = (item.bundleItems || []).length > 0;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl bg-zinc-950/75 border flex flex-wrap items-center justify-between gap-3 transition-colors ${
                  isSet
                    ? 'border-amber-500/30 hover:border-amber-500/50'
                    : 'border-zinc-800/90 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {isSet && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                        Set
                      </span>
                    )}
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

                  {isSet ? (
                    <div className="flex flex-wrap gap-1">
                      {item.bundleItems.map((p) => {
                        const child = catalogItems.find((c) => c.id === p.itemId);
                        return (
                          <span
                            key={p.itemId}
                            className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300"
                          >
                            {p.qty}× {child?.name || p.itemId}
                          </span>
                        );
                      })}
                      {(item.recipe || []).map((r) => (
                        <span
                          key={r.materialId}
                          className="px-1.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/70 text-[10px] text-zinc-400"
                        >
                          +{r.qty}× {materialMap[r.materialId]?.name || r.materialId}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-400 truncate">
                      {(item.recipe || []).length > 0
                        ? item.recipe
                            .map((r) => `${r.qty}× ${materialMap[r.materialId]?.name || r.materialId}`)
                            .join(' + ')
                        : 'No smelting/forging recipe assigned'}
                    </div>
                  )}
                </div>

                {/* Cost + Inline Manual Price Control + Actions */}
                <div className="flex items-center gap-2.5 ml-auto shrink-0">
                  <div className="text-right text-[11px] tabular-nums">
                    <div className="text-zinc-500">
                      Cost: <strong className="text-zinc-300">{item.materialCost}g</strong>
                    </div>
                    {canEditRecipes ? (
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        {item.useCustomPrice ? (
                          <button
                            type="button"
                            onClick={() => resetCatalogAutoPrice(item.id)}
                            title={`Manual price active — click to reset to auto (${item.calculatedPrice}g)`}
                            className="p-0.5 rounded text-amber-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[9px] uppercase font-bold text-zinc-500">Auto</span>
                        )}
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            value={item.sellPrice}
                            onChange={(e) => setCatalogManualPrice(item.id, e.target.value)}
                            title={
                              item.useCustomPrice
                                ? `Manual price (Auto would be ${item.calculatedPrice}g)`
                                : 'Type to manually adjust sell price'
                            }
                            className={`w-16 pl-1.5 pr-4 py-0.5 rounded text-right text-xs font-bold focus:outline-none ${
                              item.useCustomPrice
                                ? 'bg-amber-500/15 border border-amber-500/60 text-amber-200'
                                : 'bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 text-amber-300'
                            }`}
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
                            g
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-amber-300 font-bold">Sell: {item.sellPrice}g</div>
                    )}
                  </div>

                  {canEditRecipes && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditItem({ ...item })}
                        title="Edit Recipe, Set Pieces & Price"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-300 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <ConfirmDeleteButton
                        onConfirm={() => deleteCatalogItem(item.id)}
                        title={`Delete ${item.name}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
