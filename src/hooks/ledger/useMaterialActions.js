import { useCallback } from 'react';
import { findSmeltRecipeForMaterial } from '../../utils/pricing';

export function useMaterialActions({
  materials,
  setMaterials,
  materialCategories,
  setMaterialCategories,
  catalogItems,
  setCatalogItems,
  smeltableVaultIngots,
  recordStockSnapshot,
  showToast
}) {
  const recalculateIngotCosts = useCallback(() => {
    let updatedCount = 0;
    setMaterials((prev) =>
      prev.map((mat) => {
        const smeltRecipe = findSmeltRecipeForMaterial(mat, catalogItems, prev);
        if (!smeltRecipe) return mat;
        const newCost = smeltRecipe.reduce((sum, req) => {
          const ing = prev.find((m) => m.id === req.materialId);
          return sum + (ing ? (Number(ing.buyPrice) || 0) * req.qty : 0);
        }, 0);
        updatedCount += 1;
        return { ...mat, buyPrice: newCost };
      })
    );
    showToast(`Synced ${updatedCount} smelted ingot costs from your Ore & Fuel buy prices!`);
  }, [catalogItems, setMaterials, showToast]);

  const smeltBatch = useCallback(
    (ingotId, rawQty) => {
      const targetIngot = smeltableVaultIngots.find((m) => m.id === ingotId);
      if (!targetIngot) {
        showToast('Select a valid ingot to smelt.', 'error');
        return false;
      }
      const barsCount = Math.max(1, Math.floor(Number(rawQty) || 1));
      const recipe = targetIngot.smeltRecipe || [];

      const shortages = recipe
        .map((req) => {
          const currentMat = materials.find((m) => m.id === req.materialId);
          const needed = req.qty * barsCount;
          const available = Number(currentMat?.stock) || 0;
          if (available < needed) {
            return `${currentMat?.name || req.materialId} (need ${needed}, have ${available})`;
          }
          return null;
        })
        .filter(Boolean);

      if (shortages.length > 0) {
        showToast(`Not enough ore/fuel in vault: ${shortages.join(', ')}`, 'error');
        return false;
      }

      const deductions = {};
      recipe.forEach((req) => {
        deductions[req.materialId] = (deductions[req.materialId] || 0) + req.qty * barsCount;
      });

      setMaterials((prev) => {
        const nextMats = prev.map((m) => {
          let nextStock = Number(m.stock) || 0;
          if (deductions[m.id]) {
            nextStock = Math.max(0, nextStock - deductions[m.id]);
          }
          if (m.id === targetIngot.id) {
            nextStock += barsCount;
          }
          return { ...m, stock: nextStock };
        });
        recordStockSnapshot(nextMats);
        return nextMats;
      });

      showToast(`Smelted ${barsCount}x ${targetIngot.name} & deducted ores/fuel!`);
      return true;
    },
    [smeltableVaultIngots, materials, setMaterials, recordStockSnapshot, showToast]
  );

  const updateMaterialBuyPrice = useCallback(
    (matId, rawVal) => {
      const val = Math.max(0, Number(rawVal) || 0);
      setMaterials((prev) => prev.map((m) => (m.id === matId ? { ...m, buyPrice: val } : m)));
    },
    [setMaterials]
  );

  const adjustMaterialStock = useCallback(
    (matId, delta) => {
      setMaterials((prev) => {
        const nextMats = prev.map((m) =>
          m.id === matId ? { ...m, stock: Math.max(0, (Number(m.stock) || 0) + delta) } : m
        );
        recordStockSnapshot(nextMats);
        return nextMats;
      });
    },
    [setMaterials, recordStockSnapshot]
  );

  const setMaterialStockDirect = useCallback(
    (matId, rawVal) => {
      const val = Math.max(0, Number(rawVal) || 0);
      setMaterials((prev) => {
        const nextMats = prev.map((m) => (m.id === matId ? { ...m, stock: val } : m));
        recordStockSnapshot(nextMats);
        return nextMats;
      });
    },
    [setMaterials, recordStockSnapshot]
  );

  const addMaterial = useCallback(
    ({ name, category, buyPrice, stock }) => {
      const trimmed = name.trim();
      if (!trimmed) return false;
      const newMat = {
        id: `mat_${Date.now()}`,
        name: trimmed,
        category,
        buyPrice: Math.max(0, Number(buyPrice) || 0),
        stock: Math.max(0, Number(stock) || 0),
        lowThreshold: 5
      };
      setMaterials((prev) => {
        const nextMats = [...prev, newMat];
        recordStockSnapshot(nextMats);
        return nextMats;
      });
      showToast(`Added ${newMat.name} to ${newMat.category}`);
      return true;
    },
    [setMaterials, recordStockSnapshot, showToast]
  );

  const deleteMaterial = useCallback(
    (matId) => {
      setMaterials((prev) => {
        const nextMats = prev.filter((m) => m.id !== matId);
        recordStockSnapshot(nextMats);
        return nextMats;
      });
      setCatalogItems((prev) =>
        prev.map((item) => ({
          ...item,
          recipe: (item.recipe || []).filter((r) => r.materialId !== matId)
        }))
      );
      showToast('Material removed from vault.');
    },
    [setMaterials, setCatalogItems, recordStockSnapshot, showToast]
  );

  const addResourceCategory = useCallback(
    (rawName) => {
      const trimmed = rawName.trim();
      if (!trimmed) return false;
      if (!materialCategories.includes(trimmed)) {
        setMaterialCategories((prev) => [...prev, trimmed]);
        showToast(`Created resource category "${trimmed}"`);
      }
      return true;
    },
    [materialCategories, setMaterialCategories, showToast]
  );

  return {
    recalculateIngotCosts,
    smeltBatch,
    updateMaterialBuyPrice,
    adjustMaterialStock,
    setMaterialStockDirect,
    addMaterial,
    deleteMaterial,
    addResourceCategory
  };
}
