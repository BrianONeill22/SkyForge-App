import React, { useState, useMemo, useRef } from 'react';
import { Minus, Plus, Search, Trash2, X } from 'lucide-react';
import { useForgeLedgerContext, useForgeToast } from '../../../context/ForgeContext';
import { createId } from '../../../utils/formatters';
import Modal from '../../common/Modal';
import CustomSaleItemBuilder from './CustomSaleItemBuilder';

export default function RecordSaleModal({ onClose }) {
  const { enrichedCatalog, categories, sales, recordSaleLines } = useForgeLedgerContext();
  const { showToast } = useForgeToast();

  const [mode, setMode] = useState('catalog');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [customer, setCustomer] = useState('');
  const [deductStock, setDeductStock] = useState(true);
  const [deductMaterials, setDeductMaterials] = useState(true);
  const [cart, setCart] = useState([]);

  const customDraftGetterRef = useRef(null);

  const recentBuyers = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const s of sales) {
      const name = (s.customer || '').trim();
      if (!name || name === 'Walk-in Traveler' || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      list.push(name);
      if (list.length >= 5) break;
    }
    return list;
  }, [sales]);

  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enrichedCatalog.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subCategory || '').toLowerCase().includes(q)
      );
    });
  }, [enrichedCatalog, categoryFilter, search]);

  const cartQtyByItemId = useMemo(() => {
    const map = {};
    cart.forEach((line) => {
      if (line.mode === 'existing' && line.itemId) {
        map[line.itemId] = (map[line.itemId] || 0) + line.qty;
      }
    });
    return map;
  }, [cart]);

  const totals = useMemo(() => {
    return cart.reduce(
      (acc, l) => {
        const rev = l.unitSell * l.qty;
        const prof = (l.unitSell - l.unitCost) * l.qty;
        return {
          units: acc.units + l.qty,
          revenue: acc.revenue + rev,
          profit: acc.profit + prof
        };
      },
      { units: 0, revenue: 0, profit: 0 }
    );
  }, [cart]);

  const handleQuickAddCatalogItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.mode === 'existing' && l.itemId === item.id);
      if (existing) {
        return prev.map((l) =>
          l.lineId === existing.lineId ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [
        ...prev,
        {
          lineId: createId('sline'),
          mode: 'existing',
          itemId: item.id,
          itemName: item.name,
          category: item.category,
          subCategory: item.subCategory || '',
          qty: 1,
          unitSell: item.sellPrice,
          unitCost: item.materialCost,
          totalMaterialsMap: item.totalMaterialsMap || {}
        }
      ];
    });
  };

  const handleStepLineQty = (lineId, delta) => {
    setCart((prev) =>
      prev
        .map((l) => (l.lineId === lineId ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const handleSetLineQty = (lineId, rawVal) => {
    const qty = Math.max(1, Math.floor(Number(rawVal) || 1));
    setCart((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, qty } : l)));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim() && filteredCatalog.length > 0) {
      e.preventDefault();
      handleQuickAddCatalogItem(filteredCatalog[0]);
      setSearch('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const customDraft = mode === 'custom' ? customDraftGetterRef.current?.() : null;
    const lines = customDraft ? [...cart, customDraft] : [...cart];
    if (lines.length === 0) {
      showToast('Click any item on the left to add it to the sale.', 'error');
      return;
    }
    const ok = recordSaleLines({
      lines,
      customer,
      deductStock,
      deductMaterials
    });
    if (ok) onClose();
  };

  return (
    <Modal
      title="Quick Sale"
      subtitle="Click wares to add them instantly — adjust quantities right on the ticket."
      maxWidthClass="max-w-4xl"
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1 min-h-0"
      >
        {/* LEFT COLUMN: Instant Item Picker */}
        <div className="lg:col-span-7 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col gap-3 overflow-y-auto max-h-[55vh] lg:max-h-[75vh]">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setMode('catalog')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                  mode === 'catalog'
                    ? 'bg-amber-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Catalog Wares
              </button>
              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                  mode === 'custom'
                    ? 'bg-amber-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                + Custom Item
              </button>
            </div>
            {mode === 'catalog' && (
              <span className="text-[11px] text-zinc-500">Click to add • Enter adds top match</span>
            )}
          </div>

          {mode === 'catalog' ? (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search sword, armor, ingot..."
                  autoFocus
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      categoryFilter === cat
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredCatalog.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-500">
                  No catalog wares match &ldquo;{search}&rdquo;.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1">
                  {filteredCatalog.map((item) => {
                    const inCartQty = cartQtyByItemId[item.id] || 0;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleQuickAddCatalogItem(item)}
                        className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer group ${
                          inCartQty > 0
                            ? 'bg-amber-500/10 border-amber-500/50 hover:bg-amber-500/15'
                            : 'bg-zinc-950/75 border-zinc-800/90 hover:border-amber-500/40 hover:bg-zinc-900/90'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-zinc-100 truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            {item.subCategory && (
                              <span className="text-amber-300/80">{item.subCategory}</span>
                            )}
                            <span
                              className={item.stock > 0 ? 'text-emerald-400' : 'text-zinc-500'}
                            >
                              {item.stock > 0 ? `${item.stock} ready` : 'To order'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs font-bold text-amber-300">{item.sellPrice}g</span>
                          {inCartQty > 0 ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 font-bold text-[10px]">
                              ×{inCartQty}
                            </span>
                          ) : (
                            <span className="p-1 rounded bg-zinc-900 group-hover:bg-amber-500 group-hover:text-zinc-950 text-zinc-400 transition-colors">
                              <Plus className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <CustomSaleItemBuilder
              onAddCustomLine={(line) => setCart((prev) => [...prev, line])}
              onDraftChange={(getter) => {
                customDraftGetterRef.current = getter;
              }}
            />
          )}
        </div>

        {/* RIGHT COLUMN: Live Sale Ticket */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-zinc-950/50 flex flex-col justify-between gap-4 overflow-y-auto max-h-[45vh] lg:max-h-[75vh]">
          <div className="space-y-3">
            {/* Buyer Name + Quick Recent Buyer Pills */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Buyer (Optional)
              </label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Walk-in Traveler"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
              />
              {recentBuyers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {recentBuyers.map((buyer) => (
                    <button
                      key={buyer}
                      type="button"
                      onClick={() => setCustomer(buyer)}
                      className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer transition-colors ${
                        customer === buyer
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {buyer}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ticket Line Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                <span>Sale Ticket ({totals.units} {totals.units === 1 ? 'item' : 'items'})</span>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="text-zinc-500 hover:text-red-400 normal-case font-medium cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
                  Click any ware on the left to start building this sale.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {cart.map((line) => (
                    <div
                      key={line.lineId}
                      className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-zinc-100 truncate">{line.itemName}</div>
                        <div className="text-[10px] text-zinc-500">
                          {line.unitSell}g each • Cost {line.unitCost}g
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStepLineQty(line.lineId, -1)}
                          className="p-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={line.qty}
                          onChange={(e) => handleSetLineQty(line.lineId, e.target.value)}
                          className="w-10 py-0.5 text-center rounded bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleStepLineQty(line.lineId, 1)}
                          className="p-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[48px] shrink-0">
                        <div className="font-bold text-amber-300">
                          {line.unitSell * line.qty}g
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCart((prev) => prev.filter((x) => x.lineId !== line.lineId))
                        }
                        title="Remove"
                        className="p-1 rounded text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer: Toggles + Totals + Submit */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
              <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deductStock}
                  onChange={(e) => setDeductStock(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Use armory stock first</span>
              </label>
              <label className="flex items-center gap-1.5 text-emerald-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deductMaterials}
                  onChange={(e) => setDeductMaterials(e.target.checked)}
                  className="accent-emerald-500"
                />
                <span>Deduct materials</span>
              </label>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Total Revenue
                </div>
                <div className="text-base font-serif font-bold text-amber-300">
                  +{totals.revenue.toLocaleString()}g
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Net Profit
                </div>
                <div className="text-sm font-bold text-emerald-400">
                  +{totals.profit.toLocaleString()}g
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer transition-colors"
              >
                {cart.length > 0
                  ? `Complete Sale • ${totals.revenue.toLocaleString()}g`
                  : 'Complete Sale'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
