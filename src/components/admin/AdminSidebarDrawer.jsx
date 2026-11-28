import React, { useRef } from 'react';
import { Download, RotateCcw, Upload, Users, X } from 'lucide-react';
import {
  useForgeAuth,
  useForgeLedgerContext,
  useForgeToast
} from '../../context/ForgeContext';
import { downloadFullBackupJson } from '../../utils/exportImport';
import WuuthradBannerIcon from '../common/WuuthradBannerIcon';

export default function AdminSidebarDrawer({
  onClose,
  onOpenUsersModal,
  onOpenExportModal,
  onOpenResetModal
}) {
  const { managedUsers, ledgerSnapshot, applyLedgerData } = useForgeLedgerContext();
  const { effectiveAdminUnlocked } = useForgeAuth();
  const { showToast } = useForgeToast();
  const backupFileInputRef = useRef(null);

  if (!effectiveAdminUnlocked) return null;

  const handleDownloadBackup = () => {
    downloadFullBackupJson(ledgerSnapshot);
    showToast('Downloaded full Skyforge backup (.json)!');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result || '{}');
        applyLedgerData(parsed);
        showToast('Backup restored successfully!');
      } catch {
        showToast('Could not read backup file. Ensure it is a valid Skyforge .json save.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-[#141417] border-l border-zinc-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <WuuthradBannerIcon className="w-7 h-7" />
              <div>
                <h3 className="text-sm font-serif font-bold text-amber-200">
                  Master Admin Sidebar
                </h3>
                <p className="text-[11px] text-zinc-500">Keeper of the Skyforge</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Guild Users &amp; Permissions
            </h4>
            <p className="text-xs text-zinc-500">
              Add users with their own login and assign Guest, Smith, Harbinger, or Admin roles
              &amp; permissions.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUsersModal();
              }}
              className="w-full py-2.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Manage Users &amp; Roles ({managedUsers.length})</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Full Forge Backup &amp; Restore
            </h4>
            <p className="text-xs text-zinc-500">
              Save all prices, recipes, stock, orders, deliveries, user accounts, and trend history
              to a single .json file.
            </p>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full py-2.5 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Save Full Backup (.json)</span>
            </button>

            <input
              ref={backupFileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => backupFileInputRef.current?.click()}
              className="w-full py-2.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Restore from Backup (.json)</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Ledger Spreadsheet
            </h4>
            <button
              type="button"
              onClick={onOpenExportModal}
              className="w-full py-2.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Spreadsheet (.csv)</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Danger Zone</h4>
            <button
              type="button"
              onClick={onOpenResetModal}
              className="w-full py-2.5 px-3.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-red-500/40 text-red-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Forge to Clean Slate</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
        >
          Close Sidebar
        </button>
      </div>
    </div>
  );
}
