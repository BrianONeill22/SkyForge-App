export function sanitizeCatalogArray(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && typeof item === 'object' && item.id)
    .map((item) => ({
      ...item,
      name: String(item.name || 'Unnamed Item'),
      category: String(item.category || 'Unsorted'),
      subCategory: String(item.subCategory || ''),
      description: String(item.description || ''),
      stock: Math.max(0, Number(item.stock) || 0),
      customPrice: Math.max(0, Number(item.customPrice) || 0),
      useCustomPrice: Boolean(item.useCustomPrice),
      recipe: Array.isArray(item.recipe) ? item.recipe.filter((r) => r && r.materialId) : [],
      bundleItems: Array.isArray(item.bundleItems)
        ? item.bundleItems.filter((p) => p && p.itemId)
        : []
    }));
}

export function sanitizeMaterialsArray(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((m) => m && typeof m === 'object' && m.id)
    .map((m) => ({
      ...m,
      name: String(m.name || 'Unnamed Resource'),
      category: String(m.category || 'Raw Ore'),
      buyPrice: Math.max(0, Number(m.buyPrice) || 0),
      stock: Math.max(0, Number(m.stock) || 0),
      lowThreshold: Math.max(0, Number(m.lowThreshold ?? 5))
    }));
}
