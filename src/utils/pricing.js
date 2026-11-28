import { SMELTED_MAT_TO_CATALOG_ID, DEFAULT_SMELT_RECIPES_BY_ID } from '../data/seedData.js';
import { roundToNearestFive, getLocalDateString } from './formatters.js';

export const CHART_PALETTE = [
  '#f59e0b',
  '#ef4444',
  '#10b981',
  '#3b82f6',
  '#a855f7',
  '#f97316',
  '#14b8a6',
  '#eab308',
  '#ec4899',
  '#6366f1'
];

export function findSmeltRecipeForMaterial(mat, catalogList, matList) {
  const mappedCatId = SMELTED_MAT_TO_CATALOG_ID[mat.id];
  if (mappedCatId) {
    const found = catalogList.find((c) => c.id === mappedCatId);
    if (found && Array.isArray(found.recipe) && found.recipe.length > 0) return found.recipe;
  }

  if (mat.category === 'Smelted Ingots' || mat.id.endsWith('_ingot')) {
    const normalizedMatName = mat.name.toLowerCase().trim();
    const byName = catalogList.find((c) => {
      const cName = c.name.toLowerCase().trim();
      return (
        cName === normalizedMatName ||
        cName.startsWith(normalizedMatName) ||
        normalizedMatName.startsWith(cName)
      );
    });
    if (byName && Array.isArray(byName.recipe) && byName.recipe.length > 0) return byName.recipe;
  }

  if (DEFAULT_SMELT_RECIPES_BY_ID[mat.id]) {
    return DEFAULT_SMELT_RECIPES_BY_ID[mat.id].map((req) => {
      const matchedIng =
        matList.find((m) => m.id === req.materialId) ||
        matList.find((m) => m.name.toLowerCase().includes(req.nameHint));
      return { materialId: matchedIng ? matchedIng.id : req.materialId, qty: req.qty };
    });
  }

  return null;
}

export function resolveMaterialsWithSmeltCost(materials, catalogItems) {
  const baseMaterialMap = {};
  materials.forEach((m) => {
    baseMaterialMap[m.id] = m;
  });

  return materials.map((mat) => {
    const smeltRecipe = findSmeltRecipeForMaterial(mat, catalogItems, materials);
    if (!smeltRecipe) {
      return { ...mat, isAutoSmeltedCost: false };
    }
    const smeltedUnitCost = smeltRecipe.reduce((sum, req) => {
      const ing = baseMaterialMap[req.materialId];
      return sum + (ing ? (Number(ing.buyPrice) || 0) * req.qty : 0);
    }, 0);
    return {
      ...mat,
      buyPrice: smeltedUnitCost,
      isAutoSmeltedCost: true
    };
  });
}

export function enrichCatalogItems(catalogItems, materialMap, profitMarginPct, buyBackRatePct) {
  const rawItemMap = {};
  catalogItems.forEach((c) => {
    rawItemMap[c.id] = c;
  });

  const computeDirectCost = (item, visited = new Set()) => {
    if (!item || visited.has(item.id)) return 0;
    visited.add(item.id);

    const directMatCost = (item.recipe || []).reduce((sum, req) => {
      const mat = materialMap[req.materialId];
      return sum + (mat ? (Number(mat.buyPrice) || 0) * req.qty : 0);
    }, 0);

    const bundleItemsCost = (item.bundleItems || []).reduce((sum, piece) => {
      const child = rawItemMap[piece.itemId];
      if (!child) return sum;
      return sum + computeDirectCost(child, new Set(visited)) * (Number(piece.qty) || 1);
    }, 0);

    return directMatCost + bundleItemsCost;
  };

  const collectTotalMaterials = (item, multiplier = 1, visited = new Set(), acc = {}) => {
    if (!item || visited.has(item.id)) return acc;
    visited.add(item.id);

    (item.recipe || []).forEach((req) => {
      if (!req.materialId) return;
      acc[req.materialId] = (acc[req.materialId] || 0) + (Number(req.qty) || 0) * multiplier;
    });

    (item.bundleItems || []).forEach((piece) => {
      const child = rawItemMap[piece.itemId];
      if (child) {
        collectTotalMaterials(
          child,
          multiplier * (Number(piece.qty) || 1),
          new Set(visited),
          acc
        );
      }
    });

    return acc;
  };

  return catalogItems.map((item) => {
    const materialCost = computeDirectCost(item);
    const totalMaterialsMap = collectTotalMaterials(item, 1);

    const calculatedPrice = roundToNearestFive(
      materialCost * (1 + (Number(profitMarginPct) || 0) / 100)
    );
    const sellPrice = item.useCustomPrice ? Number(item.customPrice) || 0 : calculatedPrice;
    const rawBuyBack = roundToNearestFive(
      materialCost * ((Number(buyBackRatePct) || 0) / 100)
    );
    const buyFromCustomerPrice =
      sellPrice > 0 ? Math.min(rawBuyBack, Math.max(0, sellPrice - 5)) : rawBuyBack;
    const profitPerUnit = sellPrice - materialCost;

    return {
      ...item,
      materialCost,
      totalMaterialsMap,
      calculatedPrice,
      sellPrice,
      buyFromCustomerPrice,
      profitPerUnit
    };
  });
}

