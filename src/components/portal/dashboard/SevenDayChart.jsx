import React, { useState, useMemo } from 'react';
import { buildDailyPerformanceData } from '../../../utils/pricing';

function formatCompactGold(val) {
  if (val >= 10000) return `${(val / 1000).toFixed(0)}k`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
  return `${val}g`;
}

export default function SevenDayChart({ sales, purchases }) {
  const [rangeDays, setRangeDays] = useState(7);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showProfit, setShowProfit] = useState(true);
  const [showSpent, setShowSpent] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);

  const data = useMemo(
    () => buildDailyPerformanceData(sales, purchases, rangeDays),
    [sales, purchases, rangeDays]
  );

  const summary = useMemo(() => {
    const totalRev = data.reduce((s, d) => s + d.revenue, 0);
    const totalProfit = data.reduce((s, d) => s + d.profit, 0);
    const totalSpent = data.reduce((s, d) => s + d.spent, 0);
    const totalUnits = data.reduce((s, d) => s + d.units, 0);
    const bestDay = data.reduce(
      (best, d) => (d.revenue > (best?.revenue || 0) ? d : best),
      null
    );
    const avgRev = Math.round(totalRev / Math.max(1, data.length));
    return { totalRev, totalProfit, totalSpent, totalUnits, bestDay, avgRev };
  }, [data]);

  const maxVal = useMemo(() => {
    const candidates = data.map((d) =>
      Math.max(
        showRevenue ? d.revenue : 0,
        showProfit ? d.profit : 0,
        showSpent ? d.spent : 0
      )
    );
    const peak = Math.max(10, ...candidates);
    // Round up cleanly for readable gridlines
    if (peak <= 50) return Math.ceil(peak / 10) * 10;
    if (peak <= 500) return Math.ceil(peak / 50) * 50;
    return Math.ceil(peak / 100) * 100;
  }, [data, showRevenue, showProfit, showSpent]);

  const hoveredDay = useMemo(
    () => data.find((d) => d.date === hoveredDate) || null,
    [data, hoveredDate]
  );

  const labelStep = rangeDays === 7 ? 1 : rangeDays === 14 ? 2 : 5;

  return (
    <div className="xl:col-span-6 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between gap-3">
      {/* Header + Timeframe Selector */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-serif font-bold text-zinc-100">
            Daily Cash Flow &amp; Profit
          </h3>
          <p className="text-[11px] text-zinc-400">
            Hover any day to inspect revenue, profit margin, and supply spending.
          </p>
        </div>

        <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setRangeDays(d)}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
                rangeDays === d
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Live Hover Readout OR Period Summary Strip */}
      <div className="px-3 py-2 rounded-lg bg-zinc-950/90 border border-zinc-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px] tabular-nums min-h-[38px]">
        {hoveredDay ? (
          <>
            <span className="font-semibold text-zinc-200">{hoveredDay.fullLabel}</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-amber-300 font-semibold">
                Rev: {hoveredDay.revenue.toLocaleString()}g
              </span>
              <span className="text-emerald-400 font-semibold">
                Profit: +{hoveredDay.profit.toLocaleString()}g
                {hoveredDay.revenue > 0 ? ` (${hoveredDay.marginPct}%)` : ''}
              </span>
              {hoveredDay.spent > 0 && (
                <span className="text-red-300 font-semibold">
                  Spent: -{hoveredDay.spent.toLocaleString()}g
                </span>
              )}
              <span className="text-zinc-400">{hoveredDay.units} sold</span>
            </div>
          </>
        ) : (
          <>
            <span className="text-zinc-400">
              {rangeDays}d Total:{' '}
              <strong className="text-amber-300">{summary.totalRev.toLocaleString()}g</strong> rev
              {' • '}
              <strong className="text-emerald-400">
                +{summary.totalProfit.toLocaleString()}g
              </strong>{' '}
              profit
            </span>
            <span className="text-zinc-500">
              Avg <strong className="text-zinc-300">{summary.avgRev.toLocaleString()}g</strong>/day
              {summary.bestDay && summary.bestDay.revenue > 0
                ? ` • Best: ${summary.bestDay.label} (${summary.bestDay.revenue.toLocaleString()}g)`
                : ''}
            </span>
          </>
        )}
      </div>

      {/* Bar Chart Area with Horizontal Gridlines */}
      <div className="relative pt-2 pb-1">
        {/* Y-Axis Gridlines */}
        <div className="absolute inset-x-0 top-2 bottom-6 flex flex-col justify-between pointer-events-none">
          {[maxVal, Math.round(maxVal / 2), 0].map((tick) => (
            <div key={tick} className="flex items-center gap-2">
              <span className="w-9 text-right text-[9px] text-zinc-600 tabular-nums shrink-0">
                {formatCompactGold(tick)}
              </span>
              <div className="flex-1 border-b border-dashed border-zinc-800/80" />
            </div>
          ))}
        </div>

        {/* Bars Grid */}
        <div
          className="pl-11 grid items-end h-44 gap-1 relative z-10"
          style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {data.map((day, idx) => {
            const revPct = (day.revenue / maxVal) * 100;
            const profPct = (Math.max(0, day.profit) / maxVal) * 100;
            const spentPct = (day.spent / maxVal) * 100;
            const isHovered = hoveredDate === day.date;
            const showLabel = idx % labelStep === 0 || idx === data.length - 1;

            return (
              <div
                key={day.date}
                onMouseEnter={() => setHoveredDate(day.date)}
                className={`flex flex-col items-center justify-end h-full rounded-md px-0.5 transition-colors cursor-pointer ${
                  isHovered ? 'bg-zinc-800/50' : 'hover:bg-zinc-900/50'
                }`}
              >
                <div className="w-full flex items-end justify-center gap-0.5 h-36 pb-1">
                  {showRevenue && (
                    <div
                      style={{ height: `${day.revenue > 0 ? Math.max(4, revPct) : 1.5}%` }}
                      className={`flex-1 max-w-[14px] rounded-t transition-all ${
                        day.revenue > 0
                          ? isHovered
                            ? 'bg-amber-300'
                            : 'bg-amber-400/90'
                          : 'bg-zinc-800/70'
                      }`}
                    />
                  )}
                  {showProfit && (
                    <div
                      style={{ height: `${day.profit > 0 ? Math.max(4, profPct) : 1.5}%` }}
                      className={`flex-1 max-w-[14px] rounded-t transition-all ${
                        day.profit > 0
                          ? isHovered
                            ? 'bg-emerald-300'
                            : 'bg-emerald-400/90'
                          : 'bg-zinc-800/70'
                      }`}
                    />
                  )}
                  {showSpent && (
                    <div
                      style={{ height: `${day.spent > 0 ? Math.max(4, spentPct) : 1.5}%` }}
                      className={`flex-1 max-w-[14px] rounded-t transition-all ${
                        day.spent > 0
                          ? isHovered
                            ? 'bg-red-300'
                            : 'bg-red-400/85'
                          : 'bg-zinc-800/70'
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`text-[9px] font-semibold truncate h-4 leading-4 ${
                    isHovered ? 'text-amber-200' : 'text-zinc-500'
                  }`}
                >
                  {showLabel ? day.label : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Series Filter Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-[11px]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRevenue((v) => !v)}
            className={`px-2 py-0.5 rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
              showRevenue
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-amber-400" />
            <span>Revenue</span>
          </button>
          <button
            type="button"
            onClick={() => setShowProfit((v) => !v)}
            className={`px-2 py-0.5 rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
              showProfit
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-emerald-400" />
            <span>Net Profit</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSpent((v) => !v)}
            className={`px-2 py-0.5 rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
              showSpent
                ? 'bg-red-500/15 border-red-500/40 text-red-200'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500'
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-red-400" />
            <span>Purchases</span>
          </button>
        </div>

        <span className="text-[10px] text-zinc-500 tabular-nums">
          {summary.totalUnits} {summary.totalUnits === 1 ? 'ware' : 'wares'} sold in {rangeDays}d
        </span>
      </div>
    </div>
  );
}
