import React from 'react';

function DonutCard({ title, subtitle, dataset }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="p-3.5 rounded-lg bg-zinc-950/75 border border-zinc-800/80 flex flex-col justify-between gap-3">
      <div>
        <h4 className="text-xs font-serif font-bold text-amber-200">{title}</h4>
        <p className="text-[10px] text-zinc-500">{subtitle}</p>
      </div>

      {dataset.slices.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500">
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
                strokeWidth="16"
              />
              {dataset.slices.map((slice) => {
                const dashLength = (slice.pct / 100) * circumference;
                const dashOffset = -(slice.startPct / 100) * circumference;
                return (
                  <circle
                    key={slice.label}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="16"
                    strokeDasharray={`${dashLength} ${circumference}`}
                    strokeDashoffset={dashOffset}
                  >
                    <title>
                      {slice.label}: {slice.value.toLocaleString()}g ({slice.pct.toFixed(1)}%)
                    </title>
                  </circle>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[8px] uppercase tracking-wider text-zinc-500">Total</span>
              <span className="text-[11px] font-bold text-zinc-100">
                {dataset.grandTotal.toLocaleString()}g
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {dataset.slices.map((slice) => (
              <div
                key={slice.label}
                className="flex items-center justify-between gap-1.5 text-[11px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    style={{ backgroundColor: slice.color }}
                    className="w-2 h-2 rounded-xs shrink-0"
                  />
                  <span className="text-zinc-200 truncate">{slice.label}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-semibold text-zinc-100">
                    {slice.value.toLocaleString()}g
                  </span>{' '}
                  <span className="text-zinc-500">({Math.round(slice.pct)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BreakdownCharts({ metricMode, onChangeMetricMode, data }) {
  return (
    <div className="xl:col-span-7 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-serif font-bold text-zinc-100">
            Earnings Breakdown by Category &amp; Sub-Type
          </h3>
          <p className="text-[11px] text-zinc-400">
            Share of gold earned across categories and material tiers.
          </p>
        </div>
        <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
          <button
            type="button"
            onClick={() => onChangeMetricMode('revenue')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
              metricMode === 'revenue'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Gross Revenue
          </button>
          <button
            type="button"
            onClick={() => onChangeMetricMode('profit')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
              metricMode === 'profit'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Net Profit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <DonutCard
          title="By Category"
          subtitle="Weapons, Armor, Ingots & Materials"
          dataset={data.byCategory}
        />
        <DonutCard
          title="By Sub-Type / Tier"
          subtitle="Iron, Steel, Ebony, Smelted Ingots, etc."
          dataset={data.bySubType}
        />
      </div>
    </div>
  );
}
