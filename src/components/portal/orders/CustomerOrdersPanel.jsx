import React, { useState, useMemo, useRef } from 'react';
import { Minus, Plus, Search, X } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import { getOrderItems } from '../../../hooks/ledger/useOrderActions';
import SearchInput from '../../common/SearchInput';
import ConfirmDeleteButton from '../../common/ConfirmDeleteButton';

export default function CustomerOrdersPanel() {
  const {
    orders,
    sales,
    enrichedCatalog,
    addOrder,
    removeOrderLine,
    completeOrder,
    deleteOrder
  } = useForgeLedgerContext();
  const { canManageOrders } = useForgeAuth();

  const [showNewForm, setShowNewForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [targetOrderId, setTargetOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [itemQuery, setItemQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const itemInputRef = useRef(null);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'pending'),
    [orders]
  );

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
    return orders.filter((ord) => {
      const lines = getOrderItems(ord);
      return (
        (ord.customerName || '').toLowerCase().includes(q) ||
        (ord.notes || '').toLowerCase().includes(q) ||
        lines.some((l) => (l.itemName || '').toLowerCase().includes(q))
      );
    });
  }, [orders, ledgerSearch]);

  const parsedQty = Math.max(1, Number(qty) || 1);
  const liveTotal = selectedItem ? selectedItem.sellPrice * parsedQty : 0;

  const handleSelectItem = (item) => {
    setSelectedItemId(item.id);
    setItemQuery(item.name);
    setPickerOpen(false);
  };

  const handleTargetExistingOrder = (ord) => {
    setTargetOrderId(ord.id);
    setCustomerName(ord.customerName);
    setShowNewForm(true);
    setTimeout(() => {
      itemInputRef.current?.focus();
      setPickerOpen(true);
    }, 30);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canManageOrders) return;
    const targetId = selectedItemId || (matchingItems.length === 1 ? matchingItems[0].id : '');
    if (!targetId) return;

    // Validate targetOrderId is still a pending order
    const activeTargetId = pendingOrders.some((o) => o.id === targetOrderId)
      ? targetOrderId
      : '';

    const ok = addOrder({
      targetOrderId: activeTargetId,
      customerName,
      itemId: targetId,
      qty: parsedQty,
      notes
    });
    if (ok) {
      setSelectedItemId('');
      setItemQuery('');
      setQty(1);
      setNotes('');
    }
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h3 className="text-base font-serif font-bold text-amber-200">Customer Commissions</h3>
          <p className="text-xs text-zinc-400">
            Track single or multi-item custom orders for patrons.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <SearchInput
            value={ledgerSearch}
            onChange={setLedgerSearch}
            placeholder="Search orders..."
            className="flex-1 sm:w-44"
            iconClassName="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2"
            inputClassName="w-full pl-8 pr-6 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/60"
          />
          {canManageOrders && (
            <button
              type="button"
              onClick={() => {
                setShowNewForm((prev) => !prev);
                if (showNewForm) setTargetOrderId('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 ${
                showNewForm
                  ? 'bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              {showNewForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showNewForm ? 'Close' : 'New Order'}</span>
            </button>
          )}
        </div>
      </div>

      {canManageOrders && showNewForm && (
        <form
          onSubmit={handleSubmit}
          className={`space-y-2.5 p-3.5 rounded-xl bg-zinc-950/80 border transition-colors ${
            targetOrderId ? 'border-sky-500/50' : 'border-zinc-800'
          }`}
        >
          {/* Optional Destination Selector when pending orders exist */}
          {pendingOrders.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={targetOrderId}
                onChange={(e) => setTargetOrderId(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-sky-500/60 text-xs text-zinc-100 focus:outline-none"
              >
                <option value="">+ New Customer Order</option>
                {pendingOrders.map((ord) => {
                  const totalUnits = getOrderItems(ord).reduce((s, l) => s + l.qty, 0);
                  return (
                    <option key={ord.id} value={ord.id}>
                      Add to {ord.customerName}&apos;s Order ({totalUnits} items • {ord.agreedTotal}
                      g)
                    </option>
                  );
                })}
              </select>
              {targetOrderId && (
                <button
                  type="button"
                  onClick={() => setTargetOrderId('')}
                  className="px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  New
                </button>
              )}
            </div>
          )}

          {/* Row 1: Instant Searchable Item Picker + Qty Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-8 relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={itemInputRef}
                type="text"
                value={itemQuery}
                onFocus={() => setPickerOpen(true)}
                onBlur={() => setTimeout(() => setPickerOpen(false), 150)}
                onChange={(e) => {
                  setItemQuery(e.target.value);
                  setSelectedItemId('');
                  setPickerOpen(true);
                }}
                placeholder={
                  targetOrderId
                    ? 'Pick item to add to selected order...'
                    : 'Type & pick item (e.g. Steel Greatsword)...'
                }
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
                        <div className="shrink-0 flex items-center gap-2 text-[11px] tabular-nums">
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

          {/* Row 2: Patron (for new orders) + Notes + Submit */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            {!targetOrderId && (
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
            )}
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className={`${
                targetOrderId ? 'sm:col-span-8' : 'sm:col-span-5'
              } px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none`}
            />
            <button
              type="submit"
              disabled={!selectedItem && matchingItems.length !== 1}
              className={`${
                targetOrderId ? 'sm:col-span-4' : 'sm:col-span-3'
              } px-3 py-2 rounded-lg font-bold text-xs transition-colors ${
                selectedItem || matchingItems.length === 1
                  ? targetOrderId
                    ? 'bg-sky-500 hover:bg-sky-400 text-zinc-950 cursor-pointer'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {targetOrderId
                ? selectedItem
                  ? `+ Add • ${liveTotal}g`
                  : '+ Add Item'
                : selectedItem
                ? `Add • ${liveTotal}g`
                : 'Add Order'}
            </button>
          </div>
        </form>
      )}

      {filteredOrders.length === 0 ? (
        <p className="text-xs text-zinc-400 py-8 text-center border border-dashed border-zinc-800/80 rounded-xl">
          No matching customer orders found.
        </p>
      ) : (
        <div className="space-y-2.5">
          {(ledgerSearch.trim() ? filteredOrders : filteredOrders.slice(0, visibleCount)).map((ord) => {
            const lines = getOrderItems(ord);
            const isTargeted = targetOrderId === ord.id;
            return (
              <div
                key={ord.id}
                className={`p-3.5 rounded-xl bg-zinc-950/75 border space-y-2.5 transition-colors ${
                  isTargeted ? 'border-sky-500/60' : 'border-zinc-800'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-100">{ord.customerName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="text-[11px] font-bold text-amber-300 tabular-nums">
                        {Number(ord.agreedTotal || 0).toLocaleString()}g
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {ord.date}
                      {ord.notes ? ` • ${ord.notes}` : ''}
                    </div>
                  </div>

                  {canManageOrders && (
                    <div className="flex items-center gap-1.5">
                      {ord.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTargetExistingOrder(ord)}
                            title="Add another item to this order"
                            className="px-2 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Item</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => completeOrder(ord)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[11px] font-semibold cursor-pointer"
                          >
                            Complete
                          </button>
                        </>
                      )}
                      <ConfirmDeleteButton
                        onConfirm={() => {
                          if (targetOrderId === ord.id) setTargetOrderId('');
                          deleteOrder(ord.id);
                        }}
                        title="Delete Order"
                      />
                    </div>
                  )}
                </div>

                {/* Line Items inside this Order */}
                <div className="space-y-1 pt-2 border-t border-zinc-800/70">
                  {lines.map((line) => (
                    <div
                      key={`${ord.id}_${line.itemId}_${line.itemName}`}
                      className="flex items-center justify-between gap-2 text-xs py-0.5"
                    >
                      <span className="text-zinc-200 truncate">
                        <strong className="text-amber-200 tabular-nums">{line.qty}×</strong>{' '}
                        {line.itemName}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 tabular-nums">
                        <span className="text-[11px] text-zinc-400">
                          {(line.agreedUnitPrice * line.qty).toLocaleString()}g
                        </span>
                        {canManageOrders && ord.status === 'pending' && lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOrderLine(ord.id, line.itemId)}
                            title="Remove item from order"
                            className="text-zinc-600 hover:text-red-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {!ledgerSearch.trim() && filteredOrders.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 10)}
              className="w-full py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer transition-colors"
            >
              Show more orders ({filteredOrders.length - visibleCount} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
