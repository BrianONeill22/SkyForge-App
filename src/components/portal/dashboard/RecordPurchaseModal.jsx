import React, { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useForgeLedgerContext, useForgeToast } from '../../../context/ForgeContext';
import { createId } from '../../../utils/formatters';
import Modal from '../../common/Modal';

export default function RecordPurchaseModal({ onClose }) {
  const { resolvedMaterials, catalogItems, enrichedCatalog, recordPurchaseLines } =
    useForgeLedgerContext();
  const { showToast } = useForgeToast();

  const [purchaseTargetType, setPurchaseTargetType] = useState('existing');
  const [purchaseExistingSearch, setPurchaseExistingSearch] = useState('');
  const [purchaseExistingKey, setPurchaseExistingKey] = useState('');
  const [purchaseNewName, setPurchaseNewName] = useState('');
  const [purchaseNewDest, setPurchaseNewDest] = useState('catalog');
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchaseUnitCost, setPurchaseUnitCost] = useState(0);
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  const [updateUnitCostOnPurchase, setUpdateUnitCostOnPurchase] = useState(true);
  const [purchaseCartItems, setPurchaseCartItems] = useState([]);

  const buildCurrentLineItem = () => {
    const qty = Math.max(1, Number(purchaseQty) || 1);
    const unitCost = Math.max(0, Number(purchaseUnitCost) || 0);

    if (purchaseTargetType === 'existing') {
      if (!purchaseExistingKey) return null;
      const [kind, targetId] = purchaseExistingKey.split(':');
      if (kind === 'mat') {
        const targetMat = resolvedMaterials.find((m) => m.id === targetId);
        if (!targetMat) return null;
        return {
          lineId: createId('pline'),
          targetType: 'existing',
          kind: 'mat',
          targetId,
          itemName: targetMat.name,
          displayKind: 'Resource Vault',
          isAutoSmeltedCost: Boolean(targetMat.isAutoSmeltedCost),
          qty,
          unitCost
        };
      }
      const targetCat = catalogItems.find((c) => c.id === targetId);
      if (!targetCat) return null;
      return {
        lineId: createId('pline'),
        targetType: 'existing',
        kind: 'cat',
        targetId,
        itemName: targetCat.name,
        displayKind: targetCat.category,
        qty,
        unitCost
      };
    }

    const cleanName = purchaseNewName.trim();
    if (!cleanName) return null;
    return {
      lineId: createId('pline'),
      targetType: 'new',
      dest: purchaseNewDest,
      itemName: cleanName,
      displayKind: purchaseNewDest === 'material' ? 'New Resource' : 'Unsorted (New)',
      qty,
      unitCost
    };
  };

  const handleAddLineToCart = () => {
    const line = buildCurrentLineItem();
    if (!line) {
      showToast(
        purchaseTargetType === 'new'
          ? 'Enter a name for the new purchased item first.'
          : 'Select an existing resource or ware first.',
        'error'
      );
      return;
    }
    setPurchaseCartItems((prev) => [...prev, line]);
    setPurchaseQty(1);
    setPurchaseUnitCost(0);
    if (purchaseTargetType === 'new') {
      setPurchaseNewName('');
    } else {
      setPurchaseExistingKey('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDraft = buildCurrentLineItem();
    const lines =
      purchaseCartItems.length > 0
        ? currentDraft
          ? [...purchaseCartItems, currentDraft]
          : [...purchaseCartItems]
        : currentDraft
        ? [currentDraft]
        : [];

    const ok = recordPurchaseLines({
      lines,
      supplier: purchaseSupplier,
      updateUnitCost: updateUnitCostOnPurchase
    });
    if (ok) onClose();
  };

  const hasCurrentDraft = Boolean(buildCurrentLineItem());

  return (
    <Modal
      title="Record a Purchase"
      subtitle="Add one or multiple ores, materials, or wares to this purchase before logging."
      titleClassName="text-emerald-300"
      maxWidthClass="max-w-2xl"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
        {purchaseCartItems.length > 0 && (
          <div className="p-3.5 rounded-lg bg-emerald-950/25 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-emerald-200">
                Items in This Purchase ({purchaseCartItems.length})
              </span>
              <span className="font-bold text-red-300">
                Total:{' '}
                {purchaseCartItems
                  .reduce((sum, l) => sum + l.unitCost * l.qty, 0)
                  .toLocaleString()}
                g
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {purchaseCartItems.map((line) => (
                <div
                  key={line.lineId}
                  className="px-2.5 py-1.5 rounded bg-zinc-950/90 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-zinc-100">
                      {line.qty}x {line.itemName}
                    </span>
                    <span className="text-[11px] text-zinc-500 ml-2">
                      ({line.displayKind} • {line.unitCost}g each)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-red-300">-{line.unitCost * line.qty}g</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPurchaseCartItems((prev) =>
                          prev.filter((x) => x.lineId !== line.lineId)
                        )
                      }
                      className="p-1 rounded bg-zinc-900 hover:bg-red-950/70 text-zinc-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setPurchaseTargetType('existing')}
            className={`py-1.5 rounded font-semibold cursor-pointer ${
              purchaseTargetType === 'existing'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Existing Resource / Ware
          </button>
          <button
            type="button"
            onClick={() => setPurchaseTargetType('new')}
            className={`py-1.5 rounded font-semibold cursor-pointer ${
              purchaseTargetType === 'new'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            + Brand New Item
          </button>
        </div>

        {purchaseTargetType === 'existing' ? (
          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Search &amp; Select Resource or Ware
            </label>
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={purchaseExistingSearch}
                onChange={(e) => setPurchaseExistingSearch(e.target.value)}
                placeholder="Type to filter vault resources & wares..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <select
              value={purchaseExistingKey}
              onChange={(e) => setPurchaseExistingKey(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            >
              <option value="">-- Choose Item --</option>
              <optgroup label="Resources & Ores">
                {resolvedMaterials
                  .filter(
                    (m) =>
                      !purchaseExistingSearch.trim() ||
                      m.name.toLowerCase().includes(purchaseExistingSearch.toLowerCase()) ||
                      m.category.toLowerCase().includes(purchaseExistingSearch.toLowerCase())
                  )
                  .map((m) => (
                    <option key={m.id} value={`mat:${m.id}`}>
                      [Vault] {m.name} (Stock: {m.stock})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Catalog Wares">
                {enrichedCatalog
                  .filter(
                    (c) =>
                      !purchaseExistingSearch.trim() ||
                      c.name.toLowerCase().includes(purchaseExistingSearch.toLowerCase()) ||
                      c.category.toLowerCase().includes(purchaseExistingSearch.toLowerCase())
                  )
                  .map((c) => (
                    <option key={c.id} value={`cat:${c.id}`}>
                      [{c.category}] {c.name} (Stock: {c.stock})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">New Item Name</label>
              <input
                type="text"
                value={purchaseNewName}
                onChange={(e) => setPurchaseNewName(e.target.value)}
                placeholder="e.g. Flawless Ruby"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Add To</label>
              <select
                value={purchaseNewDest}
                onChange={(e) => setPurchaseNewDest(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
              >
                <option value="catalog">Catalog (Unsorted)</option>
                <option value="material">Resource Vault</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="block text-xs text-zinc-400 mb-1">Qty Bought</label>
            <input
              type="number"
              min="1"
              value={purchaseQty}
              onChange={(e) => setPurchaseQty(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-xs text-zinc-400 mb-1">Unit Cost Paid (g)</label>
            <input
              type="number"
              min="0"
              value={purchaseUnitCost}
              onChange={(e) => setPurchaseUnitCost(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-5">
            <button
              type="button"
              onClick={handleAddLineToCart}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item to Purchase</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Seller / Supplier</label>
            <input
              type="text"
              value={purchaseSupplier}
              onChange={(e) => setPurchaseSupplier(e.target.value)}
              placeholder="e.g. Traveling Merchant"
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer pt-4">
            <input
              type="checkbox"
              checked={updateUnitCostOnPurchase}
              onChange={(e) => setUpdateUnitCostOnPurchase(e.target.checked)}
              className="accent-emerald-500"
            />
            <span>Update unit buy price</span>
          </label>
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
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            {purchaseCartItems.length > 0
              ? `Log Purchase (${purchaseCartItems.length + (hasCurrentDraft ? 1 : 0)} Items)`
              : 'Log Purchase'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
