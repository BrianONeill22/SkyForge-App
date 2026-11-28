import React from 'react';

export default function SevenDayChart({ data }) {
  const maxVal = Math.max(10, ...data.map((d) => Math.max(d.revenue, d.profit)));

  return (
    <div className="xl:col-span-5 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-serif font-bold text-zinc-100">
            7-Day Revenue &amp; Net Profit
          </h3>
          <p className="text-[11px] text-zinc-400">
            Daily Septims earned vs. profit after costs.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-amber-300">
            <span className="w-2 h-2 rounded-xs bg-amber-400" />
            Revenue
          </span>
          <span className="flex items-center gap-1 text-emerald-300">
            <span className="w-2 h-2 rounded-xs bg-emerald-400" />
            Profit
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 pt-3 pb-1 h-44 items-end border-b border-zinc-800/80">
        {data.map((day) => {
          const revPct = Math.round((day.revenue / maxVal) * 100);
          const profPct = Math.round((day.profit / maxVal) * 100);
          return (
            <div key={day.date} className="flex flex-col items-center justify-end h-full gap-1">
              <div className="text-[10px] text-zinc-400 font-medium">
                {day.revenue > 0 ? `${day.revenue}g` : ''}
              </div>
              <div className="w-full flex items-end justify-center gap-1 h-28">
                <div
                  title={`Revenue: ${day.revenue}g`}
                  style={{ height: `${Math.max(day.revenue > 0 ? 8 : 2, revPct)}%` }}
                  className="w-2.5 sm:w-3.5 rounded-t bg-amber-400/90 transition-all"
                />
                <div
                  title={`Net Profit: ${day.profit}g`}
                  style={{ height: `${Math.max(day.profit > 0 ? 8 : 2, profPct)}%` }}
                  className="w-2.5 sm:w-3.5 rounded-t bg-emerald-400/90 transition-all"
                />
              </div>
              <div className="text-[10px] font-semibold text-zinc-400">{day.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
