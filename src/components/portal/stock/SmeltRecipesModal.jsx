import React, { useState, useMemo } from 'react';
import { INITIAL_CATALOG_ITEMS_RAW } from '../../../data/seedData';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import Modal from '../../common/Modal';
import SearchInput from '../../common/SearchInput';

export default function SmeltRecipesModal({ onClose }) {
  const { catalogItems, resolvedMaterials, materialMap, updateIngotSmeltRecipe } =
    useForgeLedgerContext();
  const { canEditRecipes } = useForgeAuth();
  const [search, setSearch] = useState('');

  const filteredIngots = useMemo(() => {
    const defaultIngots = INITIAL_CATALOG_ITEMS_RAW.filter(
      (c) => c.category === 'Ingots & Materials'
    );

    const ingotCatalogItems = defaultIngots.map((defIngot) => {
      const existing = catalogItems.find((c) => c.id === defIngot.id);
      if (existing) {
        const effectiveRecipe =
          Array.isArray(existing.recipe) && existing.recipe.length > 0
            ? existing.recipe
            : defIngot.recipe;
        return { ...existing, recipe: effectiveRecipe, _isVirtual: false };
      }
      return { ...defIngot, _isVirtual: true };
    });

    const extraIngots = catalogItems.filter(
      (item) =>
        !defaultIngots.some((d) => d.id === item.id) &&
        (item.category === 'Ingots & Materials' ||
          item.subCategory === 'Smelted Ingots' ||
          item.name.toLowerCase().includes('ingot'))
    );

    const allSmeltEntries = [...ingotCatalogItems, ...extraIngots];

    return allSmeltEntries.filter((item) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesIng = (item.recipe || []).some((r) =>
        (materialMap[r.materialId]?.name || r.materialId).toLowerCase().includes(q)
      );
      return matchesName || matchesIng;
    });
  }, [catalogItems, materialMap, search]);

  return (
    <Modal
      title="Ingot Smelting Formulas"
      subtitle="Adjust ores and fuel ratios used to auto-calculate ingot costs."
      maxWidthClass="max-w-2xl"
      onClose={onClose}
      headerRight={
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search ingots or ores..."
          className="w-44 sm:w-56"
          iconClassName="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2"
          inputClassName="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          clearable={false}
        />
      }
    >
      <div className="p-5 overflow-y-auto space-y-3">
        {filteredIngots.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-zinc-400">No smelted ingot recipes match your search.</p>
          </div>
        ) : (
          filteredIngots.map((ingotItem) => {
            const unitSmeltCost = (ingotItem.recipe || []).reduce((sum, r) => {
              const m = materialMap[r.materialId];
              return sum + (m ? (Number(m.buyPrice) || 0) * r.qty : 0);
            }, 0);

            return (
              <div
                key={ingotItem.id}
                className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-100">{ingotItem.name}</span>
                  <span className="text-xs font-bold text-amber-300">
                    Smelt Cost: {unitSmeltCost}g
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(ingotItem.recipe || []).map((req) => (
                    <div
                      key={req.materialId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs"
                    >
                      <input
                        type="number"
                        min="1"
                        disabled={!canEditRecipes}
                        value={req.qty}
                        onChange={(e) => {
                          const q = Math.max(1, Number(e.target.value) || 1);
                          updateIngotSmeltRecipe(ingotItem, (rec) =>
                            rec.map((r) =>
                              r.materialId === req.materialId ? { ...r, qty: q } : r
                            )
                          );
                        }}
                        className="w-12 bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-center font-bold text-amber-200"
                      />
                      <span className="text-zinc-200">
                        {materialMap[req.materialId]?.name || req.materialId}
                      </span>
                      {canEditRecipes && (
                        <button
                          type="button"
                          onClick={() =>
                            updateIngotSmeltRecipe(ingotItem, (rec) =>
                              rec.filter((r) => r.materialId !== req.materialId)
                            )
                          }
                          title="Remove ingredient"
                          className="text-zinc-500 hover:text-red-400 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  {canEditRecipes && (
                    <select
                      value=""
                      onChange={(e) => {
                        const matId = e.target.value;
                        if (!matId) return;
                        updateIngotSmeltRecipe(ingotItem, (rec) => {
                          if (rec.some((r) => r.materialId === matId)) return rec;
                          return [...rec, { materialId: matId, qty: 1 }];
                        });
                      }}
                      className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-amber-300 focus:outline-none"
                    >
                      <option value="">+ Add ore / fuel...</option>
                      {resolvedMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.buyPrice}g)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
