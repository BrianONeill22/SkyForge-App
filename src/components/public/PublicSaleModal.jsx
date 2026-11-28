import React, { useState, useMemo } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useForgeLedgerContext } from '../../context/ForgeContext';

export default function PublicSaleModal({ item, onClose }) {
  const { sales, recordQuickPublicSale } = useForgeLedgerContext();
  const [customer, setCustomer] = useState('');
  const [qty, setQty] = useState(1);
  const [deductStock, setDeductStock] = useState(true);
  const [deductMaterials, setDeductMaterials] = useState(true);

  const recentBuyers = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const s of sales) {
      const name = (s.customer || '').trim();
      if (!name || name === 'Walk-in Traveler' || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      list.push(name);
      if (list.length >= 4) break;
    }
    return list;
  }, [sales]);

  const parsedQty = Math.max(1, Number(qty) || 1);
  const totalRevenue = item.sellPrice * parsedQty;
  const totalProfit = (item.sellPrice - item.materialCost) * parsedQty;

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = recordQuickPublicSale({
      item,
      customer,
      qty: parsedQty,
      deductStock,
      deductMaterials
    });
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <form
        onSubmit={handleSubmit}
        className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-amber-200">Quick Sale</h3>
            <p className="text-xs text-zinc-400">
              Logs this sale and deducts from your vault automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/90 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
          <div>
            <div className="font-serif font-bold text-zinc-100">{item.name}</div>
            <div className="text-[11px] text-zinc-400">
              {item.category}
              {item.subCategory ? ` • ${item.subCategory}` : ''} • Ready: {item.stock}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-zinc-500">Unit Sell</div>
            <div className="font-bold text-amber-300">{item.sellPrice}g</div>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-12 gap-2.5 items-end">
            <div className="col-span-7">
              <label className="block text-zinc-400 mb-1">Buyer Name (Optional)</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Walk-in Traveler"
                autoFocus
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>
            <div className="col-span-5">
              <label className="block text-zinc-400 mb-1">Quantity</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, (Number(q) || 1) - 1))}
                  className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center text-zinc-100 font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => (Number(q) || 1) + 1)}
                  className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {recentBuyers.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recentBuyers.map((buyer) => (
                <button
                  key={buyer}
                  type="button"
                  onClick={() => setCustomer(buyer)}
                  className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                    customer === buyer
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {buyer}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px]">
            <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer">
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
              <span>Deduct recipe materials</span>
            </label>
          </div>

          <div className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400">Sale Revenue &amp; Profit:</span>
            <div className="text-right">
              <span className="font-bold text-amber-300 text-sm">
                +{totalRevenue.toLocaleString()}g
              </span>
              <span className="text-[11px] text-emerald-400 ml-2">
                (Profit: +{totalProfit.toLocaleString()}g)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            Complete Sale • {totalRevenue.toLocaleString()}g
          </button>
        </div>
      </form>
    </div>
  );
}
