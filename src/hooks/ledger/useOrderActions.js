import { useCallback } from 'react';
import { getLocalDateString } from '../../utils/formatters';

export function getOrderItems(ord) {
  if (!ord) return [];
  if (Array.isArray(ord.items) && ord.items.length > 0) {
    return ord.items.map((line) => ({
      itemId: line.itemId,
      itemName: line.itemName || 'Unnamed Item',
      category: line.category || 'Unsorted',
      subCategory: line.subCategory || '',
      qty: Math.max(1, Number(line.qty) || 1),
      agreedUnitPrice: Number(line.agreedUnitPrice) || 0,
      unitCost: Number(line.unitCost) || 0
    }));
  }
  return [
    {
      itemId: ord.itemId,
      itemName: ord.itemName || 'Unnamed Item',
      category: ord.category || 'Unsorted',
      subCategory: ord.subCategory || '',
      qty: Math.max(1, Number(ord.qty) || 1),
      agreedUnitPrice: Number(ord.agreedUnitPrice) || 0,
      unitCost: Number(ord.unitCost) || 0
    }
  ];
}

function summarizeOrderLines(items) {
  const totalQty = items.reduce((sum, l) => sum + l.qty, 0);
  const agreedTotal = items.reduce((sum, l) => sum + l.agreedUnitPrice * l.qty, 0);
  const first = items[0];
  const itemName =
    items.length === 1
      ? first.itemName
      : `${first.itemName} + ${items.length - 1} more`;
  return {
    items,
    itemId: first?.itemId || '',
    itemName,
    category: first?.category || 'Unsorted',
    subCategory: first?.subCategory || '',
    qty: totalQty,
    agreedUnitPrice: first?.agreedUnitPrice || 0,
    unitCost: first?.unitCost || 0,
    agreedTotal
  };
}

