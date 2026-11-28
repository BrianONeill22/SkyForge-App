import { getLocalDateString } from './formatters.js';
import { findSmeltRecipeForMaterial } from './pricing.js';

function parseIsoDayUtc(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  return Date.UTC(parts[0], parts[1] - 1, parts[2]);
}

function diffCalendarDays(startDateStr, endDateStr) {
  const a = parseIsoDayUtc(startDateStr);
  const b = parseIsoDayUtc(endDateStr);
  if (a === null || b === null) return 0;
  return Math.max(0, Math.round((b - a) / 86400000));
}

function expandMaterialRequirements(matId, qty, materialMap, catalogItems, rawMaterials, expandSmelted, visited = new Set(), out = {}) {
  if (!matId || !qty || qty <= 0) return out;

  const mat = materialMap[matId];
  if (expandSmelted && mat && !visited.has(matId)) {
    const smeltRecipe = findSmeltRecipeForMaterial(mat, catalogItems, rawMaterials);
    if (Array.isArray(smeltRecipe) && smeltRecipe.length > 0) {
      const nextVisited = new Set(visited);
      nextVisited.add(matId);
      smeltRecipe.forEach((req) => {
        if (!req.materialId) return;
        expandMaterialRequirements(
          req.materialId,
          qty * (Number(req.qty) || 0),
          materialMap,
          catalogItems,
          rawMaterials,
          true,
          nextVisited,
          out
        );
      });
      return out;
    }
  }

  out[matId] = (out[matId] || 0) + qty;
  return out;
}

function resolveCatalogItemForSale(sale, catalogById, catalogByName) {
  if (sale.itemId && catalogById[sale.itemId]) return catalogById[sale.itemId];
  const norm = (sale.itemName || '').trim().toLowerCase();
  if (norm && catalogByName[norm]) return catalogByName[norm];
  return null;
}

/**
 * Analyzes sales history to compute daily averages, item velocity, daily breakdown,
 * and predicted resource demand & restock shortfalls over a forecast horizon.
 */
