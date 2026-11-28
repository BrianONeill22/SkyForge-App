import React, { useState, useMemo, useEffect } from 'react';
import {
  useForgeAuth,
  useForgeLedgerContext,
  useForgeToast
} from '../../../context/ForgeContext';
import { getLocalDateString } from '../../../utils/formatters';

export default function StockTrendChart() {
  const { materials, resolvedMaterials, materialTrendHistory, recordStockSnapshot } =
    useForgeLedgerContext();
  const { canEditStock } = useForgeAuth();
  const { showToast } = useForgeToast();

  const [selectedTrendMatId, setSelectedTrendMatId] = useState('ALL');

  // Reset selector if a previously selected material was deleted
  useEffect(() => {
    if (
      selectedTrendMatId !== 'ALL' &&
      !resolvedMaterials.some((m) => m.id === selectedTrendMatId)
    ) {
      setSelectedTrendMatId('ALL');
    }
  }, [resolvedMaterials, selectedTrendMatId]);

  const points = useMemo(() => {
    const list = materialTrendHistory.map((snap) => ({
      date: snap.date,
      value:
        selectedTrendMatId === 'ALL'
          ? snap.totalUnits
          : Number(snap.byMaterial?.[selectedTrendMatId]) || 0
    }));
    const todayStr = getLocalDateString(0);
    const liveVal =
      selectedTrendMatId === 'ALL'
        ? resolvedMaterials.reduce((s, m) => s + (Number(m.stock) || 0), 0)
        : Number(resolvedMaterials.find((m) => m.id === selectedTrendMatId)?.stock) || 0;

    if (list.length === 0 || list[list.length - 1].date !== todayStr) {
      list.push({ date: todayStr, value: liveVal });
    } else {
      list[list.length - 1] = { date: todayStr, value: liveVal };
    }
    return list;
  }, [materialTrendHistory, selectedTrendMatId, resolvedMaterials]);

  const firstVal = points[0]?.value ?? 0;
  const lastVal = points[points.length - 1]?.value ?? 0;
  const diff = lastVal - firstVal;

  const maxVal = Math.max(10, ...points.map((p) => p.value));
  const w = 640;
  const h = 120;
  const padX = 28;
  const padY = 20;
  const coords = points.map((p, idx) => {
    const x =
      points.length === 1 ? w / 2 : padX + (idx / (points.length - 1)) * (w - padX * 2);
    const y = h - padY - (p.value / maxVal) * (h - padY * 2);
    return { ...p, x, y };
  });
  const polyPoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const strokeColor = diff < 0 ? '#f87171' : '#fbbf24';

  return (
    <div className="xl:col-span-7 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-serif font-bold text-zinc-100">Resource Stock Trend</h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                diff < 0
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : diff > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {diff < 0 ? `Down (${diff})` : diff > 0 ? `Up (+${diff})` : 'Steady'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Tracks vault ores, ingots, and fuel reserves over time.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={selectedTrendMatId}
            onChange={(e) => setSelectedTrendMatId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
          >
            <option value="ALL">All Vault Resources</option>
            {resolvedMaterials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.stock})
              </option>
            ))}
          </select>
          {canEditStock && (
            <button
              type="button"
              onClick={() => {
                recordStockSnapshot(materials);
                showToast('Logged today’s resource snapshot!');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
            >
              Snapshot
            </button>
          )}
        </div>
      </div>

      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-2.5">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28 overflow-visible">
          {coords.length > 1 && (
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polyPoints}
            />
          )}
          {coords.map((pt) => (
            <g key={pt.date}>
              <circle cx={pt.x} cy={pt.y} r="4.5" fill={strokeColor} />
              <text
                x={pt.x}
                y={pt.y - 8}
                textAnchor="middle"
                fill="#e4e4e7"
                fontSize="10"
                fontWeight="bold"
              >
                {pt.value}
              </text>
              <text x={pt.x} y={h - 3} textAnchor="middle" fill="#71717a" fontSize="9">
                {pt.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
