import { useCallback } from 'react';
import { getLocalDateString } from '../../utils/formatters';

export function useOrderActions({
  enrichedCatalog,
  resolvedMaterials,
  setOrders,
  setSupplyRecords,
  setMaterials,
  setSales,
  applySaleInventoryDeductions,
  recordStockSnapshot,
  showToast
}) {
  const addOrder = useCallback(
    ({ customerName, itemId, qty: rawQty, notes }) => {
      if (!itemId) return false;
      const item = enrichedCatalog.find((i) => i.id === itemId);
      if (!item) return false;
      const qty = Math.max(1, Number(rawQty) || 1);
      const newOrder = {
        id: `ord_${Date.now()}`,
        customerName: (customerName || '').trim() || 'Whiterun Patron',
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        subCategory: item.subCategory || '',
        qty,
        agreedUnitPrice: item.sellPrice,
        unitCost: item.materialCost,
        agreedTotal: item.sellPrice * qty,
        notes: (notes || '').trim(),
        status: 'pending',
        date: getLocalDateString(0)
      };
      setOrders((prev) => [newOrder, ...prev]);
      showToast(`Added commission for ${newOrder.customerName}!`);
      return true;
    },
    [enrichedCatalog, setOrders, showToast]
  );

  const completeOrder = useCallback(
    (ord) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === ord.id ? { ...o, status: 'completed' } : o))
      );
      const unitSell = Number(ord.agreedUnitPrice) || 0;
      const unitCost = Number(ord.unitCost) || 0;
      const qty = Math.max(1, Number(ord.qty) || 1);

      const catItem = enrichedCatalog.find((c) => c.id === ord.itemId);
      const stockDeductions = {};
      const materialDeductions = {};
      if (catItem) {
        const availStock = Math.max(0, Number(catItem.stock) || 0);
        const fromStock = Math.min(availStock, qty);
        const unitsToForge = qty - fromStock;
        if (fromStock > 0) stockDeductions[catItem.id] = fromStock;
        if (unitsToForge > 0 && catItem.totalMaterialsMap) {
          Object.entries(catItem.totalMaterialsMap).forEach(([matId, perUnit]) => {
            materialDeductions[matId] = (Number(perUnit) || 0) * unitsToForge;
          });
        }
      }

      applySaleInventoryDeductions({ stockDeductions, materialDeductions });

      setSales((prev) => [
        {
          id: `sale_${Date.now()}`,
          date: getLocalDateString(0),
          itemId: ord.itemId,
          itemName: ord.itemName,
          category: ord.category || 'Unsorted',
          subCategory: ord.subCategory || '',
          qty,
          unitSell,
          unitCost,
          totalRevenue: unitSell * qty,
          netProfit: (unitSell - unitCost) * qty,
          customer: ord.customerName || 'Commission Patron'
        },
        ...prev
      ]);
      showToast(`Completed order (+${unitSell * qty}g) & updated vault stock!`);
    },
    [enrichedCatalog, setOrders, setSales, applySaleInventoryDeductions, showToast]
  );

  const deleteOrder = useCallback(
    (orderId) => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    },
    [setOrders]
  );

  const addSupplyRecord = useCallback(
    ({ supplierName, materialId, qty: rawQty, totalCost: rawCost, status }) => {
      if (!materialId) return false;
      const mat = resolvedMaterials.find((m) => m.id === materialId);
      if (!mat) return false;
      const qty = Math.max(1, Number(rawQty) || 1);
      const totalCost = Math.max(0, Number(rawCost) || 0);
      const rec = {
        id: `sup_${Date.now()}`,
        supplierName: (supplierName || '').trim() || 'Mining Caravan',
        materialId: mat.id,
        materialName: mat.name,
        qty,
        totalCost,
        status,
        date: getLocalDateString(0)
      };
      setSupplyRecords((prev) => [rec, ...prev]);
      if (status === 'delivered') {
        setMaterials((prev) => {
          const nextMats = prev.map((m) =>
            m.id === mat.id ? { ...m, stock: (Number(m.stock) || 0) + qty } : m
          );
          recordStockSnapshot(nextMats);
          return nextMats;
        });
      }
      showToast(`Logged material delivery for ${mat.name}!`);
      return true;
    },
    [resolvedMaterials, setSupplyRecords, setMaterials, recordStockSnapshot, showToast]
  );

  const markSupplyDelivered = useCallback(
    (rec) => {
      setSupplyRecords((prev) =>
        prev.map((r) => (r.id === rec.id ? { ...r, status: 'delivered' } : r))
      );
      setMaterials((prev) => {
        const nextMats = prev.map((m) =>
          m.id === rec.materialId
            ? { ...m, stock: (Number(m.stock) || 0) + (Number(rec.qty) || 0) }
            : m
        );
        recordStockSnapshot(nextMats);
        return nextMats;
      });
      showToast(`Marked ${rec.qty}x ${rec.materialName} delivered & added to vault!`);
    },
    [setSupplyRecords, setMaterials, recordStockSnapshot, showToast]
  );

  const deleteSupplyRecord = useCallback(
    (recId) => {
      setSupplyRecords((prev) => prev.filter((r) => r.id !== recId));
    },
    [setSupplyRecords]
  );

  return {
    addOrder,
    completeOrder,
    deleteOrder,
    addSupplyRecord,
    markSupplyDelivered,
    deleteSupplyRecord
  };
}
