import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';
import StockTrendChart from './StockTrendChart';
import VaultQuickAdd from './VaultQuickAdd';
import SmeltBatchModal from './SmeltBatchModal';

export default function StockTab({ onOpenSmeltRecipes }) {
  const {
    materialCategories,
    resolvedMaterials,
    enrichedCatalog,
    updateMaterialBuyPrice,
    adjustMaterialStock,
    setMaterialStockDirect,
    deleteMaterial,
    adjustCatalogStock
  } = useForgeLedgerContext();
  const { canEditStock } = useForgeAuth();

  const [stockSubTab, setStockSubTab] = useState('materials');
  const [materialSearch, setMaterialSearch] = useState('');
  const [finishedStockSearch, setFinishedStockSearch] = useState('');
  const [showSmeltBatchModal, setShowSmeltBatchModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <StockTrendChart />
        <VaultQuickAdd
          onOpenSmeltBatch={() => setShowSmeltBatchModal(true)}
          onOpenSmeltRecipes={onOpenSmeltRecipes}
        />
      </div>

      <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setStockSubTab('materials')}
              className={`px-3.5 py-1.5 rounded font-semibold cursor-pointer ${
                stockSubTab === 'materials'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ores, Ingots &amp; Fuel ({resolvedMaterials.length})
            </button>
            <button
              type="button"
              onClick={() => setStockSubTab('finished')}
              className={`px-3.5 py-1.5 rounded font-semibold cursor-pointer ${
                stockSubTab === 'finished'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Finished Wares Stock ({enrichedCatalog.length})
            </button>
          </div>

          <SearchInput
            value={stockSubTab === 'materials' ? materialSearch : finishedStockSearch}
            onChange={(val) =>
              stockSubTab === 'materials' ? setMaterialSearch(val) : setFinishedStockSearch(val)
            }
            placeholder={
              stockSubTab === 'materials'
                ? 'Filter ores, ingots, fuel...'
                : 'Filter finished wares...'
            }
            className="w-full sm:w-72"
            clearable={false}
          />
        </div>

        {stockSubTab === 'materials' ? (
          <div className="space-y-5">
            {materialCategories.map((cat) => {
              const itemsInCat = resolvedMaterials.filter(
                (m) =>
                  m.category === cat &&
                  (!materialSearch.trim() ||
                    m.name.toLowerCase().includes(materialSearch.toLowerCase()))
              );
              if (itemsInCat.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wider font-bold text-zinc-400 border-b border-zinc-800/80 pb-1">
                    <span>{cat}</span>
                    <span className="text-[11px] text-zinc-500">{itemsInCat.length} types</span>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {itemsInCat.map((mat) => {
                      const isLow = (Number(mat.stock) || 0) <= (mat.lowThreshold ?? 5);
                      return (
                        <div
                          key={mat.id}
                          className="px-3 py-2 rounded-lg bg-zinc-950/75 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isLow ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            />
                            <span className="text-xs font-semibold text-zinc-100 truncate">
                              {mat.name}
                            </span>
                            {isLow && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-semibold text-amber-300 shrink-0">
                                Low
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 ml-auto">
                            <div className="flex items-center gap-1 text-xs text-zinc-400">
                              <span className="text-[11px]">
                                {mat.isAutoSmeltedCost ? 'Smelt' : 'Buy'}
                              </span>
                              {mat.isAutoSmeltedCost ? (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-amber-500/40">
                                  <span className="text-amber-300 font-bold text-xs">
                                    {mat.buyPrice}g
                                  </span>
                                  <span className="text-[9px] font-bold uppercase text-zinc-400">
                                    Auto
                                  </span>
                                </div>
                              ) : canEditStock ? (
                                <div className="relative">
                                  <input
                                    type="number"
                                    min="0"
                                    value={mat.buyPrice}
                                    onChange={(e) =>
                                      updateMaterialBuyPrice(mat.id, e.target.value)
                                    }
                                    className="w-14 pl-1.5 pr-4 py-0.5 rounded bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 text-zinc-200 font-medium text-xs text-right focus:outline-none"
                                  />
                                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
                                    g
                                  </span>
                                </div>
                              ) : (
                                <span className="text-zinc-200 font-semibold">
                                  {mat.buyPrice}g
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {canEditStock && (
                                <button
                                  type="button"
                                  onClick={() => adjustMaterialStock(mat.id, -1)}
                                  className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                              )}
                              <input
                                type="number"
                                min="0"
                                disabled={!canEditStock}
                                value={mat.stock}
                                onChange={(e) => setMaterialStockDirect(mat.id, e.target.value)}
                                className="w-12 py-0.5 px-1.5 rounded bg-zinc-900 border border-zinc-800 text-center text-xs font-bold text-zinc-100 focus:outline-none"
                              />
                              {canEditStock && (
                                <button
                                  type="button"
                                  onClick={() => adjustMaterialStock(mat.id, 1)}
                                  className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            {canEditStock && (
                              <button
                                type="button"
                                onClick={() => deleteMaterial(mat.id)}
                                title="Remove material"
                                className="p-1 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
            {enrichedCatalog
              .filter(
                (item) =>
                  !finishedStockSearch.trim() ||
                  item.name.toLowerCase().includes(finishedStockSearch.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="px-3.5 py-2.5 rounded-lg bg-zinc-950/75 border border-zinc-800/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-100 truncate">{item.name}</div>
                    <div className="text-[11px] text-zinc-500">
                      {item.category} {item.subCategory ? `• ${item.subCategory}` : ''} • Sell:{' '}
                      {item.sellPrice}g
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {canEditStock && (
                      <button
                        type="button"
                        onClick={() => adjustCatalogStock(item.id, -1)}
                        className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    )}
                    <span className="w-10 text-center text-xs font-bold text-zinc-100">
                      {item.stock}
                    </span>
                    {canEditStock && (
                      <button
                        type="button"
                        onClick={() => adjustCatalogStock(item.id, 1)}
                        className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {showSmeltBatchModal && canEditStock && (
        <SmeltBatchModal onClose={() => setShowSmeltBatchModal(false)} />
      )}
    </div>
  );
}
