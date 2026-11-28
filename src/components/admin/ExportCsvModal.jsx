import React from 'react';
import { useForgeLedgerContext, useForgeToast } from '../../context/ForgeContext';
import { downloadLedgerSpreadsheetCsv } from '../../utils/exportImport';

export default function ExportCsvModal({ onClose }) {
  const { resolvedMaterials, enrichedCatalog } = useForgeLedgerContext();
  const { showToast } = useForgeToast();

  const handleExport = () => {
    downloadLedgerSpreadsheetCsv(resolvedMaterials, enrichedCatalog);
    onClose();
    showToast('Exported Skyforge spreadsheet (.csv)!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4">
        <h3 className="text-base font-serif font-bold text-amber-200">
          Export Forge Spreadsheet (.csv)
        </h3>
        <p className="text-xs text-zinc-400">
          Download a spreadsheet containing all vault material buy prices, stock counts, We Buy
          offers, and public sell prices.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