function mergeOrderLines(existingLines, incomingLines) {
  const merged = existingLines.map((l) => ({ ...l }));
  incomingLines.forEach((inc) => {
    const match = merged.find((m) => m.itemId && m.itemId === inc.itemId);
    if (match) {
      match.qty += inc.qty;
    } else {
      merged.push({ ...inc });
    }
  });
  return merged;
}

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
  const resolveIncomingLines = useCallback(
    (rawItems) => {
      return (rawItems || [])
        .map((entry) => {
          const item =
            entry.item || enrichedCatalog.find((i) => i.id === entry.itemId);
          if (!item) return null;
          const qty = Math.max(1, Math.floor(Number(entry.qty) || 1));
          return {
            itemId: item.id,
            itemName: item.name,
            category: item.category || 'Unsorted',
            subCategory: item.subCategory || '',
            qty,
            agreedUnitPrice: Number(item.sellPrice) || 0,
            unitCost: Number(item.materialCost) || 0
          };
        })
        .filter(Boolean);
    },
    [enrichedCatalog]
  );

  const addItemsToOrder = useCallback(
    ({ targetOrderId = '', customerName = '', items = [], notes = '' }) => {
      const normalizedLines = resolveIncomingLines(items);
      if (normalizedLines.length === 0) return false;

      const cleanNotes = (notes || '').trim();
      const totalAddedUnits = normalizedLines.reduce((s, l) => s + l.qty, 0);

      if (targetOrderId) {
        let matchedPatron = '';
        setOrders((prev) =>
          prev.map((ord) => {
            if (ord.id !== targetOrderId) return ord;
            matchedPatron = ord.customerName;
            const merged = mergeOrderLines(getOrderItems(ord), normalizedLines);
            const summary = summarizeOrderLines(merged);
            const combinedNotes = cleanNotes
              ? ord.notes
                ? `${ord.notes} • ${cleanNotes}`
                : cleanNotes
              : ord.notes || '';
            return {
              ...ord,
              ...summary,
              notes: combinedNotes
            };
          })
        );
        showToast(
          `Added ${totalAddedUnits} ${totalAddedUnits === 1 ? 'item' : 'items'} to ${
            matchedPatron || 'order'
          }'s commission!`
        );
        return true;
      }

      const patron = (customerName || '').trim() || 'Whiterun Patron';
      const summary = summarizeOrderLines(normalizedLines);
      const newOrder = {
        id: `ord_${Date.now()}`,
        customerName: patron,
        ...summary,
        notes: cleanNotes,
        status: 'pending',
        date: getLocalDateString(0)
      };

      setOrders((prev) => [newOrder, ...prev]);
      showToast(
        `Created order for ${patron} (${totalAddedUnits} ${
          totalAddedUnits === 1 ? 'item' : 'items'
        } • ${summary.agreedTotal.toLocaleString()}g)!`
      );
      return true;
    },
    [resolveIncomingLines, setOrders, showToast]
  );

  const addOrder = useCallback(
    ({ customerName, itemId, qty = 1, notes = '', targetOrderId = '' }) => {
      return addItemsToOrder({
        targetOrderId,
        customerName,
        items: [{ itemId, qty }],
        notes
      });
    },
    [addItemsToOrder]
  );

  const removeOrderLine = useCallback(
    (orderId, itemId) => {
      setOrders((prev) =>
        prev
          .map((ord) => {
            if (ord.id !== orderId) return ord;
            const remaining = getOrderItems(ord).filter((l) => l.itemId !== itemId);
            if (remaining.length === 0) return null;
            return { ...ord, ...summarizeOrderLines(remaining) };
          })
          .filter(Boolean)
      );
    },
    [setOrders]
  );

  const completeOrder = useCallback(
    (ord) => {
      const orderLines = getOrderItems(ord);
      setOrders((prev) =>
        prev.map((o) => (o.id === ord.id ? { ...o, status: 'completed' } : o))
      );

      const availableFinishedStockMap = {};
      enrichedCatalog.forEach((c) => {
        availableFinishedStockMap[c.id] = Math.max(0, Number(c.stock) || 0);
      });

      const stockDeductions = {};
      const materialDeductions = {};
      const todayStr = getLocalDateString(0);
      const newSaleRecords = [];

      orderLines.forEach((line, idx) => {
        const unitSell = Number(line.agreedUnitPrice) || 0;
        const unitCost = Number(line.unitCost) || 0;
        const qty = Math.max(1, Number(line.qty) || 1);

        const catItem = enrichedCatalog.find((c) => c.id === line.itemId);
        if (catItem) {
          const availStock = availableFinishedStockMap[catItem.id] || 0;
          const fromStock = Math.min(availStock, qty);
          availableFinishedStockMap[catItem.id] = availStock - fromStock;
          const unitsToForge = qty - fromStock;

          if (fromStock > 0) {
            stockDeductions[catItem.id] = (stockDeductions[catItem.id] || 0) + fromStock;
          }
          if (unitsToForge > 0 && catItem.totalMaterialsMap) {
            Object.entries(catItem.totalMaterialsMap).forEach(([matId, perUnit]) => {
              materialDeductions[matId] =
                (materialDeductions[matId] || 0) + (Number(perUnit) || 0) * unitsToForge;
            });
          }
        }

        newSaleRecords.push({
          id: `sale_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 5)}`,
          date: todayStr,
          itemId: line.itemId,
          itemName: line.itemName,
          category: line.category || 'Unsorted',
          subCategory: line.subCategory || '',
          qty,
          unitSell,
          unitCost,
          totalRevenue: unitSell * qty,
          netProfit: (unitSell - unitCost) * qty,
          customer: ord.customerName || 'Commission Patron'
        });
      });

      applySaleInventoryDeductions({ stockDeductions, materialDeductions });
      setSales((prev) => [...newSaleRecords, ...prev]);

      const grandTotal = newSaleRecords.reduce((s, r) => s + r.totalRevenue, 0);
      showToast(
        `Completed ${ord.customerName}'s order (+${grandTotal.toLocaleString()}g) & updated vault stock!`
      );
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
    addItemsToOrder,
    removeOrderLine,
    completeOrder,
    deleteOrder,
    addSupplyRecord,
    markSupplyDelivered,
    deleteSupplyRecord
  };
}
