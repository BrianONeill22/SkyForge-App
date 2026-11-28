import React, { useState, useMemo } from 'react';
import { Minus, Plus, Search, Trash2, X } from 'lucide-react';
import { useForgeLedgerContext, useForgeToast } from '../../../context/ForgeContext';
import { createId } from '../../../utils/formatters';
import Modal from '../../common/Modal';

export default function RecordPurchaseModal({ onClose }) {
  const { resolvedMaterials, enrichedCatalog, purchases, recordPurchaseLines } =
    useForgeLedgerContext();
  const { showToast } = useForgeToast();

  const [sourceTab, setSourceTab] = useState('materials'); // 'materials' | 'wares' | 'new'
  const [search, setSearch] = useState('');
  const [supplier, setSupplier] = useState('');
  const [updateUnitCost, setUpdateUnitCost] = useState(true);
  const [cart, setCart] = useState([]);

  // Brand-new item quick form
  const [newName, setNewName] = useState('');
  const [newDest, setNewDest] = useState('material');
  const [newQty, setNewQty] = useState(1);
  const [newUnitCost, setNewUnitCost] = useState('');

  const recentSuppliers = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const p of purchases) {
      const name = (p.supplier || '').trim();
      if (!name || name === 'Traveling Merchant' || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      list.push(name);
      if (list.length >= 5) break;
    }
    return list;
  }, [purchases]);

  const filteredMaterials = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resolvedMaterials.filter(
      (m) => !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
    );
  }, [resolvedMaterials, search]);

  const filteredWares = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enrichedCatalog.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.subCategory || '').toLowerCase().includes(q)
    );
  }, [enrichedCatalog, search]);

  const cartQtyByKey = useMemo(() => {
    const map = {};
    cart.forEach((l) => {
      if (l.targetType === 'existing') {
        const key = `${l.kind}:${l.targetId}`;
        map[key] = (map[key] || 0) + l.qty;
      }
    });
    return map;
  }, [cart]);

  const totals = useMemo(() => {
    return cart.reduce(
      (acc, l) => ({
        units: acc.units + l.qty,
        spent: acc.spent + l.qty * l.unitCost
      }),
      { units: 0, spent: 0 }
    );
  }, [cart]);

  const handleQuickAddMaterial = (mat) => {
    setCart((prev) => {
      const existing = prev.find(
        (l) => l.targetType === 'existing' && l.kind === 'mat' && l.targetId === mat.id
      );
      if (existing) {
        return prev.map((l) => (l.lineId === existing.lineId ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        {
          lineId: createId('pline'),
          targetType: 'existing',
          kind: 'mat',
          targetId: mat.id,
          itemName: mat.name,
          displayKind: 'Resource Vault',
          isAutoSmeltedCost: Boolean(mat.isAutoSmeltedCost),
          qty: 1,
          unitCost: Math.max(0, Number(mat.buyPrice) || 0)
        }
      ];
    });
  };

  const handleQuickAddWare = (ware) => {
    setCart((prev) => {
      const existing = prev.find(
        (l) => l.targetType === 'existing' && l.kind === 'cat' && l.targetId === ware.id
      );
      if (existing) {
        return prev.map((l) => (l.lineId === existing.lineId ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        {
          lineId: createId('pline'),
          targetType: 'existing',
          kind: 'cat',
          targetId: ware.id,
          itemName: ware.name,
          displayKind: ware.category,
          qty: 1,
          unitCost: Math.max(0, Number(ware.buyFromCustomerPrice) || 0)
        }
      ];
    });
  };

  const buildNewItemLine = () => {
    const cleanName = newName.trim();
    if (!cleanName) return null;
    return {
      lineId: createId('pline'),
      targetType: 'new',
      dest: newDest,
      itemName: cleanName,
      displayKind: newDest === 'material' ? 'New Resource' : 'Unsorted (New)',
      qty: Math.max(1, Math.floor(Number(newQty) || 1)),
      unitCost: Math.max(0, Number(newUnitCost) || 0)
    };
  };

  const handleAddNewToCart = () => {
    const line = buildNewItemLine();
    if (!line) {
      showToast('Enter a name for the new item first.', 'error');
      return;
    }
    setCart((prev) => [...prev, line]);
    setNewName('');
    setNewQty(1);
    setNewUnitCost('');
  };

  const handleStepQty = (lineId, delta) => {
    setCart((prev) =>
      prev
        .map((l) => (l.lineId === lineId ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const handleSetQty = (lineId, rawVal) => {
    const qty = Math.max(1, Math.floor(Number(rawVal) || 1));
    setCart((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, qty } : l)));
  };

  const handleSetUnitCost = (lineId, rawVal) => {
    const unitCost = Math.max(0, Number(rawVal) || 0);
    setCart((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, unitCost } : l)));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      e.preventDefault();
      if (sourceTab === 'materials' && filteredMaterials.length > 0) {
        handleQuickAddMaterial(filteredMaterials[0]);
        setSearch('');
      } else if (sourceTab === 'wares' && filteredWares.length > 0) {
        handleQuickAddWare(filteredWares[0]);
        setSearch('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const draftNew = sourceTab === 'new' ? buildNewItemLine() : null;
    const lines = draftNew ? [...cart, draftNew] : [...cart];
    if (lines.length === 0) {
      showToast('Click any resource or ware on the left to add it to this purchase.', 'error');
      return;
    }
    const ok = recordPurchaseLines({
      lines,
      supplier,
      updateUnitCost
    });
    if (ok) onClose();
  };

  return (
    <Modal
      title="Quick Purchase"
      subtitle="Click ores, materials, or trade-ins to add them — adjust qty and cost paid on the ticket."
      titleClassName="text-emerald-300"
      maxWidthClass="max-w-4xl"
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1 min-h-0"
      >
        {/* LEFT COLUMN: Instant Picker */}
        <div className="lg:col-span-7 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col gap-3 overflow-y-auto max-h-[55vh] lg:max-h-[75vh]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setSourceTab('materials')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                  sourceTab === 'materials'
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Vault Resources
              </button>
              <button
                type="button"
                onClick={() => setSourceTab('wares')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                  sourceTab === 'wares'
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Catalog Wares
              </button>
              <button
                type="button"
                onClick={() => setSourceTab('new')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                  sourceTab === 'new'
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                + New Item
              </button>
            </div>
            {sourceTab !== 'new' && (
              <span className="text-[11px] text-zinc-500">Click to add • Enter adds top match</span>
            )}
          </div>

          {sourceTab !== 'new' ? (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={
                    sourceTab === 'materials'
                      ? 'Search iron ore, charcoal, leather...'
                      : 'Search weapons, armor trade-ins...'
                  }
                  autoFocus
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-emerald-500/60 text-xs text-zinc-100 focus:outline-none"
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

              {sourceTab === 'materials' ? (
                filteredMaterials.length === 0 ? (
                  <div className="py-10 text-center text-xs text-zinc-500">
                    No vault resources match &ldquo;{search}&rdquo;.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1">
                    {filteredMaterials.map((mat) => {
                      const inCartQty = cartQtyByKey[`mat:${mat.id}`] || 0;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => handleQuickAddMaterial(mat)}
                          className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer group ${
                            inCartQty > 0
                              ? 'bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/15'
                              : 'bg-zinc-950/75 border-zinc-800/90 hover:border-emerald-500/40 hover:bg-zinc-900/90'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-zinc-100 truncate">
                              {mat.name}
                            </div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                              <span>{mat.category}</span>
                              <span>•</span>
                              <span>Stock: {mat.stock}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-bold text-emerald-300 tabular-nums">
                              {mat.buyPrice}g
                            </span>
                            {inCartQty > 0 ? (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold text-[10px]">
                                ×{inCartQty}
                              </span>
                            ) : (
                              <span className="p-1 rounded bg-zinc-900 group-hover:bg-emerald-500 group-hover:text-zinc-950 text-zinc-400 transition-colors">
                                <Plus className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )
              ) : filteredWares.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-500">
                  No catalog wares match &ldquo;{search}&rdquo;.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1">
                  {filteredWares.map((ware) => {
                    const inCartQty = cartQtyByKey[`cat:${ware.id}`] || 0;
                    return (
                      <button
                        key={ware.id}
                        type="button"
                        onClick={() => handleQuickAddWare(ware)}
                        className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer group ${
                          inCartQty > 0
                            ? 'bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/15'
                            : 'bg-zinc-950/75 border-zinc-800/90 hover:border-emerald-500/40 hover:bg-zinc-900/90'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-zinc-100 truncate">
                            {ware.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <span>{ware.category}</span>
                            <span>•</span>
                            <span>Stock: {ware.stock}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs font-bold text-emerald-300 tabular-nums">
                            {ware.buyFromCustomerPrice}g
                          </span>
                          {inCartQty > 0 ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold text-[10px]">
                              ×{inCartQty}
                            </span>
                          ) : (
                            <span className="p-1 rounded bg-zinc-900 group-hover:bg-emerald-500 group-hover:text-zinc-950 text-zinc-400 transition-colors">
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
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">New Item Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Flawless Ruby"
                    autoFocus
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-emerald-500/60 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Add To</label>
                  <select
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  >
                    <option value="material">Resource Vault</option>
                    <option value="catalog">Catalog (Unsorted)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2.5 items-end">
                <div className="col-span-4">
                  <label className="block text-[11px] text-zinc-400 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-[11px] text-zinc-400 mb-1">Unit Cost (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={newUnitCost}
                    onChange={(e) => setNewUnitCost(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div className="col-span-4">
                  <button
                    type="button"
                    disabled={!newName.trim()}
                    onClick={handleAddNewToCart}
                    className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 ${
                      newName.trim()
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-200 cursor-pointer'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Ticket</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Purchase Ticket */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-zinc-950/50 flex flex-col justify-between gap-4 overflow-y-auto max-h-[45vh] lg:max-h-[75vh]">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Seller / Supplier (Optional)
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Traveling Merchant"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-emerald-500/60 text-xs text-zinc-100 focus:outline-none"
              />
              {recentSuppliers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {recentSuppliers.map((sup) => (
                    <button
                      key={sup}
                      type="button"
                      onClick={() => setSupplier(sup)}
                      className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                        supplier === sup
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {sup}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                <span>
                  Purchase Ticket ({totals.units} {totals.units === 1 ? 'item' : 'items'})
                </span>
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
                  Click any ore, material, or ware on the left to add it.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {cart.map((line) => (
                    <div
                      key={line.lineId}
                      className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-100 truncate">
                            {line.itemName}
                          </div>
                          <div className="text-[10px] text-zinc-500">{line.displayKind}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setCart((prev) => prev.filter((x) => x.lineId !== line.lineId))
                          }
                          className="p-1 rounded text-zinc-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStepQty(line.lineId, -1)}
                            className="p-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={line.qty}
                            onChange={(e) => handleSetQty(line.lineId, e.target.value)}
                            className="w-10 py-0.5 text-center rounded bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-100 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleStepQty(line.lineId, 1)}
                            className="p-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-zinc-500">@</span>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              value={line.unitCost}
                              onChange={(e) => handleSetUnitCost(line.lineId, e.target.value)}
                              className="w-14 pl-1.5 pr-4 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-right text-xs font-semibold text-zinc-200 focus:outline-none"
                            />
                            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
                              g
                            </span>
                          </div>
                          <span className="font-bold text-red-300 min-w-[44px] text-right tabular-nums">
                            -{line.qty * line.unitCost}g
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={updateUnitCost}
                onChange={(e) => setUpdateUnitCost(e.target.checked)}
                className="accent-emerald-500"
              />
              <span>Update stored unit buy price from this purchase</span>
            </label>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                Total Paid
              </span>
              <span className="text-base font-serif font-bold text-red-300 tabular-nums">
                -{totals.spent.toLocaleString()}g
              </span>
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
                className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer transition-colors"
              >
                {cart.length > 0
                  ? `Complete Purchase • ${totals.spent.toLocaleString()}g`
                  : 'Complete Purchase'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