export function buildSalesResourceForecast({
  sales = [],
  enrichedCatalog = [],
  catalogItems = [],
  resolvedMaterials = [],
  orders = [],
  lookbackDays = 14, // 7 | 14 | 30 | 0 (All)
  horizonDays = 7, // 1 | 3 | 7 | 14 | 30
  averageBasis = 'span', // 'span' | 'active'
  safetyBufferPct = 0, // 0 | 15 | 25
  expandSmeltedToRaw = false,
  includePendingOrders = false,
  todayStr = getLocalDateString(0)
}) {
  const safeHorizon = Math.max(1, Number(horizonDays) || 7);
  const safeBuffer = Math.max(0, Number(safetyBufferPct) || 0);
  const cutoffDateStr =
    lookbackDays > 0 ? getLocalDateString(-(lookbackDays - 1)) : null;

  // Build lookups
  const catalogById = {};
  const catalogByName = {};
  enrichedCatalog.forEach((item) => {
    catalogById[item.id] = item;
    const norm = (item.name || '').trim().toLowerCase();
    if (norm && !catalogByName[norm]) catalogByName[norm] = item;
  });

  const materialMap = {};
  resolvedMaterials.forEach((m) => {
    materialMap[m.id] = m;
  });

  // Filter sales to lookback window
  const windowSales = sales.filter((s) => {
    if (!s || !s.date) return false;
    if (!cutoffDateStr) return true;
    return s.date >= cutoffDateStr && s.date <= todayStr;
  });

  // Group sales by day & by item
  const byDayMap = {};
  const byItemMap = {};
  const materialUsageMap = {};
  const materialDriversMap = {}; // matId -> { itemName -> matUnitsUsed }

  let totalUnitsSold = 0;
  let totalRevenue = 0;
  let totalProfit = 0;
  let unmatchedSalesCount = 0;
  let earliestSaleDate = null;

  windowSales.forEach((s) => {
    const qty = Math.max(0, Number(s.qty) || 0);
    const rev = Math.max(0, Number(s.totalRevenue) || 0);
    const prof = Number(s.netProfit) || 0;
    const date = s.date;
    const catItem = resolveCatalogItemForSale(s, catalogById, catalogByName);
    const itemName = (s.itemName || catItem?.name || 'Unnamed Ware').trim();
    const category = s.category || catItem?.category || 'Uncategorized';

    if (!earliestSaleDate || date < earliestSaleDate) earliestSaleDate = date;

    totalUnitsSold += qty;
    totalRevenue += rev;
    totalProfit += prof;

    // Daily aggregation
    if (!byDayMap[date]) {
      byDayMap[date] = {
        date,
        units: 0,
        revenue: 0,
        profit: 0,
        salesCount: 0,
        itemsMap: {}
      };
    }
    const dayBucket = byDayMap[date];
    dayBucket.units += qty;
    dayBucket.revenue += rev;
    dayBucket.profit += prof;
    dayBucket.salesCount += 1;
    if (!dayBucket.itemsMap[itemName]) {
      dayBucket.itemsMap[itemName] = { itemName, qty: 0, revenue: 0 };
    }
    dayBucket.itemsMap[itemName].qty += qty;
    dayBucket.itemsMap[itemName].revenue += rev;

    // Item velocity aggregation
    const itemKey = catItem ? catItem.id : `name:${itemName.toLowerCase()}`;
    if (!byItemMap[itemKey]) {
      byItemMap[itemKey] = {
        key: itemKey,
        itemId: catItem?.id || null,
        itemName,
        category,
        hasRecipe: Boolean(
          catItem &&
            catItem.totalMaterialsMap &&
            Object.keys(catItem.totalMaterialsMap).length > 0
        ),
        totalMaterialsMap: catItem?.totalMaterialsMap || {},
        totalQty: 0,
        totalRevenue: 0,
        totalProfit: 0,
        datesSet: new Set()
      };
    }
    const itemBucket = byItemMap[itemKey];
    itemBucket.totalQty += qty;
    itemBucket.totalRevenue += rev;
    itemBucket.totalProfit += prof;
    itemBucket.datesSet.add(date);

    // Map sold item -> materials consumed
    if (
      catItem &&
      catItem.totalMaterialsMap &&
      Object.keys(catItem.totalMaterialsMap).length > 0
    ) {
      const expanded = {};
      Object.entries(catItem.totalMaterialsMap).forEach(([matId, perUnit]) => {
        expandMaterialRequirements(
          matId,
          (Number(perUnit) || 0) * qty,
          materialMap,
          catalogItems,
          resolvedMaterials,
          expandSmeltedToRaw,
          new Set(),
          expanded
        );
      });

      Object.entries(expanded).forEach(([matId, usedQty]) => {
        materialUsageMap[matId] = (materialUsageMap[matId] || 0) + usedQty;
        if (!materialDriversMap[matId]) materialDriversMap[matId] = {};
        materialDriversMap[matId][itemName] =
          (materialDriversMap[matId][itemName] || 0) + usedQty;
      });
    } else {
      unmatchedSalesCount += 1;
    }
  });

  // Pending customer orders material demand (optional)
  const pendingOrders = orders.filter((o) => o && o.status === 'pending');
  const pendingMaterialNeedMap = {};
  if (includePendingOrders) {
    pendingOrders.forEach((order) => {
      const orderLines =
        Array.isArray(order.items) && order.items.length > 0
          ? order.items
          : [{ itemId: order.itemId, itemName: order.itemName, qty: order.qty }];

      orderLines.forEach((line) => {
        const lineQty = Math.max(0, Number(line.qty) || 0);
        if (lineQty <= 0) return;
        const catItem = resolveCatalogItemForSale(line, catalogById, catalogByName);
        if (!catItem?.totalMaterialsMap) return;
        const expanded = {};
        Object.entries(catItem.totalMaterialsMap).forEach(([matId, perUnit]) => {
          expandMaterialRequirements(
            matId,
            (Number(perUnit) || 0) * lineQty,
            materialMap,
            catalogItems,
            resolvedMaterials,
            expandSmeltedToRaw,
            new Set(),
            expanded
          );
        });
        Object.entries(expanded).forEach(([matId, reqQty]) => {
          pendingMaterialNeedMap[matId] = (pendingMaterialNeedMap[matId] || 0) + reqQty;
        });
      });
    });
  }

  // Compute day divisors
  const activeDaysCount = Object.keys(byDayMap).length;
  const elapsedFromFirst = earliestSaleDate
    ? diffCalendarDays(earliestSaleDate, todayStr) + 1
    : 0;
  const spanDays =
    earliestSaleDate === null
      ? 0
      : lookbackDays > 0
      ? Math.min(lookbackDays, Math.max(1, elapsedFromFirst))
      : Math.max(1, elapsedFromFirst);

  const divisorDays =
    averageBasis === 'active'
      ? Math.max(1, activeDaysCount)
      : Math.max(1, spanDays);

  const avgUnitsPerDay = activeDaysCount > 0 ? totalUnitsSold / divisorDays : 0;
  const avgRevenuePerDay = activeDaysCount > 0 ? totalRevenue / divisorDays : 0;
  const avgProfitPerDay = activeDaysCount > 0 ? totalProfit / divisorDays : 0;
  const avgOrdersPerDay = activeDaysCount > 0 ? windowSales.length / divisorDays : 0;

  const todayBucket = byDayMap[todayStr];
  const todayUnits = todayBucket ? todayBucket.units : 0;
  const todayRevenue = todayBucket ? todayBucket.revenue : 0;

  // Daily breakdown sorted newest-first
  const dailyBreakdown = Object.values(byDayMap)
    .map((day) => {
      const items = Object.values(day.itemsMap).sort(
        (a, b) => b.qty - a.qty || b.revenue - a.revenue
      );
      const vsAvgPct =
        avgUnitsPerDay > 0
          ? Math.round(((day.units - avgUnitsPerDay) / avgUnitsPerDay) * 100)
          : 0;
      return {
        date: day.date,
        units: day.units,
        revenue: day.revenue,
        profit: day.profit,
        salesCount: day.salesCount,
        vsAvgPct,
        items
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Item velocity sorted by average sold per day
  const itemVelocity = Object.values(byItemMap)
    .map((item) => {
      const avgPerDay = item.totalQty / divisorDays;
      const projectedQty = avgPerDay * safeHorizon;
      const sharePct =
        totalUnitsSold > 0 ? Math.round((item.totalQty / totalUnitsSold) * 100) : 0;
      const recipeList = Object.entries(item.totalMaterialsMap || {}).map(([matId, q]) => ({
        matId,
        name: materialMap[matId]?.name || matId,
        qty: q
      }));
      return {
        key: item.key,
        itemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        hasRecipe: item.hasRecipe,
        totalQty: item.totalQty,
        totalRevenue: item.totalRevenue,
        totalProfit: item.totalProfit,
        daysSoldOn: item.datesSet.size,
        avgQtyPerDay: avgPerDay,
        projectedQty,
        sharePct,
        recipeList
      };
    })
    .sort((a, b) => b.totalQty - a.totalQty || b.totalRevenue - a.totalRevenue);

  // Resource forecast rows
  const allRelevantMatIds = new Set([
    ...Object.keys(materialUsageMap),
    ...Object.keys(pendingMaterialNeedMap)
  ]);

  const bufferMultiplier = 1 + safeBuffer / 100;

  const resourceForecast = Array.from(allRelevantMatIds)
    .map((matId) => {
      const mat = materialMap[matId] || {
        id: matId,
        name: matId,
        category: 'Unknown',
        stock: 0,
        buyPrice: 0,
        lowThreshold: 5
      };
      const usedInWindow = materialUsageMap[matId] || 0;
      const avgPerDay = activeDaysCount > 0 ? usedInWindow / divisorDays : 0;
      const projectedNeedExact = avgPerDay * safeHorizon * bufferMultiplier;
      const projectedNeed = Math.ceil(projectedNeedExact);
      const pendingOrderNeed = Math.ceil(pendingMaterialNeedMap[matId] || 0);
      const totalRequired = projectedNeed + pendingOrderNeed;
      const currentStock = Math.max(0, Number(mat.stock) || 0);
      const shortfall = Math.max(0, totalRequired - currentStock);
      const surplus = Math.max(0, currentStock - totalRequired);
      const daysOfCover = avgPerDay > 0 ? currentStock / avgPerDay : Infinity;
      const unitCost = Number(mat.buyPrice) || 0;
      const estimatedRestockCost = Math.round(shortfall * unitCost);

      const driversRaw = materialDriversMap[matId] || {};
      const totalDriverUnits = Object.values(driversRaw).reduce((s, v) => s + v, 0);
      const topDrivers = Object.entries(driversRaw)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, used]) => ({
          name,
          used,
          pct: totalDriverUnits > 0 ? Math.round((used / totalDriverUnits) * 100) : 0
        }));

      let urgency = 'ok';
      if (shortfall > 0 && (currentStock === 0 || daysOfCover < 2)) {
        urgency = 'critical';
      } else if (shortfall > 0) {
        urgency = 'short';
      }

      return {
        matId,
        material: mat,
        usedInWindow,
        avgPerDay,
        projectedNeedExact,
        projectedNeed,
        pendingOrderNeed,
        totalRequired,
        currentStock,
        shortfall,
        surplus,
        daysOfCover,
        unitCost,
        estimatedRestockCost,
        urgency,
        topDrivers
      };
    })
    .sort((a, b) => {
      // Sort shortfalls first (critical -> short -> ok), then by shortfall / projected need
      const rank = { critical: 0, short: 1, ok: 2 };
      if (rank[a.urgency] !== rank[b.urgency]) return rank[a.urgency] - rank[b.urgency];
      if (b.shortfall !== a.shortfall) return b.shortfall - a.shortfall;
      return b.totalRequired - a.totalRequired;
    });

  const shortfallRows = resourceForecast.filter((r) => r.shortfall > 0);
  const totalShortfallMaterials = shortfallRows.length;
  const totalShortfallUnits = shortfallRows.reduce((s, r) => s + r.shortfall, 0);
  const totalEstimatedRestockCost = shortfallRows.reduce(
    (s, r) => s + r.estimatedRestockCost,
    0
  );

  const bottleneck =
    resourceForecast
      .filter((r) => r.avgPerDay > 0)
      .sort((a, b) => a.daysOfCover - b.daysOfCover)[0] || null;

  return {
    summary: {
      totalSalesEntries: windowSales.length,
      totalAllTimeSales: sales.length,
      totalUnitsSold,
      totalRevenue,
      totalProfit,
      activeDaysCount,
      spanDays,
      divisorDays,
      avgUnitsPerDay,
      avgRevenuePerDay,
      avgProfitPerDay,
      avgOrdersPerDay,
      todayUnits,
      todayRevenue,
      unmatchedSalesCount,
      pendingOrdersCount: pendingOrders.length,
      totalShortfallMaterials,
      totalShortfallUnits,
      totalEstimatedRestockCost,
      bottleneck
    },
    dailyBreakdown,
    itemVelocity,
    resourceForecast
  };
}
