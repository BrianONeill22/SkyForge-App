import React, { useState } from 'react';
import { Award, Users } from 'lucide-react';

function formatMetric(value, metricMode) {
  if (metricMode === 'units') return `${value.toLocaleString()} sold`;
  return `${value.toLocaleString()}g`;
}

function InteractiveDonutCard({ title, subtitle, dataset, metricMode }) {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const activeSlice = dataset.slices.find((s) => s.label === hoveredLabel) || null;

  return (
    <div className="p-3.5 rounded-xl bg-zinc-950/75 border border-zinc-800/80 flex flex-col justify-between gap-3">
      <div>
        <h4 className="text-xs font-serif font-bold text-amber-200">{title}</h4>
        <p className="text-[10px] text-zinc-500">{subtitle}</p>
      </div>

      {dataset.slices.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800/70 rounded-lg">
          Log a sale to view distribution.
        </div>
      ) : (
        <div className="flex items-center gap-3.5">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#27272a"
                strokeWidth="15"
              />
              {dataset.slices.map((slice) => {
                const dashLength = (slice.pct / 100) * circumference;
                const dashOffset = -(slice.startPct / 100) * circumference;
                const isActive = hoveredLabel === slice.label;
                const isDimmed = hoveredLabel !== null && !isActive;

                return (
                  <circle
                    key={slice.label}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isActive ? '18' : '15'}
                    strokeDasharray={`${dashLength} ${circumference}`}
                    strokeDashoffset={dashOffset}
                    opacity={isDimmed ? 0.35 : 1}
                    onMouseEnter={() => setHoveredLabel(slice.label)}
                    onMouseLeave={() => setHoveredLabel(null)}
                    className="transition-all duration-150 cursor-pointer"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
              {activeSlice ? (
                <>
                  <span className="text-[9px] text-zinc-400 truncate max-w-[68px]">
                    {activeSlice.label}
                  </span>
                  <span className="text-[11px] font-bold text-amber-200 tabular-nums leading-tight">
                    {metricMode === 'units'
                      ? activeSlice.value.toLocaleString()
                      : `${activeSlice.value.toLocaleString()}g`}
                  </span>
                  <span className="text-[9px] text-zinc-400 tabular-nums">
                    {activeSlice.pct.toFixed(0)}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500">Total</span>
                  <span className="text-[11px] font-bold text-zinc-100 tabular-nums">
                    {metricMode === 'units'
                      ? dataset.grandTotal.toLocaleString()
                      : `${dataset.grandTotal.toLocaleString()}g`}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {dataset.slices.map((slice) => {
              const isActive = hoveredLabel === slice.label;
              return (
                <div
                  key={slice.label}
                  onMouseEnter={() => setHoveredLabel(slice.label)}
                  onMouseLeave={() => setHoveredLabel(null)}
                  className={`px-1.5 py-1 rounded transition-colors cursor-pointer ${
                    isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        style={{ backgroundColor: slice.color }}
                        className="w-2 h-2 rounded-xs shrink-0"
                      />
                      <span className="text-zinc-200 truncate">{slice.label}</span>
                    </div>
                    <div className="text-right shrink-0 tabular-nums">
                      <span className="font-semibold text-zinc-100">
                        {formatMetric(slice.value, metricMode)}
                      </span>{' '}
                      <span className="text-zinc-500">({Math.round(slice.pct)}%)</span>
                    </div>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      style={{ width: `${slice.pct}%`, backgroundColor: slice.color }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BreakdownCharts({ metricMode, onChangeMetricMode, data }) {
  const [viewTab, setViewTab] = useState('breakdown'); // 'breakdown' | 'topItems' | 'topBuyers'

  const getRowMetric = (row) => {
    if (metricMode === 'profit') return row.profit;
    if (metricMode === 'units') return row.units;
    return row.revenue;
  };

  const renderLeaderboard = (rows, emptyLabel, isBuyer = false) => {
    if (!rows || rows.length === 0) {
      return (
        <div className="py-10 text-center text-xs text-zinc-500 border border-dashed border-zinc-800/80 rounded-xl">
          {emptyLabel}
        </div>
      );
    }
    const maxMetric = Math.max(1, ...rows.map(getRowMetric));

    return (
      <div className="space-y-2">
        {rows.map((row, idx) => {
          const val = getRowMetric(row);
          const pct = Math.max(4, Math.round((val / maxMetric) * 100));
          return (
            <div
              key={row.name}
              className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-100 truncate">{row.name}</div>
                    <div className="text-[10px] text-zinc-500 tabular-nums">
                      {isBuyer
                        ? `${row.orders} ${row.orders === 1 ? 'sale' : 'sales'} • ${row.units} items`
                        : `${row.category} • ${row.units} sold • Profit +${row.profit.toLocaleString()}g`}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 tabular-nums">
                  <div className="font-bold text-amber-300">{formatMetric(val, metricMode)}</div>
                  {metricMode !== 'revenue' && (
                    <div className="text-[10px] text-zinc-500">
                      Rev {row.revenue.toLocaleString()}g
                    </div>
                  )}
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-full rounded-full transition-all ${
                    metricMode === 'profit'
                      ? 'bg-emerald-400'
                      : metricMode === 'units'
                      ? 'bg-sky-400'
                      : 'bg-amber-400'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="xl:col-span-6 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
          <button
            type="button"
            onClick={() => setViewTab('breakdown')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
              viewTab === 'breakdown'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Breakdown
          </button>
          <button
            type="button"
            onClick={() => setViewTab('topItems')}
            className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 cursor-pointer ${
              viewTab === 'topItems'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Top Wares</span>
          </button>
          <button
            type="button"
            onClick={() => setViewTab('topBuyers')}
            className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 cursor-pointer ${
              viewTab === 'topBuyers'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Top Patrons</span>
          </button>
        </div>

        <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
          {[
            { id: 'revenue', label: 'Revenue', activeClass: 'bg-amber-500/20 text-amber-200 border border-amber-500/50' },
            { id: 'profit', label: 'Profit', activeClass: 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50' },
            { id: 'units', label: 'Units', activeClass: 'bg-sky-500/20 text-sky-200 border border-sky-500/50' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onChangeMetricMode(m.id)}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                metricMode === m.id ? m.activeClass : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {viewTab === 'breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InteractiveDonutCard
            title="By Category"
            subtitle="Hover slice or item to inspect share"
            dataset={data.byCategory}
            metricMode={metricMode}
          />
          <InteractiveDonutCard
            title="By Material Tier"
            subtitle="Iron, Steel, Ebony, Ingots, etc."
            dataset={data.bySubType}
            metricMode={metricMode}
          />
        </div>
      )}

      {viewTab === 'topItems' &&
        renderLeaderboard(data.topItems, 'Log sales to rank your best-selling wares.', false)}

      {viewTab === 'topBuyers' &&
        renderLeaderboard(data.topBuyers, 'Log sales to see your top patrons.', true)}
    </div>
  );
}
