import React, { useState, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';

export default function MaterialDeliveriesPanel() {
  const {
    supplyRecords,
    resolvedMaterials,
    addSupplyRecord,
    markSupplyDelivered,
    deleteSupplyRecord
  } = useForgeLedgerContext();
  const { canManageOrders } = useForgeAuth();

  const [ledgerSearch, setLedgerSearch] = useState('');
  const [matSearch, setMatSearch] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [qty, setQty] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [status, setStatus] = useState('pending');
  const [filter, setFilter] = useState('all');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canManageOrders) return;
    const ok = addSupplyRecord({ supplierName, materialId, qty, totalCost, status });
    if (ok) {
      setSupplierName('');
      setMaterialId('');
      setQty(1);
      setTotalCost(0);
    }
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-serif font-bold text-amber-200">
            Material Deliveries &amp; Pending Supplies
          </h3>
          <p className="text-[11px] text-zinc-400">
            Track miners/caravans who delivered ores or pending shipments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <SearchInput
            value={ledgerSearch}
            onChange={setLedgerSearch}
            placeholder="Search deliveries..."
            className="w-36 sm:w-44"
            iconClassName="w-3 h-3 text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2"
            inputClassName="w-full pl-7 pr-5 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          />
          {['all', 'pending', 'delivered'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded capitalize cursor-pointer ${
                filter === f
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {canManageOrders && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800"
        >
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={matSearch}
              onChange={(e) => setMatSearch(e.target.value)}
              placeholder="Quick-filter material dropdown..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Delivered by / Supplier name"
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            >
              <option value="">-- Select Material --</option>
              {resolvedMaterials
                .filter(
                  (m) =>
                    !matSearch.trim() ||
                    m.name.toLowerCase().includes(matSearch.toLowerCase()) ||
                    m.category.toLowerCase().includes(matSearch.toLowerCase())
                )
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Qty"
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <input
              type="number"
              min="0"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="Total Gold (g)"
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            >
              <option value="pending">Pending Delivery</option>
              <option value="delivered">Delivered (+Add Stock)</option>
            </select>
            <button
              type="submit"
              className="px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
            >
              Add Entry
            </button>
          </div>
        </form>
      )}

      {filteredSupplies.length === 0 ? (
        <p className="text-xs text-zinc-500 py-6 text-center">
          No material delivery records in this view.
        </p>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredSupplies.map((rec) => (
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
                  <button
                    type="button"
                    onClick={() => deleteSupplyRecord(rec.id)}
                    className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
