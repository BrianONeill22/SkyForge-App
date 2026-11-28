import React, { useState, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';

export default function CustomerOrdersPanel() {
  const { orders, enrichedCatalog, addOrder, completeOrder, deleteOrder } =
    useForgeLedgerContext();
  const { canManageOrders } = useForgeAuth();

  const [ledgerSearch, setLedgerSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [itemId, setItemId] = useState('');
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const filteredOrders = useMemo(() => {
    if (!ledgerSearch.trim()) return orders;
    const q = ledgerSearch.toLowerCase();
    return orders.filter(
      (ord) =>
        (ord.customerName || '').toLowerCase().includes(q) ||
        (ord.itemName || '').toLowerCase().includes(q) ||
        (ord.notes || '').toLowerCase().includes(q)
    );
  }, [orders, ledgerSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canManageOrders) return;
    const ok = addOrder({ customerName, itemId, qty, notes });
    if (ok) {
      setCustomerName('');
      setItemId('');
      setQty(1);
      setNotes('');
    }
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-serif font-bold text-amber-200">Customer Commissions</h3>
          <p className="text-[11px] text-zinc-400">
            Track custom weapons &amp; armor ordered by patrons.
          </p>
        </div>
        <SearchInput
          value={ledgerSearch}
          onChange={setLedgerSearch}
          placeholder="Search orders..."
          className="w-full sm:w-48"
          iconClassName="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2"
          inputClassName="w-full pl-8 pr-6 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
        />
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
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Quick-filter item dropdown..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            >
              <option value="">-- Select Item --</option>
              {enrichedCatalog
                .filter(
                  (item) =>
                    !itemSearch.trim() ||
                    item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
                    (item.subCategory || '').toLowerCase().includes(itemSearch.toLowerCase())
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sellPrice}g)
                  </option>
                ))}
            </select>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes (e.g. sharpened, urgent)"
              className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
            >
              Add Order
            </button>
          </div>
        </form>
      )}

      {filteredOrders.length === 0 ? (
        <p className="text-xs text-zinc-500 py-6 text-center">No matching customer orders found.</p>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100">
                    {ord.qty}x {ord.itemName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ord.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Patron: <strong className="text-zinc-200">{ord.customerName}</strong> •{' '}
                  {ord.agreedTotal}g
                </div>
                {ord.notes && <div className="text-[11px] text-zinc-500 italic">{ord.notes}</div>}
              </div>

              {canManageOrders && (
                <div className="flex items-center gap-1.5">
                  {ord.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => completeOrder(ord)}
                      className="px-2.5 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-semibold cursor-pointer"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteOrder(ord.id)}
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