export function computeDashboardStats(sales, purchases) {
  const totalRevenue = sales.reduce((s, r) => s + (Number(r.totalRevenue) || 0), 0);
  const totalNetProfit = sales.reduce((s, r) => s + (Number(r.netProfit) || 0), 0);
  const totalUnitsSold = sales.reduce((s, r) => s + (Number(r.qty) || 0), 0);
  const totalSpent = purchases.reduce((s, p) => s + (Number(p.totalCost) || 0), 0);
  return { totalRevenue, totalNetProfit, totalUnitsSold, totalSpent };
}

export function buildDailyPerformanceData(sales, purchases = [], daysCount = 7) {
  const days = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    const dateStr = getLocalDateString(-i);
    const dateObj = new Date(`${dateStr}T12:00:00`);
    const label =
      daysCount <= 7
        ? dateObj.toLocaleDateString(undefined, { weekday: 'short' })
        : dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const fullLabel = dateObj.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const daySales = sales.filter((s) => s.date === dateStr);
    const dayPurchases = purchases.filter((p) => p.date === dateStr);

    const revenue = daySales.reduce((sum, s) => sum + (Number(s.totalRevenue) || 0), 0);
    const profit = daySales.reduce((sum, s) => sum + (Number(s.netProfit) || 0), 0);
    const units = daySales.reduce((sum, s) => sum + (Number(s.qty) || 0), 0);
    const spent = dayPurchases.reduce((sum, p) => sum + (Number(p.totalCost) || 0), 0);
    const marginPct = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

    days.push({
      date: dateStr,
      label,
      fullLabel,
      revenue,
      profit,
      spent,
      units,
      marginPct,
      salesCount: daySales.length
    });
  }
  return days;
}

export function buildSevenDayChartData(sales) {
  return buildDailyPerformanceData(sales, [], 7);
}

export function buildBreakdownChartsData(sales, catalogItems, pieMetricMode) {
  const itemLookup = {};
  catalogItems.forEach((c) => {
    itemLookup[c.id] = c;
  });

  const catTotals = {};
  const subTotals = {};
  const itemAgg = {};
  const buyerAgg = {};

  sales.forEach((s) => {
    const catItem = itemLookup[s.itemId];
    const category = s.category || catItem?.category || 'Uncategorized';
    const subType =
      s.subCategory || (catItem?.subCategory ? catItem.subCategory : `${category} (General)`);

    const rev = Math.max(0, Number(s.totalRevenue) || 0);
    const prof = Math.max(0, Number(s.netProfit) || 0);
    const units = Math.max(0, Number(s.qty) || 0);

    const amount =
      pieMetricMode === 'profit' ? prof : pieMetricMode === 'units' ? units : rev;

    catTotals[category] = (catTotals[category] || 0) + amount;
    subTotals[subType] = (subTotals[subType] || 0) + amount;

    const itemKey = s.itemName || catItem?.name || 'Unnamed Ware';
    if (!itemAgg[itemKey]) {
      itemAgg[itemKey] = { name: itemKey, category, revenue: 0, profit: 0, units: 0 };
    }
    itemAgg[itemKey].revenue += rev;
    itemAgg[itemKey].profit += prof;
    itemAgg[itemKey].units += units;

    const buyerKey = (s.customer || '').trim() || 'Walk-in Traveler';
    if (!buyerAgg[buyerKey]) {
      buyerAgg[buyerKey] = { name: buyerKey, revenue: 0, profit: 0, units: 0, orders: 0 };
    }
    buyerAgg[buyerKey].revenue += rev;
    buyerAgg[buyerKey].profit += prof;
    buyerAgg[buyerKey].units += units;
    buyerAgg[buyerKey].orders += 1;
  });

  const buildSlices = (totalsMap) => {
    const entries = Object.entries(totalsMap)
      .filter(([, val]) => val > 0)
      .sort((a, b) => b[1] - a[1]);
    const grandTotal = entries.reduce((sum, [, val]) => sum + val, 0);
    let cumulativePct = 0;

    return {
      grandTotal,
      slices: entries.map(([label, value], idx) => {
        const pct = grandTotal > 0 ? (value / grandTotal) * 100 : 0;
        const startPct = cumulativePct;
        cumulativePct += pct;
        return {
          label,
          value,
          pct,
          startPct,
          color: CHART_PALETTE[idx % CHART_PALETTE.length]
        };
      })
    };
  };

  const sortMetric = (a, b) => {
    if (pieMetricMode === 'profit') return b.profit - a.profit;
    if (pieMetricMode === 'units') return b.units - a.units;
    return b.revenue - a.revenue;
  };

  const topItems = Object.values(itemAgg).sort(sortMetric).slice(0, 5);
  const topBuyers = Object.values(buyerAgg).sort(sortMetric).slice(0, 5);

  return {
    byCategory: buildSlices(catTotals),
    bySubType: buildSlices(subTotals),
    topItems,
    topBuyers
  };
}
