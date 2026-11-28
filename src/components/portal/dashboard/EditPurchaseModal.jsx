import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForgeLedgerContext } from '../../../context/ForgeContext';

export default function EditPurchaseModal({ purchase, onClose }) {
  const { updatePurchase } = useForgeLedgerContext();
  const [draft, setDraft] = useState({ ...purchase });

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePurchase(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <form
        onSubmit={handleSubmit}
        className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-base font-serif font-bold text-emerald-300">Edit Purchase Entry</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Item Purchased</label>
            <input
              type="text"
              value={draft.itemName}
              onChange={(e) => setDraft({ ...draft, itemName: e.target.value })}
              className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-zinc-400 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={draft.qty}
                onChange={(e) => setDraft({ ...draft, qty: e.target.value })}
                className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Unit Cost Paid (g)</label>
              <input
                type="number"
                min="0"
                value={draft.unitCost}
                onChange={(e) => setDraft({ ...draft, unitCost: e.target.value })}
                className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-red-300 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-zinc-400 mb-1">Seller / Supplier</label>
              <input
                type="text"
                value={draft.supplier}
                onChange={(e) => setDraft({ ...draft, supplier: e.target.value })}
                className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Date</label>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
