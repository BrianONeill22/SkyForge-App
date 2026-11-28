import React, { useState, useMemo } from 'react';
import { Minus, Plus, Search, Trash2, X } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';

export default function CustomerOrdersPanel() {
  const { orders, sales, enrichedCatalog, addOrder, completeOrder, deleteOrder } =
    useForgeLedgerContext();
  const { canManageOrders } = useForgeAuth();

  const [ledgerSearch, setLedgerSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [itemQuery, setItemQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const selectedItem = useMemo(
    () => enrichedCatalog.find((i) => i.id === selectedItemId) || null,
    [enrichedCatalog, selectedItemId]
  );

  const matchingItems = useMemo(() => {
    const q = itemQuery.trim().toLowerCase();
    return enrichedCatalog
      .filter(
        (item) =>
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.subCategory || '').toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [enrichedCatalog, itemQuery]);

  const recentPatrons = useMemo(() => {
    const names = new Set();
    [...orders, ...sales].forEach((entry) => {
      const n = (entry.customerName || entry.customer || '').trim();
      if (n && n !== 'Walk-in Traveler' && n !== 'Whiterun Patron') names.add(n);
    });
    return Array.from(names).slice(0, 10);
  }, [orders, sales]);

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

  const parsedQty = Math.max(1, Number(qty) || 1);
  const liveTotal = selectedItem ? selectedItem.sellPrice * parsedQty : 0;

  const handleSelectItem = (item) => {
    setSelectedItemId(item.id);
    setItemQuery(item.name);
    setPickerOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canManageOrders) return;
    const targetId = selectedItemId || (matchingItems.length === 1 ? matchingItems[0].id : '');
    if (!targetId) return;
    const ok = addOrder({ customerName, itemId: targetId, qty: parsedQty, notes });
    if (ok) {
      setSelectedItemId('');
      setItemQuery('');
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
          className="space-y-2.5 p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800"
        >
          {/* Row 1: Instant Searchable Item Picker + Qty Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-8 relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={itemQuery}
                onFocus={() => setPickerOpen(true)}
                onBlur={() => setTimeout(() => setPickerOpen(false), 150)}
                onChange={(e) => {
                  setItemQuery(e.target.value);
                  setSelectedItemId('');
                  setPickerOpen(true);
                }}
                placeholder="Type & pick item (e.g. Steel Greatsword)..."
                className={`w-full pl-8 pr-7 py-2 rounded-lg bg-zinc-900 border text-xs text-zinc-100 focus:outline-none ${
                  selectedItem
                    ? 'border-amber-500/50'
                    : 'border-zinc-800 focus:border-amber-500/60'
                }`}
              />
              {itemQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setItemQuery('');
                    setSelectedItemId('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {pickerOpen && (
                <div className="absolute z-20 left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-lg bg-[#141417] border border-zinc-700 shadow-2xl divide-y divide-zinc-800/70">
                  {matchingItems.length === 0 ? (
                    <div className="px-3 py-2.5 text-xs text-zinc-500">No matching wares.</div>
                  ) : (
                    matchingItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectItem(item);
                        }}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-amber-500/15 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-zinc-100">{item.name}</span>
                          {item.subCategory && (
                            <span className="ml-1.5 text-[10px] text-amber-300/80">
                              {item.subCategory}
                            </span>
                          )}
                        </div>
                        <div className="shrink-0 flex items-center gap-2 text-[11px]">
                          <span className={item.stock > 0 ? 'text-emerald-400' : 'text-zinc-500'}>
                            {item.stock > 0 ? `${item.stock} ready` : 'To order'}
                          </span>
                          <span className="font-bold text-amber-300">{item.sellPrice}g</span>
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
                onClick={() => setQty((q) => Math.max(1, (Number(q) || 1) - 1))}
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
                onClick={() => setQty((q) => (Number(q) || 1) + 1)}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Row 2: Patron + Notes + Submit with live total */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-4">
              <input
                type="text"
                list="skyforge-recent-patrons"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer (optional)"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
              />
              <datalist id="skyforge-recent-patrons">
                {recentPatrons.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="sm:col-span-5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!selectedItem && matchingItems.length !== 1}
              className={`sm:col-span-3 px-3 py-2 rounded-lg font-bold text-xs transition-colors ${
                selectedItem || matchingItems.length === 1
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {selectedItem ? `Add • ${liveTotal}g` : 'Add Order'}
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
