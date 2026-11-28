import React, { useState, useMemo, useRef } from 'react';
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

  const tableContainerRef = useRef(null);

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

  const categoryCounts = useMemo(() => {
    const counts = {};
    resolvedMaterials.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [resolvedMaterials]);

  // Show Raw Ore & Fuel before Smelted Ingots when filling out "All" so prices flow naturally
  const orderedMaterialCategories = useMemo(() => {
    const priority = ['Raw Ore', 'Fuel', 'Leather & Pelts', 'Dwemer Scrap & Gems', 'Smelted Ingots'];
    return [...materialCategories].sort((a, b) => {
      const ia = priority.indexOf(a);
      const ib = priority.indexOf(b);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [materialCategories]);

  const visibleMaterialGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orderedMaterialCategories
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
  }, [orderedMaterialCategories, materialCatFilter, resolvedMaterials, lowStockOnly, search]);

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

  // Spreadsheet-style Enter / ArrowDown / ArrowUp navigation within the same column
  const handleCellKeyDown = (e, colName) => {
    if (e.key !== 'Enter' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const container = tableContainerRef.current;
    if (!container) return;
    const inputs = Array.from(container.querySelectorAll(`input[data-vault-col="${colName}"]`));
    const currentIdx = inputs.indexOf(e.currentTarget);
    if (currentIdx === -1) return;
    const nextIdx = e.key === 'ArrowUp' ? currentIdx - 1 : currentIdx + 1;
    const target = inputs[nextIdx];
    if (target) {
      target.focus();
      target.select();
    }
  };

  const handleSelectOnFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="space-y-3.5">
      {/* Compact Vault Summary & Action Toolbar */}
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
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

      {/* Collapsible Secondary Panels */}
      {showAddPanel && canEditStock && (
        <VaultQuickAdd onClose={() => setShowAddPanel(false)} />
      )}
      {showTrendPanel && <StockTrendChart onClose={() => setShowTrendPanel(false)} />}

      {/* Main Fast-Entry Inventory Sheet */}
      <div
        ref={tableContainerRef}
        className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5"
      >
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

        {/* Category Pills + Quick-Entry Hint */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          {stockSubTab === 'materials' ? (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMaterialCatFilter('All')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                    materialCatFilter === 'All'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  All ({resolvedMaterials.length})
                </button>
                {orderedMaterialCategories.map((cat) => (
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
                    {cat}{' '}
                    <span className="opacity-60 tabular-nums">({categoryCounts[cat] || 0})</span>
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

        {canEditStock && (
          <div className="px-3 py-1.5 rounded-lg bg-zinc-950/70 border border-zinc-800/70 text-[11px] text-zinc-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong className="text-amber-300">Fast Entry:</strong> Click any price or stock box
              to replace it right away — press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-200 font-mono">
                Enter
              </kbd>{' '}
              or{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-200 font-mono">
                ↑ / ↓
              </kbd>{' '}
              to jump straight down the column.
            </span>
            {stockSubTab === 'materials' && (
              <span className="text-zinc-500">
                Fill Raw Ore &amp; Fuel prices first — Smelted Ingot costs update automatically.
              </span>
            )}
          </div>
        )}

        {/* MATERIALS SPREADSHEET VIEW */}
        {stockSubTab === 'materials' ? (
          visibleMaterialGroups.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              No vault materials match your current filter.
            </div>
          ) : (
            <div className="space-y-4">
              {visibleMaterialGroups.map(({ cat, items }) => {
                const groupUnits = items.reduce((s, m) => s + (Number(m.stock) || 0), 0);
                return (
                  <div
                    key={cat}
                    className="rounded-xl border border-zinc-800/90 bg-zinc-950/40 overflow-hidden"
                  >
                    {/* Group Header + Column Labels */}
                    <div className="px-3.5 py-2 bg-zinc-900/70 border-b border-zinc-800/90 grid grid-cols-12 gap-2 items-center text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                      <div className="col-span-5 sm:col-span-5 flex items-center gap-2">
                        <span className="text-amber-200">{cat}</span>
                        <span className="text-zinc-500 font-normal normal-case tabular-nums">
                          ({groupUnits} units)
                        </span>
                      </div>
                      <div className="col-span-3 sm:col-span-3 text-right pr-1">
                        {cat === 'Smelted Ingots' ? 'Smelt Cost' : 'Buy Price'}
                      </div>
                      <div className="col-span-4 sm:col-span-4 text-right pr-7">Vault Stock</div>
                    </div>

                    {/* Crisp Aligned Rows */}
                    <div className="divide-y divide-zinc-800/60">
                      {items.map((mat) => {
                        const isLow = (Number(mat.stock) || 0) <= (mat.lowThreshold ?? 5);
                        const isSmeltable = smeltableIdSet.has(mat.id);

                        return (
                          <div
                            key={mat.id}
                            className="px-3.5 py-2 grid grid-cols-12 gap-2 items-center hover:bg-zinc-900/60 transition-colors"
                          >
                            {/* Name + Status + Smelt Shortcut */}
                            <div className="col-span-5 sm:col-span-5 flex items-center gap-2 min-w-0">
                              <span
                                title={
                                  isLow
                                    ? `Low stock (≤ ${mat.lowThreshold ?? 5})`
                                    : 'Stock level healthy'
                                }
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
                                  tabIndex={-1}
                                  onClick={() => setSmeltModalIngotId(mat.id)}
                                  title={`Smelt ${mat.name}`}
                                  className="px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/35 text-[10px] font-semibold text-amber-300 flex items-center gap-0.5 cursor-pointer shrink-0"
                                >
                                  <Flame className="w-2.5 h-2.5" />
                                  <span className="hidden sm:inline">Smelt</span>
                                </button>
                              )}
                            </div>

                            {/* Buy Price Column */}
                            <div className="col-span-3 sm:col-span-3 flex justify-end">
                              {mat.isAutoSmeltedCost ? (
                                <span
                                  title="Auto-calculated from ore & fuel prices"
                                  className="px-2.5 py-1 rounded-md bg-zinc-900/90 border border-amber-500/30 text-amber-300 font-bold text-xs tabular-nums"
                                >
                                  {mat.buyPrice}g{' '}
                                  <span className="text-[9px] font-semibold uppercase text-zinc-500">
                                    Auto
                                  </span>
                                </span>
                              ) : canEditStock ? (
                                <div className="relative w-20">
                                  <input
                                    type="number"
                                    min="0"
                                    data-vault-col="price"
                                    value={mat.buyPrice}
                                    onFocus={handleSelectOnFocus}
                                    onKeyDown={(e) => handleCellKeyDown(e, 'price')}
                                    onChange={(e) =>
                                      updateMaterialBuyPrice(mat.id, e.target.value)
                                    }
                                    className="w-full pl-2 pr-5 py-1 rounded-md bg-zinc-900 border border-zinc-800 focus:border-amber-500 focus:bg-zinc-950 text-zinc-100 font-semibold text-xs text-right tabular-nums focus:outline-none transition-colors"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 pointer-events-none">
                                    g
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-semibold text-zinc-200 tabular-nums">
                                  {mat.buyPrice}g
                                </span>
                              )}
                            </div>

                            {/* Vault Stock Column + Quick Stepper + Delete */}
                            <div className="col-span-4 sm:col-span-4 flex items-center justify-end gap-1">
                              {canEditStock && (
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  onClick={() => adjustMaterialStock(mat.id, -1)}
                                  className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                              )}
                              <input
                                type="number"
                                min="0"
                                data-vault-col="mat-stock"
                                disabled={!canEditStock}
                                value={mat.stock}
                                onFocus={handleSelectOnFocus}
                                onKeyDown={(e) => handleCellKeyDown(e, 'mat-stock')}
                                onChange={(e) => setMaterialStockDirect(mat.id, e.target.value)}
                                className={`w-16 py-1 px-2 rounded-md border text-center text-xs font-bold tabular-nums focus:outline-none transition-colors ${
                                  isLow
                                    ? 'bg-amber-500/10 border-amber-500/40 focus:border-amber-400 text-amber-200'
                                    : 'bg-zinc-900 border-zinc-800 focus:border-amber-500 focus:bg-zinc-950 text-zinc-100'
                                }`}
                              />
                              {canEditStock && (
                                <>
                                  <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => adjustMaterialStock(mat.id, 1)}
                                    className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => adjustMaterialStock(mat.id, 10)}
                                    title="Add 10"
                                    className="hidden sm:inline-flex px-1.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-semibold text-zinc-400 hover:text-amber-200 cursor-pointer"
                                  >
                                    +10
                                  </button>
                                  <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => deleteMaterial(mat.id)}
                                    title="Remove material"
                                    className="p-1 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-950/50 ml-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : filteredFinishedWares.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            No finished wares match your current filter.
          </div>
        ) : (
          /* FINISHED WARES SPREADSHEET VIEW */
          <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/40 overflow-hidden">
            <div className="px-3.5 py-2 bg-zinc-900/70 border-b border-zinc-800/90 grid grid-cols-12 gap-2 items-center text-[10px] uppercase tracking-wider font-bold text-zinc-400">
              <div className="col-span-6">Finished Ware</div>
              <div className="col-span-2 text-right">Sell Price</div>
              <div className="col-span-4 text-right pr-2">Ready in Armory</div>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {filteredFinishedWares.map((item) => (
                <div
                  key={item.id}
                  className="px-3.5 py-2 grid grid-cols-12 gap-2 items-center hover:bg-zinc-900/60 transition-colors"
                >
                  <div className="col-span-6 min-w-0">
                    <div className="text-xs font-semibold text-zinc-100 truncate">{item.name}</div>
                    <div className="text-[10px] text-zinc-500">
                      {item.category}
                      {item.subCategory ? ` • ${item.subCategory}` : ''}
                    </div>
                  </div>

                  <div className="col-span-2 text-right text-xs font-bold text-amber-300 tabular-nums">
                    {item.sellPrice}g
                  </div>

                  <div className="col-span-4 flex items-center justify-end gap-1">
                    {canEditStock && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => adjustCatalogStock(item.id, -1)}
                        className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    )}
                    <input
                      type="number"
                      min="0"
                      data-vault-col="ware-stock"
                      disabled={!canEditStock}
                      value={item.stock}
                      onFocus={handleSelectOnFocus}
                      onKeyDown={(e) => handleCellKeyDown(e, 'ware-stock')}
                      onChange={(e) => setCatalogStockDirect(item.id, e.target.value)}
                      className={`w-16 py-1 px-2 rounded-md border text-center text-xs font-bold tabular-nums focus:outline-none transition-colors ${
                        item.stock > 0
                          ? 'bg-emerald-500/10 border-emerald-500/40 focus:border-emerald-400 text-emerald-200'
                          : 'bg-zinc-900 border-zinc-800 focus:border-amber-500 focus:bg-zinc-950 text-zinc-100'
                      }`}
                    />
                    {canEditStock && (
                      <>
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => adjustCatalogStock(item.id, 1)}
                          className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => adjustCatalogStock(item.id, 5)}
                          title="Add 5"
                          className="hidden sm:inline-flex px-1.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-semibold text-zinc-400 hover:text-emerald-200 cursor-pointer"
                        >
                          +5
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
