import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  ClipboardList,
  Coins,
  Copy,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X
} from 'lucide-react';
import {
  useForgeAuth,
  useForgeLedgerContext,
  useForgeToast
} from '../../context/ForgeContext';
import { getOrderItems } from '../../hooks/ledger/useOrderActions';
import { createId } from '../../utils/formatters';

export default function PriceListCartDrawer({
  cartItems,
  onStepQty,
  onSetQty,
  onRemoveItem,
  onClearCart,
  onClose
}) {
  const { sales, orders, recordSaleLines, addItemsToOrder } = useForgeLedgerContext();
  const { workerProfile, canLogSalesPurchases, canManageOrders } = useForgeAuth();
  const { showToast } = useForgeToast();

  const canSale = Boolean(workerProfile && canLogSalesPurchases);
  const canOrder = Boolean(workerProfile && canManageOrders);

  const [checkoutAction, setCheckoutAction] = useState(canSale ? 'sale' : 'order');
  const [customer, setCustomer] = useState('');
  const [targetOrderId, setTargetOrderId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [deductStock, setDeductStock] = useState(true);
  const [deductMaterials, setDeductMaterials] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'pending'),
    [orders]
  );

  const recentBuyers = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const entry of [...orders, ...sales]) {
      const name = (entry.customerName || entry.customer || '').trim();
      if (
        !name ||
        name === 'Walk-in Traveler' ||
        name === 'Whiterun Patron' ||
        seen.has(name.toLowerCase())
      ) {
        continue;
      }
      seen.add(name.toLowerCase());
      list.push(name);
      if (list.length >= 5) break;
    }
    return list;
  }, [orders, sales]);

  const totals = useMemo(() => {
    return cartItems.reduce(
      (acc, { item, qty }) => ({
        units: acc.units + qty,
        sellTotal: acc.sellTotal + item.sellPrice * qty,
        buyTotal: acc.buyTotal + item.buyFromCustomerPrice * qty,
        costTotal: acc.costTotal + item.materialCost * qty,
        profitTotal: acc.profitTotal + (item.sellPrice - item.materialCost) * qty
      }),
      { units: 0, sellTotal: 0, buyTotal: 0, costTotal: 0, profitTotal: 0 }
    );
  }, [cartItems]);

  const handleCopyQuote = async () => {
    if (cartItems.length === 0) return;
    const summaryLines = cartItems.map(
      ({ item, qty }) => `${qty}x ${item.name} (${(item.sellPrice * qty).toLocaleString()}g)`
    );
    const quoteText = `Skyforge Order: ${summaryLines.join(', ')} — Total: ${totals.sellTotal.toLocaleString()}g`;
    try {
      await navigator.clipboard.writeText(quoteText);
      setCopied(true);
      showToast('Copied order tally to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not access clipboard.', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (checkoutAction === 'order' && canOrder) {
      const ok = addItemsToOrder({
        targetOrderId,
        customerName: customer,
        items: cartItems,
        notes: orderNotes
      });
      if (ok) {
        onClearCart();
        onClose();
      }
      return;
    }

    if (canSale) {
      const lines = cartItems.map(({ item, qty }) => ({
        lineId: createId('sline'),
        mode: 'existing',
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        subCategory: item.subCategory || '',
        qty,
        unitSell: item.sellPrice,
        unitCost: item.materialCost,
        totalMaterialsMap: item.totalMaterialsMap || {}
      }));

      const ok = recordSaleLines({
        lines,
        customer,
        deductStock,
        deductMaterials
      });
      if (ok) {
        onClearCart();
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#141417] border-l border-zinc-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-300">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-amber-200">
                Order Cart &amp; Tally
              </h3>
              <p className="text-[11px] text-zinc-400">
                {totals.units} {totals.units === 1 ? 'ware' : 'wares'} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleCopyQuote}
                title="Copy itemized total to clipboard"
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Quote</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-2 border border-dashed border-zinc-800 rounded-xl">
              <ShoppingCart className="w-8 h-8 text-zinc-700 mx-auto" />
              <p className="text-xs font-semibold text-zinc-300">Your order cart is empty</p>
              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                Click any weapon, armor piece, or ingot on the price list to add it to this tally.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1">
                <span className="uppercase tracking-wider font-semibold">Selected Wares</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-zinc-500 hover:text-red-400 font-medium cursor-pointer"
                >
                  Clear cart
                </button>
              </div>

              {cartItems.map(({ item, qty }) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-zinc-950/85 border border-zinc-800 flex items-center justify-between gap-2.5 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-zinc-100 truncate">{item.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 tabular-nums">
                      {item.sellPrice}g each
                      {item.stock > 0 ? ` • ${item.stock} ready` : ' • Forged to order'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStepQty(item.id, -1)}
                      className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => onSetQty(item.id, e.target.value)}
                      className="w-10 py-0.5 text-center rounded bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-100 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onStepQty(item.id, 1)}
                      className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[52px] shrink-0 tabular-nums">
                    <div className="font-bold text-amber-300">
                      {(item.sellPrice * qty).toLocaleString()}g
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    title="Remove item"
                    className="p-1 rounded text-zinc-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer: Tally & Smith Checkout / Add to Order */}
        {cartItems.length > 0 && (
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/70 space-y-3"
          >
            {/* Tally Breakdown */}
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5 text-xs tabular-nums">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">We Sell Total ({totals.units} items)</span>
                <span className="text-base font-serif font-bold text-amber-300">
                  {totals.sellTotal.toLocaleString()}g
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Trade-In / Buy-Back Value</span>
                <span className="text-emerald-300 font-semibold">
                  {totals.buyTotal.toLocaleString()}g
                </span>
              </div>
              {(canSale || canOrder) && (
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-zinc-800/80">
                  <span className="text-zinc-400">
                    Material Cost:{' '}
                    <strong className="text-zinc-200">{totals.costTotal.toLocaleString()}g</strong>
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Net Profit: +{totals.profitTotal.toLocaleString()}g
                  </span>
                </div>
              )}
            </div>

            {canSale || canOrder ? (
              <div className="space-y-3">
                {/* Action Mode Switch: Sale Now vs Add to Order */}
                {canSale && canOrder && (
                  <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setCheckoutAction('sale')}
                      className={`py-1.5 rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        checkoutAction === 'sale'
                          ? 'bg-amber-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Log Sale Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutAction('order')}
                      className={`py-1.5 rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        checkoutAction === 'order'
                          ? 'bg-sky-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                )}

                {checkoutAction === 'order' && canOrder ? (
                  <div className="space-y-2.5">
                    {pendingOrders.length > 0 && (
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                          Order Destination
                        </label>
                        <select
                          value={targetOrderId}
                          onChange={(e) => setTargetOrderId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-sky-500/60 text-xs text-zinc-100 focus:outline-none"
                        >
                          <option value="">+ Create New Customer Order</option>
                          {pendingOrders.map((ord) => {
                            const count = getOrderItems(ord).reduce((s, l) => s + l.qty, 0);
                            return (
                              <option key={ord.id} value={ord.id}>
                                Add to {ord.customerName}&apos;s Order ({count} items •{' '}
                                {ord.agreedTotal}g)
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    {!targetOrderId && (
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={customer}
                          onChange={(e) => setCustomer(e.target.value)}
                          placeholder="e.g. Farkas, Whiterun Patron..."
                          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-sky-500/60 text-xs text-zinc-100 focus:outline-none"
                        />
                        {recentBuyers.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {recentBuyers.map((buyer) => (
                              <button
                                key={buyer}
                                type="button"
                                onClick={() => setCustomer(buyer)}
                                className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                                  customer === buyer
                                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-200'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                                }`}
                              >
                                {buyer}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Order notes (optional, e.g. sharpened, rush)"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-sky-500/60 text-xs text-zinc-100 focus:outline-none"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-sky-500/15"
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span>
                        {targetOrderId
                          ? `Add ${totals.units} ${totals.units === 1 ? 'Item' : 'Items'} to Order`
                          : `Save Order (${totals.units} ${
                              totals.units === 1 ? 'Item' : 'Items'
                            }) • ${totals.sellTotal.toLocaleString()}g`}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Buyer Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        placeholder="Walk-in Traveler"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
                      />
                      {recentBuyers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {recentBuyers.map((buyer) => (
                            <button
                              key={buyer}
                              type="button"
                              onClick={() => setCustomer(buyer)}
                              className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                                customer === buyer
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {buyer}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                      <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deductStock}
                          onChange={(e) => setDeductStock(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <span>Use armory stock first</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-emerald-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deductMaterials}
                          onChange={(e) => setDeductMaterials(e.target.checked)}
                          className="accent-emerald-500"
                        />
                        <span>Deduct recipe materials</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/15"
                    >
                      <Coins className="w-4 h-4" />
                      <span>
                        Create {cartItems.length === 1 ? 'Sale' : `${cartItems.length} Sales`} •{' '}
                        {totals.sellTotal.toLocaleString()}g
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCopyQuote}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Order Quote • {totals.sellTotal.toLocaleString()}g</span>
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
