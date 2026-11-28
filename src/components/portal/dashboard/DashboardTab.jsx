import React, { useState, useMemo } from 'react';
import { Coins, Edit3, Package, ShoppingBag, Trash2, TrendingUp } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import { buildBreakdownChartsData } from '../../../utils/pricing';
import SearchInput from '../../common/SearchInput';
import SevenDayChart from './SevenDayChart';
import BreakdownCharts from './BreakdownCharts';
import ResourceForecastPanel from '../stock/ResourceForecastPanel';
import RecordSaleModal from './RecordSaleModal';
import RecordPurchaseModal from './RecordPurchaseModal';
import EditSaleModal from './EditSaleModal';
import EditPurchaseModal from './EditPurchaseModal';

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
  const [showRecordSaleModal, setShowRecordSaleModal] = useState(false);
  const [showRecordPurchaseModal, setShowRecordPurchaseModal] = useState(false);
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

  return (
    <div className="space-y-4">
      {/* KPI Strip + Primary Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Gross Revenue</span>
            <Coins className="w-3.5 h-3.5 text-amber-400/80" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-amber-300 mt-1 tabular-nums">
            {dashboardStats.totalRevenue.toLocaleString()}g
          </div>
        </div>

        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Net Profit</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400/80" />
          </div>
          <div className="flex items-baseline justify-between gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-400 tabular-nums">
              {dashboardStats.totalNetProfit.toLocaleString()}g
            </span>
            {dashboardStats.totalRevenue > 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 tabular-nums">
                {marginRatio}%
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Wares Sold</span>
            <Package className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1 tabular-nums">
            {dashboardStats.totalUnitsSold.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Supply Spent</span>
            <ShoppingBag className="w-3.5 h-3.5 text-red-400/80" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-red-300 mt-1 tabular-nums">
            {dashboardStats.totalSpent.toLocaleString()}g
          </div>
        </div>

        {canLogSalesPurchases ? (
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-[#1b1817] to-[#18181b] border border-amber-500/25 rounded-xl p-3 flex flex-row lg:flex-col justify-center gap-2">
            <button
              type="button"
              onClick={() => setShowRecordSaleModal(true)}
              className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm shadow-amber-500/20"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Quick Sale</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRecordPurchaseModal(true)}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Log Purchase</span>
            </button>
          </div>
        ) : (
          <div className="col-span-2 lg:col-span-1 bg-[#18181b] border border-zinc-800/90 rounded-xl p-3.5 flex items-center justify-center text-xs text-zinc-500">
            Ledger Read-Only
          </div>
        )}
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

      {/* Daily Sales Pace & Resource Demand Forecast */}
      <ResourceForecastPanel defaultExpanded />

      {/* Ledger History */}
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-serif font-bold text-zinc-100">
              Sales &amp; Purchases Ledger
            </h3>
            <p className="text-[11px] text-zinc-500">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
                Recent Sales
              </h4>
              <span className="text-[11px] text-zinc-500 tabular-nums">
                {filteredSales.length} {filteredSales.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {filteredSales.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800/80 rounded-lg">
                No sales recorded yet.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {filteredSales.map((s) => (
                  <div
                    key={s.id}
                    className="px-3 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-100 truncate">
                        {s.qty}× {s.itemName}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {s.date} • {s.customer}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right tabular-nums">
                        <div className="font-bold text-amber-300">+{s.totalRevenue}g</div>
                        <div className="text-[11px] text-emerald-400">+{s.netProfit}g net</div>
                      </div>
                      {canLogSalesPurchases && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingSale({ ...s })}
                            title="Edit Sale"
                            className="p-1.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-300 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSale(s.id)}
                            title="Remove Sale"
                            className="p-1.5 rounded bg-zinc-950 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-emerald-300">
                Recent Purchases
              </h4>
              <span className="text-[11px] text-zinc-500 tabular-nums">
                {filteredPurchases.length} {filteredPurchases.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {filteredPurchases.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800/80 rounded-lg">
                No supply purchases recorded yet.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {filteredPurchases.map((p) => (
                  <div
                    key={p.id}
                    className="px-3 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-100 truncate">
                        {p.qty}× {p.itemName}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {p.date} • {p.kind} • {p.supplier}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right tabular-nums">
                        <div className="font-bold text-red-300">-{p.totalCost}g</div>
                        <div className="text-[11px] text-zinc-500">{p.unitCost}g each</div>
                      </div>
                      {canLogSalesPurchases && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingPurchase({ ...p })}
                            title="Edit Purchase"
                            className="p-1.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-300 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePurchase(p.id)}
                            title="Remove Purchase"
                            className="p-1.5 rounded bg-zinc-950 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Modals */}
      {showRecordSaleModal && canLogSalesPurchases && (
        <RecordSaleModal onClose={() => setShowRecordSaleModal(false)} />
      )}
      {showRecordPurchaseModal && canLogSalesPurchases && (
        <RecordPurchaseModal onClose={() => setShowRecordPurchaseModal(false)} />
      )}
      {editingSale && canLogSalesPurchases && (
        <EditSaleModal sale={editingSale} onClose={() => setEditingSale(null)} />
      )}
      {editingPurchase && canLogSalesPurchases && (
        <EditPurchaseModal purchase={editingPurchase} onClose={() => setEditingPurchase(null)} />
      )}
    </div>
  );
}
