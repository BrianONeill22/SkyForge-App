import React, { useState, useMemo } from 'react';
import { Flame } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../context/ForgeContext';
import SearchInput from '../common/SearchInput';
import PublicSaleModal from './PublicSaleModal';

export default function PublicPriceList() {
  const { enrichedCatalog, categories, subCategories } = useForgeLedgerContext();
  const { workerProfile, canLogSalesPurchases } = useForgeAuth();

  const [publicCategory, setPublicCategory] = useState('All');
  const [publicSubCategory, setPublicSubCategory] = useState('All');
  const [publicSearch, setPublicSearch] = useState('');
  const [selectedSaleItem, setSelectedSaleItem] = useState(null);

  const canRecordFromCard = Boolean(workerProfile && canLogSalesPurchases);

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

  return (
    <>
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
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

            <SearchInput
              value={publicSearch}
              onChange={setPublicSearch}
              placeholder="Search weapons, armor, ingots..."
              className="w-full lg:w-80 shrink-0"
              iconClassName="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2"
              inputClassName="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
            />
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

            <span className="text-[11px] text-zinc-500 tabular-nums">
              {canRecordFromCard && (
                <span className="text-amber-300 font-semibold mr-2">
                  Click any card for Quick Sale •
                </span>
              )}
              Showing <strong className="text-zinc-300">{filteredPublicItems.length}</strong>{' '}
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
            {filteredPublicItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (canRecordFromCard) setSelectedSaleItem(item);
                }}
                role={canRecordFromCard ? 'button' : undefined}
                tabIndex={canRecordFromCard ? 0 : undefined}
                onKeyDown={(e) => {
                  if (canRecordFromCard && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setSelectedSaleItem(item);
                  }
                }}
                className={`bg-[#18181b] border border-zinc-800/90 hover:border-amber-500/45 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all ${
                  canRecordFromCard
                    ? 'cursor-pointer hover:-translate-y-0.5 hover:bg-zinc-900/90 hover:shadow-lg hover:shadow-amber-500/5'
                    : ''
                }`}
              >
                <div className="space-y-2">
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
                      <h3 className="text-sm font-serif font-bold text-zinc-100 leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 tabular-nums">
                      <div className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/35 text-right">
                        <div className="text-[8px] uppercase tracking-wider font-bold text-emerald-400">
                          Buy
                        </div>
                        <div className="text-xs font-bold text-emerald-200">
                          {item.buyFromCustomerPrice}g
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-right">
                        <div className="text-[8px] uppercase tracking-wider font-bold text-amber-400">
                          Sell
                        </div>
                        <div className="text-xs font-bold text-amber-200">{item.sellPrice}g</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold flex items-center gap-1.5 ${
                      item.stock > 0 ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.stock > 0 ? 'bg-emerald-400' : 'bg-zinc-600'
                      }`}
                    />
                    {item.stock > 0 ? `${item.stock} Ready` : 'Forged to Order'}
                  </span>
                  {canRecordFromCard ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold">
                      + Quick Sale
                    </span>
                  ) : (
                    <span className="text-zinc-500">
                      {(item.bundleItems || []).length > 0
                        ? `Set (${item.bundleItems.reduce((s, p) => s + (Number(p.qty) || 1), 0)} pcs)`
                        : (item.recipe || []).length > 0
                        ? `${item.recipe.length} component${item.recipe.length > 1 ? 's' : ''}`
                        : 'Direct stock'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedSaleItem && canRecordFromCard && (
        <PublicSaleModal item={selectedSaleItem} onClose={() => setSelectedSaleItem(null)} />
      )}
    </>
  );
}
