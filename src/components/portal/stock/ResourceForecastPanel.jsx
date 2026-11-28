import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Copy,
  Flame,
  Package,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { useForgeLedgerContext, useForgeToast } from '../../../context/ForgeContext';
import { buildSalesResourceForecast } from '../../../utils/forecasting';

function fmtRate(val) {
  if (!val || val <= 0) return '0';
  if (val >= 100) return Math.round(val).toLocaleString();
  const rounded = Math.round(val * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function fmtGold(val) {
  const num = Number(val) || 0;
  if (num >= 10000) return `${(num / 1000).toFixed(1)}k g`;
  return `${Math.round(num).toLocaleString()}g`;
}

function fmtRunway(days) {
  if (!Number.isFinite(days)) return '—';
  if (days <= 0) return 'Out';
  if (days > 99) return '99+d';
  return `${days.toFixed(1)}d`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ResourceForecastPanel({ onClose, defaultExpanded = true }) {
  const {
    sales,
    enrichedCatalog,
    catalogItems,
    resolvedMaterials,
    orders
  } = useForgeLedgerContext();
  const { showToast } = useForgeToast();

  const [lookbackDays, setLookbackDays] = useState(14); // 7 | 14 | 30 | 0 (All)
  const [horizonDays, setHorizonDays] = useState(7); // 1 | 3 | 7 | 14 | 30
  const [averageBasis, setAverageBasis] = useState('span'); // 'span' | 'active'
  const [safetyBufferPct, setSafetyBufferPct] = useState(0); // 0 | 15 | 25
  const [expandSmeltedToRaw, setExpandSmeltedToRaw] = useState(false);
  const [includePendingOrders, setIncludePendingOrders] = useState(true);

  const [salesSubTab, setSalesSubTab] = useState('wares'); // 'wares' | 'daily'
  const [resourceFilter, setResourceFilter] = useState('all'); // 'all' | 'shortfall'
  const [collapsed, setCollapsed] = useState(!defaultExpanded);

  const forecast = useMemo(
    () =>
      buildSalesResourceForecast({
        sales,
        enrichedCatalog,
        catalogItems,
        resolvedMaterials,
        orders,
        lookbackDays,
        horizonDays,
        averageBasis,
        safetyBufferPct,
        expandSmeltedToRaw,
        includePendingOrders
      }),
    [
      sales,
      enrichedCatalog,
      catalogItems,
      resolvedMaterials,
      orders,
      lookbackDays,
      horizonDays,
      averageBasis,
      safetyBufferPct,
      expandSmeltedToRaw,
      includePendingOrders
    ]
  );

  const { summary, dailyBreakdown, itemVelocity, resourceForecast } = forecast;

  const visibleResources = useMemo(() => {
    if (resourceFilter === 'shortfall') {
      return resourceForecast.filter((r) => r.shortfall > 0);
    }
    return resourceForecast;
  }, [resourceForecast, resourceFilter]);

  const maxItemQty = Math.max(1, ...itemVelocity.map((i) => i.totalQty));

  const handleCopyRestockList = async () => {
    const targets = resourceForecast.filter((r) => r.shortfall > 0);
    const lookbackLabel = lookbackDays === 0 ? 'All history' : `${lookbackDays}D`;
    const modeLabel = expandSmeltedToRaw ? 'Raw Ore & Fuel' : 'Direct Recipe Materials';

    const lines = [
      `The Skyforge — ${horizonDays}-Day Resource Forecast (${lookbackLabel} pace • ${modeLabel})`,
      `Avg Pace: ${fmtRate(summary.avgUnitsPerDay)} wares/day (${fmtGold(summary.avgRevenuePerDay)}/day)`
    ];

    if (targets.length === 0) {
      lines.push('Vault is fully stocked for the predicted demand!');
    } else {
      lines.push('');
      lines.push('Needed to Restock:');
      targets.forEach((r) => {
        const costPart = r.estimatedRestockCost > 0 ? `, ~${fmtGold(r.estimatedRestockCost)}` : '';
        lines.push(
          `• ${r.material.name}: need ${r.totalRequired} (in vault ${r.currentStock} → get ${r.shortfall}${costPart})`
        );
      });
      if (summary.totalEstimatedRestockCost > 0) {
        lines.push('');
        lines.push(`Estimated Restock Total: ~${fmtGold(summary.totalEstimatedRestockCost)}`);
      }
    }

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      showToast('Copied predicted restock list to clipboard!');
    } catch {
      showToast('Could not access clipboard.', 'error');
    }
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5 shadow-lg shadow-black/20">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-serif font-bold text-zinc-100">
                Sales Pace &amp; Resource Forecast
              </h3>
              {summary.totalShortfallMaterials > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/40 tabular-nums">
                  {summary.totalShortfallMaterials} to restock ({horizonDays}D)
                </span>
              ) : summary.totalSalesEntries > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                  Vault Covered ({horizonDays}D)
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-zinc-500">
              {summary.totalSalesEntries > 0 ? (
                <>
                  Reading <strong className="text-zinc-300">{summary.totalSalesEntries}</strong>{' '}
                  {summary.totalSalesEntries === 1 ? 'sale' : 'sales'} across{' '}
                  <strong className="text-zinc-300">
                    {summary.divisorDays}{' '}
                    {averageBasis === 'active' ? 'active sale' : 'calendar'}{' '}
                    {summary.divisorDays === 1 ? 'day' : 'days'}
                  </strong>{' '}
                  to predict the next{' '}
                  <strong className="text-amber-300">
                    {horizonDays} {horizonDays === 1 ? 'day' : 'days'}
                  </strong>
                  .
                </>
              ) : (
                'Reads your daily sales history & recipes to predict what materials to stock.'
              )}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {!collapsed && (
            <>
              {/* Lookback Window */}
              <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
                <span className="px-1.5 text-[10px] text-zinc-500 hidden sm:inline">Read:</span>
                {[
                  { val: 7, label: '7D' },
                  { val: 14, label: '14D' },
                  { val: 30, label: '30D' },
                  { val: 0, label: 'All' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setLookbackDays(opt.val)}
                    className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      lookbackDays === opt.val
                        ? 'bg-zinc-800 text-amber-200'
                        : 'text-zinc-500 hover:text-zinc-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Forecast Horizon */}
              <select
                value={horizonDays}
                onChange={(e) => setHorizonDays(Number(e.target.value))}
                title="How many days ahead to predict resource demand"
                className="px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-semibold text-amber-200 focus:outline-none focus:border-amber-500/60 cursor-pointer"
              >
                <option value={1}>Predict: 1 Day</option>
                <option value={3}>Predict: 3 Days</option>
                <option value={7}>Predict: 7 Days</option>
                <option value={14}>Predict: 14 Days</option>
                <option value={30}>Predict: 30 Days</option>
              </select>

              {/* Average Basis Toggle */}
              <div
                className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]"
                title="Calendar Span divides by elapsed days since your first sale in range; Active Days divides only by days you actually made sales."
              >
                <button
                  type="button"
                  onClick={() => setAverageBasis('span')}
                  className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    averageBasis === 'span'
                      ? 'bg-amber-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Daily Avg
                </button>
                <button
                  type="button"
                  onClick={() => setAverageBasis('active')}
                  className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    averageBasis === 'active'
                      ? 'bg-amber-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Active Days
                </button>
              </div>

              {/* Copy Restock List */}
              {resourceForecast.length > 0 && (
                <button
                  type="button"
                  onClick={handleCopyRestockList}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy List</span>
                </button>
              )}
            </>
          )}

          {!onClose && (
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-semibold text-zinc-300 cursor-pointer"
            >
              {collapsed ? 'Expand' : 'Hide'}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Empty State */}
          {summary.totalSalesEntries === 0 && resourceForecast.length === 0 ? (
            <div className="py-7 px-4 text-center rounded-xl bg-zinc-950/60 border border-dashed border-zinc-800 space-y-2">
              <p className="text-xs text-zinc-300 font-semibold">
                {summary.totalAllTimeSales > 0
                  ? `No sales recorded in the last ${lookbackDays} days.`
                  : 'No sales recorded yet to calculate daily averages.'}
              </p>
              <p className="text-[11px] text-zinc-500 max-w-md mx-auto">
                {summary.totalAllTimeSales > 0
                  ? 'Switch the lookback window to All History to forecast from older sales.'
                  : 'Log a few sales from the Dashboard or Public Price List and this panel will automatically compute your daily pace and predict the exact ores, ingots, and leather you need.'}
              </p>
              {summary.totalAllTimeSales > 0 && lookbackDays !== 0 && (
                <button
                  type="button"
                  onClick={() => setLookbackDays(0)}
                  className="mt-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold cursor-pointer"
                >
                  Switch to All History ({summary.totalAllTimeSales} sales)
                </button>
              )}
            </div>
          ) : (
            <>
              {/* 4 Mini KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 tabular-nums">
                <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Avg Sold / Day
                  </div>
                  <div className="text-sm font-serif font-bold text-zinc-100 mt-0.5">
                    {fmtRate(summary.avgUnitsPerDay)} wares/day
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Today: <span className="text-zinc-300 font-semibold">{summary.todayUnits}</span>{' '}
                    • {fmtRate(summary.avgOrdersPerDay)} orders/day
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Avg Revenue / Day
                  </div>
                  <div className="text-sm font-serif font-bold text-amber-300 mt-0.5">
                    {fmtGold(summary.avgRevenuePerDay)}/day
                  </div>
                  <div className="text-[10px] text-emerald-400/90 mt-0.5">
                    +{fmtGold(summary.avgProfitPerDay)} net/day
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                    {horizonDays}-Day Shortfall
                  </div>
                  <div
                    className={`text-sm font-serif font-bold mt-0.5 ${
                      summary.totalShortfallMaterials > 0 ? 'text-amber-300' : 'text-emerald-400'
                    }`}
                  >
                    {summary.totalShortfallMaterials > 0
                      ? `${summary.totalShortfallMaterials} resources (${summary.totalShortfallUnits} units)`
                      : 'All Covered'}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {summary.totalShortfallMaterials > 0
                      ? `Est. restock ~${fmtGold(summary.totalEstimatedRestockCost)}`
                      : `Vault covers next ${horizonDays}D`}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Tightest Resource
                  </div>
                  {summary.bottleneck ? (
                    <>
                      <div className="text-sm font-bold text-zinc-100 mt-0.5 truncate">
                        {summary.bottleneck.material.name}
                      </div>
                      <div
                        className={`text-[10px] font-semibold mt-0.5 ${
                          summary.bottleneck.daysOfCover < 2
                            ? 'text-red-400'
                            : summary.bottleneck.daysOfCover < horizonDays
                            ? 'text-amber-300'
                            : 'text-emerald-400'
                        }`}
                      >
                        {fmtRunway(summary.bottleneck.daysOfCover)} runway (
                        {summary.bottleneck.currentStock} in vault)
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-bold text-zinc-500 mt-0.5">—</div>
                  )}
                </div>
              </div>

              {/* Forecast Options Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800/70 text-[11px]">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandSmeltedToRaw((prev) => !prev)}
                    className={`px-2 py-0.5 rounded border font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      expandSmeltedToRaw
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                    title="Expand smelted ingots into the raw ores and fuel needed to smelt them"
                  >
                    <Flame className="w-3 h-3" />
                    <span>
                      {expandSmeltedToRaw ? 'Mode: Raw Ore & Fuel' : 'Mode: Direct Ingots & Parts'}
                    </span>
                  </button>

                  {summary.pendingOrdersCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setIncludePendingOrders((prev) => !prev)}
                      className={`px-2 py-0.5 rounded border font-semibold cursor-pointer transition-colors ${
                        includePendingOrders
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      + {summary.pendingOrdersCount} Pending{' '}
                      {summary.pendingOrdersCount === 1 ? 'Order' : 'Orders'}
                    </button>
                  )}

                  <div className="inline-flex items-center gap-1 text-zinc-400">
                    <span className="text-[10px]">Safety Buffer:</span>
                    {[0, 15, 25].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setSafetyBufferPct(pct)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                          safetyBufferPct === pct
                            ? 'bg-zinc-800 text-amber-200 border border-amber-500/40'
                            : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        {pct === 0 ? 'None' : `+${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {summary.unmatchedSalesCount > 0 && (
                  <span className="text-[10px] text-zinc-500">
                    Note: {summary.unmatchedSalesCount} custom{' '}
                    {summary.unmatchedSalesCount === 1 ? 'sale had' : 'sales had'} no saved recipe
                  </span>
                )}
              </div>

              {/* Main Split: Left = Daily Sales & What You Sell | Right = Predicted Resources */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">
                {/* Left: What You Sell & Daily Log */}
                <div className="xl:col-span-5 bg-zinc-950/75 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSalesSubTab('wares')}
                        className={`px-2.5 py-0.5 rounded font-semibold flex items-center gap-1 cursor-pointer ${
                          salesSubTab === 'wares'
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>Avg by Ware ({itemVelocity.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSalesSubTab('daily')}
                        className={`px-2.5 py-0.5 rounded font-semibold flex items-center gap-1 cursor-pointer ${
                          salesSubTab === 'daily'
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Sold Per Day ({dailyBreakdown.length})</span>
                      </button>
                    </div>
                  </div>

                  {salesSubTab === 'wares' ? (
                    itemVelocity.length === 0 ? (
                      <div className="py-8 text-center text-xs text-zinc-500">
                        No wares sold in this window.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {itemVelocity.map((item) => {
                          const barPct = Math.max(
                            6,
                            Math.round((item.totalQty / maxItemQty) * 100)
                          );
                          return (
                            <div
                              key={item.key}
                              className="p-2 rounded-lg bg-zinc-900/75 border border-zinc-800/80 space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <div className="min-w-0 flex items-center gap-1.5">
                                  <span className="font-semibold text-zinc-100 truncate">
                                    {item.itemName}
                                  </span>
                                  {!item.hasRecipe && (
                                    <span className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px] shrink-0">
                                      No recipe
                                    </span>
                                  )}
                                </div>
                                <div className="shrink-0 tabular-nums text-right">
                                  <span className="font-bold text-amber-300">
                                    {fmtRate(item.avgQtyPerDay)}/day
                                  </span>
                                  <span className="text-[10px] text-zinc-500 ml-1.5">
                                    (~{Math.ceil(item.projectedQty)} in {horizonDays}d)
                                  </span>
                                </div>
                              </div>

                              <div className="h-1.5 rounded-full bg-zinc-950 overflow-hidden">
                                <div
                                  style={{ width: `${barPct}%` }}
                                  className="h-full rounded-full bg-amber-400/85"
                                />
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-zinc-500 tabular-nums">
                                <span>
                                  {item.totalQty} sold ({item.sharePct}% share •{' '}
                                  {fmtGold(item.totalRevenue)})
                                </span>
                                {item.recipeList.length > 0 && (
                                  <span className="truncate max-w-[60%] text-zinc-400">
                                    Uses:{' '}
                                    {item.recipeList
                                      .slice(0, 3)
                                      .map((r) => `${r.qty}× ${r.name}`)
                                      .join(', ')}
                                    {item.recipeList.length > 3 ? '…' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : dailyBreakdown.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      No daily sales in this window.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {dailyBreakdown.map((day) => (
                        <div
                          key={day.date}
                          className="p-2.5 rounded-lg bg-zinc-900/75 border border-zinc-800/80 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-semibold text-zinc-100">
                                {formatShortDate(day.date)}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  day.vsAvgPct > 10
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : day.vsAvgPct < -10
                                    ? 'bg-red-500/15 text-red-300'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {day.vsAvgPct > 0 ? `+${day.vsAvgPct}%` : `${day.vsAvgPct}%`} vs avg
                              </span>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="font-bold text-zinc-100">{day.units} wares</span>
                              <span className="font-bold text-amber-300">
                                {fmtGold(day.revenue)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {day.items.map((it) => (
                              <span
                                key={it.itemName}
                                className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 tabular-nums"
                              >
                                <strong className="text-amber-300">{it.qty}×</strong> {it.itemName}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Predicted Resource Needs */}
                <div className="xl:col-span-7 bg-zinc-950/75 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-zinc-100">
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Predicted Resources Needed ({horizonDays}{' '}
                        {horizonDays === 1 ? 'Day' : 'Days'})
                      </span>
                    </div>

                    <div className="inline-flex p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setResourceFilter('all')}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          resourceFilter === 'all'
                            ? 'bg-zinc-800 text-amber-200'
                            : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        All ({resourceForecast.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setResourceFilter('shortfall')}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          resourceFilter === 'shortfall'
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                            : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        Shortfalls ({summary.totalShortfallMaterials})
                      </button>
                    </div>
                  </div>

                  {visibleResources.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-lg flex flex-col items-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
                      <span>
                        {resourceFilter === 'shortfall'
                          ? `No predicted shortfalls — your vault covers the next ${horizonDays} days!`
                          : 'No recipe materials matched your recent sales yet.'}
                      </span>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto pr-1">
                      <table className="w-full text-left border-collapse text-xs tabular-nums">
                        <thead className="sticky top-0 bg-zinc-950 z-10 border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500">
                          <tr>
                            <th className="py-1.5 pr-2 font-semibold">Resource</th>
                            <th className="py-1.5 px-2 font-semibold text-right">Use / Day</th>
                            <th className="py-1.5 px-2 font-semibold text-right">
                              Need ({horizonDays}D)
                            </th>
                            <th className="py-1.5 px-2 font-semibold text-right">In Vault</th>
                            <th className="py-1.5 px-2 font-semibold text-right">Runway</th>
                            <th className="py-1.5 pl-2 font-semibold text-right">To Get</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                          {visibleResources.map((row) => {
                            const isCritical = row.urgency === 'critical';
                            const isShort = row.urgency === 'short';
                            return (
                              <tr
                                key={row.matId}
                                className={`hover:bg-zinc-900/60 transition-colors ${
                                  isCritical
                                    ? 'bg-red-500/[0.04]'
                                    : isShort
                                    ? 'bg-amber-500/[0.03]'
                                    : ''
                                }`}
                              >
                                <td className="py-2 pr-2">
                                  <div className="flex items-center gap-1.5">
                                    {isCritical && (
                                      <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                                    )}
                                    {isShort && (
                                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                    )}
                                    <span className="font-semibold text-zinc-100">
                                      {row.material.name}
                                    </span>
                                  </div>
                                  {row.topDrivers.length > 0 && (
                                    <div className="text-[10px] text-zinc-500 truncate max-w-[230px]">
                                      {row.topDrivers
                                        .map((d) => `${d.name} (${d.pct}%)`)
                                        .join(' • ')}
                                    </div>
                                  )}
                                </td>

                                <td className="py-2 px-2 text-right text-zinc-300">
                                  {fmtRate(row.avgPerDay)}/d
                                </td>

                                <td className="py-2 px-2 text-right">
                                  <span className="font-bold text-zinc-100">
                                    {row.totalRequired}
                                  </span>
                                  {row.pendingOrderNeed > 0 && (
                                    <div className="text-[9px] text-emerald-400">
                                      +{row.pendingOrderNeed} orders
                                    </div>
                                  )}
                                </td>

                                <td className="py-2 px-2 text-right text-zinc-300">
                                  {row.currentStock}
                                </td>

                                <td className="py-2 px-2 text-right font-semibold">
                                  <span
                                    className={
                                      row.daysOfCover < 2
                                        ? 'text-red-400'
                                        : row.daysOfCover < horizonDays
                                        ? 'text-amber-300'
                                        : 'text-emerald-400'
                                    }
                                  >
                                    {fmtRunway(row.daysOfCover)}
                                  </span>
                                </td>

                                <td className="py-2 pl-2 text-right">
                                  {row.shortfall > 0 ? (
                                    <div>
                                      <span
                                        className={`inline-block px-1.5 py-0.5 rounded font-bold ${
                                          isCritical
                                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                            : 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                                        }`}
                                      >
                                        +{row.shortfall}
                                      </span>
                                      {row.estimatedRestockCost > 0 && (
                                        <div className="text-[10px] text-zinc-500 mt-0.5">
                                          ~{fmtGold(row.estimatedRestockCost)}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[11px] font-semibold text-emerald-400">
                                      Covered
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
