import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useForgeLedgerContext, useForgeToast } from '../../../context/ForgeContext';
import { roundToNearestFive, createId } from '../../../utils/formatters';
import Modal from '../../common/Modal';

export default function RecordSaleModal({ onClose }) {
  const {
    enrichedCatalog,
    resolvedMaterials,
    materialMap,
    categories,
    subCategories,
    profitMarginPct,
    recordSaleLines
  } = useForgeLedgerContext();
  const { showToast } = useForgeToast();

  const [saleMode, setSaleMode] = useState('existing');
  const [saleItemSearch, setSaleItemSearch] = useState('');
  const [saleItemId, setSaleItemId] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [saleCustomer, setSaleCustomer] = useState('');
  const [deductStockOnSale, setDeductStockOnSale] = useState(true);
  const [deductMaterialsOnSale, setDeductMaterialsOnSale] = useState(true);
  const [saleCartItems, setSaleCartItems] = useState([]);

  const [customSaleName, setCustomSaleName] = useState('');
  const [customSaleCat, setCustomSaleCat] = useState('Weapons');
  const [customSaleSubCat, setCustomSaleSubCat] = useState('Iron');
  const [customSaleMatSearch, setCustomSaleMatSearch] = useState('');
  const [customSaleMatId, setCustomSaleMatId] = useState('mat_iron_ingot');
  const [customSaleMatQty, setCustomSaleMatQty] = useState(1);
  const [customSaleRecipe, setCustomSaleRecipe] = useState([]);
  const [customSalePriceOverride, setCustomSalePriceOverride] = useState('');
  const [saveCustomSaleToRecipes, setSaveCustomSaleToRecipes] = useState(true);

  const customSalePricingPreview = useMemo(() => {
    const materialCost = customSaleRecipe.reduce((sum, req) => {
      const mat = materialMap[req.materialId];
      return sum + (mat ? (Number(mat.buyPrice) || 0) * req.qty : 0);
    }, 0);
    const calculatedSellPrice = roundToNearestFive(
      materialCost * (1 + (Number(profitMarginPct) || 0) / 100)
    );
    const hasOverride =
      customSalePriceOverride !== '' &&
      !Number.isNaN(Number(customSalePriceOverride)) &&
      Number(customSalePriceOverride) >= 0;
    const finalSellPrice = hasOverride
      ? Math.round(Number(customSalePriceOverride))
      : calculatedSellPrice;
    const profitPerUnit = finalSellPrice - materialCost;
    return { materialCost, calculatedSellPrice, finalSellPrice, profitPerUnit, hasOverride };
  }, [customSaleRecipe, materialMap, profitMarginPct, customSalePriceOverride]);

  const handleAddCustomSaleIngredient = () => {
    if (!customSaleMatId) return;
    const qty = Math.max(1, Number(customSaleMatQty) || 1);
    setCustomSaleRecipe((prev) => {
      const existing = prev.find((r) => r.materialId === customSaleMatId);
      if (existing) {
        return prev.map((r) =>
          r.materialId === customSaleMatId ? { ...r, qty: r.qty + qty } : r
        );
      }
      return [...prev, { materialId: customSaleMatId, qty }];
    });
  };

  const buildCurrentLineItem = () => {
    const qty = Math.max(1, Number(saleQty) || 1);
    if (saleMode === 'custom') {
      const cleanName = customSaleName.trim();
      if (!cleanName) return null;
      const { materialCost, finalSellPrice, hasOverride } = customSalePricingPreview;
      return {
        lineId: createId('sline'),
        mode: 'custom',
        itemName: cleanName,
        category: customSaleCat || 'Unsorted',
        subCategory: customSaleSubCat || '',
        qty,
        unitSell: finalSellPrice,
        unitCost: materialCost,
        hasOverride,
        recipe: [...customSaleRecipe],
        saveToRecipes: saveCustomSaleToRecipes
      };
    }
    const item = enrichedCatalog.find((i) => i.id === saleItemId);
    if (!item) return null;
    return {
      lineId: createId('sline'),
      mode: 'existing',
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      subCategory: item.subCategory || '',
      qty,
      unitSell: item.sellPrice,
      unitCost: item.materialCost,
      totalMaterialsMap: item.totalMaterialsMap || {}
    };
  };

  const handleAddLineToCart = () => {
    const line = buildCurrentLineItem();
    if (!line) {
      showToast(
        saleMode === 'custom'
          ? 'Enter a name for the custom item first.'
          : 'Select an item from the catalog first.',
        'error'
      );
      return;
    }
    setSaleCartItems((prev) => [...prev, line]);
    setSaleQty(1);
    if (saleMode === 'custom') {
      setCustomSaleName('');
      setCustomSaleRecipe([]);
      setCustomSalePriceOverride('');
    } else {
      setSaleItemId('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDraft = buildCurrentLineItem();
    const lines =
      saleCartItems.length > 0
        ? currentDraft
          ? [...saleCartItems, currentDraft]
          : [...saleCartItems]
        : currentDraft
        ? [currentDraft]
        : [];

    const ok = recordSaleLines({
      lines,
      customer: saleCustomer,
      deductStock: deductStockOnSale,
      deductMaterials: deductMaterialsOnSale
    });
    if (ok) onClose();
  };

  const hasCurrentDraft = Boolean(buildCurrentLineItem());

  return (
    <Modal
      title="Record a Sale"
      subtitle="Add one or multiple catalog/custom items to this sale before logging."
      maxWidthClass="max-w-2xl"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
        {saleCartItems.length > 0 && (
          <div className="p-3.5 rounded-lg bg-amber-950/25 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-amber-200">
                Items in This Sale ({saleCartItems.length})
              </span>
              <span className="font-bold text-amber-300">
                Subtotal:{' '}
                {saleCartItems
                  .reduce((sum, l) => sum + l.unitSell * l.qty, 0)
                  .toLocaleString()}
                g
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {saleCartItems.map((line) => (
                <div
                  key={line.lineId}
                  className="px-2.5 py-1.5 rounded bg-zinc-950/90 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-zinc-100">
                      {line.qty}x {line.itemName}
                    </span>
                    <span className="text-[11px] text-zinc-500 ml-2">
                      ({line.unitSell}g each • Cost: {line.unitCost}g)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-amber-300">+{line.unitSell * line.qty}g</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSaleCartItems((prev) => prev.filter((x) => x.lineId !== line.lineId))
                      }
                      className="p-1 rounded bg-zinc-900 hover:bg-red-950/70 text-zinc-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setSaleMode('existing')}
            className={`py-1.5 rounded font-semibold cursor-pointer ${
              saleMode === 'existing'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Existing Catalog Item
          </button>
          <button
            type="button"
            onClick={() => setSaleMode('custom')}
            className={`py-1.5 rounded font-semibold cursor-pointer ${
              saleMode === 'custom'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            + Unlisted Item &amp; Materials
          </button>
        </div>

        {saleMode === 'existing' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Search &amp; Select Item</label>
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={saleItemSearch}
                  onChange={(e) => setSaleItemSearch(e.target.value)}
                  placeholder="Type to filter catalog items..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>
              <select
                value={saleItemId}
                onChange={(e) => setSaleItemId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
              >
                <option value="">-- Select Ware --</option>
                {enrichedCatalog
                  .filter(
                    (item) =>
                      !saleItemSearch.trim() ||
                      item.name.toLowerCase().includes(saleItemSearch.toLowerCase()) ||
                      item.category.toLowerCase().includes(saleItemSearch.toLowerCase()) ||
                      (item.subCategory || '')
                        .toLowerCase()
                        .includes(saleItemSearch.toLowerCase())
                  )
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sellPrice}g | Stock: {item.stock})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deductStockOnSale}
                  onChange={(e) => setDeductStockOnSale(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Use finished stock first</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-emerald-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deductMaterialsOnSale}
                  onChange={(e) => setDeductMaterialsOnSale(e.target.checked)}
                  className="accent-emerald-500"
                />
                <span>Deduct recipe materials from vault</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-3.5 rounded-lg bg-zinc-950/85 border border-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-1">
                <label className="block text-[11px] text-zinc-400 mb-1">New Item Name</label>
                <input
                  type="text"
                  value={customSaleName}
                  onChange={(e) => setCustomSaleName(e.target.value)}
                  placeholder="e.g. Glass Mace"
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Category</label>
                <select
                  value={customSaleCat}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCustomSaleCat(c);
                    setCustomSaleSubCat((subCategories[c] || [])[0] || '');
                  }}
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Sub-Tier</label>
                <select
                  value={customSaleSubCat}
                  onChange={(e) => setCustomSaleSubCat(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                >
                  <option value="">-- None --</option>
                  {(subCategories[customSaleCat] || []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-semibold text-zinc-300">
                Materials Used to Forge This Item
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customSaleMatSearch}
                  onChange={(e) => setCustomSaleMatSearch(e.target.value)}
                  placeholder="Search ores, ingots, leather..."
                  className="w-full pl-8 pr-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={customSaleMatId}
                  onChange={(e) => setCustomSaleMatId(e.target.value)}
                  className="flex-1 min-w-[160px] px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                >
                  {resolvedMaterials
                    .filter(
                      (m) =>
                        !customSaleMatSearch.trim() ||
                        m.name.toLowerCase().includes(customSaleMatSearch.toLowerCase()) ||
                        m.category.toLowerCase().includes(customSaleMatSearch.toLowerCase())
                    )
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.buyPrice}g)
                      </option>
                    ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={customSaleMatQty}
                  onChange={(e) => setCustomSaleMatQty(e.target.value)}
                  className="w-16 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSaleIngredient}
                  className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
                >
                  + Add Material
                </button>
              </div>

              {customSaleRecipe.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customSaleRecipe.map((r) => (
                    <span
                      key={r.materialId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                    >
                      <span>
                        {r.qty}x {materialMap[r.materialId]?.name || r.materialId}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomSaleRecipe((prev) =>
                            prev.filter((x) => x.materialId !== r.materialId)
                          )
                        }
                        className="text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/90 border border-amber-500/30 grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-[10px] uppercase text-zinc-400">Material Cost</div>
                <div className="font-bold text-zinc-100">
                  {customSalePricingPreview.materialCost}g
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-zinc-400">
                  Calculated ({profitMarginPct}%)
                </div>
                <div className="font-bold text-amber-300">
                  {customSalePricingPreview.calculatedSellPrice}g
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-zinc-400">
                  Override Sell (Opt.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={customSalePriceOverride}
                  onChange={(e) => setCustomSalePriceOverride(e.target.value)}
                  placeholder={`${customSalePricingPreview.calculatedSellPrice}g`}
                  className="w-full mt-0.5 px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-amber-200 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-emerald-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveCustomSaleToRecipes}
                  onChange={(e) => setSaveCustomSaleToRecipes(e.target.checked)}
                  className="accent-emerald-500"
                />
                <span>Save item &amp; recipe to catalog</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deductMaterialsOnSale}
                  onChange={(e) => setDeductMaterialsOnSale(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Deduct materials from vault</span>
              </label>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="block text-xs text-zinc-400 mb-1">Qty</label>
            <input
              type="number"
              min="1"
              value={saleQty}
              onChange={(e) => setSaleQty(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-4">
            <button
              type="button"
              onClick={handleAddLineToCart}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item to Sale</span>
            </button>
          </div>
          <div className="sm:col-span-5">
            <label className="block text-xs text-zinc-400 mb-1">Buyer Name</label>
            <input
              type="text"
              value={saleCustomer}
              onChange={(e) => setSaleCustomer(e.target.value)}
              placeholder="e.g. Whiterun Guard"
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            {saleCartItems.length > 0
              ? `Log Sale (${saleCartItems.length + (hasCurrentDraft ? 1 : 0)} Items)`
              : 'Log Sale'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
