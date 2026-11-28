import { useCallback } from 'react';

export function useCatalogActions({ setCatalogItems, setSubCategories, showToast }) {
  const quickChangeItemSubCategory = useCallback(
    (itemId, nextSubCat) => {
      setCatalogItems((prev) =>
        prev.map((c) => (c.id === itemId ? { ...c, subCategory: nextSubCat } : c))
      );
      showToast(`Updated type to ${nextSubCat || 'None'}.`);
    },
    [setCatalogItems, showToast]
  );

  const adjustCatalogStock = useCallback(
    (itemId, delta) => {
      setCatalogItems((prev) =>
        prev.map((c) =>
          c.id === itemId ? { ...c, stock: Math.max(0, (Number(c.stock) || 0) + delta) } : c
        )
      );
    },
    [setCatalogItems]
  );

  const setCatalogStockDirect = useCallback(
    (itemId, rawVal) => {
      const val = Math.max(0, Math.floor(Number(rawVal) || 0));
      setCatalogItems((prev) =>
        prev.map((c) => (c.id === itemId ? { ...c, stock: val } : c))
      );
    },
    [setCatalogItems]
  );

  const addSubTier = useCallback(
    (categoryName, rawTier) => {
      const trimmed = rawTier.trim();
      if (!trimmed || categoryName === 'All') return false;
      setSubCategories((prev) => {
        const existing = prev[categoryName] || [];
        if (existing.includes(trimmed)) return prev;
        return { ...prev, [categoryName]: [...existing, trimmed] };
      });
      showToast(`Added "${trimmed}" tier to ${categoryName}`);
      return true;
    },
    [setSubCategories, showToast]
  );

  const removeSubTier = useCallback(
    (categoryName, tierName) => {
      setSubCategories((prev) => ({
        ...prev,
        [categoryName]: (prev[categoryName] || []).filter((t) => t !== tierName)
      }));
      showToast(`Removed tier "${tierName}"`);
    },
    [setSubCategories, showToast]
  );

  const createCatalogItem = useCallback(
    ({ name, category, subCategory, description, recipe, bundleItems }) => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        showToast('Please enter an item or armor set name first.', 'error');
        return false;
      }
      const created = {
        id: `cat_${Date.now()}`,
        name: trimmedName,
        category,
        subCategory: subCategory || '',
        description:
          description.trim() ||
          (bundleItems.length > 0
            ? `Complete set (${bundleItems.length} pieces) forged at the Skyforge.`
            : 'Hand-forged at the Skyforge.'),
        stock: 0,
        customPrice: 0,
        useCustomPrice: false,
        recipe: [...recipe],
        bundleItems: [...bundleItems]
      };
      setCatalogItems((prev) => [...prev, created]);
      showToast(`Added "${created.name}" to catalog!`);
      return true;
    },
    [setCatalogItems, showToast]
  );

  const updateCatalogItem = useCallback(
    (editedItem) => {
      const cleaned = {
        id: editedItem.id,
        name: String(editedItem.name || 'Unnamed Item'),
        category: String(editedItem.category || 'Unsorted'),
        subCategory: String(editedItem.subCategory || ''),
        description: String(editedItem.description || ''),
        stock: Math.max(0, Number(editedItem.stock) || 0),
        customPrice: Math.max(0, Number(editedItem.customPrice) || 0),
        useCustomPrice: Boolean(editedItem.useCustomPrice),
        recipe: Array.isArray(editedItem.recipe) ? editedItem.recipe : [],
        bundleItems: Array.isArray(editedItem.bundleItems) ? editedItem.bundleItems : []
      };
      setCatalogItems((prev) => prev.map((c) => (c.id === cleaned.id ? cleaned : c)));
      showToast('Saved item changes.');
    },
    [setCatalogItems, showToast]
  );

  const deleteCatalogItem = useCallback(
    (itemId) => {
      setCatalogItems((prev) => prev.filter((c) => c.id !== itemId));
    },
    [setCatalogItems]
  );

  const updateIngotSmeltRecipe = useCallback(
    (targetIngot, recipeUpdater) => {
      setCatalogItems((prev) => {
        const exists = prev.some((c) => c.id === targetIngot.id);
        if (exists) {
          return prev.map((c) => {
            if (c.id !== targetIngot.id) return c;
            const baseRecipe =
              Array.isArray(c.recipe) && c.recipe.length > 0 ? c.recipe : targetIngot.recipe || [];
            return { ...c, recipe: recipeUpdater(baseRecipe) };
          });
        }
        const { _isVirtual, ...cleanTarget } = targetIngot;
        return [
          ...prev,
          {
            ...cleanTarget,
            recipe: recipeUpdater(targetIngot.recipe || [])
          }
        ];
      });
    },
    [setCatalogItems]
  );

  return {
    quickChangeItemSubCategory,
    adjustCatalogStock,
    setCatalogStockDirect,
    addSubTier,
    removeSubTier,
    createCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    updateIngotSmeltRecipe
  };
}
