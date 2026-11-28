import { useCallback } from 'react';
import { getLocalDateString } from '../../utils/formatters';

export function useTransactionActions({
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
}) {
  const recordSaleLines = useCallback(
    ({ lines, customer, deductStock, deductMaterials }) => {
      if (!lines || lines.length === 0) {
        showToast('Select an item or add at least one item to the sale.', 'error');
        return false;
      }

      const todayStr = getLocalDateString(0);
      const buyerName = (customer || '').trim() || 'Walk-in Traveler';
      const newCatalogEntries = [];
      const stockDeductions = {};
      const materialDeductions = {};
      const newSaleRecords = [];

      const availableFinishedStockMap = {};
      catalogItems.forEach((c) => {
        availableFinishedStockMap[c.id] = Math.max(0, Number(c.stock) || 0);
      });

      lines.forEach((line, idx) => {
        const totalRevenue = line.unitSell * line.qty;
        const netProfit = (line.unitSell - line.unitCost) * line.qty;
        let resolvedItemId = line.itemId;
        let unitsToForgeFromMaterials = line.qty;

        if (line.mode === 'custom') {
          const newCatId = `cat_${Date.now()}_${idx}`;
          resolvedItemId = line.saveToRecipes ? newCatId : `custom_${Date.now()}_${idx}`;
          if (line.saveToRecipes) {
            newCatalogEntries.push({
              id: newCatId,
              name: line.itemName,
              category: line.category || 'Unsorted',
              subCategory: line.subCategory || '',
              description: 'Forged & logged directly from a custom sale.',
              stock: 0,
              customPrice: line.hasOverride ? line.unitSell : 0,
              useCustomPrice: Boolean(line.hasOverride),
              recipe: line.recipe || [],
              bundleItems: []
            });
          }
          if (deductMaterials && Array.isArray(line.recipe)) {
            line.recipe.forEach((req) => {
              if (!req.materialId) return;
              materialDeductions[req.materialId] =
                (materialDeductions[req.materialId] || 0) + (Number(req.qty) || 0) * line.qty;
            });
          }
        } else if (line.itemId) {
          if (deductStock) {
            const avail = availableFinishedStockMap[line.itemId] || 0;
            const usedFromStock = Math.min(avail, line.qty);
            availableFinishedStockMap[line.itemId] = avail - usedFromStock;
            stockDeductions[line.itemId] = (stockDeductions[line.itemId] || 0) + usedFromStock;
            unitsToForgeFromMaterials = line.qty - usedFromStock;
          }
          if (deductMaterials && unitsToForgeFromMaterials > 0 && line.totalMaterialsMap) {
            Object.entries(line.totalMaterialsMap).forEach(([matId, perUnitQty]) => {
              materialDeductions[matId] =
                (materialDeductions[matId] || 0) +
                (Number(perUnitQty) || 0) * unitsToForgeFromMaterials;
            });
          }
        }

        newSaleRecords.push({
          id: `sale_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 5)}`,
          date: todayStr,
          itemId: resolvedItemId,
          itemName: line.itemName,
          category: line.category || 'Unsorted',
          subCategory: line.subCategory || '',
          qty: line.qty,
          unitSell: line.unitSell,
          unitCost: line.unitCost,
          totalRevenue,
          netProfit,
          customer: buyerName
        });
      });

      setSales((prev) => [...newSaleRecords, ...prev]);
      const deductedMaterials = applySaleInventoryDeductions({
        stockDeductions,
        materialDeductions,
        newCatalogEntries
      });

      const grandRev = newSaleRecords.reduce((s, r) => s + r.totalRevenue, 0);
      showToast(
        `Logged ${newSaleRecords.length} sale ${newSaleRecords.length === 1 ? 'item' : 'items'} (+${grandRev}g)${
          deductedMaterials ? ' & deducted vault materials!' : '!'
        }`
      );
      return true;
    },
    [catalogItems, setSales, applySaleInventoryDeductions, showToast]
  );

  const recordQuickPublicSale = useCallback(
    ({ item, customer, qty: rawQty, deductStock, deductMaterials }) => {
      if (!item) return false;
      const qty = Math.max(1, Number(rawQty) || 1);
      const unitSell = Number(item.sellPrice) || 0;
      const unitCost = Number(item.materialCost) || 0;
      const totalRevenue = unitSell * qty;
      const netProfit = (unitSell - unitCost) * qty;
      const buyerName = (customer || '').trim() || 'Walk-in Traveler';

      const stockDeductions = {};
      const materialDeductions = {};
      let unitsToForgeFromMaterials = qty;

      if (deductStock) {
        const avail = Math.max(0, Number(item.stock) || 0);
        const usedFromStock = Math.min(avail, qty);
        unitsToForgeFromMaterials = qty - usedFromStock;
        if (usedFromStock > 0) stockDeductions[item.id] = usedFromStock;
      }

      if (deductMaterials && unitsToForgeFromMaterials > 0 && item.totalMaterialsMap) {
        Object.entries(item.totalMaterialsMap).forEach(([matId, perUnitQty]) => {
          materialDeductions[matId] = (Number(perUnitQty) || 0) * unitsToForgeFromMaterials;
        });
      }

      const deductedMaterials = applySaleInventoryDeductions({
        stockDeductions,
        materialDeductions
      });

      setSales((prev) => [
        {
          id: `sale_${Date.now()}`,
          date: getLocalDateString(0),
          itemId: item.id,
          itemName: item.name,
          category: item.category || 'Unsorted',
          subCategory: item.subCategory || '',
          qty,
          unitSell,
          unitCost,
          totalRevenue,
          netProfit,
          customer: buyerName
        },
        ...prev
      ]);

      showToast(
        `Recorded sale (${qty}x ${item.name}, +${totalRevenue}g)${
          deductedMaterials ? ' & deducted vault materials!' : '!'
        }`
      );
      return true;
    },
    [setSales, applySaleInventoryDeductions, showToast]
  );

  const updateSale = useCallback(
    (editedSale) => {
      const qty = Math.max(1, Number(editedSale.qty) || 1);
      const unitSell = Math.max(0, Number(editedSale.unitSell) || 0);
      const unitCost = Math.max(0, Number(editedSale.unitCost) || 0);
      const totalRevenue = unitSell * qty;
      const netProfit = (unitSell - unitCost) * qty;

      setSales((prev) =>
        prev.map((s) =>
          s.id === editedSale.id
            ? {
                ...s,
                itemName: editedSale.itemName?.trim() || s.itemName,
                qty,
                unitSell,
                unitCost,
                totalRevenue,
                netProfit,
                customer: editedSale.customer?.trim() || 'Walk-in Traveler',
                date: editedSale.date || s.date
              }
            : s
        )
      );
      showToast('Updated sale record!');
    },
    [setSales, showToast]
  );

  const deleteSale = useCallback(
    (saleId) => {
      setSales((prev) => prev.filter((s) => s.id !== saleId));
      showToast('Removed sale entry.');
    },
    [setSales, showToast]
  );

  const recordPurchaseLines = useCallback(
    ({ lines, supplier: rawSupplier, updateUnitCost }) => {
      if (!lines || lines.length === 0) {
        showToast('Select or enter at least one item to purchase.', 'error');
        return false;
      }

      const todayStr = getLocalDateString(0);
      const supplier = (rawSupplier || '').trim() || 'Traveling Merchant';
      let nextMats = [...materials];
      let nextCats = [...catalogItems];
      let matsChanged = false;
      let needsUnsorted = false;
      const newPurchaseRecords = [];

      lines.forEach((line, idx) => {
        const totalCost = line.qty * line.unitCost;

        if (line.targetType === 'existing') {
          if (line.kind === 'mat') {
            matsChanged = true;
            nextMats = nextMats.map((m) => {
              if (m.id !== line.targetId) return m;
              const nextPrice =
                updateUnitCost && !line.isAutoSmeltedCost ? line.unitCost : m.buyPrice;
              return {
                ...m,
                stock: (Number(m.stock) || 0) + line.qty,
                buyPrice: nextPrice
              };
            });
          } else {
            nextCats = nextCats.map((c) =>
              c.id === line.targetId
                ? {
                    ...c,
                    stock: (Number(c.stock) || 0) + line.qty,
                    ...(updateUnitCost && line.unitCost > 0
                      ? { customPrice: line.unitCost, useCustomPrice: true }
                      : {})
                  }
                : c
            );
          }
        } else if (line.dest === 'material') {
          matsChanged = true;
          nextMats.push({
            id: `mat_${Date.now()}_${idx}`,
            name: line.itemName,
            category: materialCategories[0] || 'Raw Ore',
            buyPrice: line.unitCost,
            stock: line.qty,
            lowThreshold: 5
          });
        } else {
          needsUnsorted = true;
          nextCats.push({
            id: `cat_${Date.now()}_${idx}`,
            name: line.itemName,
            category: 'Unsorted',
            subCategory: 'General',
            description: `Purchased from ${supplier}.`,
            stock: line.qty,
            customPrice: line.unitCost,
            useCustomPrice: line.unitCost > 0,
            recipe: [],
            bundleItems: []
          });
        }

        newPurchaseRecords.push({
          id: `pur_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 5)}`,
          date: todayStr,
          itemName: line.itemName,
          kind: line.displayKind,
          qty: line.qty,
          unitCost: line.unitCost,
          totalCost,
          supplier
        });
      });

      if (matsChanged) {
        setMaterials(nextMats);
        recordStockSnapshot(nextMats);
      }
      if (needsUnsorted && !categories.includes('Unsorted')) {
        setCategories((prev) => [...prev, 'Unsorted']);
      }
      setCatalogItems(nextCats);
      setPurchases((prev) => [...newPurchaseRecords, ...prev]);

      const grandSpent = newPurchaseRecords.reduce((s, r) => s + r.totalCost, 0);
      showToast(
        `Logged ${newPurchaseRecords.length} purchased ${
          newPurchaseRecords.length === 1 ? 'item' : 'items'
        } (-${grandSpent}g)!`
      );
      return true;
    },
    [
      materials,
      catalogItems,
      materialCategories,
      categories,
      setMaterials,
      setCategories,
      setCatalogItems,
      setPurchases,
      recordStockSnapshot,
      showToast
    ]
  );

  const updatePurchase = useCallback(
    (editedPurchase) => {
      const qty = Math.max(1, Number(editedPurchase.qty) || 1);
      const unitCost = Math.max(0, Number(editedPurchase.unitCost) || 0);
      const totalCost = unitCost * qty;

      setPurchases((prev) =>
        prev.map((p) =>
          p.id === editedPurchase.id
            ? {
                ...p,
                itemName: editedPurchase.itemName?.trim() || p.itemName,
                qty,
                unitCost,
                totalCost,
                supplier: editedPurchase.supplier?.trim() || 'Traveling Merchant',
                date: editedPurchase.date || p.date
              }
            : p
        )
      );
      showToast('Updated purchase record!');
    },
    [setPurchases, showToast]
  );

  const deletePurchase = useCallback(
    (purchaseId) => {
      setPurchases((prev) => prev.filter((p) => p.id !== purchaseId));
      showToast('Removed purchase entry.');
    },
    [setPurchases, showToast]
  );

  return {
    recordSaleLines,
    recordQuickPublicSale,
    updateSale,
    deleteSale,
    recordPurchaseLines,
    updatePurchase,
    deletePurchase
  };
}
