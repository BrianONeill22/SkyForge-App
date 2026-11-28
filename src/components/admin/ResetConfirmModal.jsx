import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useForgeLedgerContext } from '../../context/ForgeContext';

export default function ResetConfirmModal({ onClose, onAfterReset }) {
  const { resetForgeToCleanSlate } = useForgeLedgerContext();

  const handleConfirm = () => {
    resetForgeToCleanSlate();
    onClose();
    onAfterReset?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#18181b] border border-red-500/40 rounded-xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-serif font-bold">Reset Forge to Clean Slate?</h3>
        </div>
        <p className="text-xs text-zinc-300">
          This will clear all prices, stock counts, sales, purchases, orders, deliveries, and trend
          history back to zero. Make sure you have saved a .json backup first if you want to keep
          your records.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
          >
            Confirm Clean Reset
          </button>
        </div>
      </div>
    </div>
  );
}
