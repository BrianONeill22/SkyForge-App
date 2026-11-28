import React, { useState, useMemo } from 'react';
import { Coins, Edit3, ShoppingBag, Trash2 } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import { buildBreakdownChartsData } from '../../../utils/pricing';
import SearchInput from '../../common/SearchInput';
import SevenDayChart from './SevenDayChart';
import BreakdownCharts from './BreakdownCharts';
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
    sevenDayChartData,
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
      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400">Gross Septim Revenue</div>
          <div className="text-xl font-serif font-bold text-amber-300 mt-0.5">
            {dashboardStats.totalRevenue.toLocaleString()}g
          </div>
        </div>
        <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400">Net Forge Profit</div>
          <div className="text-xl font-serif font-bold text-emerald-400 mt-0.5">
            {dashboardStats.totalNetProfit.toLocaleString()}g
          </div>
        </div>
        <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400">Wares Sold</div>
          <div className="text-xl font-serif font-bold text-zinc-100 mt-0.5">
            {dashboardStats.totalUnitsSold.toLocaleString()}
          </div>
        </div>
        <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-400">Supply Purchases</div>
          <div className="text-xl font-serif font-bold text-red-300 mt-0.5">
            {dashboardStats.totalSpent.toLocaleString()}g
          </div>
        </div>

        {canLogSalesPurchases ? (
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3 flex flex-col justify-center gap-2">
            <button
              type="button"
              onClick={() => setShowRecordSaleModal(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Record a Sale</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRecordPurchaseModal(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Record a Purchase</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5 flex items-center justify-center text-xs text-zinc-500">
            Ledger Read-Only
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <SevenDayChart data={sevenDayChartData} />
        <BreakdownCharts
          metricMode={pieMetricMode}
          onChangeMetricMode={setPieMetricMode}
          data={breakdownChartsData}
        />
      </div>

      {/* Ledger History */}
      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-serif font-bold text-zinc-200">
            Sales &amp; Purchases Ledger
          </h3>
          <SearchInput
            value={ledgerHistorySearch}
            onChange={setLedgerHistorySearch}
            placeholder="Search sales, buyers, suppliers..."
            className="w-full sm:w-80"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
              Recent Sales ({sales.length})
            </h4>
            {filteredSales.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No matching sales found.</p>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {filteredSales.map((s) => (
                  <div
                    key={s.id}
                    className="px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-100 truncate">
                        {s.qty}x {s.itemName}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {s.date} • Buyer: {s.customer}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-amber-300">+{s.totalRevenue}g</div>
                        <div className="text-[11px] text-emerald-400">Profit: +{s.netProfit}g</div>
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

          <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-emerald-300">
              Recent Supply Purchases ({purchases.length})
            </h4>
            {filteredPurchases.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No matching purchases found.</p>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {filteredPurchases.map((p) => (
                  <div
                    key={p.id}
                    className="px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-100 truncate">
                        {p.qty}x {p.itemName}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {p.date} • {p.kind} • {p.supplier}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
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
