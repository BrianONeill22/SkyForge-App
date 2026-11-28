import React, { useState, useMemo } from 'react';
import { Flame, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../context/ForgeContext';
import SearchInput from '../common/SearchInput';
import PriceListCartDrawer from './PriceListCartDrawer';

export default function PublicPriceList() {
  const { enrichedCatalog, categories, subCategories } = useForgeLedgerContext();
  const { workerProfile, canLogSalesPurchases, canManageOrders } = useForgeAuth();

  const [publicCategory, setPublicCategory] = useState('All');
  const [publicSubCategory, setPublicSubCategory] = useState('All');
  const [publicSearch, setPublicSearch] = useState('');
  const [cartQuantities, setCartQuantities] = useState({});
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const canCheckout = Boolean(workerProfile && (canLogSalesPurchases || canManageOrders));

  const availablePublicSubTiers = useMemo(() => {
    if (publicCategory === 'All') return [];
    const configured = subCategories[publicCategory] || [];
    const fromItems = enrichedCatalog
      .filter((i) => i.category === publicCategory && i.subCategory)
      .map((i) => i.subCategory);
    return Array.from(new Set([...configured, ...fromItems]));
  }, [publicCategory, subCategories, enrichedCatalog]);

  const filteredPublicItems = useMemo(() => {
    return enrichedCatalog.filter((item) => {
      if (publicCategory !== 'All' && item.category !== publicCategory) return false;
      if (publicSubCategory !== 'All' && (item.subCategory || '') !== publicSubCategory) {
        return false;
      }
      if (publicSearch.trim()) {
        const q = publicSearch.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          (item.subCategory || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [enrichedCatalog, publicCategory, publicSubCategory, publicSearch]);

  const cartItems = useMemo(() => {
    return Object.entries(cartQuantities)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = enrichedCatalog.find((c) => c.id === itemId);
        return item ? { item, qty } : null;
      })
      .filter(Boolean);
  }, [cartQuantities, enrichedCatalog]);

  const cartSummary = useMemo(() => {
    return cartItems.reduce(
      (acc, { item, qty }) => ({
        units: acc.units + qty,
        sellTotal: acc.sellTotal + item.sellPrice * qty
      }),
      { units: 0, sellTotal: 0 }
    );
  }, [cartItems]);

  const handleStepCartQty = (itemId, delta) => {
    setCartQuantities((prev) => {
      const next = (prev[itemId] || 0) + delta;
      if (next <= 0) {
        const { [itemId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handleSetCartQty = (itemId, rawVal) => {
    const qty = Math.max(1, Math.floor(Number(rawVal) || 1));
    setCartQuantities((prev) => ({ ...prev, [itemId]: qty }));
  };

  const handleRemoveCartItem = (itemId) => {
    setCartQuantities((prev) => {
      const { [itemId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleClearCart = () => setCartQuantities({});

  return (
    <>
      <main
        className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4 ${
          cartItems.length > 0 ? 'pb-24' : ''
        }`}
      >
        <div className="bg-gradient-to-r from-[#18181b] via-[#1c1617] to-[#18181b] border border-zinc-800/90 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-lg shadow-black/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Skyforge Exchange</span>
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-xs text-zinc-400">
                  <span className="text-amber-300 font-semibold">We Sell</span> &amp;{' '}
                  <span className="text-emerald-300 font-semibold">We Buy</span> rates
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
                Armory Wares &amp; Rates
              </h2>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <SearchInput
                value={publicSearch}
                onChange={setPublicSearch}
                placeholder="Search weapons, armor, ingots..."
                className="flex-1 lg:w-80 shrink-0"
                iconClassName="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2"
                inputClassName="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCartDrawer(true)}
                className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  cartSummary.units > 0
                    ? 'bg-amber-500 hover:bg-amber-400 border-amber-400 text-zinc-950 shadow-sm shadow-amber-500/20'
                    : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Cart</span>
                {cartSummary.units > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-zinc-950/20 text-[10px] font-bold tabular-nums">
                    {cartSummary.units}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800/80">
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setPublicCategory(cat);
                    setPublicSubCategory('All');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    publicCategory === cat
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-zinc-950/90 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-zinc-400 tabular-nums">
              Showing <strong className="text-zinc-200">{filteredPublicItems.length}</strong>{' '}
              {filteredPublicItems.length === 1 ? 'ware' : 'wares'}
            </span>
          </div>

          {publicCategory !== 'All' && availablePublicSubTiers.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mr-1">
                Tier:
              </span>
              {['All', ...availablePublicSubTiers].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setPublicSubCategory(tier)}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    publicSubCategory === tier
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                      : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {tier === 'All' ? 'All Tiers' : tier}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredPublicItems.length === 0 ? (
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-10 text-center space-y-1.5">
            <p className="text-sm font-serif font-semibold text-zinc-300">
              No wares match your current filter.
            </p>
            <p className="text-xs text-zinc-500">
              Try clearing the search bar or switching categories/tiers above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredPublicItems.map((item) => {
              const inCartQty = cartQuantities[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl p-4 flex flex-col justify-between gap-3 transition-all ${
                    inCartQty > 0
                      ? 'bg-amber-500/[0.07] border border-amber-500/60 shadow-lg shadow-amber-500/5'
                      : 'bg-[#18181b] border border-zinc-800/90 hover:border-amber-500/40 hover:bg-zinc-900/75'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            {item.category}
                          </span>
                          {item.subCategory && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-semibold text-amber-300">
                              {item.subCategory}
                            </span>
                          )}
                        </div>
                        <h3 className="text-[15px] font-serif font-bold text-zinc-100 leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
                        <div
                          title="What the Skyforge pays you for this ware"
                          className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/35 text-right"
                        >
                          <div className="text-[10px] uppercase tracking-wide font-bold text-emerald-400">
                            We Buy
                          </div>
                          <div className="text-sm font-bold text-emerald-200 leading-tight">
                            {item.buyFromCustomerPrice}g
                          </div>
                        </div>
                        <div
                          title="Price to purchase this ware from the Skyforge"
                          className="px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-right"
                        >
                          <div className="text-[10px] uppercase tracking-wide font-bold text-amber-400">
                            We Sell
                          </div>
                          <div className="text-sm font-bold text-amber-200 leading-tight">
                            {item.sellPrice}g
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`font-semibold flex items-center gap-1.5 ${
                        item.stock > 0 ? 'text-emerald-400' : 'text-zinc-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.stock > 0 ? 'bg-emerald-400' : 'bg-zinc-600'
                        }`}
                      />
                      {item.stock > 0 ? `${item.stock} Ready` : 'Forged to Order'}
                    </span>

                    {inCartQty > 0 ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Remove one ${item.name}`}
                          onClick={() => handleStepCartQty(item.id, -1)}
                          className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 cursor-pointer transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-bold text-xs tabular-nums">
                          ×{inCartQty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Add one more ${item.name}`}
                          onClick={() => handleStepCartQty(item.id, 1)}
                          className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStepCartQty(item.id, 1)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 hover:text-zinc-950 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Tally Bar */}
      {cartItems.length > 0 && !showCartDrawer && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl">
          <div className="bg-[#18181b]/95 backdrop-blur-md border border-amber-500/50 rounded-2xl px-4 py-3 shadow-2xl shadow-black/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 shrink-0">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-100 tabular-nums">
                  {cartSummary.units} {cartSummary.units === 1 ? 'item' : 'items'} in cart •{' '}
                  <span className="text-amber-300">
                    {cartSummary.sellTotal.toLocaleString()}g
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate">
                  {cartItems.map(({ item, qty }) => `${qty}× ${item.name}`).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleClearCart}
                title="Clear cart"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowCartDrawer(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer transition-colors"
              >
                {canCheckout ? 'Checkout / Add to Order' : 'View Tally'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Cart & Checkout Drawer */}
      {showCartDrawer && (
        <PriceListCartDrawer
          cartItems={cartItems}
          onStepQty={handleStepCartQty}
          onSetQty={handleSetCartQty}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onClose={() => setShowCartDrawer(false)}
        />
      )}
    </>
  );
}
