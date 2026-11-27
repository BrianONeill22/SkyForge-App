import React, { useState, useMemo, useEffect } from 'react';
import {
  Anvil,
  Sword,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  Check,
  Edit3,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Users,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Package,
  ClipboardList,
  Lock,
  Unlock,
  Sliders,
  Layers,
  AlertTriangle
} from 'lucide-react';

// --- PASSCODES ---
const SMITH_PASSCODE = 'Wuuthrad';
const GUEST_PASSCODE = 'Whiterun';
const ADMIN_PASSCODE = 'Ysgramor';

// --- DEFAULT CATEGORIES & SUB-TIERS ---
const DEFAULT_CATEGORIES = ['Weapons', 'Armor', 'Ingots & Materials', 'Unsorted'];

const SUBCATEGORIES_BY_CATEGORY = {
  Weapons: ['Iron', 'Steel', 'Dwarven', 'Elven', 'Orcish', 'Glass', 'Ebony', 'Daedric', 'Dragonbone'],
  Armor: ['Iron', 'Steel', 'Dwarven', 'Elven', 'Orcish', 'Glass', 'Ebony', 'Daedric', 'Dragonscale'],
  'Ingots & Materials': ['Smelted Ingots', 'Leather & Straps'],
  Unsorted: []
};

// --- CLEAN SLATE DEFAULT MATERIALS (ALL STOCKS & BUY PRICES START AT 0) ---
const INITIAL_MATERIALS = [
  // Smelted Ingots
  { id: 'mat_iron_ingot', name: 'Iron Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_steel_ingot', name: 'Steel Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_corundum_ingot', name: 'Corundum Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_silver_ingot', name: 'Silver Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_gold_ingot', name: 'Gold Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_quicksilver_ingot', name: 'Quicksilver Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_dwarven_ingot', name: 'Dwarven Metal Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_orichalcum_ingot', name: 'Orichalcum Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_moonstone_ingot', name: 'Refined Moonstone', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_malachite_ingot', name: 'Refined Malachite', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_stalhrim_ingot', name: 'Stalhrim Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_ebony_ingot', name: 'Ebony Ingot', category: 'Smelted Ingots', unit: 'ingots', buyPrice: 0, stock: 0, minStock: 0 },

  // Raw Ore & Scrap
  { id: 'mat_iron_ore', name: 'Iron Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_corundum_ore', name: 'Corundum Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_silver_ore', name: 'Silver Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_gold_ore', name: 'Gold Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_quicksilver_ore', name: 'Quicksilver Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_dwemer_scrap', name: 'Small Dwemer Plate Metal', category: 'Raw Ore', unit: 'scrap', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_orichalcum_ore', name: 'Orichalcum Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_moonstone_ore', name: 'Moonstone Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_malachite_ore', name: 'Malachite Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_stalhrim_ore', name: 'Stalhrim (Glacial Crystal)', category: 'Raw Ore', unit: 'crystals', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_ebony_ore', name: 'Ebony Ore', category: 'Raw Ore', unit: 'ore', buyPrice: 0, stock: 0, minStock: 0 },

  // Fuel
  { id: 'mat_poor_charcoal', name: 'Poor Charcoal', category: 'Fuel', unit: 'bags', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_charcoal', name: 'Charcoal', category: 'Fuel', unit: 'bags', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_briquettes', name: 'Charcoal Briquettes', category: 'Fuel', unit: 'bags', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_coke', name: 'Coke', category: 'Fuel', unit: 'bags', buyPrice: 0, stock: 0, minStock: 0 },

  // Hides & Straps
  { id: 'mat_leather', name: 'Leather', category: 'Hides & Straps', unit: 'hides', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_leather_strips', name: 'Leather Strips', category: 'Hides & Straps', unit: 'strips', buyPrice: 0, stock: 0, minStock: 0 },
  { id: 'mat_firewood', name: 'Firewood', category: 'Hides & Straps', unit: 'logs', buyPrice: 0, stock: 0, minStock: 0 }
];

// --- CLEAN SLATE CATALOG ITEMS (SMELTING FORMULAS + SAMPLE WEAPONS & ARMOR AT 0 STOCK/PRICE) ---
const INITIAL_CATALOG_ITEMS = [
  // Smelted Ingots (Exact formulas provided)
  {
    id: 'item_ingot_iron',
    name: 'Iron Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Iron Ore and 1x Poor Charcoal.',
    recipe: [
      { materialId: 'mat_iron_ore', qty: 2 },
      { materialId: 'mat_poor_charcoal', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_steel',
    name: 'Steel Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Alloyed from 1x Iron Ore, 1x Corundum Ore, and 1x Poor Charcoal.',
    recipe: [
      { materialId: 'mat_iron_ore', qty: 1 },
      { materialId: 'mat_corundum_ore', qty: 1 },
      { materialId: 'mat_poor_charcoal', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_corundum',
    name: 'Corundum Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Corundum Ore and 1x Poor Charcoal.',
    recipe: [
      { materialId: 'mat_corundum_ore', qty: 2 },
      { materialId: 'mat_poor_charcoal', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_silver',
    name: 'Silver Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Refined from 2x Silver Ore and 1x Charcoal.',
    recipe: [
      { materialId: 'mat_silver_ore', qty: 2 },
      { materialId: 'mat_charcoal', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_quicksilver',
    name: 'Quicksilver Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Quicksilver Ore and 1x Charcoal Briquettes.',
    recipe: [
      { materialId: 'mat_quicksilver_ore', qty: 2 },
      { materialId: 'mat_briquettes', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_dwarven',
    name: 'Dwarven Metal Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Small Dwemer Plate Metal.',
    recipe: [{ materialId: 'mat_dwemer_scrap', qty: 1 }],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_orichalcum',
    name: 'Orichalcum Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Orichalcum Ore and 1x Charcoal Briquettes.',
    recipe: [
      { materialId: 'mat_orichalcum_ore', qty: 2 },
      { materialId: 'mat_briquettes', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_malachite',
    name: 'Refined Malachite',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Glass ingot refined from 2x Malachite Ore and 1x Coke.',
    recipe: [
      { materialId: 'mat_malachite_ore', qty: 2 },
      { materialId: 'mat_coke', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_stalhrim',
    name: 'Stalhrim Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Forged from 2x Stalhrim and 1x Coke.',
    recipe: [
      { materialId: 'mat_stalhrim_ore', qty: 2 },
      { materialId: 'mat_coke', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ingot_ebony',
    name: 'Ebony Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Ebony Ore and 1x Coke.',
    recipe: [
      { materialId: 'mat_ebony_ore', qty: 2 },
      { materialId: 'mat_coke', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },

  // Weapons
  {
    id: 'item_iron_sword',
    name: 'Iron Sword',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Standard Whiterun guard-issue blade.',
    recipe: [
      { materialId: 'mat_iron_ingot', qty: 2 },
      { materialId: 'mat_leather_strips', qty: 1 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_steel_greatsword',
    name: 'Steel Greatsword',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Heavy two-handed Skyforge-honed steel blade.',
    recipe: [
      { materialId: 'mat_steel_ingot', qty: 4 },
      { materialId: 'mat_iron_ingot', qty: 1 },
      { materialId: 'mat_leather_strips', qty: 2 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ebony_war_axe',
    name: 'Ebony War Axe',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Masterwork dark volcanic glass-forged axe.',
    recipe: [
      { materialId: 'mat_ebony_ingot', qty: 3 },
      { materialId: 'mat_leather_strips', qty: 2 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },

  // Armor
  {
    id: 'item_iron_armor',
    name: 'Iron Cuirass',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Riveted iron chestplate lined with cured leather.',
    recipe: [
      { materialId: 'mat_iron_ingot', qty: 4 },
      { materialId: 'mat_leather', qty: 1 },
      { materialId: 'mat_leather_strips', qty: 3 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_steel_plate',
    name: 'Steel Plate Armor',
    category: 'Armor',
    subCategory: 'Steel',
    description: 'Layered corundum-reinforced steel plate.',
    recipe: [
      { materialId: 'mat_steel_ingot', qty: 4 },
      { materialId: 'mat_corundum_ingot', qty: 2 },
      { materialId: 'mat_leather_strips', qty: 3 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  },
  {
    id: 'item_ebony_armor',
    name: 'Ebony Armor',
    category: 'Armor',
    subCategory: 'Ebony',
    description: 'Heavy master-forged ebony plate.',
    recipe: [
      { materialId: 'mat_ebony_ingot', qty: 5 },
      { materialId: 'mat_leather_strips', qty: 3 }
    ],
    stock: 0,
    minStock: 0,
    useCustomPrice: false,
    customPrice: 0
  }
];

const SMELTED_MAT_TO_CATALOG_ID = {
  mat_iron_ingot: 'item_ingot_iron',
  mat_steel_ingot: 'item_ingot_steel',
  mat_corundum_ingot: 'item_ingot_corundum',
  mat_silver_ingot: 'item_ingot_silver',
  mat_quicksilver_ingot: 'item_ingot_quicksilver',
  mat_dwarven_ingot: 'item_ingot_dwarven',
  mat_orichalcum_ingot: 'item_ingot_orichalcum',
  mat_malachite_ingot: 'item_ingot_malachite',
  mat_stalhrim_ingot: 'item_ingot_stalhrim',
  mat_ebony_ingot: 'item_ingot_ebony'
};

function getLocalDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function triggerFileDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function App() {
  // --- PAGE TITLE & WUTHRAD BANNER FAVICON ---
  useEffect(() => {
    document.title = 'The Skyforge';
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M8 4h48v42L32 60 8 46V4z" fill="#7f1d1d" stroke="#f59e0b" stroke-width="4"/>
      <path d="M20 26h24l-3 6H23l-3-6zm5 6h14v6H25v-6zm-4 6h22l2 6H19l2-6z" fill="#fde68a"/>
    </svg>`;
    const encoded = `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = encoded;
  }, []);

  // --- PERSISTENT CORE STATE (CLEAN SLATE v13 KEYS) ---
  const [materials, setMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_materials_v13');
      return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
    } catch {
      return INITIAL_MATERIALS;
    }
  });

  const [catalogItems, setCatalogItems] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_catalog_v13');
      return saved ? JSON.parse(saved) : INITIAL_CATALOG_ITEMS;
    } catch {
      return INITIAL_CATALOG_ITEMS;
    }
  });

  const [profitMarginPct, setProfitMarginPct] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_margin_v13');
      return saved !== null ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [buyOfferPct, setBuyOfferPct] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_buy_offer_v13');
      return saved !== null ? Number(saved) : 70;
    } catch {
      return 70;
    }
  });

  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_sales_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [purchases, setPurchases] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_purchases_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_orders_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [supplyRecords, setSupplyRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_supplies_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_custom_cats_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customMaterialCategories, setCustomMaterialCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_mat_categories_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [subCategoriesMap, setSubCategoriesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_subcats_v13');
      return saved ? JSON.parse(saved) : SUBCATEGORIES_BY_CATEGORY;
    } catch {
      return SUBCATEGORIES_BY_CATEGORY;
    }
  });

  const [memberProfiles, setMemberProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_profiles_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [materialHistory, setMaterialHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_mat_history_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- SYNC TO LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('skyforge_materials_v13', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('skyforge_catalog_v13', JSON.stringify(catalogItems));
  }, [catalogItems]);

  useEffect(() => {
    localStorage.setItem('skyforge_margin_v13', String(profitMarginPct));
  }, [profitMarginPct]);

  useEffect(() => {
    localStorage.setItem('skyforge_buy_offer_v13', String(buyOfferPct));
  }, [buyOfferPct]);

  useEffect(() => {
    localStorage.setItem('skyforge_sales_v13', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('skyforge_purchases_v13', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('skyforge_orders_v13', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('skyforge_supplies_v13', JSON.stringify(supplyRecords));
  }, [supplyRecords]);

  useEffect(() => {
    localStorage.setItem('skyforge_custom_cats_v13', JSON.stringify(customCategories));
  }, [customCategories]);

  useEffect(() => {
    localStorage.setItem('skyforge_mat_categories_v13', JSON.stringify(customMaterialCategories));
  }, [customMaterialCategories]);

  useEffect(() => {
    localStorage.setItem('skyforge_subcats_v13', JSON.stringify(subCategoriesMap));
  }, [subCategoriesMap]);

  useEffect(() => {
    localStorage.setItem('skyforge_profiles_v13', JSON.stringify(memberProfiles));
  }, [memberProfiles]);

  useEffect(() => {
    localStorage.setItem('skyforge_mat_history_v13', JSON.stringify(materialHistory));
  }, [materialHistory]);

  // --- AUTH & NAVIGATION UI STATE ---
  const [workerProfile, setWorkerProfile] = useState(null); // { name, roleType: 'smith' | 'guest' }
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [viewMode, setViewMode] = useState('public'); // 'public' | 'worker'
  const [activeWorkerTab, setActiveWorkerTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'stock' | 'pricing' | 'profiles'
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const [confirmResetModal, setConfirmResetModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? '' : prev));
    }, 3200);
  };

  // --- PUBLIC CATALOG FILTER STATE ---
  const [publicCategory, setPublicCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // --- DASHBOARD (SALE & PURCHASE) STATE ---
  const [ledgerActionMode, setLedgerActionMode] = useState('sale'); // 'sale' | 'purchase'
  const [saleItemId, setSaleItemId] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [salePriceOverride, setSalePriceOverride] = useState('');
  const [saleCustomer, setSaleCustomer] = useState('');
  const [deductStockOnSale, setDeductStockOnSale] = useState(true);

  const [purchaseTargetType, setPurchaseTargetType] = useState('existing_mat'); // 'existing_mat' | 'existing_item' | 'new_item'
  const [purchaseTargetId, setPurchaseTargetId] = useState('');
  const [purchaseNewName, setPurchaseNewName] = useState('');
  const [purchaseNewDestination, setPurchaseNewDestination] = useState('unsorted_ware'); // 'unsorted_ware' | 'resource_vault'
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchaseUnitCost, setPurchaseUnitCost] = useState(0);
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  const [updateBuyPriceOnPurchase, setUpdateBuyPriceOnPurchase] = useState(true);

  // --- ORDERS & SUPPLY DELIVERIES STATE ---
  const [orderCustomer, setOrderCustomer] = useState('');
  const [orderItemId, setOrderItemId] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');

  const [supplyPerson, setSupplyPerson] = useState('');
  const [supplyMaterialId, setSupplyMaterialId] = useState('');
  const [supplyQty, setSupplyQty] = useState(1);
  const [supplyStatus, setSupplyStatus] = useState('delivered'); // 'delivered' | 'pending'
  const [supplyAddToStock, setSupplyAddToStock] = useState(true);
  const [supplyFilter, setSupplyFilter] = useState('all'); // 'all' | 'pending' | 'delivered'

  // --- FORGE STOCK & ORE STATE ---
  const [stockSubView, setStockSubView] = useState('materials'); // 'materials' | 'finished'
  const [stockCategoryFilter, setStockCategoryFilter] = useState('All');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [finishedStockSearch, setFinishedStockSearch] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [newMatCategoryName, setNewMatCategoryName] = useState('');
  const [newMatName, setNewMatName] = useState('');
  const [newMatCat, setNewMatCat] = useState('Smelted Ingots');
  const [newMatBuyPrice, setNewMatBuyPrice] = useState(0);
  const [newMatStock, setNewMatStock] = useState(0);
  const [trendMaterialId, setTrendMaterialId] = useState('ALL');

  // --- RECIPES, MARGIN & TIERS STATE ---
  const [pricingCatFilter, setPricingCatFilter] = useState('All');
  const [pricingSubTierFilter, setPricingSubTierFilter] = useState('All');
  const [pricingSearch, setPricingSearch] = useState('');
  const [newSubTierInput, setNewSubTierInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showSmeltQuickEditor, setShowSmeltQuickEditor] = useState(false);

  // Add New Item in Recipes & Margin
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Weapons');
  const [newItemSubCat, setNewItemSubCat] = useState('Iron');
  const [newItemDesc, setNewItemDesc] = useState('');

  // Profiles & Admin Unlock State
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminPassError, setAdminPassError] = useState('');

  // --- AUTO-SMELT CALCULATION & ENRICHED CATALOG ---
  const baseMaterialMap = useMemo(() => {
    const map = {};
    materials.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [materials]);

  const findSmeltRecipeForMaterial = (mat) => {
    const mappedCatId = SMELTED_MAT_TO_CATALOG_ID[mat.id];
    if (mappedCatId) {
      const found = catalogItems.find((c) => c.id === mappedCatId);
      if (found && Array.isArray(found.recipe) && found.recipe.length > 0) return found;
    }
    if (mat.category === 'Smelted Ingots') {
      const normalized = mat.name.trim().toLowerCase();
      const foundByName = catalogItems.find(
        (c) =>
          c.name.trim().toLowerCase() === normalized &&
          Array.isArray(c.recipe) &&
          c.recipe.length > 0
      );
      if (foundByName) return foundByName;
    }
    return null;
  };

  const resolvedMaterials = useMemo(() => {
    return materials.map((mat) => {
      const smeltRecipeItem = findSmeltRecipeForMaterial(mat);
      if (!smeltRecipeItem) {
        return { ...mat, isAutoSmeltedCost: false };
      }
      const smeltedUnitCost = smeltRecipeItem.recipe.reduce((sum, req) => {
        const ing = baseMaterialMap[req.materialId];
        return sum + (ing ? (Number(ing.buyPrice) || 0) * req.qty : 0);
      }, 0);
      return {
        ...mat,
        buyPrice: smeltedUnitCost,
        isAutoSmeltedCost: true
      };
    });
  }, [materials, catalogItems, baseMaterialMap]);

  const materialMap = useMemo(() => {
    const map = {};
    resolvedMaterials.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [resolvedMaterials]);

  const enrichedCatalog = useMemo(() => {
    return catalogItems.map((item) => {
      const materialCost = (item.recipe || []).reduce((sum, req) => {
        const mat = materialMap[req.materialId];
        return sum + (mat ? (Number(mat.buyPrice) || 0) * req.qty : 0);
      }, 0);
      const calculatedPrice = Math.round(materialCost * (1 + profitMarginPct / 100));
      const finalPrice = item.useCustomPrice ? Number(item.customPrice || 0) : calculatedPrice;
      const unitProfit = finalPrice - materialCost;
      const suggestedBuyPrice = Math.max(
        0,
        Math.min(
          finalPrice > 0 ? finalPrice - 1 : 0,
          Math.round(materialCost * (buyOfferPct / 100))
        )
      );
      return {
        ...item,
        materialCost,
        calculatedPrice,
        finalPrice,
        unitProfit,
        suggestedBuyPrice
      };
    });
  }, [catalogItems, materialMap, profitMarginPct, buyOfferPct]);

  // --- RECORD MATERIAL STOCK SNAPSHOTS FOR TREND GRAPH ---
  const recordMaterialSnapshot = (nextMaterials) => {
    const today = getLocalDateString(0);
    const byMaterial = {};
    let totalUnits = 0;
    nextMaterials.forEach((m) => {
      const qty = Number(m.stock) || 0;
      byMaterial[m.id] = qty;
      totalUnits += qty;
    });
    setMaterialHistory((prev) => {
      const filtered = prev.filter((entry) => entry.date !== today);
      return [...filtered, { date: today, totalUnits, byMaterial }].slice(-30);
    });
  };

  // --- DERIVED LISTS ---
  const allCategories = useMemo(() => {
    return ['All', ...DEFAULT_CATEGORIES, ...customCategories];
  }, [customCategories]);

  const allMaterialCategories = useMemo(() => {
    const base = ['Smelted Ingots', 'Raw Ore', 'Fuel', 'Hides & Straps'];
    const extras = new Set(customMaterialCategories);
    resolvedMaterials.forEach((m) => {
      if (!base.includes(m.category)) extras.add(m.category);
    });
    return [...base, ...Array.from(extras)];
  }, [customMaterialCategories, resolvedMaterials]);

  const filteredPublicItems = useMemo(() => {
    return enrichedCatalog.filter((item) => {
      const matchesCat = publicCategory === 'All' || item.category === publicCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCat;
      return (
        matchesCat &&
        (item.name.toLowerCase().includes(q) ||
          (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)))
      );
    });
  }, [enrichedCatalog, publicCategory, searchQuery]);

  // --- AUTH HANDLERS ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const trimmedName = loginName.trim();
    const trimmedPass = loginPasscode.trim();
    if (!trimmedName) {
      setLoginError('Please enter your name.');
      return;
    }
    let roleType = null;
    if (trimmedPass === SMITH_PASSCODE) {
      roleType = 'smith';
    } else if (trimmedPass === GUEST_PASSCODE) {
      roleType = 'guest';
    } else {
      setLoginError('Invalid passcode. Use the Smith or Guest passcode.');
      return;
    }

    const nowStr = new Date().toLocaleString();
    setWorkerProfile({ name: trimmedName, roleType });
    setIsAdminUnlocked(false);
    setViewMode('worker');
    setActiveWorkerTab('dashboard');
    setShowLoginModal(false);
    setLoginError('');
    setLoginPasscode('');

    setMemberProfiles((prev) => {
      const idx = prev.findIndex((p) => p.name.toLowerCase() === trimmedName.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], roleType, lastActive: nowStr };
        return copy;
      }
      return [...prev, { name: trimmedName, roleType, lastActive: nowStr }];
    });
    triggerToast(
      roleType === 'smith'
        ? `Welcome to the Forge, ${trimmedName}.`
        : `Guest pass activated for ${trimmedName} (Read-Only).`
    );
  };

  // --- SALES & PURCHASES HANDLERS ---
  const handleRecordSale = (e) => {
    e.preventDefault();
    if (!workerProfile || workerProfile.roleType === 'guest') return;
    const item = enrichedCatalog.find((i) => i.id === saleItemId);
    if (!item) {
      triggerToast('Select an item to record a sale.');
      return;
    }
    const qty = Math.max(1, Number(saleQty) || 1);
    const unitSell =
      salePriceOverride !== '' ? Math.max(0, Number(salePriceOverride)) : item.finalPrice;
    const totalRevenue = unitSell * qty;
    const totalCost = item.materialCost * qty;
    const netProfit = totalRevenue - totalCost;

    const newSale = {
      id: `sale_${Date.now()}`,
      date: getLocalDateString(0),
      itemId: item.id,
      itemName: item.name,
      qty,
      unitSell,
      totalRevenue,
      totalCost,
      netProfit,
      customer: saleCustomer.trim() || 'Walk-in Adventurer',
      smithName: workerProfile.name
    };

    setSales((prev) => [newSale, ...prev]);

    if (deductStockOnSale) {
      setCatalogItems((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, stock: Math.max(0, c.stock - qty) } : c))
      );
    }

    setSaleQty(1);
    setSalePriceOverride('');
    setSaleCustomer('');
    triggerToast(`Logged sale: ${qty}x ${item.name} (+${netProfit}g net).`);
  };

  const handleDeleteSale = (id) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    triggerToast('Sale entry removed.');
  };

  const handleRecordPurchase = (e) => {
    e.preventDefault();
    if (!workerProfile || workerProfile.roleType === 'guest') return;
    const qty = Math.max(1, Number(purchaseQty) || 1);
    const unitCost = Math.max(0, Number(purchaseUnitCost) || 0);
    const totalSpent = qty * unitCost;
    const supplier = purchaseSupplier.trim() || 'Caravan / Supplier';

    let itemName = '';
    let categoryLabel = '';

    if (purchaseTargetType === 'existing_mat') {
      const mat = resolvedMaterials.find((m) => m.id === purchaseTargetId);
      if (!mat) {
        triggerToast('Select an existing resource to purchase.');
        return;
      }
      itemName = mat.name;
      categoryLabel = mat.category;
      const nextMats = materials.map((m) =>
        m.id === mat.id
          ? {
              ...m,
              stock: (Number(m.stock) || 0) + qty,
              buyPrice: updateBuyPriceOnPurchase ? unitCost : m.buyPrice
            }
          : m
      );
      setMaterials(nextMats);
      recordMaterialSnapshot(nextMats);
    } else if (purchaseTargetType === 'existing_item') {
      const item = catalogItems.find((c) => c.id === purchaseTargetId);
      if (!item) {
        triggerToast('Select an existing item to purchase.');
        return;
      }
      itemName = item.name;
      categoryLabel = item.category;
      setCatalogItems((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, stock: (Number(c.stock) || 0) + qty } : c))
      );
    } else {
      const cleanName = purchaseNewName.trim();
      if (!cleanName) {
        triggerToast('Enter a name for the new purchased item.');
        return;
      }
      itemName = cleanName;
      if (purchaseNewDestination === 'resource_vault') {
        categoryLabel = 'Raw Ore';
        const newMat = {
          id: `mat_${Date.now()}`,
          name: cleanName,
          category: 'Raw Ore',
          unit: 'units',
          buyPrice: unitCost,
          stock: qty,
          minStock: 0
        };
        const nextMats = [...materials, newMat];
        setMaterials(nextMats);
        recordMaterialSnapshot(nextMats);
      } else {
        categoryLabel = 'Unsorted';
        const newCatalogEntry = {
          id: `item_${Date.now()}`,
          name: cleanName,
          category: 'Unsorted',
          subCategory: '',
          description: 'Acquired via purchase — assign recipe & tier in Recipes & Margin.',
          recipe: [],
          stock: qty,
          minStock: 0,
          useCustomPrice: unitCost > 0,
          customPrice: Math.round(unitCost * (1 + profitMarginPct / 100))
        };
        setCatalogItems((prev) => [newCatalogEntry, ...prev]);
      }
    }

    const newPurchase = {
      id: `purch_${Date.now()}`,
      date: getLocalDateString(0),
      itemName,
      category: categoryLabel,
      qty,
      unitCost,
      totalSpent,
      supplier,
      smithName: workerProfile.name
    };

    setPurchases((prev) => [newPurchase, ...prev]);
    setPurchaseNewName('');
    setPurchaseQty(1);
    setPurchaseSupplier('');
    triggerToast(`Purchased ${qty}x ${itemName} (${totalSpent}g) & added to stock.`);
  };

  // --- CUSTOMER ORDERS & MATERIAL DELIVERIES ---
  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!workerProfile || workerProfile.roleType === 'guest') return;
    const item = enrichedCatalog.find((i) => i.id === orderItemId);
    if (!item || !orderCustomer.trim()) {
      triggerToast('Enter customer name and choose an item.');
      return;
    }
    const newOrder = {
      id: `ord_${Date.now()}`,
      date: getLocalDateString(0),
      customer: orderCustomer.trim(),
      itemId: item.id,
      itemName: item.name,
      qty: Math.max(1, Number(orderQty) || 1),
      quotedTotal: item.finalPrice * Math.max(1, Number(orderQty) || 1),
      notes: orderNotes.trim(),
      status: 'pending',
      loggedBy: workerProfile.name
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderCustomer('');
    setOrderQty(1);
    setOrderNotes('');
    triggerToast(`Order logged for ${newOrder.customer}.`);
  };

  const toggleOrderComplete = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === 'done' ? 'pending' : 'done' } : o
      )
    );
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    triggerToast('Order removed.');
  };

  const handleAddSupplyRecord = (e) => {
    e.preventDefault();
    if (!workerProfile || workerProfile.roleType === 'guest') return;
    const mat = resolvedMaterials.find((m) => m.id === supplyMaterialId);
    if (!mat || !supplyPerson.trim()) {
      triggerToast('Enter supplier/courier name and select a material.');
      return;
    }
    const qty = Math.max(1, Number(supplyQty) || 1);
    const rec = {
      id: `sup_${Date.now()}`,
      date: getLocalDateString(0),
      person: supplyPerson.trim(),
      materialId: mat.id,
      materialName: mat.name,
      qty,
      status: supplyStatus,
      loggedBy: workerProfile.name
    };
    setSupplyRecords((prev) => [rec, ...prev]);

    if (supplyStatus === 'delivered' && supplyAddToStock) {
      const nextMats = materials.map((m) =>
        m.id === mat.id ? { ...m, stock: (Number(m.stock) || 0) + qty } : m
      );
      setMaterials(nextMats);
      recordMaterialSnapshot(nextMats);
    }

    setSupplyPerson('');
    setSupplyQty(1);
    triggerToast(
      supplyStatus === 'delivered'
        ? `Logged delivery from ${rec.person}.`
        : `Logged pending supply order from ${rec.person}.`
    );
  };

  const markSupplyDelivered = (id) => {
    const target = supplyRecords.find((r) => r.id === id);
    if (!target || target.status === 'delivered') return;
    setSupplyRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'delivered' } : r))
    );
    const nextMats = materials.map((m) =>
      m.id === target.materialId
        ? { ...m, stock: (Number(m.stock) || 0) + (Number(target.qty) || 0) }
        : m
    );
    setMaterials(nextMats);
    recordMaterialSnapshot(nextMats);
    triggerToast(`Marked ${target.materialName} from ${target.person} as delivered & stocked.`);
  };

  const deleteSupplyRecord = (id) => {
    setSupplyRecords((prev) => prev.filter((r) => r.id !== id));
    triggerToast('Supply record removed.');
  };

  // --- MATERIAL & CATALOG STOCK HANDLERS ---
  const updateMaterialBuyPrice = (id, val) => {
    const price = Math.max(0, Number(val) || 0);
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, buyPrice: price } : m)));
  };

  const adjustMaterialStock = (id, delta) => {
    const nextMats = materials.map((m) =>
      m.id === id ? { ...m, stock: Math.max(0, (Number(m.stock) || 0) + delta) } : m
    );
    setMaterials(nextMats);
    recordMaterialSnapshot(nextMats);
  };

  const setMaterialStockDirect = (id, val) => {
    const stock = Math.max(0, Number(val) || 0);
    const nextMats = materials.map((m) => (m.id === id ? { ...m, stock } : m));
    setMaterials(nextMats);
    recordMaterialSnapshot(nextMats);
  };

  const handleAddMaterialCategory = (e) => {
    e.preventDefault();
    const clean = newMatCategoryName.trim();
    if (!clean) return;
    if (!allMaterialCategories.includes(clean)) {
      setCustomMaterialCategories((prev) => [...prev, clean]);
    }
    setNewMatCat(clean);
    setNewMatCategoryName('');
    triggerToast(`Added resource category "${clean}".`);
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    const clean = newMatName.trim();
    if (!clean) return;
    const newMat = {
      id: `mat_${Date.now()}`,
      name: clean,
      category: newMatCat,
      unit: 'units',
      buyPrice: Math.max(0, Number(newMatBuyPrice) || 0),
      stock: Math.max(0, Number(newMatStock) || 0),
      minStock: 0
    };
    const nextMats = [...materials, newMat];
    setMaterials(nextMats);
    recordMaterialSnapshot(nextMats);
    setNewMatName('');
    setNewMatBuyPrice(0);
    setNewMatStock(0);
    triggerToast(`Added "${clean}" to ${newMatCat}.`);
  };

  const handleDeleteMaterial = (id) => {
    const nextMats = materials.filter((m) => m.id !== id);
    setMaterials(nextMats);
    setCatalogItems((prev) =>
      prev.map((item) => ({
        ...item,
        recipe: (item.recipe || []).filter((r) => r.materialId !== id)
      }))
    );
    if (trendMaterialId === id) setTrendMaterialId('ALL');
    triggerToast('Material removed from vault.');
  };

  const handleRecalculateIngots = () => {
    setMaterials((prev) =>
      prev.map((mat) => {
        const smeltRecipeItem = findSmeltRecipeForMaterial(mat);
        if (!smeltRecipeItem) return mat;
        const smeltedUnitCost = smeltRecipeItem.recipe.reduce((sum, req) => {
          const ing = baseMaterialMap[req.materialId];
          return sum + (ing ? (Number(ing.buyPrice) || 0) * req.qty : 0);
        }, 0);
        return { ...mat, buyPrice: smeltedUnitCost };
      })
    );
    triggerToast('Smelted Ingot costs recalculated from Raw Ore & Fuel buy prices.');
  };

  const adjustCatalogStock = (id, delta) => {
    setCatalogItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stock: Math.max(0, (Number(c.stock) || 0) + delta) } : c))
    );
  };

  const setCatalogStockDirect = (id, val) => {
    const stock = Math.max(0, Number(val) || 0);
    setCatalogItems((prev) => prev.map((c) => (c.id === id ? { ...c, stock } : c)));
  };

  // --- SUB-TIERS & RECIPES HANDLERS ---
  const handleAddSubTier = (e) => {
    e.preventDefault();
    if (pricingCatFilter === 'All') return;
    const clean = newSubTierInput.trim();
    if (!clean) return;
    setSubCategoriesMap((prev) => {
      const existing = prev[pricingCatFilter] || [];
      if (existing.includes(clean)) return prev;
      return { ...prev, [pricingCatFilter]: [...existing, clean] };
    });
    setNewSubTierInput('');
    triggerToast(`Added tier "${clean}" under ${pricingCatFilter}.`);
  };

  const handleRemoveSubTier = (cat, tier) => {
    setSubCategoriesMap((prev) => ({
      ...prev,
      [cat]: (prev[cat] || []).filter((t) => t !== tier)
    }));
    setCatalogItems((prev) =>
      prev.map((item) =>
        item.category === cat && item.subCategory === tier ? { ...item, subCategory: '' } : item
      )
    );
    if (pricingSubTierFilter === tier) setPricingSubTierFilter('All');
    triggerToast(`Removed tier "${tier}".`);
  };

  const handleAddCatalogItem = (e) => {
    e.preventDefault();
    const clean = newItemName.trim();
    if (!clean) return;
    const created = {
      id: `item_${Date.now()}`,
      name: clean,
      category: newItemCat,
      subCategory: newItemSubCat,
      description: newItemDesc.trim() || 'Hand-forged at The Skyforge.',
      recipe: [],
      stock: 0,
      minStock: 0,
      useCustomPrice: false,
      customPrice: 0
    };
    setCatalogItems((prev) => [created, ...prev]);
    setNewItemName('');
    setNewItemDesc('');
    setEditingItem(created);
    triggerToast(`Created "${clean}". Add its recipe ingredients below.`);
  };

  const handleSaveEditedItem = (updated) => {
    setCatalogItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setEditingItem(null);
    triggerToast(`Updated "${updated.name}".`);
  };

  const handleDeleteCatalogItem = (id) => {
    setCatalogItems((prev) => prev.filter((i) => i.id !== id));
    triggerToast('Item removed from catalog.');
  };

  // --- ADMIN EXPORT, BACKUP & RESET ---
  const handleExportSpreadsheetCsv = () => {
    const dateStamp = getLocalDateString(0);
    const lines = [
      ['Item Name', 'Category', 'Tier', 'Material Cost (g)', 'We Buy (g)', 'We Sell (g)', 'Stock'].join(
        ','
      ),
      ...enrichedCatalog.map((item) =>
        [
          `"${item.name.replace(/"/g, '""')}"`,
          `"${item.category}"`,
          `"${item.subCategory || ''}"`,
          item.materialCost,
          item.suggestedBuyPrice,
          item.finalPrice,
          item.stock
        ].join(',')
      )
    ];
    triggerFileDownload(
      lines.join('\n'),
      `skyforge-ledger-${dateStamp}.csv`,
      'text/csv;charset=utf-8;'
    );
    triggerToast('Exported Forge Spreadsheet (.csv).');
  };

  const handleResetDefaults = () => {
    setMaterials(INITIAL_MATERIALS);
    setCatalogItems(INITIAL_CATALOG_ITEMS);
    setCustomCategories([]);
    setCustomMaterialCategories([]);
    setSubCategoriesMap(SUBCATEGORIES_BY_CATEGORY);
    setProfitMarginPct(0);
    setBuyOfferPct(70);
    setSales([]);
    setPurchases([]);
    setOrders([]);
    setSupplyRecords([]);
    setMemberProfiles([]);
    setMaterialHistory([]);
    localStorage.setItem('skyforge_mat_history_v13', JSON.stringify([]));
    localStorage.setItem('skyforge_purchases_v13', JSON.stringify([]));
    localStorage.setItem('skyforge_mat_categories_v13', JSON.stringify([]));
    localStorage.setItem('skyforge_buy_offer_v13', '70');
    setConfirmResetModal(false);
    setShowAdminSidebar(false);
    triggerToast('The Skyforge reset to a clean slate.');
  };

  const handleExportFullBackupJson = () => {
    const dateStamp = getLocalDateString(0);
    const snapshot = {
      app: 'The Skyforge',
      version: 'v13',
      exportedAt: new Date().toISOString(),
      data: {
        materials,
        catalogItems,
        profitMarginPct,
        buyOfferPct,
        sales,
        purchases,
        customCategories,
        customMaterialCategories,
        subCategoriesMap,
        orders,
        supplyRecords,
        memberProfiles,
        materialHistory
      }
    };
    triggerFileDownload(
      JSON.stringify(snapshot, null, 2),
      `the-skyforge-backup-${dateStamp}.json`,
      'application/json;charset=utf-8;'
    );
    triggerToast('Saved full Forge Backup (.json) to your device!');
  };

  const handleImportFullBackupJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(String(evt.target?.result || '{}'));
        const payload = parsed?.data || parsed;
        if (!payload || !Array.isArray(payload.materials) || !Array.isArray(payload.catalogItems)) {
          triggerToast('Invalid backup file. Please select a Skyforge .json backup.');
          return;
        }
        setMaterials(payload.materials);
        setCatalogItems(payload.catalogItems);
        if (typeof payload.profitMarginPct === 'number') setProfitMarginPct(payload.profitMarginPct);
        if (typeof payload.buyOfferPct === 'number') setBuyOfferPct(payload.buyOfferPct);
        if (Array.isArray(payload.sales)) setSales(payload.sales);
        if (Array.isArray(payload.purchases)) setPurchases(payload.purchases);
        if (Array.isArray(payload.customCategories)) setCustomCategories(payload.customCategories);
        if (Array.isArray(payload.customMaterialCategories)) {
          setCustomMaterialCategories(payload.customMaterialCategories);
        }
        if (payload.subCategoriesMap && typeof payload.subCategoriesMap === 'object') {
          setSubCategoriesMap(payload.subCategoriesMap);
        }
        if (Array.isArray(payload.orders)) setOrders(payload.orders);
        if (Array.isArray(payload.supplyRecords)) setSupplyRecords(payload.supplyRecords);
        if (Array.isArray(payload.memberProfiles)) setMemberProfiles(payload.memberProfiles);
        if (Array.isArray(payload.materialHistory)) setMaterialHistory(payload.materialHistory);
        triggerToast('Forge data restored from backup!');
      } catch {
        triggerToast('Could not read backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- KPI METRICS ---
  const todayStr = getLocalDateString(0);
  const kpis = useMemo(() => {
    const todaySales = sales.filter((s) => s.date === todayStr);
    const todayGross = todaySales.reduce((sum, s) => sum + s.totalRevenue, 0);
    const todayNet = todaySales.reduce((sum, s) => sum + s.netProfit, 0);
    const allTimeGross = sales.reduce((sum, s) => sum + s.totalRevenue, 0);
    const allTimeNet = sales.reduce((sum, s) => sum + s.netProfit, 0);
    const allTimePurchases = purchases.reduce((sum, p) => sum + p.totalSpent, 0);
    return { todayGross, todayNet, allTimeGross, allTimeNet, allTimePurchases };
  }, [sales, purchases, todayStr]);

  const isGuest = workerProfile?.roleType === 'guest';

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 font-sans selection:bg-red-900 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg bg-zinc-900 border border-amber-500/60 text-amber-200 text-xs font-semibold shadow-2xl">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#121215]/95 backdrop-blur border-b border-zinc-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-900 to-zinc-900 border border-amber-500/50 flex items-center justify-center shadow-inner">
              <Anvil className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-bold tracking-wide text-amber-200 leading-none">
                THE SKYFORGE
              </h1>
              <p className="text-[11px] text-zinc-400 mt-1">
                {!workerProfile
                  ? 'Public Price List & Forge Catalog'
                  : isGuest
                    ? `Guest Pass • ${workerProfile.name}`
                    : isAdminUnlocked
                      ? `Master Admin • ${workerProfile.name}`
                      : `Smith on duty • ${workerProfile.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {workerProfile ? (
              <>
                {!isGuest && isAdminUnlocked && (
                  <button
                    type="button"
                    onClick={() => setShowAdminSidebar(true)}
                    className="px-3 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/50 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Menu</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'public' ? 'worker' : 'public')}
                  className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold cursor-pointer"
                >
                  {viewMode === 'public' ? 'Forge Ledger' : 'Public Price List'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWorkerProfile(null);
                    setIsAdminUnlocked(false);
                    setShowAdminSidebar(false);
                    setViewMode('public');
                  }}
                  className="px-3 py-1.5 rounded-md bg-zinc-950 hover:bg-red-950/60 text-zinc-400 hover:text-red-300 border border-zinc-800 text-xs font-semibold cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="px-3.5 py-1.5 rounded-md bg-red-900/90 hover:bg-red-800 text-amber-200 border border-amber-500/50 text-xs font-semibold cursor-pointer"
              >
                Smith / Guest Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* PUBLIC PRICE LIST VIEW                                                */}
      {/* ===================================================================== */}
      {viewMode === 'public' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#18181b] border border-zinc-800/90 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPublicCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer border transition-colors ${
                    publicCategory === cat
                      ? 'bg-red-900/90 text-amber-200 border-amber-500/60'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search weapons, armor, ingots..."
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          <section>
            {filteredPublicItems.length === 0 ? (
              <div className="text-center py-12 text-sm text-zinc-500 bg-[#18181b] border border-zinc-800/80 rounded-lg">
                No items match your current filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPublicItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-[#18181b] border border-zinc-800/90 hover:border-amber-500/40 p-4 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          {item.category}
                          {item.subCategory ? ` • ${item.subCategory}` : ''}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            title="Max price we pay to buy this item from a customer and still profit on resale"
                            className="px-2.5 py-1 rounded bg-zinc-950 border border-emerald-700/60 text-right"
                          >
                            <div className="text-[9px] uppercase tracking-wider text-emerald-400/90 font-semibold leading-none">
                              We Buy
                            </div>
                            <div className="text-emerald-300 font-bold text-sm leading-tight mt-0.5">
                              {item.suggestedBuyPrice}g
                            </div>
                          </div>

                          <div
                            title="Public selling price"
                            className="px-2.5 py-1 rounded bg-zinc-900 border border-amber-500/55 text-right"
                          >
                            <div className="text-[9px] uppercase tracking-wider text-amber-400/90 font-semibold leading-none">
                              We Sell
                            </div>
                            <div className="text-amber-300 font-bold text-sm leading-tight mt-0.5">
                              {item.finalPrice}g
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-zinc-100 mt-2.5">
                        {item.name}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* ===================================================================== */}
      {/* FORGE LEDGER / WORKER & GUEST VIEW                                    */}
      {/* ===================================================================== */}
      {viewMode === 'worker' && workerProfile && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#18181b] border border-zinc-800/90 rounded-lg p-2">
            {[
              { id: 'dashboard', label: 'Sales & Profits', icon: TrendingUp },
              { id: 'orders', label: 'Orders & Deliveries', icon: ClipboardList },
              { id: 'stock', label: 'Forge Stock & Ore', icon: Package },
              ...(!isGuest ? [{ id: 'pricing', label: 'Recipes & Margin', icon: Sliders }] : []),
              {
                id: 'profiles',
                label: isGuest ? 'Forge Roster' : 'Smith Profiles',
                icon: Users
              }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveWorkerTab(tab.id)}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    activeWorkerTab === tab.id
                      ? 'bg-red-900/90 text-amber-200 border border-amber-500/50'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* TAB 1: SALES, PURCHASES & PROFITS                                 */}
          {/* ----------------------------------------------------------------- */}
          {activeWorkerTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[#18181b] border border-zinc-800/90">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400">
                    Today Gross Sales
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-300 mt-1">
                    {kpis.todayGross.toLocaleString()}g
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#18181b] border border-zinc-800/90">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400">
                    Today Net Profit
                  </div>
                  <div className="text-2xl font-serif font-bold text-emerald-400 mt-1">
                    {kpis.todayNet.toLocaleString()}g
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#18181b] border border-zinc-800/90">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400">
                    All-Time Net Profit
                  </div>
                  <div className="text-2xl font-serif font-bold text-emerald-300 mt-1">
                    {kpis.allTimeNet.toLocaleString()}g
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#18181b] border border-zinc-800/90">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400">
                    Total Supply Purchases
                  </div>
                  <div className="text-2xl font-serif font-bold text-zinc-200 mt-1">
                    {kpis.allTimePurchases.toLocaleString()}g
                  </div>
                </div>
              </div>

              {/* Record a Sale OR Record a Purchase (Smiths Only) */}
              {!isGuest && (
                <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                    <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setLedgerActionMode('sale')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          ledgerActionMode === 'sale'
                            ? 'bg-red-900/90 text-amber-200 border border-amber-500/50'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Record a Sale
                      </button>
                      <button
                        type="button"
                        onClick={() => setLedgerActionMode('purchase')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          ledgerActionMode === 'purchase'
                            ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/50'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Record a Purchase
                      </button>
                    </div>
                  </div>

                  {ledgerActionMode === 'sale' ? (
                    <form onSubmit={handleRecordSale} className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                      <select
                        required
                        value={saleItemId}
                        onChange={(e) => setSaleItemId(e.target.value)}
                        className="sm:col-span-2 px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                      >
                        <option value="">Select item sold...</option>
                        {enrichedCatalog.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.finalPrice}g • {item.stock} in stock)
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={saleQty}
                        onChange={(e) => setSaleQty(e.target.value)}
                        placeholder="Qty"
                        className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                      />

                      <input
                        type="number"
                        min="0"
                        value={salePriceOverride}
                        onChange={(e) => setSalePriceOverride(e.target.value)}
                        placeholder="Unit price (g) optional"
                        className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                      />

                      <input
                        type="text"
                        value={saleCustomer}
                        onChange={(e) => setSaleCustomer(e.target.value)}
                        placeholder="Customer name..."
                        className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                      />

                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-red-900 hover:bg-red-800 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer"
                      >
                        Log Sale
                      </button>

                      <label className="sm:col-span-6 flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deductStockOnSale}
                          onChange={(e) => setDeductStockOnSale(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <span>Deduct sold quantity from Finished Wares stock automatically</span>
                      </label>
                    </form>
                  ) : (
                    <form onSubmit={handleRecordPurchase} className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {[
                          { id: 'existing_mat', label: 'Existing Ore / Material' },
                          { id: 'existing_item', label: 'Existing Weapon / Armor' },
                          { id: 'new_item', label: 'Brand New Item' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPurchaseTargetType(opt.id)}
                            className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer ${
                              purchaseTargetType === opt.id
                                ? 'bg-zinc-800 text-emerald-300 border-emerald-500/50'
                                : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                        {purchaseTargetType === 'existing_mat' && (
                          <select
                            required
                            value={purchaseTargetId}
                            onChange={(e) => setPurchaseTargetId(e.target.value)}
                            className="sm:col-span-2 px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                          >
                            <option value="">Select ore, ingot, or fuel...</option>
                            {resolvedMaterials.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.category})
                              </option>
                            ))}
                          </select>
                        )}

                        {purchaseTargetType === 'existing_item' && (
                          <select
                            required
                            value={purchaseTargetId}
                            onChange={(e) => setPurchaseTargetId(e.target.value)}
                            className="sm:col-span-2 px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                          >
                            <option value="">Select finished item...</option>
                            {enrichedCatalog.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name} ({item.category})
                              </option>
                            ))}
                          </select>
                        )}

                        {purchaseTargetType === 'new_item' && (
                          <>
                            <input
                              type="text"
                              required
                              value={purchaseNewName}
                              onChange={(e) => setPurchaseNewName(e.target.value)}
                              placeholder="New item name..."
                              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                            />
                            <select
                              value={purchaseNewDestination}
                              onChange={(e) => setPurchaseNewDestination(e.target.value)}
                              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                            >
                              <option value="unsorted_ware">Add to Unsorted Catalog</option>
                              <option value="resource_vault">Add to Resource Vault</option>
                            </select>
                          </>
                        )}

                        <input
                          type="number"
                          min="1"
                          value={purchaseQty}
                          onChange={(e) => setPurchaseQty(e.target.value)}
                          placeholder="Qty"
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                        />

                        <input
                          type="number"
                          min="0"
                          value={purchaseUnitCost}
                          onChange={(e) => setPurchaseUnitCost(e.target.value)}
                          placeholder="Unit cost (g)"
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                        />

                        <input
                          type="text"
                          value={purchaseSupplier}
                          onChange={(e) => setPurchaseSupplier(e.target.value)}
                          placeholder="Seller / Supplier..."
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                        />

                        <button
                          type="submit"
                          className="px-4 py-2 rounded bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/50 text-xs font-bold cursor-pointer"
                        >
                          Log Purchase
                        </button>
                      </div>

                      {purchaseTargetType === 'existing_mat' && (
                        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={updateBuyPriceOnPurchase}
                            onChange={(e) => setUpdateBuyPriceOnPurchase(e.target.checked)}
                            className="accent-emerald-500"
                          />
                          <span>Update resource&apos;s unit Buy Price to this purchase price</span>
                        </label>
                      )}
                    </form>
                  )}
                </div>
              )}

              {/* Sales Ledger */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-3">
                <h3 className="text-base font-serif font-bold text-zinc-100">Sales Ledger</h3>
                {sales.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4">No sales logged yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-zinc-400 border-b border-zinc-800">
                        <tr>
                          <th className="py-2 pr-3">Date</th>
                          <th className="py-2 pr-3">Item</th>
                          <th className="py-2 pr-3">Qty</th>
                          <th className="py-2 pr-3">Revenue</th>
                          <th className="py-2 pr-3">Net Profit</th>
                          <th className="py-2 pr-3">Customer</th>
                          <th className="py-2 pr-3">Smith</th>
                          {!isGuest && <th className="py-2 text-right">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/70">
                        {sales.map((s) => (
                          <tr key={s.id}>
                            <td className="py-2.5 pr-3 text-zinc-400">{s.date}</td>
                            <td className="py-2.5 pr-3 font-semibold text-zinc-100">{s.itemName}</td>
                            <td className="py-2.5 pr-3">{s.qty}</td>
                            <td className="py-2.5 pr-3 text-amber-300 font-semibold">
                              {s.totalRevenue}g
                            </td>
                            <td className="py-2.5 pr-3 text-emerald-400 font-semibold">
                              +{s.netProfit}g
                            </td>
                            <td className="py-2.5 pr-3 text-zinc-300">{s.customer}</td>
                            <td className="py-2.5 pr-3 text-zinc-400">{s.smithName}</td>
                            {!isGuest && (
                              <td className="py-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSale(s.id)}
                                  className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Purchases Ledger */}
              {purchases.length > 0 && (
                <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-3">
                  <h3 className="text-base font-serif font-bold text-zinc-100">Purchase Ledger</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-zinc-400 border-b border-zinc-800">
                        <tr>
                          <th className="py-2 pr-3">Date</th>
                          <th className="py-2 pr-3">Item / Resource</th>
                          <th className="py-2 pr-3">Category</th>
                          <th className="py-2 pr-3">Qty</th>
                          <th className="py-2 pr-3">Total Paid</th>
                          <th className="py-2 pr-3">Supplier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/70">
                        {purchases.map((p) => (
                          <tr key={p.id}>
                            <td className="py-2.5 pr-3 text-zinc-400">{p.date}</td>
                            <td className="py-2.5 pr-3 font-semibold text-zinc-100">{p.itemName}</td>
                            <td className="py-2.5 pr-3 text-zinc-400">{p.category}</td>
                            <td className="py-2.5 pr-3">{p.qty}</td>
                            <td className="py-2.5 pr-3 text-amber-300 font-semibold">
                              {p.totalSpent}g
                            </td>
                            <td className="py-2.5 pr-3 text-zinc-300">{p.supplier}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 2: CUSTOMER ORDERS & MATERIAL DELIVERIES                      */}
          {/* ----------------------------------------------------------------- */}
          {activeWorkerTab === 'orders' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Orders */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <h3 className="text-base font-serif font-bold text-amber-200">
                  Customer Commissions &amp; Orders
                </h3>

                {!isGuest && (
                  <form onSubmit={handleAddOrder} className="space-y-2.5 bg-zinc-950/70 p-3.5 rounded-lg border border-zinc-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        required
                        value={orderCustomer}
                        onChange={(e) => setOrderCustomer(e.target.value)}
                        placeholder="Customer name..."
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                      />
                      <select
                        required
                        value={orderItemId}
                        onChange={(e) => setOrderItemId(e.target.value)}
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                      >
                        <option value="">Select item ordered...</option>
                        {enrichedCatalog.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.finalPrice}g)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <input
                        type="number"
                        min="1"
                        value={orderQty}
                        onChange={(e) => setOrderQty(e.target.value)}
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                      />
                      <input
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Notes (optional)..."
                        className="col-span-2 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded bg-red-900 hover:bg-red-800 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer"
                    >
                      + Log Customer Order
                    </button>
                  </form>
                )}

                {orders.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4">No customer orders logged.</p>
                ) : (
                  <div className="divide-y divide-zinc-800/80">
                    {orders.map((ord) => (
                      <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                ord.status === 'done'
                                  ? 'line-through text-zinc-500'
                                  : 'text-zinc-100'
                              }`}
                            >
                              {ord.qty}x {ord.itemName}
                            </span>
                            <span className="text-xs text-amber-300 font-semibold">
                              ({ord.quotedTotal}g)
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400">
                            For <strong className="text-zinc-200">{ord.customer}</strong> • {ord.date}
                            {ord.notes ? ` • ${ord.notes}` : ''}
                          </div>
                        </div>

                        {!isGuest && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleOrderComplete(ord.id)}
                              className={`px-2.5 py-1 rounded text-xs font-semibold border cursor-pointer ${
                                ord.status === 'done'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-amber-500/50'
                              }`}
                            >
                              {ord.status === 'done' ? 'Completed' : 'Mark Done'}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteOrder(ord.id)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Material Deliveries & Pending Supply Orders */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-serif font-bold text-amber-200">
                    Material Deliveries &amp; Pending Supply
                  </h3>
                  <div className="flex items-center gap-1 text-[11px]">
                    {['all', 'pending', 'delivered'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSupplyFilter(f)}
                        className={`px-2 py-1 rounded capitalize cursor-pointer border ${
                          supplyFilter === f
                            ? 'bg-zinc-800 text-amber-200 border-amber-500/40'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {!isGuest && (
                  <form
                    onSubmit={handleAddSupplyRecord}
                    className="space-y-2.5 bg-zinc-950/70 p-3.5 rounded-lg border border-zinc-800"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        required
                        value={supplyPerson}
                        onChange={(e) => setSupplyPerson(e.target.value)}
                        placeholder="Who delivered / supplier..."
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                      />
                      <select
                        required
                        value={supplyMaterialId}
                        onChange={(e) => setSupplyMaterialId(e.target.value)}
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                      >
                        <option value="">Select material...</option>
                        {resolvedMaterials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <input
                        type="number"
                        min="1"
                        value={supplyQty}
                        onChange={(e) => setSupplyQty(e.target.value)}
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                      />
                      <select
                        value={supplyStatus}
                        onChange={(e) => setSupplyStatus(e.target.value)}
                        className="col-span-2 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                      >
                        <option value="delivered">Delivered Now</option>
                        <option value="pending">Pending Delivery</option>
                      </select>
                    </div>
                    {supplyStatus === 'delivered' && (
                      <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={supplyAddToStock}
                          onChange={(e) => setSupplyAddToStock(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <span>Add delivered quantity directly to Vault stock</span>
                      </label>
                    )}
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded bg-zinc-800 hover:bg-red-900/80 text-amber-200 border border-zinc-700 hover:border-amber-500/50 text-xs font-bold cursor-pointer"
                    >
                      + Log Supply Entry
                    </button>
                  </form>
                )}

                {supplyRecords.filter((r) => supplyFilter === 'all' || r.status === supplyFilter)
                  .length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4">No supply deliveries recorded.</p>
                ) : (
                  <div className="divide-y divide-zinc-800/80">
                    {supplyRecords
                      .filter((r) => supplyFilter === 'all' || r.status === supplyFilter)
                      .map((rec) => (
                        <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-zinc-100">
                                {rec.qty}x {rec.materialName}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  rec.status === 'delivered'
                                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/50'
                                    : 'bg-amber-950/70 text-amber-300 border border-amber-700/50'
                                }`}
                              >
                                {rec.status}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-400">
                              From <strong className="text-zinc-200">{rec.person}</strong> • {rec.date}
                            </div>
                          </div>

                          {!isGuest && (
                            <div className="flex items-center gap-1.5">
                              {rec.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => markSupplyDelivered(rec.id)}
                                  className="px-2.5 py-1 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/50 text-xs font-semibold cursor-pointer"
                                >
                                  Mark Delivered
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteSupplyRecord(rec.id)}
                                className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 3: FORGE STOCK, ORE VAULT & STOCK TREND GRAPH                 */}
          {/* ----------------------------------------------------------------- */}
          {activeWorkerTab === 'stock' && (() => {
            const totalVaultValue = resolvedMaterials.reduce(
              (sum, m) => sum + (Number(m.buyPrice) || 0) * (Number(m.stock) || 0),
              0
            );

            // Trend points
            const trendPoints = materialHistory.map((h) => ({
              date: h.date,
              val:
                trendMaterialId === 'ALL'
                  ? h.totalUnits
                  : Number(h.byMaterial?.[trendMaterialId] ?? 0)
            }));
            const trendDelta =
              trendPoints.length >= 2
                ? trendPoints[trendPoints.length - 1].val - trendPoints[0].val
                : 0;

            const filteredMaterials = resolvedMaterials.filter((m) => {
              const matchesCat =
                stockCategoryFilter === 'All' || m.category === stockCategoryFilter;
              const matchesLow = !showLowStockOnly || m.stock <= m.minStock;
              const q = stockSearchQuery.trim().toLowerCase();
              const matchesSearch = !q || m.name.toLowerCase().includes(q);
              return matchesCat && matchesLow && matchesSearch;
            });

            const groupedMaterials = allMaterialCategories
              .map((cat) => ({
                category: cat,
                items: filteredMaterials.filter((m) => m.category === cat)
              }))
              .filter((g) => g.items.length > 0);

            return (
              <div className="space-y-5">
                {/* Top Sub-View Bar */}
                <div className="rounded-lg bg-[#18181b] border border-zinc-800/90 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800 self-start">
                    <button
                      type="button"
                      onClick={() => setStockSubView('materials')}
                      className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                        stockSubView === 'materials'
                          ? 'bg-zinc-800 text-amber-200 border border-amber-500/40'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Anvil className="w-4 h-4 text-amber-400" />
                      <span>Ores, Ingots &amp; Fuel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockSubView('finished')}
                      className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                        stockSubView === 'finished'
                          ? 'bg-zinc-800 text-amber-200 border border-amber-500/40'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Sword className="w-4 h-4 text-red-400" />
                      <span>Finished Wares</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400">
                      Vault Value:{' '}
                      <strong className="text-zinc-200">{totalVaultValue.toLocaleString()}g</strong>
                    </div>
                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showLowStockOnly}
                        onChange={(e) => setShowLowStockOnly(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>Low Stock Only</span>
                    </label>
                  </div>
                </div>

                {/* Resource Stock Trend Graph */}
                <div className="rounded-lg bg-[#18181b] border border-zinc-800/90 p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-serif font-bold text-zinc-100">
                        Resource Stock Trend Over Time
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Tracks daily stock levels so you can spot downward trajectories early.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {trendPoints.length >= 2 && (
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 border ${
                            trendDelta < 0
                              ? 'bg-red-950/60 text-red-300 border-red-700/60'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                          }`}
                        >
                          {trendDelta < 0 ? (
                            <>
                              <TrendingDown className="w-3.5 h-3.5" />
                              <span>Trending Down ({trendDelta}) — Restock Soon</span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>Trending Up (+{trendDelta})</span>
                            </>
                          )}
                        </span>
                      )}

                      <select
                        value={trendMaterialId}
                        onChange={(e) => setTrendMaterialId(e.target.value)}
                        className="px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs"
                      >
                        <option value="ALL">All Vault Resources (Total Units)</option>
                        {resolvedMaterials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {trendPoints.length < 2 ? (
                    <div className="py-6 text-center text-xs text-zinc-500 bg-zinc-950/60 rounded border border-zinc-800/80">
                      Adjust stock across 2 or more days to plot your resource trend line.
                    </div>
                  ) : (() => {
                    const maxVal = Math.max(1, ...trendPoints.map((p) => p.val));
                    const pts = trendPoints
                      .map((p, idx) => {
                        const x =
                          trendPoints.length === 1
                            ? 50
                            : 20 + (idx / (trendPoints.length - 1)) * 560;
                        const y = 95 - (p.val / maxVal) * 75;
                        return `${x},${y}`;
                      })
                      .join(' ');
                    return (
                      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-lg p-3">
                        <svg viewBox="0 0 600 115" className="w-full h-28 overflow-visible">
                          <polyline
                            fill="none"
                            stroke={trendDelta < 0 ? '#f87171' : '#fbbf24'}
                            strokeWidth="2.5"
                            points={pts}
                          />
                          {trendPoints.map((p, idx) => {
                            const x =
                              trendPoints.length === 1
                                ? 50
                                : 20 + (idx / (trendPoints.length - 1)) * 560;
                            const y = 95 - (p.val / maxVal) * 75;
                            return (
                              <g key={p.date}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="3.5"
                                  fill={trendDelta < 0 ? '#f87171' : '#fbbf24'}
                                />
                                <text
                                  x={x}
                                  y="110"
                                  textAnchor="middle"
                                  fill="#71717a"
                                  fontSize="9"
                                >
                                  {p.date.slice(5)}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    );
                  })()}
                </div>

                {/* SUB-VIEW A: ORES, INGOTS & FUEL */}
                {stockSubView === 'materials' && (
                  <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-5">
                    {/* Prominent Recalculate Ingots & Smelting Formulas Bar */}
                    {!isGuest && (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-zinc-950/90 border border-amber-500/30">
                        <div className="text-xs text-zinc-300">
                          <strong className="text-amber-200">Smelted Ingot Costs:</strong>{' '}
                          Automatically calculated from your Raw Ore &amp; Fuel{' '}
                          <span className="text-zinc-200 font-semibold">Buy Prices</span>.
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowSmeltQuickEditor(true)}
                            className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold cursor-pointer"
                          >
                            Smelting Formulas
                          </button>
                          <button
                            type="button"
                            onClick={handleRecalculateIngots}
                            className="px-3.5 py-1.5 rounded bg-red-900/90 hover:bg-red-800 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer"
                          >
                            Recalculate Ingots
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Filter Pills & Search */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {['All', ...allMaterialCategories].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setStockCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border ${
                              stockCategoryFilter === cat
                                ? 'bg-zinc-800 text-amber-200 border-amber-500/45 font-semibold'
                                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full lg:w-64">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={stockSearchQuery}
                          onChange={(e) => setStockSearchQuery(e.target.value)}
                          placeholder="Filter ores, ingots, fuel..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/60"
                        />
                      </div>
                    </div>

                    {/* Add New Resource Category & Add New Material (Smiths Only) */}
                    {!isGuest && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <form
                          onSubmit={handleAddMaterialCategory}
                          className="flex items-center gap-2 p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80"
                        >
                          <input
                            type="text"
                            value={newMatCategoryName}
                            onChange={(e) => setNewMatCategoryName(e.target.value)}
                            placeholder="New resource category..."
                            className="flex-1 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-200 border border-zinc-700 text-xs font-semibold cursor-pointer"
                          >
                            + Category
                          </button>
                        </form>

                        <form
                          onSubmit={handleAddMaterial}
                          className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-6 gap-2 p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80"
                        >
                          <input
                            type="text"
                            required
                            value={newMatName}
                            onChange={(e) => setNewMatName(e.target.value)}
                            placeholder="New material name..."
                            className="col-span-2 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                          />
                          <select
                            value={newMatCat}
                            onChange={(e) => setNewMatCat(e.target.value)}
                            className="px-2 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs"
                          >
                            {allMaterialCategories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            value={newMatBuyPrice}
                            onChange={(e) => setNewMatBuyPrice(e.target.value)}
                            placeholder="Buy (g)"
                            className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs"
                          />
                          <input
                            type="number"
                            min="0"
                            value={newMatStock}
                            onChange={(e) => setNewMatStock(e.target.value)}
                            placeholder="Qty"
                            className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-red-900/80 text-amber-200 border border-zinc-700 hover:border-amber-500/50 font-semibold text-xs cursor-pointer"
                          >
                            + Add Mat
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Grouped Material Rows */}
                    {groupedMaterials.length === 0 ? (
                      <div className="text-center py-8 text-xs text-zinc-500">
                        No materials match your filter.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {groupedMaterials.map((group) => (
                          <div key={group.category} className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                {group.category}
                              </h4>
                              <span className="text-[11px] text-zinc-500">
                                {group.items.length} types
                              </span>
                            </div>

                            <div className="rounded-lg border border-zinc-800/90 bg-zinc-950/60 divide-y divide-zinc-800/60">
                              {group.items.map((mat) => {
                                const isLow = mat.stock <= mat.minStock;
                                return (
                                  <div
                                    key={mat.id}
                                    className="px-3.5 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:bg-zinc-900/50 transition-colors"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                          isLow ? 'bg-amber-400' : 'bg-emerald-500/70'
                                        }`}
                                      />
                                      <span className="text-sm font-medium text-zinc-100 truncate">
                                        {mat.name}
                                      </span>
                                      {isLow && (
                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-semibold text-amber-300 shrink-0">
                                          Low (≤{mat.minStock})
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0 ml-auto">
                                      {/* Buy Price / Auto Smelt Cost */}
                                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                        <span>{mat.isAutoSmeltedCost ? 'Smelt Cost' : 'Buy Price'}</span>
                                        {mat.isAutoSmeltedCost ? (
                                          <div
                                            title="Auto-calculated from Raw Ore + Fuel Buy Prices"
                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-amber-500/40"
                                          >
                                            <span className="text-amber-300 font-bold text-xs">
                                              {mat.buyPrice}g
                                            </span>
                                            <span className="text-[10px] font-bold uppercase text-zinc-400">
                                              Auto
                                            </span>
                                          </div>
                                        ) : !isGuest ? (
                                          <div className="relative">
                                            <input
                                              type="number"
                                              min="0"
                                              value={mat.buyPrice}
                                              onChange={(e) =>
                                                updateMaterialBuyPrice(mat.id, e.target.value)
                                              }
                                              className="w-16 pl-2 pr-4 py-1 rounded bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 text-zinc-200 font-medium text-xs text-right focus:outline-none"
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

                                      {/* Stock Counter (- / input / + / +10 / Trash) */}
                                      <div className="flex items-center gap-1">
                                        {!isGuest ? (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => adjustMaterialStock(mat.id, -1)}
                                              className="w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 cursor-pointer"
                                            >
                                              <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <input
                                              type="number"
                                              min="0"
                                              value={mat.stock}
                                              onChange={(e) =>
                                                setMaterialStockDirect(mat.id, e.target.value)
                                              }
                                              className={`w-12 py-1 rounded bg-zinc-900 border border-zinc-800 text-center font-semibold text-xs focus:outline-none focus:border-amber-500/60 ${
                                                isLow ? 'text-amber-300' : 'text-zinc-100'
                                              }`}
                                            />
                                            <button
                                              type="button"
                                              onClick={() => adjustMaterialStock(mat.id, 1)}
                                              className="w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 cursor-pointer"
                                            >
                                              <Plus className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => adjustMaterialStock(mat.id, 10)}
                                              title="Add 10 stock"
                                              className="px-1.5 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-amber-300/90 hover:text-amber-200 border border-zinc-800 font-semibold text-[11px] cursor-pointer"
                                            >
                                              +10
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteMaterial(mat.id)}
                                              title="Remove material"
                                              className="ml-1 w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-red-950/70 text-zinc-500 hover:text-red-300 border border-zinc-800 cursor-pointer"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </>
                                        ) : (
                                          <span className="text-zinc-200 font-semibold text-xs">
                                            {mat.stock} {mat.unit}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-VIEW B: FINISHED WARES */}
                {stockSubView === 'finished' && (
                  <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                      <div>
                        <h3 className="text-base font-serif font-bold text-zinc-100">
                          Finished Wares Inventory
                        </h3>
                        <p className="text-xs text-zinc-400">
                          Ready-to-sell weapons, armor pieces, and smelted goods.
                        </p>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={finishedStockSearch}
                          onChange={(e) => setFinishedStockSearch(e.target.value)}
                          placeholder="Filter finished wares..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/60"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-800/90 bg-zinc-950/60 divide-y divide-zinc-800/60 max-h-[34rem] overflow-y-auto">
                      {enrichedCatalog
                        .filter((item) => {
                          const matchesLow = !showLowStockOnly || item.stock <= item.minStock;
                          const q = finishedStockSearch.trim().toLowerCase();
                          if (!q) return matchesLow;
                          return (
                            matchesLow &&
                            (item.name.toLowerCase().includes(q) ||
                              item.category.toLowerCase().includes(q) ||
                              (item.subCategory && item.subCategory.toLowerCase().includes(q)))
                          );
                        })
                        .map((item) => {
                          const isLow = item.stock <= item.minStock;
                          return (
                            <div
                              key={item.id}
                              className="px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-zinc-900/50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    isLow ? 'bg-amber-400' : 'bg-emerald-500/70'
                                  }`}
                                />
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-zinc-100 truncate">
                                    {item.name}
                                  </div>
                                  <div className="text-[11px] text-zinc-500">
                                    {item.category}
                                    {item.subCategory ? ` • ${item.subCategory}` : ''} • Sell:{' '}
                                    {item.finalPrice}g • We Buy: {item.suggestedBuyPrice}g
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {!isGuest ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => adjustCatalogStock(item.id, -1)}
                                      className="w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 cursor-pointer"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      value={item.stock}
                                      onChange={(e) =>
                                        setCatalogStockDirect(item.id, e.target.value)
                                      }
                                      className={`w-12 py-1 rounded bg-zinc-900 border border-zinc-800 text-center font-semibold text-xs focus:outline-none focus:border-amber-500/60 ${
                                        isLow ? 'text-amber-300' : 'text-zinc-100'
                                      }`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => adjustCatalogStock(item.id, 1)}
                                      className="w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => adjustCatalogStock(item.id, 10)}
                                      title="Add 10 stock"
                                      className="px-1.5 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-amber-300/90 hover:text-amber-200 border border-zinc-800 font-semibold text-[11px] cursor-pointer"
                                    >
                                      +10
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-zinc-200 font-semibold text-xs">
                                    {item.stock} in stock
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 4: RECIPES, PROFIT MARGIN, BUY-BACK RATE & SUB-TIERS          */}
          {/* ----------------------------------------------------------------- */}
          {activeWorkerTab === 'pricing' && !isGuest && (
            <div className="space-y-6">
              {/* Profit Margin & Customer Buy-Back Rate Controls */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-serif font-bold text-amber-200">
                        Global Forge Profit Margin
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Automatically marks up non-custom items above their raw material cost.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded bg-red-950/70 border border-amber-500/40 text-amber-200 font-bold text-sm">
                      +{profitMarginPct}% Markup
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={profitMarginPct}
                      onChange={(e) => setProfitMarginPct(Number(e.target.value))}
                      className="flex-1 min-w-[200px] accent-red-700 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5">
                      {[20, 40, 60, 100].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setProfitMarginPct(preset)}
                          className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer border ${
                            profitMarginPct === preset
                              ? 'bg-red-800 text-amber-200 border-amber-500/60'
                              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border-zinc-800'
                          }`}
                        >
                          +{preset}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-zinc-100">
                        Customer Buy-Back Rate (Tile &ldquo;We Buy&rdquo; Price)
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Sets the &ldquo;We Buy&rdquo; offer shown on the Price List tiles (% of material cost).
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 font-bold text-sm">
                      {buyOfferPct}% of Mat Cost
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={buyOfferPct}
                      onChange={(e) => setBuyOfferPct(Number(e.target.value))}
                      className="flex-1 min-w-[200px] accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5">
                      {[50, 65, 75, 85].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBuyOfferPct(preset)}
                          className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer border ${
                            buyOfferPct === preset
                              ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500/60'
                              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border-zinc-800'
                          }`}
                        >
                          {preset}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipes & Sub-Tier Organizer */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-serif font-bold text-zinc-100">
                    Recipes, Pricing &amp; Sub-Tiers
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowSmeltQuickEditor(true)}
                    className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-amber-200 border border-amber-500/40 text-xs font-semibold cursor-pointer"
                  >
                    Quick-Edit Smelting Formulas
                  </button>
                </div>

                {/* Category & Sub-Tier Filter + Add/Remove Tiers */}
                <div className="space-y-3 p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {allCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setPricingCatFilter(cat);
                            setPricingSubTierFilter('All');
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
                            pricingCatFilter === cat
                              ? 'bg-red-900/90 text-amber-200 border-amber-500/50'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={pricingSearch}
                      onChange={(e) => setPricingSearch(e.target.value)}
                      placeholder="Filter recipes..."
                      className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                    />
                  </div>

                  {pricingCatFilter !== 'All' && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPricingSubTierFilter('All')}
                          className={`px-2.5 py-1 rounded text-xs cursor-pointer border ${
                            pricingSubTierFilter === 'All'
                              ? 'bg-zinc-800 text-amber-200 border-amber-500/40'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          }`}
                        >
                          All Tiers
                        </button>
                        {(subCategoriesMap[pricingCatFilter] || []).map((tier) => (
                          <span
                            key={tier}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border ${
                              pricingSubTierFilter === tier
                                ? 'bg-zinc-800 text-amber-200 border-amber-500/40'
                                : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setPricingSubTierFilter(tier)}
                              className="cursor-pointer"
                            >
                              {tier}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubTier(pricingCatFilter, tier)}
                              title={`Remove ${tier} tier`}
                              className="text-zinc-500 hover:text-red-400 cursor-pointer ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <form onSubmit={handleAddSubTier} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newSubTierInput}
                          onChange={(e) => setNewSubTierInput(e.target.value)}
                          placeholder="New tier..."
                          className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                        />
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-200 border border-zinc-700 text-xs font-semibold cursor-pointer"
                        >
                          + Tier
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Add New Catalog Item */}
                <form
                  onSubmit={handleAddCatalogItem}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800"
                >
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="New weapon / armor name..."
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                  />
                  <select
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                  >
                    {[...DEFAULT_CATEGORIES, ...customCategories].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newItemSubCat}
                    onChange={(e) => setNewItemSubCat(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                  >
                    <option value="">No Tier</option>
                    {(subCategoriesMap[newItemCat] || []).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="Short description..."
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-red-900 hover:bg-red-800 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer"
                  >
                    + Add Item
                  </button>
                </form>

                {/* Catalog Items List */}
                <div className="divide-y divide-zinc-800/70">
                  {enrichedCatalog
                    .filter((item) => {
                      const matchesCat =
                        pricingCatFilter === 'All' || item.category === pricingCatFilter;
                      const matchesTier =
                        pricingSubTierFilter === 'All' ||
                        item.subCategory === pricingSubTierFilter;
                      const q = pricingSearch.trim().toLowerCase();
                      const matchesQ = !q || item.name.toLowerCase().includes(q);
                      return matchesCat && matchesTier && matchesQ;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-sm font-semibold text-zinc-100">
                            {item.name}{' '}
                            <span className="text-xs font-normal text-zinc-400">
                              ({item.category}
                              {item.subCategory ? ` • ${item.subCategory}` : ''})
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            Recipe:{' '}
                            {(item.recipe || []).length === 0
                              ? 'None assigned'
                              : item.recipe
                                  .map(
                                    (r) =>
                                      `${r.qty}x ${materialMap[r.materialId]?.name || r.materialId}`
                                  )
                                  .join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <div className="text-zinc-400">
                            Mat Cost: <strong className="text-zinc-200">{item.materialCost}g</strong>
                          </div>
                          <div className="text-emerald-400">
                            We Buy: <strong>{item.suggestedBuyPrice}g</strong>
                          </div>
                          <div className="text-amber-300">
                            We Sell: <strong>{item.finalPrice}g</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCatalogItem(item.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 5: SMITH PROFILES & MASTER ADMIN UNLOCK                       */}
          {/* ----------------------------------------------------------------- */}
          {activeWorkerTab === 'profiles' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Session Card */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <h3 className="text-base font-serif font-bold text-amber-200">
                  {isGuest
                    ? 'Guest Pass Permissions'
                    : isAdminUnlocked
                      ? 'Master Admin Session'
                      : 'Active Smith Profile'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Signed in as <strong className="text-zinc-100">{workerProfile.name}</strong> (
                  {isGuest
                    ? 'Guest Pass — Read-Only Ledger & Stock View'
                    : isAdminUnlocked
                      ? 'Master Admin — Full Access + Backup & Reset Sidebar'
                      : 'Smith on Duty — Full Forge & Sales Access'}
                  ).
                </p>

                {!isGuest && (
                  <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-200">
                        Master Admin Controls
                      </span>
                      {isAdminUnlocked ? (
                        <button
                          type="button"
                          onClick={() => setShowAdminSidebar(true)}
                          className="px-3 py-1.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer"
                        >
                          Open Admin Sidebar
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>

                    {!isAdminUnlocked && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (adminPassInput.trim() === ADMIN_PASSCODE) {
                            setIsAdminUnlocked(true);
                            setAdminPassError('');
                            setAdminPassInput('');
                            setShowAdminSidebar(true);
                            triggerToast('Master Admin unlocked.');
                          } else {
                            setAdminPassError('Incorrect Master Admin passcode.');
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="password"
                          value={adminPassInput}
                          onChange={(e) => setAdminPassInput(e.target.value)}
                          placeholder="Enter Master Admin passcode..."
                          className="flex-1 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded bg-red-900 hover:bg-red-800 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unlock</span>
                        </button>
                      </form>
                    )}
                    {adminPassError && <p className="text-xs text-red-400">{adminPassError}</p>}
                  </div>
                )}
              </div>

              {/* Forge Roster */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-3">
                <h3 className="text-base font-serif font-bold text-zinc-100">Forge Roster</h3>
                {memberProfiles.length === 0 ? (
                  <p className="text-xs text-zinc-500">No recorded sessions yet.</p>
                ) : (
                  <div className="divide-y divide-zinc-800/80">
                    {memberProfiles.map((prof) => (
                      <div key={prof.name} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-zinc-100">{prof.name}</div>
                          <div className="text-[11px] text-zinc-400">
                            {prof.roleType === 'guest' ? 'Visitor • Last visit' : 'Smith • Last shift'}:{' '}
                            {prof.lastActive}
                          </div>
                        </div>
                        {isAdminUnlocked && (
                          <button
                            type="button"
                            onClick={() =>
                              setMemberProfiles((prev) =>
                                prev.filter((p) => p.name !== prof.name)
                              )
                            }
                            className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* LOGIN MODAL                                                           */}
      {/* ===================================================================== */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-[#18181b] border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-amber-200">
                Enter The Skyforge
              </h2>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Passcode (Smith or Guest)
                </label>
                <input
                  type="password"
                  required
                  value={loginPasscode}
                  onChange={(e) => setLoginPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                />
              </div>

              {loginError && <p className="text-xs text-red-400">{loginError}</p>}

              <button
                type="submit"
                className="w-full py-2 rounded bg-red-900 hover:bg-red-800 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* RECIPE & ITEM EDITOR MODAL                                            */}
      {/* ===================================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#18181b] border border-zinc-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-amber-200">
                Edit Item &amp; Recipe
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Item Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value, subCategory: '' })
                    }
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
                  >
                    {[...DEFAULT_CATEGORIES, ...customCategories].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Sub-Tier</label>
                  <select
                    value={editingItem.subCategory || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, subCategory: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
                  >
                    <option value="">None</option>
                    {(subCategoriesMap[editingItem.category] || []).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <input
                  type="text"
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
                />
              </div>

              {/* Recipe Ingredients */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="font-semibold text-zinc-200">Recipe Materials</div>
                {(editingItem.recipe || []).map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={req.materialId}
                      onChange={(e) => {
                        const next = [...editingItem.recipe];
                        next[idx] = { ...next[idx], materialId: e.target.value };
                        setEditingItem({ ...editingItem, recipe: next });
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
                    >
                      {resolvedMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.buyPrice}g)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={req.qty}
                      onChange={(e) => {
                        const next = [...editingItem.recipe];
                        next[idx] = { ...next[idx], qty: Math.max(1, Number(e.target.value) || 1) };
                        setEditingItem({ ...editingItem, recipe: next });
                      }}
                      className="w-16 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = editingItem.recipe.filter((_, i) => i !== idx);
                        setEditingItem({ ...editingItem, recipe: next });
                      }}
                      className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {resolvedMaterials.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingItem({
                        ...editingItem,
                        recipe: [
                          ...(editingItem.recipe || []),
                          { materialId: resolvedMaterials[0].id, qty: 1 }
                        ]
                      })
                    }
                    className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-amber-200 border border-zinc-700 cursor-pointer"
                  >
                    + Add Ingredient
                  </button>
                )}
              </div>

              {/* Custom Price Override */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.useCustomPrice)}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, useCustomPrice: e.target.checked })
                    }
                    className="accent-amber-500"
                  />
                  <span>Override with Custom Sell Price</span>
                </label>
                {editingItem.useCustomPrice && (
                  <input
                    type="number"
                    min="0"
                    value={editingItem.customPrice || 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        customPrice: Math.max(0, Number(e.target.value) || 0)
                      })
                    }
                    className="w-24 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-amber-300 font-bold text-right"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3.5 py-1.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveEditedItem(editingItem)}
                className="px-4 py-1.5 rounded bg-red-900 hover:bg-red-800 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* QUICK-EDIT INGOT SMELTING FORMULAS MODAL                              */}
      {/* ===================================================================== */}
      {showSmeltQuickEditor && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-xl bg-[#18181b] border border-zinc-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-amber-200">
                Smelting Formulas Quick-Editor
              </h3>
              <button
                type="button"
                onClick={() => setShowSmeltQuickEditor(false)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-zinc-800">
              {catalogItems
                .filter((item) => item.category === 'Ingots & Materials')
                .map((ingot) => (
                  <div key={ingot.id} className="py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-100">{ingot.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (resolvedMaterials.length === 0) return;
                          setCatalogItems((prev) =>
                            prev.map((c) =>
                              c.id === ingot.id
                                ? {
                                    ...c,
                                    recipe: [
                                      ...(c.recipe || []),
                                      { materialId: resolvedMaterials[0].id, qty: 1 }
                                    ]
                                  }
                                : c
                            )
                          );
                        }}
                        className="px-2 py-1 rounded bg-zinc-900 text-amber-200 border border-zinc-700 text-xs cursor-pointer"
                      >
                        + Add Ore/Fuel
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(ingot.recipe || []).map((req, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs"
                        >
                          <input
                            type="number"
                            min="1"
                            value={req.qty}
                            onChange={(e) => {
                              const qty = Math.max(1, Number(e.target.value) || 1);
                              setCatalogItems((prev) =>
                                prev.map((c) => {
                                  if (c.id !== ingot.id) return c;
                                  const next = [...c.recipe];
                                  next[idx] = { ...next[idx], qty };
                                  return { ...c, recipe: next };
                                })
                              );
                            }}
                            className="w-10 bg-zinc-900 border border-zinc-700 rounded text-center text-zinc-100"
                          />
                          <select
                            value={req.materialId}
                            onChange={(e) => {
                              const materialId = e.target.value;
                              setCatalogItems((prev) =>
                                prev.map((c) => {
                                  if (c.id !== ingot.id) return c;
                                  const next = [...c.recipe];
                                  next[idx] = { ...next[idx], materialId };
                                  return { ...c, recipe: next };
                                })
                              );
                            }}
                            className="bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-100"
                          >
                            {resolvedMaterials.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              setCatalogItems((prev) =>
                                prev.map((c) =>
                                  c.id === ingot.id
                                    ? { ...c, recipe: c.recipe.filter((_, i) => i !== idx) }
                                    : c
                                )
                              )
                            }
                            className="text-zinc-500 hover:text-red-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSmeltQuickEditor(false)}
                className="px-4 py-1.5 rounded bg-red-900 text-amber-200 border border-amber-500/50 text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MASTER ADMIN SIDEBAR DRAWER (SPREADSHEET, BACKUP/RESTORE & RESET)     */}
      {/* ===================================================================== */}
      {showAdminSidebar && !isGuest && isAdminUnlocked && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-[#141417] border-l border-zinc-800 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-serif font-bold text-amber-200">
                    Master Admin Menu
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdminSidebar(false)}
                  className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Spreadsheet Export */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Spreadsheet Export
                </div>
                <button
                  type="button"
                  onClick={handleExportSpreadsheetCsv}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Export Price &amp; Stock Spreadsheet (.csv)</span>
                </button>
              </div>

              {/* Full Forge Backup & Restore */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-800/80">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Full Forge Backup &amp; Restore
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Download a complete <code>.json</code> snapshot of all prices, recipes, stock,
                  orders, deliveries, and profiles to restore anytime.
                </p>

                <button
                  type="button"
                  onClick={handleExportFullBackupJson}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/50 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Save Full Backup (.json)</span>
                </button>

                <label className="w-full py-2.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Restore from Backup (.json)</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFullBackupJson}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Reset Forge */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-800/80">
                <div className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Danger Zone
                </div>
                {!confirmResetModal ? (
                  <button
                    type="button"
                    onClick={() => setConfirmResetModal(true)}
                    className="w-full py-2.5 px-3.5 rounded-lg bg-red-950/60 hover:bg-red-900/70 text-red-300 border border-red-800/60 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Forge to Clean Slate</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-lg bg-red-950/70 border border-red-700 space-y-2.5">
                    <p className="text-xs text-red-200">
                      Clear all prices, stock, sales, orders, and profiles back to 0?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="flex-1 py-1.5 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-bold cursor-pointer"
                      >
                        Yes, Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmResetModal(false)}
                        className="flex-1 py-1.5 rounded bg-zinc-900 text-zinc-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAdminUnlocked(false);
                setShowAdminSidebar(false);
                triggerToast('Master Admin locked.');
              }}
              className="w-full py-2 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-semibold cursor-pointer"
            >
              Lock Admin Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
