import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Layers, X } from 'lucide-react';
import {
  useForgeAuth,
  useForgeLedgerContext,
  useForgeToast
} from '../../../context/ForgeContext';
import { getLocalDateString } from '../../../utils/formatters';

function formatGold(val) {
  if (val >= 10000) return `${(val / 1000).toFixed(1)}k g`;
  return `${Math.round(val).toLocaleString()}g`;
}

export default function StockTrendChart({ onClose }) {
  const {
    materials,
    materialCategories,
    resolvedMaterials,
    materialMap,
    materialTrendHistory,
    recordStockSnapshot
  } = useForgeLedgerContext();
  const { canEditStock } = useForgeAuth();
  const { showToast } = useForgeToast();

  // Scope: 'ALL' | 'CAT:<category>' | 'MAT:<matId>'
  const [scope, setScope] = useState('ALL');
  const [metric, setMetric] = useState('units'); // 'units' | 'value'
  const [rangeLimit, setRangeLimit] = useState(14); // 7 | 14 | 30 | 0 (All)
  const [insightTab, setInsightTab] = useState('health'); // 'health' | 'movers'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Guard against deleted material or category
  useEffect(() => {
    if (scope.startsWith('MAT:')) {
      const id = scope.slice(4);
      if (!resolvedMaterials.some((m) => m.id === id)) setScope('ALL');
    } else if (scope.startsWith('CAT:')) {
      const cat = scope.slice(4);
      if (!materialCategories.includes(cat)) setScope('ALL');
    }
  }, [scope, resolvedMaterials, materialCategories]);

  const scopedMaterials = useMemo(() => {
    if (scope === 'ALL') return resolvedMaterials;
    if (scope.startsWith('CAT:')) {
      const cat = scope.slice(4);
      return resolvedMaterials.filter((m) => m.category === cat);
    }
    if (scope.startsWith('MAT:')) {
      const id = scope.slice(4);
      return resolvedMaterials.filter((m) => m.id === id);
    }
    return resolvedMaterials;
  }, [scope, resolvedMaterials]);

  const selectedSingleMat = scope.startsWith('MAT:') ? scopedMaterials[0] || null : null;

  // Build normalized snapshot timeline for the chosen scope & metric
  const points = useMemo(() => {
    const computeSnapshotMetrics = (byMat) => {
      let units = 0;
      let goldValue = 0;
      scopedMaterials.forEach((m) => {
        const st = Number(byMat?.[m.id]) || 0;
        units += st;
        goldValue += st * (Number(m.buyPrice) || 0);
      });
      return { units, goldValue };
    };

    const list = materialTrendHistory.map((snap) => {
      const { units, goldValue } = computeSnapshotMetrics(snap.byMaterial || {});
      return {
        date: snap.date,
        units,
        goldValue,
        value: metric === 'value' ? goldValue : units
      };
    });

    const todayStr = getLocalDateString(0);
    const liveUnits = scopedMaterials.reduce((s, m) => s + (Number(m.stock) || 0), 0);
    const liveGold = scopedMaterials.reduce(
      (s, m) => s + (Number(m.stock) || 0) * (Number(m.buyPrice) || 0),
      0
    );
    const livePoint = {
      date: todayStr,
      units: liveUnits,
      goldValue: liveGold,
      value: metric === 'value' ? liveGold : liveUnits
    };

    if (list.length === 0 || list[list.length - 1].date !== todayStr) {
      list.push(livePoint);
    } else {
      list[list.length - 1] = livePoint;
    }

    if (rangeLimit > 0 && list.length > rangeLimit) {
      return list.slice(-rangeLimit);
    }
    return list;
  }, [materialTrendHistory, scopedMaterials, metric, rangeLimit]);

  const stats = useMemo(() => {
    const first = points[0] || { value: 0, units: 0, goldValue: 0 };
    const last = points[points.length - 1] || { value: 0, units: 0, goldValue: 0 };
    const diff = last.value - first.value;
    const pctChange = first.value > 0 ? Math.round((diff / first.value) * 100) : 0;
    const peak = Math.max(0, ...points.map((p) => p.value));
    const low = points.length > 0 ? Math.min(...points.map((p) => p.value)) : 0;
    const avg = Math.round(points.reduce((s, p) => s + p.value, 0) / Math.max(1, points.length));
    const lowCount = scopedMaterials.filter(
      (m) => (Number(m.stock) || 0) <= (m.lowThreshold ?? 5)
    ).length;

    return {
      currentUnits: last.units,
      currentGold: last.goldValue,
      currentVal: last.value,
      diff,
      pctChange,
      peak,
      low,
      avg,
      lowCount
    };
  }, [points, scopedMaterials]);

  // Category breakdown (for Health view when scope === 'ALL')
  const categoryBreakdown = useMemo(() => {
    const totalAllUnits = Math.max(
      1,
      resolvedMaterials.reduce((s, m) => s + (Number(m.stock) || 0), 0)
    );
    const totalAllGold = Math.max(
      1,
      resolvedMaterials.reduce(
        (s, m) => s + (Number(m.stock) || 0) * (Number(m.buyPrice) || 0),
        0
      )
    );

    return materialCategories
      .map((cat) => {
        const items = resolvedMaterials.filter((m) => m.category === cat);
        const units = items.reduce((s, m) => s + (Number(m.stock) || 0), 0);
        const goldValue = items.reduce(
          (s, m) => s + (Number(m.stock) || 0) * (Number(m.buyPrice) || 0),
          0
        );
        const lowCount = items.filter(
          (m) => (Number(m.stock) || 0) <= (m.lowThreshold ?? 5)
        ).length;
        const sharePct =
          metric === 'value'
            ? Math.round((goldValue / totalAllGold) * 100)
            : Math.round((units / totalAllUnits) * 100);
        return { cat, units, goldValue, lowCount, count: items.length, sharePct };
      })
      .filter((c) => c.count > 0)
      .sort((a, b) =>
        metric === 'value' ? b.goldValue - a.goldValue : b.units - a.units
      );
  }, [materialCategories, resolvedMaterials, metric]);

  // Restock Priority list (lowest stock relative to threshold)
  const restockPriority = useMemo(() => {
    return scopedMaterials
      .map((m) => {
        const stock = Number(m.stock) || 0;
        const threshold = Math.max(1, Number(m.lowThreshold ?? 5));
        const ratio = stock / threshold;
        const deficit = Math.max(0, threshold - stock);
        return { mat: m, stock, threshold, ratio, deficit };
      })
      .sort((a, b) => a.ratio - b.ratio || a.stock - b.stock)
      .slice(0, 6);
  }, [scopedMaterials]);

  // Top Movers (compare earliest snapshot in range vs live current stock)
  const movers = useMemo(() => {
    const windowSnaps =
      rangeLimit > 0 && materialTrendHistory.length > rangeLimit
        ? materialTrendHistory.slice(-rangeLimit)
        : materialTrendHistory;
    const baseline = windowSnaps[0]?.byMaterial || {};

    const deltas = scopedMaterials
      .map((m) => {
        const current = Number(m.stock) || 0;
        const start = Number(baseline[m.id] ?? current);
        const delta = current - start;
        return {
          mat: m,
          start,
          current,
          delta,
          goldDelta: delta * (Number(m.buyPrice) || 0)
        };
      })
      .filter((d) => d.delta !== 0);

    const drained = [...deltas]
      .filter((d) => d.delta < 0)
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 4);
    const gained = [...deltas]
      .filter((d) => d.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 4);

    return { drained, gained, hasAny: drained.length > 0 || gained.length > 0 };
  }, [materialTrendHistory, rangeLimit, scopedMaterials]);

  // SVG Geometry
  const lowThresholdVal =
    selectedSingleMat && metric === 'units'
      ? Number(selectedSingleMat.lowThreshold ?? 5)
      : null;

  const yMax = Math.max(10, stats.peak, lowThresholdVal || 0);
  const w = 640;
  const h = 152;
  const padLeft = 42;
  const padRight = 16;
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

  const avgY =
    coords.length > 1 ? padTop + plotH - (stats.avg / yMax) * plotH : null;
  const thresholdY =
    lowThresholdVal !== null ? padTop + plotH - (lowThresholdVal / yMax) * plotH : null;

  const strokeColor = stats.diff < 0 ? '#f87171' : stats.diff > 0 ? '#34d399' : '#fbbf24';
  const hoveredPt = hoveredIdx !== null ? coords[hoveredIdx] : null;
  const yTicks = [yMax, Math.round(yMax / 2), 0];

  const scopeLabel =
    scope === 'ALL'
      ? 'All Vault Resources'
      : scope.startsWith('CAT:')
      ? `${scope.slice(4)} (Group)`
      : materialMap[scope.slice(4)]?.name || 'Material';

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5 shadow-lg shadow-black/20">
      {/* Header Row: Title + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-serif font-bold text-zinc-100">
            Vault Resource Analytics
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tabular-nums flex items-center gap-0.5 ${
              stats.diff < 0
                ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                : stats.diff > 0
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {stats.diff < 0 ? (
              <>
                <ArrowDownRight className="w-3 h-3" />
                {metric === 'value'
                  ? `-${formatGold(Math.abs(stats.diff))}`
                  : Math.round(stats.diff).toLocaleString()}
              </>
            ) : stats.diff > 0 ? (
              <>
                <ArrowUpRight className="w-3 h-3" />+
                {metric === 'value'
                  ? formatGold(stats.diff)
                  : Math.round(stats.diff).toLocaleString()}
              </>
            ) : (
              'Steady'
            )}
            {stats.pctChange !== 0 ? ` (${stats.pctChange > 0 ? '+' : ''}${stats.pctChange}%)` : ''}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Scope Selector: All / By Group / Single Material */}
          <select
            value={scope}
            onChange={(e) => {
              setScope(e.target.value);
              setHoveredIdx(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60"
          >
            <option value="ALL">All Vault Resources</option>
            <optgroup label="By Resource Group">
              {materialCategories.map((cat) => (
                <option key={`CAT:${cat}`} value={`CAT:${cat}`}>
                  Group: {cat}
                </option>
              ))}
            </optgroup>
            <optgroup label="Single Resource">
              {resolvedMaterials.map((m) => (
                <option key={`MAT:${m.id}`} value={`MAT:${m.id}`}>
                  {m.name} ({m.stock})
                </option>
              ))}
            </optgroup>
          </select>

          {/* Units vs Gold Value Toggle */}
          <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setMetric('units')}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                metric === 'units'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Units
            </button>
            <button
              type="button"
              onClick={() => setMetric('value')}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                metric === 'value'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Value (g)
            </button>
          </div>

          {/* Range Selector */}
          <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
            {[
              { val: 7, label: '7D' },
              { val: 14, label: '14D' },
              { val: 30, label: '30D' }
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => setRangeLimit(r.val)}
                className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                  rangeLimit === r.val
                    ? 'bg-zinc-800 text-amber-200'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

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

      {/* 4 Mini KPI Cards for Current Scope */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 tabular-nums">
        <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Current Stock</div>
          <div className="text-sm font-serif font-bold text-zinc-100 mt-0.5">
            {stats.currentUnits.toLocaleString()} units
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Vault Gold Value</div>
          <div className="text-sm font-serif font-bold text-amber-300 mt-0.5">
            {formatGold(stats.currentGold)}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Range (Min – Peak)
          </div>
          <div className="text-sm font-bold text-zinc-200 mt-0.5">
            {metric === 'value'
              ? `${formatGold(stats.low)} – ${formatGold(stats.peak)}`
              : `${stats.low} – ${stats.peak}`}
            <span className="text-[10px] font-normal text-zinc-500 ml-1.5">
              avg {metric === 'value' ? formatGold(stats.avg) : stats.avg}
            </span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Stock Health</div>
          {selectedSingleMat ? (
            <div className="text-sm font-bold mt-0.5">
              {stats.currentUnits <= (selectedSingleMat.lowThreshold ?? 5) ? (
                <span className="text-amber-300">
                  Low (min {selectedSingleMat.lowThreshold ?? 5})
                </span>
              ) : (
                <span className="text-emerald-400">
                  Healthy (min {selectedSingleMat.lowThreshold ?? 5})
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm font-bold mt-0.5">
              <span className={stats.lowCount > 0 ? 'text-amber-300' : 'text-emerald-400'}>
                {stats.lowCount} / {scopedMaterials.length} low
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Split: Trend Chart (Left) + Health & Movers Insights (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">
        {/* Left: Area Chart */}
        <div className="xl:col-span-7 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] tabular-nums min-h-[22px]">
            {hoveredPt ? (
              <>
                <span className="font-semibold text-zinc-200">{hoveredPt.date}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-zinc-100">{hoveredPt.units} units</span>
                  <span className="font-bold text-amber-300">
                    {formatGold(hoveredPt.goldValue)}
                  </span>
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
                      {hoveredPt.delta > 0
                        ? `+${Math.round(hoveredPt.delta).toLocaleString()}`
                        : Math.round(hoveredPt.delta).toLocaleString()}
                      {metric === 'value' ? 'g' : ''} vs prior
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="font-semibold text-zinc-300 truncate">{scopeLabel}</span>
                <span className="text-zinc-500">
                  {points.length === 1
                    ? 'More points log automatically as stock changes'
                    : `${points.length} daily snapshots • Hover points to inspect`}
                </span>
              </>
            )}
          </div>

          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="w-full h-36 overflow-visible"
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
                    {metric === 'value' && tick >= 1000
                      ? `${(tick / 1000).toFixed(1)}k`
                      : tick}
                  </text>
                </g>
              );
            })}

            {/* Average Reference Line */}
            {avgY !== null && (
              <line
                x1={padLeft}
                y1={avgY}
                x2={w - padRight}
                y2={avgY}
                stroke="#71717a"
                strokeOpacity="0.45"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            )}

            {/* Low-Stock Alert Threshold Line (for single material) */}
            {thresholdY !== null && (
              <g>
                <line
                  x1={padLeft}
                  y1={thresholdY}
                  x2={w - padRight}
                  y2={thresholdY}
                  stroke="#f59e0b"
                  strokeOpacity="0.65"
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
                  Low Alert ({lowThresholdVal})
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

            {/* Interactive Points */}
            {coords.map((pt, idx) => {
              const isHovered = hoveredIdx === idx;
              const showDateLabel =
                coords.length <= 10 ||
                idx === 0 ||
                idx === coords.length - 1 ||
                idx % Math.ceil(coords.length / 7) === 0;

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
                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                  {(isHovered || coords.length <= 7) && (
                    <text
                      x={pt.x}
                      y={pt.y - 9}
                      textAnchor="middle"
                      fill="#f4f4f5"
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {metric === 'value'
                        ? formatGold(pt.value)
                        : Math.round(pt.value).toLocaleString()}
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

        {/* Right: Category Distribution / Restock Priority / Movers */}
        <div className="xl:col-span-5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px]">
              <button
                type="button"
                onClick={() => setInsightTab('health')}
                className={`px-2.5 py-0.5 rounded font-semibold cursor-pointer ${
                  insightTab === 'health'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                By Group
              </button>
              <button
                type="button"
                onClick={() => setInsightTab('restock')}
                className={`px-2.5 py-0.5 rounded font-semibold cursor-pointer ${
                  insightTab === 'restock'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Low Alerts
              </button>
              <button
                type="button"
                onClick={() => setInsightTab('movers')}
                className={`px-2.5 py-0.5 rounded font-semibold cursor-pointer ${
                  insightTab === 'movers'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Movers
              </button>
            </div>
            {scope !== 'ALL' && (
              <button
                type="button"
                onClick={() => setScope('ALL')}
                className="text-[10px] text-amber-300 hover:text-amber-200 cursor-pointer"
              >
                Reset to All
              </button>
            )}
          </div>

          {insightTab === 'health' ? (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {categoryBreakdown.map((row) => {
                const isSelectedGroup = scope === `CAT:${row.cat}`;
                return (
                  <button
                    key={row.cat}
                    type="button"
                    onClick={() => setScope(isSelectedGroup ? 'ALL' : `CAT:${row.cat}`)}
                    className={`w-full p-2 rounded-lg border text-left space-y-1 transition-colors cursor-pointer ${
                      isSelectedGroup
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : 'bg-zinc-900/70 hover:bg-zinc-900 border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-zinc-200 flex items-center gap-1.5 truncate">
                        <Layers className="w-3 h-3 text-amber-400/80 shrink-0" />
                        <span className="truncate">{row.cat}</span>
                        {row.lowCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[9px] font-bold">
                            {row.lowCount} low
                          </span>
                        )}
                      </span>
                      <span className="text-zinc-300 font-semibold shrink-0 tabular-nums">
                        {metric === 'value'
                          ? formatGold(row.goldValue)
                          : `${row.units.toLocaleString()} units`}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-950 overflow-hidden">
                      <div
                        style={{ width: `${Math.max(row.units > 0 ? 4 : 0, row.sharePct)}%` }}
                        className="h-full rounded-full bg-amber-400/90"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : insightTab === 'movers' ? (
            !movers.hasAny ? (
              <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                No stock changes recorded across snapshots yet. Smelt, sell, or adjust stock to
                track top gainers &amp; drainers.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-red-400">
                    Most Used
                  </div>
                  {movers.drained.length === 0 ? (
                    <p className="text-[11px] text-zinc-500">None depleted</p>
                  ) : (
                    movers.drained.map((m) => (
                      <button
                        key={m.mat.id}
                        type="button"
                        onClick={() => setScope(`MAT:${m.mat.id}`)}
                        className="w-full px-2 py-1 rounded bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 flex items-center justify-between gap-1 text-[11px] cursor-pointer"
                      >
                        <span className="text-zinc-200 truncate">{m.mat.name}</span>
                        <span className="font-bold text-red-400 tabular-nums shrink-0">
                          {m.delta}
                        </span>
                      </button>
                    ))
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                    Most Restocked
                  </div>
                  {movers.gained.length === 0 ? (
                    <p className="text-[11px] text-zinc-500">None added</p>
                  ) : (
                    movers.gained.map((m) => (
                      <button
                        key={m.mat.id}
                        type="button"
                        onClick={() => setScope(`MAT:${m.mat.id}`)}
                        className="w-full px-2 py-1 rounded bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 flex items-center justify-between gap-1 text-[11px] cursor-pointer"
                      >
                        <span className="text-zinc-200 truncate">{m.mat.name}</span>
                        <span className="font-bold text-emerald-400 tabular-nums shrink-0">
                          +{m.delta}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {restockPriority.map(({ mat, stock, threshold, ratio, deficit }) => {
                const fillPct = Math.min(100, Math.round(ratio * 100));
                const isLow = stock <= threshold;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setScope(`MAT:${mat.id}`)}
                    className="w-full p-2 rounded-lg bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 text-left space-y-1 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-zinc-200 flex items-center gap-1.5 truncate">
                        {isLow && (
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        )}
                        <span className="truncate">{mat.name}</span>
                      </span>
                      <span className="shrink-0 tabular-nums">
                        <strong className={isLow ? 'text-amber-300' : 'text-emerald-300'}>
                          {stock}
                        </strong>
                        <span className="text-zinc-500"> / {threshold}</span>
                        {deficit > 0 && (
                          <span className="text-[10px] text-amber-400/90 ml-1">
                            (need {deficit})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-950 overflow-hidden">
                      <div
                        style={{ width: `${Math.max(stock > 0 ? 4 : 0, fillPct)}%` }}
                        className={`h-full rounded-full ${
                          isLow ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
