import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  useForgeAuth,
  useForgeLedgerContext,
  useForgeToast
} from '../../../context/ForgeContext';
import { getLocalDateString } from '../../../utils/formatters';

export default function StockTrendChart({ onClose }) {
  const { materials, resolvedMaterials, materialTrendHistory, recordStockSnapshot } =
    useForgeLedgerContext();
  const { canEditStock } = useForgeAuth();
  const { showToast } = useForgeToast();

  const [selectedTrendMatId, setSelectedTrendMatId] = useState('ALL');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    if (
      selectedTrendMatId !== 'ALL' &&
      !resolvedMaterials.some((m) => m.id === selectedTrendMatId)
    ) {
      setSelectedTrendMatId('ALL');
    }
  }, [resolvedMaterials, selectedTrendMatId]);

  const selectedMaterial = useMemo(
    () =>
      selectedTrendMatId === 'ALL'
        ? null
        : resolvedMaterials.find((m) => m.id === selectedTrendMatId) || null,
    [resolvedMaterials, selectedTrendMatId]
  );

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
        : Number(selectedMaterial?.stock) || 0;

    if (list.length === 0 || list[list.length - 1].date !== todayStr) {
      list.push({ date: todayStr, value: liveVal });
    } else {
      list[list.length - 1] = { date: todayStr, value: liveVal };
    }
    return list;
  }, [materialTrendHistory, selectedTrendMatId, resolvedMaterials, selectedMaterial]);

  const firstVal = points[0]?.value ?? 0;
  const lastVal = points[points.length - 1]?.value ?? 0;
  const diff = lastVal - firstVal;
  const peakVal = Math.max(0, ...points.map((p) => p.value));
  const minVal = points.length > 0 ? Math.min(...points.map((p) => p.value)) : 0;
  const lowThreshold = selectedMaterial ? Number(selectedMaterial.lowThreshold ?? 5) : null;

  const yMax = Math.max(10, peakVal, lowThreshold || 0);
  const w = 720;
  const h = 138;
  const padLeft = 36;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 24;
  const plotW = w - padLeft - padRight;
  const plotH = h - padTop - padBottom;

  const coords = points.map((p, idx) => {
    const x =
      points.length === 1
        ? padLeft + plotW / 2
        : padLeft + (idx / (points.length - 1)) * plotW;
    const y = padTop + plotH - (p.value / yMax) * plotH;
    const prevVal = idx > 0 ? points[idx - 1].value : p.value;
    return { ...p, x, y, delta: p.value - prevVal };
  });

  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const areaPath =
    coords.length > 1
      ? `M ${coords[0].x},${padTop + plotH} L ${coords.map((c) => `${c.x},${c.y}`).join(' L ')} L ${
          coords[coords.length - 1].x
        },${padTop + plotH} Z`
      : '';

  const thresholdY =
    lowThreshold !== null ? padTop + plotH - (lowThreshold / yMax) * plotH : null;

  const strokeColor = diff < 0 ? '#f87171' : diff > 0 ? '#34d399' : '#fbbf24';
  const hoveredPt = hoveredIdx !== null ? coords[hoveredIdx] : null;
  const yTicks = [yMax, Math.round(yMax / 2), 0];

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-serif font-bold text-zinc-100">Resource Stock Trend</h3>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tabular-nums ${
              diff < 0
                ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                : diff > 0
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {diff < 0 ? `Down ${diff}` : diff > 0 ? `Up +${diff}` : 'Steady'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={selectedTrendMatId}
            onChange={(e) => {
              setSelectedTrendMatId(e.target.value);
              setHoveredIdx(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
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
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
            >
              Snapshot
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

      {/* Stat Readout / Hover Inspector */}
      <div className="px-3 py-2 rounded-lg bg-zinc-950/90 border border-zinc-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px] tabular-nums">
        {hoveredPt ? (
          <>
            <span className="font-semibold text-zinc-200">{hoveredPt.date}</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-amber-300">{hoveredPt.value} units</span>
              {hoveredIdx > 0 && (
                <span
                  className={
                    hoveredPt.delta < 0
                      ? 'text-red-400 font-semibold'
                      : hoveredPt.delta > 0
                      ? 'text-emerald-400 font-semibold'
                      : 'text-zinc-500'
                  }
                >
                  {hoveredPt.delta > 0 ? `+${hoveredPt.delta}` : hoveredPt.delta} vs prior
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 text-zinc-400">
              <span>
                Current: <strong className="text-zinc-100">{lastVal}</strong>
              </span>
              <span>
                Peak: <strong className="text-emerald-300">{peakVal}</strong>
              </span>
              <span>
                Low: <strong className="text-zinc-300">{minVal}</strong>
              </span>
            </div>
            {lowThreshold !== null ? (
              <span className="text-amber-300/90">
                Low-stock alert line: <strong>{lowThreshold}</strong>
              </span>
            ) : (
              <span className="text-zinc-500">{points.length} recorded snapshots</span>
            )}
          </>
        )}
      </div>

      {/* Area Chart */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-2.5">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-32 overflow-visible"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="skyforgeTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Y-Axis Gridlines */}
          {yTicks.map((tick) => {
            const y = padTop + plotH - (tick / yMax) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={w - padRight}
                  y2={y}
                  stroke="#27272a"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="9"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Low Stock Threshold Dashed Reference Line */}
          {thresholdY !== null && (
            <g>
              <line
                x1={padLeft}
                y1={thresholdY}
                x2={w - padRight}
                y2={thresholdY}
                stroke="#f59e0b"
                strokeOpacity="0.6"
                strokeWidth="1.2"
                strokeDasharray="5 4"
              />
              <text
                x={w - padRight}
                y={thresholdY - 4}
                textAnchor="end"
                fill="#fbbf24"
                fontSize="8.5"
                fontWeight="bold"
              >
                Low ({lowThreshold})
              </text>
            </g>
          )}

          {/* Shaded Area + Line */}
          {areaPath && <path d={areaPath} fill="url(#skyforgeTrendFill)" />}
          {coords.length > 1 && (
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={linePoints}
            />
          )}

          {/* Data Points & Hover Targets */}
          {coords.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const showDateLabel =
              coords.length <= 10 ||
              idx === 0 ||
              idx === coords.length - 1 ||
              idx % Math.ceil(coords.length / 8) === 0;

            return (
              <g
                key={pt.date}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="cursor-pointer"
              >
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={padTop}
                    x2={pt.x}
                    y2={padTop + plotH}
                    stroke="#52525b"
                    strokeDasharray="2 2"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={strokeColor}
                  stroke="#18181b"
                  strokeWidth="2"
                />
                {/* Larger invisible hit area for easy hovering */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                {(isHovered || coords.length <= 8) && (
                  <text
                    x={pt.x}
                    y={pt.y - 9}
                    textAnchor="middle"
                    fill="#f4f4f5"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {pt.value}
                  </text>
                )}
                {showDateLabel && (
                  <text
                    x={pt.x}
                    y={h - 5}
                    textAnchor="middle"
                    fill={isHovered ? '#fbbf24' : '#71717a'}
                    fontSize="9"
                  >
                    {pt.date.slice(5)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
