import React, { useState, useMemo } from 'react';
import { Coins, Edit3, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import { buildBreakdownChartsData } from '../../../utils/pricing';
import SearchInput from '../../common/SearchInput';
import ConfirmDeleteButton from '../../common/ConfirmDeleteButton';
import SevenDayChart from './SevenDayChart';
import BreakdownCharts from './BreakdownCharts';
import ResourceForecastPanel from '../stock/ResourceForecastPanel';
import EditSaleModal from './EditSaleModal';
import EditPurchaseModal from './EditPurchaseModal';

const PAGE_STEP = 10;

export default function DashboardTab() {
  const {
    sales,
    purchases,
    catalogItems,
    dashboardStats,
    deleteSale,
    deletePurchase
  } = useForgeLedgerContext();
  const { canLogSalesPurchases } = useForgeAuth();

  const [pieMetricMode, setPieMetricMode] = useState('revenue');
  const [ledgerHistorySearch, setLedgerHistorySearch] = useState('');
  const [salesVisibleCount, setSalesVisibleCount] = useState(PAGE_STEP);
  const [purchasesVisibleCount, setPurchasesVisibleCount] = useState(PAGE_STEP);
  const [editingSale, setEditingSale] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const breakdownChartsData = useMemo(
    () => buildBreakdownChartsData(sales, catalogItems, pieMetricMode),
    [sales, catalogItems, pieMetricMode]
  );

  const marginRatio =
    dashboardStats.totalRevenue > 0
      ? Math.round((dashboardStats.totalNetProfit / dashboardStats.totalRevenue) * 100)
      : 0;

  const isSearching = Boolean(ledgerHistorySearch.trim());

  const filteredSales = useMemo(() => {
    if (!ledgerHistorySearch.trim()) return sales;
    const q = ledgerHistorySearch.toLowerCase();
    return sales.filter(
      (s) =>
        (s.itemName || '').toLowerCase().includes(q) ||
        (s.customer || '').toLowerCase().includes(q) ||
        (s.date || '').includes(q)
    );
  }, [sales, ledgerHistorySearch]);

  const filteredPurchases = useMemo(() => {
    if (!ledgerHistorySearch.trim()) return purchases;
    const q = ledgerHistorySearch.toLowerCase();
    return purchases.filter(
      (p) =>
        (p.itemName || '').toLowerCase().includes(q) ||
        (p.supplier || '').toLowerCase().includes(q) ||
        (p.kind || '').toLowerCase().includes(q) ||
        (p.date || '').includes(q)
    );
  }, [purchases, ledgerHistorySearch]);

  const displayedSales = isSearching
    ? filteredSales
    : filteredSales.slice(0, salesVisibleCount);
  const displayedPurchases = isSearching
    ? filteredPurchases
    : filteredPurchases.slice(0, purchasesVisibleCount);

  return (
    <div className="space-y-4">
      {/* Clean 4-Card KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Gross Revenue</span>
            <Coins className="w-4 h-4 text-amber-400/80" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-amber-300 mt-1.5 tabular-nums">
            {dashboardStats.totalRevenue.toLocaleString()}g
          </div>
        </div>

        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Net Profit</span>
            <TrendingUp className="w-4 h-4 text-emerald-400/80" />
          </div>
          <div className="flex items-baseline justify-between gap-2 mt-1.5">
            <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-400 tabular-nums">
              {dashboardStats.totalNetProfit.toLocaleString()}g
            </span>
            {dashboardStats.totalRevenue > 0 && (
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 tabular-nums">
                {marginRatio}%
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Wares Sold</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1.5 tabular-nums">
            {dashboardStats.totalUnitsSold.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Supply Spent</span>
            <ShoppingBag className="w-4 h-4 text-red-400/80" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-red-300 mt-1.5 tabular-nums">
            {dashboardStats.totalSpent.toLocaleString()}g
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <SevenDayChart sales={sales} purchases={purchases} />
        <BreakdownCharts
          metricMode={pieMetricMode}
          onChangeMetricMode={setPieMetricMode}
          data={breakdownChartsData}
        />
      </div>

      {/* Collapsible Resource Demand Forecast (collapsed by default to keep Dashboard scannable) */}
      <ResourceForecastPanel defaultExpanded={false} />

      {/* Ledger History */}
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-serif font-bold text-zinc-100">
              Sales &amp; Purchases Ledger
            </h3>
            <p className="text-xs text-zinc-400">
              Complete history of forge transactions and merchant buys.
            </p>
          </div>
          <SearchInput
            value={ledgerHistorySearch}
            onChange={setLedgerHistorySearch}
            placeholder="Search sales, buyers, suppliers..."
            className="w-full sm:w-80"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Recent Sales */}
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
                Recent Sales
              </h4>
              <span className="text-xs text-zinc-400 tabular-nums">
                {filteredSales.length} {filteredSales.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {filteredSales.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400 border border-dashed border-zinc-800/80 rounded-lg">
                No sales recorded yet.
              </div>
            ) : (
              <div className="space-y-1.5">
                {displayedSales.map((s) => (
                  <div
                    key={s.id}
                    className="px-3 py-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-100 truncate text-[13px]">
                        {s.qty}× {s.itemName}
                      </div>
                      <div className="text-xs text-zinc-400 truncate mt-0.5">
                        {s.date} • {s.customer}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right tabular-nums">
                        <div className="font-bold text-amber-300 text-[13px]">
                          +{s.totalRevenue}g
                        </div>
                        <div className="text-[11px] text-emerald-400">+{s.netProfit}g net</div>
                      </div>
                      {canLogSalesPurchases && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingSale({ ...s })}
                            title="Edit Sale"
                            aria-label="Edit Sale"
                            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-300 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <ConfirmDeleteButton
                            onConfirm={() => deleteSale(s.id)}
                            title="Remove Sale"
                            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 transition-colors cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {!isSearching && filteredSales.length > salesVisibleCount && (
                  <button
                    type="button"
                    onClick={() => setSalesVisibleCount((c) => c + PAGE_STEP)}
                    className="w-full py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer transition-colors"
                  >
                    Show more sales ({filteredSales.length - salesVisibleCount} remaining)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Recent Purchases */}
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-emerald-300">
                Recent Purchases
              </h4>
              <span className="text-xs text-zinc-400 tabular-nums">
                {filteredPurchases.length} {filteredPurchases.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {filteredPurchases.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400 border border-dashed border-zinc-800/80 rounded-lg">
                No supply purchases recorded yet.
              </div>
            ) : (
              <div className="space-y-1.5">
                {displayedPurchases.map((p) => (
                  <div
                    key={p.id}
                    className="px-3 py-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-100 truncate text-[13px]">
                        {p.qty}× {p.itemName}
                      </div>
                      <div className="text-xs text-zinc-400 truncate mt-0.5">
                        {p.date} • {p.kind} • {p.supplier}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right tabular-nums">
                        <div className="font-bold text-red-300 text-[13px]">-{p.totalCost}g</div>
                        <div className="text-[11px] text-zinc-400">{p.unitCost}g each</div>
                      </div>
                      {canLogSalesPurchases && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingPurchase({ ...p })}
                            title="Edit Purchase"
                            aria-label="Edit Purchase"
                            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-300 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <ConfirmDeleteButton
                            onConfirm={() => deletePurchase(p.id)}
                            title="Remove Purchase"
                            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 transition-colors cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {!isSearching && filteredPurchases.length > purchasesVisibleCount && (
                  <button
                    type="button"
                    onClick={() => setPurchasesVisibleCount((c) => c + PAGE_STEP)}
                    className="w-full py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer transition-colors"
                  >
                    Show more purchases ({filteredPurchases.length - purchasesVisibleCount} remaining)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      {editingSale && canLogSalesPurchases && (
        <EditSaleModal sale={editingSale} onClose={() => setEditingSale(null)} />
      )}
      {editingPurchase && canLogSalesPurchases && (
        <EditPurchaseModal purchase={editingPurchase} onClose={() => setEditingPurchase(null)} />
      )}
    </div>
  );
}
