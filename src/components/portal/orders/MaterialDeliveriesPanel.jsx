import React, { useState, useMemo } from 'react';
import { Minus, Plus, Search, X } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';
import ConfirmDeleteButton from '../../common/ConfirmDeleteButton';

export default function MaterialDeliveriesPanel() {
  const {
    supplyRecords,
    purchases,
    resolvedMaterials,
    addSupplyRecord,
    markSupplyDelivered,
    deleteSupplyRecord
  } = useForgeLedgerContext();
  const { canManageOrders } = useForgeAuth();

  const [showNewForm, setShowNewForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [matQuery, setMatQuery] = useState('');
  const [selectedMatId, setSelectedMatId] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [totalCost, setTotalCost] = useState('');
  const [status, setStatus] = useState('pending');
  const [filter, setFilter] = useState('all');

  const selectedMat = useMemo(
    () => resolvedMaterials.find((m) => m.id === selectedMatId) || null,
    [resolvedMaterials, selectedMatId]
  );

  const matchingMaterials = useMemo(() => {
    const q = matQuery.trim().toLowerCase();
    return resolvedMaterials
      .filter(
        (m) =>
          !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [resolvedMaterials, matQuery]);

  const recentSuppliers = useMemo(() => {
    const names = new Set();
    [...supplyRecords, ...purchases].forEach((entry) => {
      const n = (entry.supplierName || entry.supplier || '').trim();
      if (n && n !== 'Mining Caravan' && n !== 'Traveling Merchant') names.add(n);
    });
    return Array.from(names).slice(0, 10);
  }, [supplyRecords, purchases]);

  const filteredSupplies = useMemo(() => {
    return supplyRecords.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (!ledgerSearch.trim()) return true;
      const q = ledgerSearch.toLowerCase();
      return (
        (r.supplierName || '').toLowerCase().includes(q) ||
        (r.materialName || '').toLowerCase().includes(q)
      );
    });
  }, [supplyRecords, filter, ledgerSearch]);

  const handleSelectMaterial = (mat) => {
    setSelectedMatId(mat.id);
    setMatQuery(mat.name);
    setPickerOpen(false);
    const parsedQty = Math.max(1, Number(qty) || 1);
    if (mat.buyPrice > 0) {
      setTotalCost(String(mat.buyPrice * parsedQty));
    }
  };

  const handleStepQty = (delta) => {
    setQty((prev) => {
      const next = Math.max(1, (Number(prev) || 1) + delta);
      if (selectedMat && selectedMat.buyPrice > 0) {
        setTotalCost(String(selectedMat.buyPrice * next));
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canManageOrders) return;
    const targetId =
      selectedMatId || (matchingMaterials.length === 1 ? matchingMaterials[0].id : '');
    if (!targetId) return;
    const ok = addSupplyRecord({
      supplierName,
      materialId: targetId,
      qty: Math.max(1, Number(qty) || 1),
      totalCost: Math.max(0, Number(totalCost) || 0),
      status
    });
    if (ok) {
      setSelectedMatId('');
      setMatQuery('');
      setQty(1);
      setTotalCost('');
    }
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h3 className="text-base font-serif font-bold text-amber-200">
            Material Deliveries &amp; Pending Supplies
          </h3>
          <p className="text-xs text-zinc-400">
            Track miners/caravans who delivered ores or pending shipments.
          </p>
        </div>
        {canManageOrders && (
          <button
            type="button"
            onClick={() => setShowNewForm((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 ${
              showNewForm
                ? 'bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
            }`}
          >
            {showNewForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showNewForm ? 'Close' : 'Log Delivery'}</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <SearchInput
          value={ledgerSearch}
          onChange={setLedgerSearch}
          placeholder="Search deliveries..."
          className="flex-1 sm:max-w-[220px]"
          iconClassName="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2"
          inputClassName="w-full pl-8 pr-6 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/60"
        />
        <div className="flex items-center gap-1">
          {['all', 'pending', 'delivered'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize cursor-pointer transition-colors ${
                filter === f
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {canManageOrders && showNewForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-2.5 p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800"
        >
          {/* Row 1: Instant Material Picker + Qty Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-8 relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={matQuery}
                onFocus={() => setPickerOpen(true)}
                onBlur={() => setTimeout(() => setPickerOpen(false), 150)}
                onChange={(e) => {
                  setMatQuery(e.target.value);
                  setSelectedMatId('');
                  setPickerOpen(true);
                }}
                placeholder="Type & pick material (e.g. Iron Ore, Coke)..."
                className={`w-full pl-8 pr-7 py-2 rounded-lg bg-zinc-900 border text-xs text-zinc-100 focus:outline-none ${
                  selectedMat
                    ? 'border-amber-500/50'
                    : 'border-zinc-800 focus:border-amber-500/60'
                }`}
              />
              {matQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setMatQuery('');
                    setSelectedMatId('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {pickerOpen && (
                <div className="absolute z-20 left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-lg bg-[#141417] border border-zinc-700 shadow-2xl divide-y divide-zinc-800/70">
                  {matchingMaterials.length === 0 ? (
                    <div className="px-3 py-2.5 text-xs text-zinc-500">No matching materials.</div>
                  ) : (
                    matchingMaterials.map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectMaterial(mat);
                        }}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-amber-500/15 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-zinc-100">{mat.name}</span>
                          <span className="ml-1.5 text-[10px] text-zinc-500">{mat.category}</span>
                        </div>
                        <div className="shrink-0 flex items-center gap-2 text-[11px]">
                          <span className="text-zinc-400">Stock: {mat.stock}</span>
                          <span className="font-bold text-amber-300">{mat.buyPrice}g</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="sm:col-span-4 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleStepQty(-1)}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full py-2 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-center text-xs font-bold text-zinc-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleStepQty(1)}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Row 2: Supplier + Total Cost + Status + Submit */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-4">
              <input
                type="text"
                list="skyforge-recent-suppliers"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Supplier (optional)"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
              />
              <datalist id="skyforge-recent-suppliers">
                {recentSuppliers.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div className="sm:col-span-2 relative">
              <input
                type="number"
                min="0"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="Gold"
                className="w-full pl-2.5 pr-5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
                g
              </span>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="sm:col-span-3 px-2.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered (+Stock)</option>
            </select>
            <button
              type="submit"
              disabled={!selectedMat && matchingMaterials.length !== 1}
              className={`sm:col-span-3 px-3 py-2 rounded-lg font-bold text-xs transition-colors ${
                selectedMat || matchingMaterials.length === 1
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              Add Entry
            </button>
          </div>
        </form>
      )}

      {filteredSupplies.length === 0 ? (
        <p className="text-xs text-zinc-400 py-8 text-center border border-dashed border-zinc-800/80 rounded-xl">
          No material delivery records in this view.
        </p>
      ) : (
        <div className="space-y-2.5">
          {(ledgerSearch.trim() ? filteredSupplies : filteredSupplies.slice(0, visibleCount)).map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100">
                    {rec.qty}x {rec.materialName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rec.status === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Supplier: <strong className="text-zinc-200">{rec.supplierName}</strong> •{' '}
                  {rec.date} • {rec.totalCost}g
                </div>
              </div>

              {canManageOrders && (
                <div className="flex items-center gap-1.5">
                  {rec.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => markSupplyDelivered(rec)}
                      className="px-2.5 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-semibold cursor-pointer"
                    >
                      Mark Delivered
                    </button>
                  )}
                  <ConfirmDeleteButton
                    onConfirm={() => deleteSupplyRecord(rec.id)}
                    title="Delete Delivery Record"
                  />
                </div>
              )}
            </div>
          ))}
          {!ledgerSearch.trim() && filteredSupplies.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 10)}
              className="w-full py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer transition-colors"
            >
              Show more deliveries ({filteredSupplies.length - visibleCount} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
