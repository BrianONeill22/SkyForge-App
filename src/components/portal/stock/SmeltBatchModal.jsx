import React, { useState, useMemo } from 'react';
import { Flame, Minus, Plus, X } from 'lucide-react';
import { useForgeLedgerContext } from '../../../context/ForgeContext';

export default function SmeltBatchModal({ initialIngotId, onClose }) {
  const { smeltableVaultIngots, materialMap, smeltBatch } = useForgeLedgerContext();
  const [ingotId, setIngotId] = useState(
    initialIngotId || smeltableVaultIngots[0]?.id || 'mat_iron_ingot'
  );
  const [qty, setQty] = useState(1);

  const selectedIngot =
    smeltableVaultIngots.find((m) => m.id === ingotId) || smeltableVaultIngots[0];
  const qtyNum = Math.max(1, Math.floor(Number(qty) || 1));
  const reqList = selectedIngot?.smeltRecipe || [];

  const maxSmeltable = useMemo(() => {
    if (!reqList.length) return 0;
    return reqList.reduce((minBars, req) => {
      const avail = Number(materialMap[req.materialId]?.stock) || 0;
      const possible = req.qty > 0 ? Math.floor(avail / req.qty) : 0;
      return Math.min(minBars, possible);
    }, Infinity);
  }, [reqList, materialMap]);

  const hasShortage = reqList.some((req) => {
    const mat = materialMap[req.materialId];
    return (Number(mat?.stock) || 0) < req.qty * qtyNum;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedIngot) return;
    const ok = smeltBatch(selectedIngot.id, qtyNum);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <form
        onSubmit={handleSubmit}
        className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-serif font-bold text-amber-200">Smelt Bars in Vault</h3>
          </div>
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
            <label className="block text-zinc-400 mb-1">Ingot to Smelt</label>
            <select
              value={selectedIngot?.id || ''}
              onChange={(e) => {
                setIngotId(e.target.value);
                setQty(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
            >
              {smeltableVaultIngots.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} (In Vault: {ing.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
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
                className="w-16 px-2 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center text-amber-300 font-bold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQty((q) => (Number(q) || 1) + 1)}
                className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {[5, 10].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => setQty((q) => (Number(q) || 0) + inc)}
                  className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-semibold text-zinc-300 cursor-pointer"
                >
                  +{inc}
                </button>
              ))}
              {reqList.length > 0 && (
                <button
                  type="button"
                  disabled={maxSmeltable <= 0}
                  onClick={() => setQty(Math.max(1, maxSmeltable))}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold ${
                    maxSmeltable > 0
                      ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-200 cursor-pointer'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  Max ({Number.isFinite(maxSmeltable) ? maxSmeltable : 0})
                </button>
              )}
            </div>
          </div>
        </div>

        {selectedIngot && (
          <div className="p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-300">Vault Stock Changes:</span>
              <span className="font-bold text-emerald-400">
                +{qtyNum} {selectedIngot.name} ({selectedIngot.stock} →{' '}
                {(Number(selectedIngot.stock) || 0) + qtyNum})
              </span>
            </div>

            {reqList.length === 0 ? (
              <p className="text-[11px] text-zinc-500">
                No ore/fuel recipe configured for this ingot yet.
              </p>
            ) : (
              <div className="space-y-1.5 pt-1 border-t border-zinc-800/80">
                {reqList.map((req) => {
                  const mat = materialMap[req.materialId];
                  const needed = req.qty * qtyNum;
                  const currentStock = Number(mat?.stock) || 0;
                  const remaining = currentStock - needed;
                  const insufficient = remaining < 0;

                  return (
                    <div
                      key={req.materialId}
                      className="flex items-center justify-between text-[11px]"
                    >
                      <span className="text-zinc-300">
                        {mat?.name || req.materialId} ({req.qty} / bar)
                      </span>
                      <span
                        className={`font-semibold ${
                          insufficient ? 'text-red-400' : 'text-amber-200'
                        }`}
                      >
                        -{needed} ({currentStock} → {remaining})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
            disabled={hasShortage}
            className={`px-4 py-2 rounded-lg font-bold text-xs cursor-pointer ${
              hasShortage
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
            }`}
          >
            {hasShortage
              ? 'Insufficient Ore / Fuel'
              : `Smelt ${qtyNum} Bar${qtyNum > 1 ? 's' : ''}`}
          </button>
        </div>
      </form>
    </div>
  );
}
