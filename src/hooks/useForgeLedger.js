import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_SUBCATEGORIES,
  INITIAL_MATERIAL_CATEGORIES,
  INITIAL_MATERIALS,
  INITIAL_CATALOG_ITEMS_RAW
} from '../data/seedData';
import { getLocalDateString } from '../utils/formatters';
import { sanitizeCatalogArray, sanitizeMaterialsArray } from '../utils/sanitizers';
import { readLocalLedger, writeLocalLedgerSnapshot } from '../utils/storage';
import {
  findSmeltRecipeForMaterial,
  resolveMaterialsWithSmeltCost,
  enrichCatalogItems,
  computeDashboardStats,
  buildSevenDayChartData
} from '../utils/pricing';
import { useMaterialActions } from './ledger/useMaterialActions';
import { useCatalogActions } from './ledger/useCatalogActions';
import { useTransactionActions } from './ledger/useTransactionActions';
import { useOrderActions } from './ledger/useOrderActions';
import { useAccountActions } from './ledger/useAccountActions';

export function useForgeLedger({ showToast }) {
  const [materials, setMaterials] = useState(() =>
    sanitizeMaterialsArray(readLocalLedger('materials', INITIAL_MATERIALS))
  );
  const [materialCategories, setMaterialCategories] = useState(() =>
    readLocalLedger('materialCategories', INITIAL_MATERIAL_CATEGORIES)
  );
  const [catalogItems, setCatalogItems] = useState(() =>
    sanitizeCatalogArray(readLocalLedger('catalogItems', INITIAL_CATALOG_ITEMS_RAW))
  );
  const [categories, setCategories] = useState(() =>
    readLocalLedger('categories', DEFAULT_CATEGORIES)
  );
  const [subCategories, setSubCategories] = useState(() =>
    readLocalLedger('subCategories', DEFAULT_SUBCATEGORIES)
  );
  const [profitMarginPct, setProfitMarginPct] = useState(() =>
    readLocalLedger('profitMarginPct', 0)
  );
  const [buyBackRatePct, setBuyBackRatePct] = useState(() =>
    readLocalLedger('buyBackRatePct', 70)
  );
  const [sales, setSales] = useState(() => readLocalLedger('sales', []));
  const [purchases, setPurchases] = useState(() => readLocalLedger('purchases', []));
  const [orders, setOrders] = useState(() => readLocalLedger('orders', []));
  const [supplyRecords, setSupplyRecords] = useState(() => readLocalLedger('supplyRecords', []));
  const [smithProfiles, setSmithProfiles] = useState(() => readLocalLedger('smithProfiles', []));
  const [managedUsers, setManagedUsers] = useState(() => readLocalLedger('managedUsers', []));
  const [materialTrendHistory, setMaterialTrendHistory] = useState(() =>
    readLocalLedger('materialTrendHistory', [])
  );

  const ledgerSnapshot = useMemo(
    () => ({
      materials,
      materialCategories,
      catalogItems,
      categories,
      subCategories,
      profitMarginPct,
      buyBackRatePct,
      sales,
      purchases,
      orders,
      supplyRecords,
      smithProfiles,
      managedUsers,
      materialTrendHistory
    }),
    [
      materials,
      materialCategories,
      catalogItems,
      categories,
      subCategories,
      profitMarginPct,
      buyBackRatePct,
      sales,
      purchases,
      orders,
      supplyRecords,
      smithProfiles,
      managedUsers,
      materialTrendHistory
    ]
  );

  useEffect(() => {
    writeLocalLedgerSnapshot(ledgerSnapshot);
  }, [ledgerSnapshot]);

  // --- DERIVED DOMAIN DATA ---
  const resolvedMaterials = useMemo(
    () => resolveMaterialsWithSmeltCost(materials, catalogItems),
    [materials, catalogItems]
  );

  const materialMap = useMemo(() => {
    const map = {};
    resolvedMaterials.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [resolvedMaterials]);

  const smeltableVaultIngots = useMemo(
    () =>
      resolvedMaterials
        .filter(
          (m) => m.isAutoSmeltedCost || m.category === 'Smelted Ingots' || m.id.endsWith('_ingot')
        )
        .map((mat) => ({
          ...mat,
          smeltRecipe: findSmeltRecipeForMaterial(mat, catalogItems, materials) || []
        })),
    [resolvedMaterials, catalogItems, materials]
  );

  const enrichedCatalog = useMemo(
    () => enrichCatalogItems(catalogItems, materialMap, profitMarginPct, buyBackRatePct),
    [catalogItems, materialMap, profitMarginPct, buyBackRatePct]
  );

  const dashboardStats = useMemo(
    () => computeDashboardStats(sales, purchases),
    [sales, purchases]
  );

  const sevenDayChartData = useMemo(() => buildSevenDayChartData(sales), [sales]);

  // --- SHARED STATE HELPERS ---
  const recordStockSnapshot = useCallback((nextMaterialsList) => {
    const today = getLocalDateString(0);
    const byMaterial = {};
    let totalUnits = 0;
    nextMaterialsList.forEach((m) => {
      const st = Number(m.stock) || 0;
      byMaterial[m.id] = st;
      totalUnits += st;
    });

    setMaterialTrendHistory((prev) => {
      const filtered = prev.filter((entry) => entry.date !== today);
      const updated = [...filtered, { date: today, totalUnits, byMaterial }].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      return updated.slice(-30);
    });
  }, []);

  const applySaleInventoryDeductions = useCallback(
    ({ stockDeductions = {}, materialDeductions = {}, newCatalogEntries = [] }) => {
      if (newCatalogEntries.length > 0 || Object.keys(stockDeductions).length > 0) {
        setCatalogItems((prev) => {
          const updated = prev.map((c) =>
            stockDeductions[c.id]
              ? { ...c, stock: Math.max(0, (Number(c.stock) || 0) - stockDeductions[c.id]) }
              : c
          );
          return [...updated, ...newCatalogEntries];
        });
      }

      const deductedMatIds = Object.keys(materialDeductions);
      if (deductedMatIds.length > 0) {
        setMaterials((prev) => {
          const nextMats = prev.map((m) =>
            materialDeductions[m.id]
              ? { ...m, stock: Math.max(0, (Number(m.stock) || 0) - materialDeductions[m.id]) }
              : m
          );
          recordStockSnapshot(nextMats);
          return nextMats;
        });
      }
      return deductedMatIds.length > 0;
    },
    [recordStockSnapshot]
  );

  const applyLedgerData = useCallback((data) => {
    if (!data || typeof data !== 'object') return;
    if (Array.isArray(data.materials)) setMaterials(sanitizeMaterialsArray(data.materials));
    if (Array.isArray(data.materialCategories)) setMaterialCategories(data.materialCategories);
    if (Array.isArray(data.catalogItems)) setCatalogItems(sanitizeCatalogArray(data.catalogItems));
    if (Array.isArray(data.categories)) setCategories(data.categories);
    if (data.subCategories && typeof data.subCategories === 'object') {
      setSubCategories(data.subCategories);
    }
    if (typeof data.profitMarginPct === 'number') setProfitMarginPct(data.profitMarginPct);
    if (typeof data.buyBackRatePct === 'number') setBuyBackRatePct(data.buyBackRatePct);
    if (Array.isArray(data.sales)) setSales(data.sales);
    if (Array.isArray(data.purchases)) setPurchases(data.purchases);
    if (Array.isArray(data.orders)) setOrders(data.orders);
    if (Array.isArray(data.supplyRecords)) setSupplyRecords(data.supplyRecords);
    if (Array.isArray(data.smithProfiles)) setSmithProfiles(data.smithProfiles);
    if (Array.isArray(data.managedUsers)) setManagedUsers(data.managedUsers);
    if (Array.isArray(data.materialTrendHistory)) {
      setMaterialTrendHistory(data.materialTrendHistory);
    }
  }, []);

  const resetForgeToCleanSlate = useCallback(() => {
    setMaterials(INITIAL_MATERIALS);
    setMaterialCategories(INITIAL_MATERIAL_CATEGORIES);
    setCatalogItems(INITIAL_CATALOG_ITEMS_RAW);
    setCategories(DEFAULT_CATEGORIES);
    setSubCategories(DEFAULT_SUBCATEGORIES);
    setProfitMarginPct(0);
    setBuyBackRatePct(70);
    setSales([]);
    setPurchases([]);
    setOrders([]);
    setSupplyRecords([]);
    setSmithProfiles([]);
    setManagedUsers([]);
    setMaterialTrendHistory([]);
    showToast('Forge wiped to a clean slate!');
  }, [showToast]);

  // --- COMPOSED DOMAIN ACTION HOOKS ---
  const materialActions = useMaterialActions({
    materials,
    setMaterials,
    materialCategories,
    setMaterialCategories,
    catalogItems,
    setCatalogItems,
    smeltableVaultIngots,
    recordStockSnapshot,
    showToast
  });

  const catalogActions = useCatalogActions({
    setCatalogItems,
    setSubCategories,
    showToast
  });

  const transactionActions = useTransactionActions({
    materials,
    setMaterials,
    materialCategories,
    catalogItems,
    setCatalogItems,
    categories,
    setCategories,
    setSales,
    setPurchases,
    applySaleInventoryDeductions,
    recordStockSnapshot,
    showToast
  });

  const orderActions = useOrderActions({
    enrichedCatalog,
    resolvedMaterials,
    setOrders,
    setSupplyRecords,
    setMaterials,
    setSales,
    applySaleInventoryDeductions,
    recordStockSnapshot,
    showToast
  });

  const accountActions = useAccountActions({
    managedUsers,
    setManagedUsers,
    setSmithProfiles,
    showToast
  });

  return {
    materials,
    materialCategories,
    catalogItems,
    categories,
    subCategories,
    profitMarginPct,
    setProfitMarginPct,
    buyBackRatePct,
    setBuyBackRatePct,
    sales,
    purchases,
    orders,
    supplyRecords,
    smithProfiles,
    managedUsers,
    materialTrendHistory,
    ledgerSnapshot,
    resolvedMaterials,
    materialMap,
    smeltableVaultIngots,
    enrichedCatalog,
    dashboardStats,
    sevenDayChartData,
    recordStockSnapshot,
    applyLedgerData,
    resetForgeToCleanSlate,
    ...materialActions,
    ...catalogActions,
    ...transactionActions,
    ...orderActions,
    ...accountActions
  };
}
