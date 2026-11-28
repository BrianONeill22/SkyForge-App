import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForgeLedgerContext } from '../../context/ForgeContext';

export default function PublicSaleModal({ item, onClose }) {
  const { recordQuickPublicSale } = useForgeLedgerContext();
  const [customer, setCustomer] = useState('');
  const [qty, setQty] = useState(1);
  const [deductStock, setDeductStock] = useState(true);
  const [deductMaterials, setDeductMaterials] = useState(true);

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
            <h3 className="text-base font-serif font-bold text-amber-200">Record Sale</h3>
            <p className="text-xs text-zinc-400">
              Logs this sale to your ledger and deducts from your vault.
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
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block text-zinc-400 mb-1">Buyer Name</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. Walk-in Traveler"
                autoFocus
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={deductStock}
                onChange={(e) => setDeductStock(e.target.checked)}
                className="accent-amber-500"
              />
              <span>Use finished armory stock first</span>
            </label>
            <label className="flex items-center gap-2 text-emerald-300 cursor-pointer">
              <input
                type="checkbox"
                checked={deductMaterials}
                onChange={(e) => setDeductMaterials(e.target.checked)}
                className="accent-emerald-500"
              />
              <span>Deduct recipe materials from vault</span>
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
            Log Sale &amp; Deduct Vault
          </button>
        </div>
      </form>
    </div>
  );
}
