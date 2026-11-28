import React, { useState } from 'react';
import { useForgeLedgerContext } from '../../../context/ForgeContext';
import Modal from '../../common/Modal';

export default function EditCatalogItemModal({ item, onClose }) {
  const {
    categories,
    subCategories,
    catalogItems,
    enrichedCatalog,
    resolvedMaterials,
    materialMap,
    updateCatalogItem
  } = useForgeLedgerContext();

  const [draft, setDraft] = useState({ ...item });
  const [matId, setMatId] = useState('mat_iron_ingot');
  const [matQty, setMatQty] = useState(1);
  const [setPieceId, setSetPieceId] = useState('');
  const [setPieceQty, setSetPieceQty] = useState(1);

  const handleAddPiece = () => {
    if (!setPieceId) return;
    const q = Math.max(1, Number(setPieceQty) || 1);
    const existing = (draft.bundleItems || []).find((p) => p.itemId === setPieceId);
    const nextPieces = existing
      ? (draft.bundleItems || []).map((p) =>
          p.itemId === setPieceId ? { ...p, qty: p.qty + q } : p
        )
      : [...(draft.bundleItems || []), { itemId: setPieceId, qty: q }];
    setDraft({ ...draft, bundleItems: nextPieces });
    setSetPieceId('');
    setSetPieceQty(1);
  };

  const handleAddMaterial = () => {
    if (!matId) return;
    const q = Math.max(1, Number(matQty) || 1);
    const existing = (draft.recipe || []).find((r) => r.materialId === matId);
    const nextRec = existing
      ? (draft.recipe || []).map((r) => (r.materialId === matId ? { ...r, qty: r.qty + q } : r))
      : [...(draft.recipe || []), { materialId: matId, qty: q }];
    setDraft({ ...draft, recipe: nextRec });
  };

  const handleSave = () => {
    updateCatalogItem(draft);
    onClose();
  };

  return (
    <Modal title={`Edit ${draft.name}`} maxWidthClass="max-w-xl" onClose={onClose}>
      <div className="p-5 overflow-y-auto space-y-3 text-xs">
        <div>
          <label className="block text-zinc-400 mb-1">Item Name</label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-zinc-400 mb-1">Category</label>
            <select
              value={draft.category}
              onChange={(e) => {
                const nextCat = e.target.value;
                const availableTiers = subCategories[nextCat] || [];
                setDraft({
                  ...draft,
                  category: nextCat,
                  subCategory: availableTiers.includes(draft.subCategory) ? draft.subCategory : ''
                });
              }}
              className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">
              {draft.category === 'Armor' ? 'Armor Type / Tier' : 'Sub-Type / Tier'}
            </label>
            <select
              value={
                (subCategories[draft.category] || []).includes(draft.subCategory || '') ||
                !draft.subCategory
                  ? draft.subCategory || ''
                  : '__custom__'
              }
              onChange={(e) => {
                if (e.target.value !== '__custom__') {
                  setDraft({ ...draft, subCategory: e.target.value });
                }
              }}
              className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
            >
              <option value="">-- None --</option>
              {(subCategories[draft.category] || []).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              {draft.subCategory &&
                !(subCategories[draft.category] || []).includes(draft.subCategory) && (
                  <option value="__custom__">{draft.subCategory} (Custom)</option>
                )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">
            Custom {draft.category === 'Armor' ? 'Armor' : 'Item'} Type (Optional)
          </label>
          <input
            type="text"
            value={draft.subCategory || ''}
            onChange={(e) => setDraft({ ...draft, subCategory: e.target.value })}
            placeholder={
              draft.category === 'Armor'
                ? 'e.g. Heavy Plate, Light Leather, Daedric...'
                : 'Enter custom type or material tier...'
            }
            className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/90 border border-amber-500/25 space-y-2">
          <div className="font-bold text-amber-300">Bundled Set Pieces (Armor Set / Kit)</div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={setPieceId}
              onChange={(e) => setSetPieceId(e.target.value)}
              className="flex-1 min-w-[150px] px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100"
            >
              <option value="">-- Add item to set --</option>
              {enrichedCatalog
                .filter((c) => c.id !== draft.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.materialCost}g)
                  </option>
                ))}
            </select>
            <input
              type="number"
              min="1"
              value={setPieceQty}
              onChange={(e) => setSetPieceQty(e.target.value)}
              className="w-16 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100"
            />
            <button
              type="button"
              onClick={handleAddPiece}
              className="px-2.5 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold cursor-pointer"
            >
              + Piece
            </button>
          </div>

          {(draft.bundleItems || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(draft.bundleItems || []).map((p) => {
                const pieceObj = catalogItems.find((c) => c.id === p.itemId);
                return (
                  <span
                    key={p.itemId}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/40 text-amber-100"
                  >
                    <span>
                      {p.qty}x {pieceObj?.name || p.itemId}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          bundleItems: (draft.bundleItems || []).filter(
                            (x) => x.itemId !== p.itemId
                          )
                        })
                      }
                      className="text-amber-300/70 hover:text-red-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/90 border border-zinc-800 space-y-2">
          <div className="font-bold text-zinc-300">Raw Materials &amp; Ingots</div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={matId}
              onChange={(e) => setMatId(e.target.value)}
              className="flex-1 min-w-[150px] px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100"
            >
              {resolvedMaterials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.buyPrice}g)
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={matQty}
              onChange={(e) => setMatQty(e.target.value)}
              className="w-16 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100"
            />
            <button
              type="button"
              onClick={handleAddMaterial}
              className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-200 font-semibold cursor-pointer"
            >
              + Material
            </button>
          </div>

          {(draft.recipe || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(draft.recipe || []).map((r) => (
                <span
                  key={r.materialId}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                >
                  <span>
                    {r.qty}x {materialMap[r.materialId]?.name || r.materialId}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        recipe: (draft.recipe || []).filter((x) => x.materialId !== r.materialId)
                      })
                    }
                    className="text-zinc-500 hover:text-red-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(draft.useCustomPrice)}
              onChange={(e) => setDraft({ ...draft, useCustomPrice: e.target.checked })}
              className="accent-amber-500"
            />
            <span>Override with Custom Sell Price</span>
          </label>
          {draft.useCustomPrice && (
            <input
              type="number"
              min="0"
              value={draft.customPrice}
              onChange={(e) => setDraft({ ...draft, customPrice: Number(e.target.value) || 0 })}
              className="w-24 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-right text-amber-300 font-bold"
            />
          )}
        </div>
      </div>

      <div className="p-5 flex justify-end gap-2 border-t border-zinc-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}
