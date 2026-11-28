import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  Minus,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';
import StockTrendChart from './StockTrendChart';
import VaultQuickAdd from './VaultQuickAdd';
import SmeltBatchModal from './SmeltBatchModal';

export default function StockTab({ onOpenSmeltRecipes }) {
  const {
    materialCategories,
    categories,
    resolvedMaterials,
    smeltableVaultIngots,
    enrichedCatalog,
    recalculateIngotCosts,
    updateMaterialBuyPrice,
    adjustMaterialStock,
    setMaterialStockDirect,
    deleteMaterial,
    adjustCatalogStock,
    setCatalogStockDirect
  } = useForgeLedgerContext();
  const { canEditStock } = useForgeAuth();

  const [stockSubTab, setStockSubTab] = useState('materials');
  const [materialCatFilter, setMaterialCatFilter] = useState('All');
  const [finishedCatFilter, setFinishedCatFilter] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [inStockWaresOnly, setInStockWaresOnly] = useState(false);
  const [search, setSearch] = useState('');

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showTrendPanel, setShowTrendPanel] = useState(false);
  const [smeltModalIngotId, setSmeltModalIngotId] = useState(null);

  const smeltableIdSet = useMemo(
    () => new Set(smeltableVaultIngots.map((m) => m.id)),
    [smeltableVaultIngots]
  );

  const vaultSummary = useMemo(() => {
    const totalMatUnits = resolvedMaterials.reduce((s, m) => s + (Number(m.stock) || 0), 0);
    const lowCount = resolvedMaterials.filter(
      (m) => (Number(m.stock) || 0) <= (m.lowThreshold ?? 5)
    ).length;
    const readyWaresUnits = enrichedCatalog.reduce((s, c) => s + (Number(c.stock) || 0), 0);
    return { totalMatUnits, lowCount, readyWaresUnits };
  }, [resolvedMaterials, enrichedCatalog]);

  const visibleMaterialCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return materialCategories
      .filter((cat) => materialCatFilter === 'All' || cat === materialCatFilter)
      .map((cat) => {
        const items = resolvedMaterials.filter((m) => {
          if (m.category !== cat) return false;
          if (lowStockOnly && (Number(m.stock) || 0) > (m.lowThreshold ?? 5)) return false;
          if (q && !m.name.toLowerCase().includes(q)) return false;
          return true;
        });
        return { cat, items };
      })
      .filter((g) => g.items.length > 0);
  }, [materialCategories, materialCatFilter, resolvedMaterials, lowStockOnly, search]);

  const filteredFinishedWares = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enrichedCatalog.filter((item) => {
      if (finishedCatFilter !== 'All' && item.category !== finishedCatFilter) return false;
      if (inStockWaresOnly && (Number(item.stock) || 0) <= 0) return false;
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !(item.subCategory || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [enrichedCatalog, finishedCatFilter, inStockWaresOnly, search]);

  return (
    <div className="space-y-3.5">
      {/* Compact Vault Summary & Action Toolbar */}
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
            <strong className="text-zinc-100">{vaultSummary.totalMatUnits.toLocaleString()}</strong>{' '}
            <span className="text-zinc-500">vault units</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setStockSubTab('materials');
              setLowStockOnly((prev) => !prev);
            }}
            title="Click to toggle Low Stock filter"
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-colors ${
              lowStockOnly && stockSubTab === 'materials'
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-semibold'
                : 'bg-zinc-950 border-zinc-800 text-amber-300 hover:border-amber-500/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              <strong>{vaultSummary.lowCount}</strong> low stock
            </span>
          </button>
          <div className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
            <strong className="text-emerald-300">{vaultSummary.readyWaresUnits}</strong>{' '}
            <span className="text-zinc-500">ready wares</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {canEditStock && (
            <>
              <button
                type="button"
                onClick={() =>
                  setSmeltModalIngotId(smeltableVaultIngots[0]?.id || 'mat_iron_ingot')
                }
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Smelt Ingots</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddPanel((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                  showAddPanel
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Resource</span>
              </button>
              <button
                type="button"
                onClick={recalculateIngotCosts}
                title="Sync smelted ingot costs from current ore & fuel prices"
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sync Costs</span>
              </button>
              <button
                type="button"
                onClick={onOpenSmeltRecipes}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer"
              >
                Recipes
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setShowTrendPanel((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
              showTrendPanel
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trend</span>
          </button>
        </div>
      </div>

      {/* Optional Collapsible Drawers */}
      {showAddPanel && canEditStock && (
        <VaultQuickAdd onClose={() => setShowAddPanel(false)} />
      )}
      {showTrendPanel && <StockTrendChart onClose={() => setShowTrendPanel(false)} />}

      {/* Main Inventory Card */}
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setStockSubTab('materials')}
              className={`px-3.5 py-1.5 rounded font-semibold cursor-pointer ${
                stockSubTab === 'materials'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ores, Ingots &amp; Fuel ({resolvedMaterials.length})
            </button>
            <button
              type="button"
              onClick={() => setStockSubTab('finished')}
              className={`px-3.5 py-1.5 rounded font-semibold cursor-pointer ${
                stockSubTab === 'finished'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Finished Wares ({enrichedCatalog.length})
            </button>
          </div>

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={
              stockSubTab === 'materials'
                ? 'Search ores, ingots, fuel...'
                : 'Search finished wares...'
            }
            className="w-full sm:w-72"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          {stockSubTab === 'materials' ? (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', ...materialCategories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMaterialCatFilter(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      materialCatFilter === cat
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowStockOnly}
                  onChange={(e) => setLowStockOnly(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Low stock only</span>
              </label>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFinishedCatFilter(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      finishedCatFilter === cat
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockWaresOnly}
                  onChange={(e) => setInStockWaresOnly(e.target.checked)}
                  className="accent-emerald-500"
                />
                <span>In stock only</span>
              </label>
            </>
          )}
        </div>

        {/* Inventory Lists */}
        {stockSubTab === 'materials' ? (
          visibleMaterialCategories.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No vault materials match your current filter.
            </div>
          ) : (
            <div className="space-y-4">
              {visibleMaterialCategories.map(({ cat, items }) => (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-zinc-400">
                    <span>{cat}</span>
                    <span className="text-zinc-500 font-medium">{items.length}</span>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {items.map((mat) => {
                      const isLow = (Number(mat.stock) || 0) <= (mat.lowThreshold ?? 5);
                      const isSmeltable = smeltableIdSet.has(mat.id);
                      return (
                        <div
                          key={mat.id}
                          className="px-3 py-2 rounded-lg bg-zinc-950/75 border border-zinc-800/80 hover:border-zinc-700/90 flex flex-wrap items-center justify-between gap-2 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isLow ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            />
                            <span className="text-xs font-semibold text-zinc-100 truncate">
                              {mat.name}
                            </span>
                            {isSmeltable && canEditStock && (
                              <button
                                type="button"
                                onClick={() => setSmeltModalIngotId(mat.id)}
                                title={`Smelt ${mat.name}`}
                                className="px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/35 text-[10px] font-semibold text-amber-300 flex items-center gap-0.5 cursor-pointer shrink-0"
                              >
                                <Flame className="w-2.5 h-2.5" />
                                <span>Smelt</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 ml-auto">
                            {/* Buy / Auto-Smelt Cost */}
                            <div className="flex items-center gap-1 text-xs text-zinc-400">
                              {mat.isAutoSmeltedCost ? (
                                <span
                                  title="Auto-calculated from ore & fuel prices"
                                  className="px-2 py-0.5 rounded bg-zinc-900 border border-amber-500/35 text-amber-300 font-bold text-[11px]"
                                >
                                  {mat.buyPrice}g
                                </span>
                              ) : canEditStock ? (
                                <div className="relative">
                                  <input
                                    type="number"
                                    min="0"
                                    value={mat.buyPrice}
                                    onChange={(e) =>
                                      updateMaterialBuyPrice(mat.id, e.target.value)
                                    }
                                    title="Unit buy price (gold)"
                                    className="w-14 pl-1.5 pr-4 py-0.5 rounded bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 text-zinc-200 font-medium text-xs text-right focus:outline-none"
                                  />
                                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
                                    g
                                  </span>
                                </div>
                              ) : (
                                <span className="text-zinc-200 font-semibold">
                                  {mat.buyPrice}g
                                </span>
                              )}
                            </div>

                            {/* Stock Controls (-5, -1, input, +1, +5) */}
                            <div className="flex items-center gap-1">
                              {canEditStock && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => adjustMaterialStock(mat.id, -5)}
                                    title="Subtract 5"
                                    className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                                  >
                                    -5
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => adjustMaterialStock(mat.id, -1)}
                                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                              <input
                                type="number"
                                min="0"
                                disabled={!canEditStock}
                                value={mat.stock}
                                onChange={(e) => setMaterialStockDirect(mat.id, e.target.value)}
                                className="w-12 py-0.5 px-1 rounded bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 text-center text-xs font-bold text-zinc-100 focus:outline-none"
                              />
                              {canEditStock && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => adjustMaterialStock(mat.id, 1)}
                                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => adjustMaterialStock(mat.id, 5)}
                                    title="Add 5"
                                    className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                                  >
                                    +5
                                  </button>
                                </>
                              )}
                            </div>

                            {canEditStock && (
                              <button
                                type="button"
                                onClick={() => deleteMaterial(mat.id)}
                                title="Remove material"
                                className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-950/50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : filteredFinishedWares.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No finished wares match your current filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {filteredFinishedWares.map((item) => (
              <div
                key={item.id}
                className="px-3 py-2 rounded-lg bg-zinc-950/75 border border-zinc-800/80 hover:border-zinc-700/90 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-100 truncate">{item.name}</div>
                  <div className="text-[11px] text-zinc-500">
                    {item.category}
                    {item.subCategory ? ` • ${item.subCategory}` : ''} •{' '}
                    <span className="text-amber-300 font-semibold">{item.sellPrice}g</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {canEditStock && (
                    <button
                      type="button"
                      onClick={() => adjustCatalogStock(item.id, -1)}
                      className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  )}
                  <input
                    type="number"
                    min="0"
                    disabled={!canEditStock}
                    value={item.stock}
                    onChange={(e) => setCatalogStockDirect(item.id, e.target.value)}
                    className="w-12 py-0.5 px-1 rounded bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 text-center text-xs font-bold text-zinc-100 focus:outline-none"
                  />
                  {canEditStock && (
                    <button
                      type="button"
                      onClick={() => adjustCatalogStock(item.id, 1)}
                      className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {smeltModalIngotId && canEditStock && (
        <SmeltBatchModal
          initialIngotId={smeltModalIngotId}
          onClose={() => setSmeltModalIngotId(null)}
        />
      )}
    </div>
  );
}
