import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Flame,
  Hammer,
  Shield,
  Sword,
  Coins,
  Package,
  TrendingUp,
  Plus,
  Minus,
  Trash2,
  Search,
  Lock,
  Unlock,
  LogOut,
  Users,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  Upload,
  RotateCcw,
  Edit3,
  X,
  Sliders,
  AlertTriangle,
  Sparkles,
  Tag,
  Layers,
  RefreshCw,
  PieChart
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot
} from 'firebase/firestore';

// --- OPTIONAL DEPLOYMENT CONFIG (FOR VERCEL / NETLIFY) ---
// Set window.__SKYFORGE_CLOUD_CONFIG__ in index.html or inject via build env vars so keys stay out of GitHub.
const ENV_CLOUD_CONFIG =
  typeof window !== 'undefined' && window.__SKYFORGE_CLOUD_CONFIG__
    ? window.__SKYFORGE_CLOUD_CONFIG__
    : typeof process !== 'undefined' && process.env
    ? {
        apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY || '',
        authDomain:
          process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
        projectId:
          process.env.VITE_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
        storageBucket:
          process.env.VITE_FIREBASE_STORAGE_BUCKET ||
          process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
          '',
        messagingSenderId:
          process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
          process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
          '',
        appId: process.env.VITE_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID || ''
      }
    : null;

const DEPLOYED_CLOUD_CONFIG = {
  apiKey: ENV_CLOUD_CONFIG?.apiKey || '',
  authDomain: ENV_CLOUD_CONFIG?.authDomain || '',
  projectId: ENV_CLOUD_CONFIG?.projectId || '',
  storageBucket: ENV_CLOUD_CONFIG?.storageBucket || '',
  messagingSenderId: ENV_CLOUD_CONFIG?.messagingSenderId || '',
  appId: ENV_CLOUD_CONFIG?.appId || ''
};

// --- INITIAL CLEAN-SLATE DATA ---
const DEFAULT_CATEGORIES = ['Weapons', 'Armor', 'Ingots & Materials', 'Unsorted'];

const DEFAULT_SUBCATEGORIES = {
  Weapons: ['Iron', 'Steel', 'Dwarven', 'Orichalcum', 'Elven', 'Glass', 'Ebony', 'Daedric', 'Dragonbone'],
  Armor: ['Iron', 'Steel', 'Dwarven', 'Orichalcum', 'Elven', 'Glass', 'Ebony', 'Daedric', 'Dragonscale'],
  'Ingots & Materials': ['Smelted Ingots', 'Leather & Pelts', 'Specialty'],
  Unsorted: ['General']
};

const INITIAL_MATERIAL_CATEGORIES = [
  'Smelted Ingots',
  'Raw Ore',
  'Fuel',
  'Leather & Pelts',
  'Dwemer Scrap & Gems'
];

const INITIAL_MATERIALS = [
  // Smelted Ingots (Auto-calculated from Ore + Fuel)
  { id: 'mat_iron_ingot', name: 'Iron Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_steel_ingot', name: 'Steel Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_corundum_ingot', name: 'Corundum Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_silver_ingot', name: 'Silver Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_quicksilver_ingot', name: 'Quicksilver Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_dwarven_ingot', name: 'Dwarven Metal Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_orichalcum_ingot', name: 'Orichalcum Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_malachite_ingot', name: 'Refined Malachite', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_stalhrim_ingot', name: 'Stalhrim Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_ebony_ingot', name: 'Ebony Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_gold_ingot', name: 'Gold Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_moonstone_ingot', name: 'Refined Moonstone', category: 'Smelted Ingots', buyPrice: 0, stock: 0, lowThreshold: 5 },

  // Raw Ore
  { id: 'mat_iron_ore', name: 'Iron Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_corundum_ore', name: 'Corundum Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_silver_ore', name: 'Silver Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_quicksilver_ore', name: 'Quicksilver Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_orichalcum_ore', name: 'Orichalcum Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_malachite_ore', name: 'Malachite Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_stalhrim_ore', name: 'Stalhrim (Glacial Crystal)', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_ebony_ore', name: 'Ebony Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_gold_ore', name: 'Gold Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_moonstone_ore', name: 'Moonstone Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, lowThreshold: 10 },

  // Fuel
  { id: 'mat_poor_charcoal', name: 'Poor Charcoal', category: 'Fuel', buyPrice: 0, stock: 0, lowThreshold: 15 },
  { id: 'mat_charcoal', name: 'Charcoal', category: 'Fuel', buyPrice: 0, stock: 0, lowThreshold: 15 },
  { id: 'mat_briquettes', name: 'Charcoal Briquettes', category: 'Fuel', buyPrice: 0, stock: 0, lowThreshold: 15 },
  { id: 'mat_coke', name: 'Coke', category: 'Fuel', buyPrice: 0, stock: 0, lowThreshold: 15 },

  // Leather & Pelts
  { id: 'mat_leather', name: 'Leather', category: 'Leather & Pelts', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_leather_strips', name: 'Leather Strips', category: 'Leather & Pelts', buyPrice: 0, stock: 0, lowThreshold: 20 },

  // Dwemer Scrap & Gems
  { id: 'mat_dwemer_plate', name: 'Small Dwemer Plate Metal', category: 'Dwemer Scrap & Gems', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_firewood', name: 'Firewood', category: 'Dwemer Scrap & Gems', buyPrice: 0, stock: 0, lowThreshold: 10 }
];

const INITIAL_CATALOG_ITEMS_RAW = [
  // Smelted Ingots (Catalog items for pricing & smelting recipes)
  {
    id: 'cat_iron_ingot',
    name: 'Iron Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Iron Ore and 1x Poor Charcoal.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_iron_ore', qty: 2 },
      { materialId: 'mat_poor_charcoal', qty: 1 }
    ]
  },
  {
    id: 'cat_steel_ingot',
    name: 'Steel Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Iron Ore, 1x Corundum Ore, and 1x Poor Charcoal.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_iron_ore', qty: 1 },
      { materialId: 'mat_corundum_ore', qty: 1 },
      { materialId: 'mat_poor_charcoal', qty: 1 }
    ]
  },
  {
    id: 'cat_corundum_ingot',
    name: 'Corundum Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Corundum Ore and 1x Poor Charcoal.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_corundum_ore', qty: 2 },
      { materialId: 'mat_poor_charcoal', qty: 1 }
    ]
  },
  {
    id: 'cat_silver_ingot',
    name: 'Silver Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Silver Ore and 1x Charcoal.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_silver_ore', qty: 2 },
      { materialId: 'mat_charcoal', qty: 1 }
    ]
  },
  {
    id: 'cat_quicksilver_ingot',
    name: 'Quicksilver Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Quicksilver Ore and 1x Charcoal Briquettes.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_quicksilver_ore', qty: 2 },
      { materialId: 'mat_briquettes', qty: 1 }
    ]
  },
  {
    id: 'cat_dwarven_ingot',
    name: 'Dwarven Metal Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Small Dwemer Plate Metal.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [{ materialId: 'mat_dwemer_plate', qty: 1 }]
  },
  {
    id: 'cat_orichalcum_ingot',
    name: 'Orichalcum Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Orichalcum Ore and 1x Charcoal Briquettes.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_orichalcum_ore', qty: 2 },
      { materialId: 'mat_briquettes', qty: 1 }
    ]
  },
  {
    id: 'cat_malachite_ingot',
    name: 'Refined Malachite (Glass Ingot)',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Malachite Ore and 1x Coke.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_malachite_ore', qty: 2 },
      { materialId: 'mat_coke', qty: 1 }
    ]
  },
  {
    id: 'cat_stalhrim_ingot',
    name: 'Stalhrim Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Stalhrim (Glacial Crystal) and 1x Coke.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_stalhrim_ore', qty: 2 },
      { materialId: 'mat_coke', qty: 1 }
    ]
  },
  {
    id: 'cat_ebony_ingot',
    name: 'Ebony Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Ebony Ore and 1x Coke.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_ebony_ore', qty: 2 },
      { materialId: 'mat_coke', qty: 1 }
    ]
  },
  {
    id: 'cat_gold_ingot',
    name: 'Gold Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Gold Ore and 1x Charcoal.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_gold_ore', qty: 2 },
      { materialId: 'mat_charcoal', qty: 1 }
    ]
  },
  {
    id: 'cat_moonstone_ingot',
    name: 'Refined Moonstone',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 2x Moonstone Ore and 1x Charcoal Briquettes.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_moonstone_ore', qty: 2 },
      { materialId: 'mat_briquettes', qty: 1 }
    ]
  },

  // Sample Starter Weapons & Armor (all 0 stock/price until materials are priced)
  {
    id: 'cat_iron_sword',
    name: 'Iron Sword',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Reliable Nord-forged blade balanced for Whiterun guards and travelers.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_iron_ingot', qty: 2 },
      { materialId: 'mat_leather_strips', qty: 1 }
    ]
  },
  {
    id: 'cat_iron_dagger',
    name: 'Iron Dagger',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Light utility blade forged from a single iron bar and leather grip.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_iron_ingot', qty: 1 },
      { materialId: 'mat_leather_strips', qty: 1 }
    ]
  },
  {
    id: 'cat_steel_greatsword',
    name: 'Steel Greatsword',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Two-handed broadsword tempered in the Skyforge flames.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_steel_ingot', qty: 4 },
      { materialId: 'mat_iron_ingot', qty: 1 },
      { materialId: 'mat_leather_strips', qty: 3 }
    ]
  },
  {
    id: 'cat_ebony_war_axe',
    name: 'Ebony War Axe',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Heavy volcanic-glass edge prized by veteran Jarl housecarls.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_ebony_ingot', qty: 3 },
      { materialId: 'mat_leather_strips', qty: 2 }
    ]
  },
  {
    id: 'cat_iron_cuirass',
    name: 'Iron Armor',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Riveted iron breastplate lined with cured hide.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_iron_ingot', qty: 4 },
      { materialId: 'mat_leather', qty: 1 },
      { materialId: 'mat_leather_strips', qty: 3 }
    ]
  },
  {
    id: 'cat_steel_plate_armor',
    name: 'Steel Plate Armor',
    category: 'Armor',
    subCategory: 'Steel',
    description: 'Layered steel and corundum alloy plate offering heavy protection.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_steel_ingot', qty: 4 },
      { materialId: 'mat_corundum_ingot', qty: 1 },
      { materialId: 'mat_leather_strips', qty: 3 }
    ]
  },
  {
    id: 'cat_ebony_shield',
    name: 'Ebony Shield',
    category: 'Armor',
    subCategory: 'Ebony',
    description: 'Masterwork tower shield hammered from pure Skyforge ebony.',
    stock: 0,
    customPrice: 0,
    useCustomPrice: false,
    recipe: [
      { materialId: 'mat_ebony_ingot', qty: 4 },
      { materialId: 'mat_leather_strips', qty: 1 }
    ]
  }
];

const SMELTED_MAT_TO_CATALOG_ID = {
  mat_iron_ingot: 'cat_iron_ingot',
  mat_steel_ingot: 'cat_steel_ingot',
  mat_corundum_ingot: 'cat_corundum_ingot',
  mat_silver_ingot: 'cat_silver_ingot',
  mat_quicksilver_ingot: 'cat_quicksilver_ingot',
  mat_dwarven_ingot: 'cat_dwarven_ingot',
  mat_orichalcum_ingot: 'cat_orichalcum_ingot',
  mat_malachite_ingot: 'cat_malachite_ingot',
  mat_stalhrim_ingot: 'cat_stalhrim_ingot',
  mat_ebony_ingot: 'cat_ebony_ingot',
  mat_gold_ingot: 'cat_gold_ingot',
  mat_moonstone_ingot: 'cat_moonstone_ingot'
};

const DEFAULT_SMELT_RECIPES_BY_ID = {
  mat_iron_ingot: [
    { materialId: 'mat_iron_ore', nameHint: 'iron ore', qty: 2 },
    { materialId: 'mat_poor_charcoal', nameHint: 'poor charcoal', qty: 1 }
  ],
  mat_steel_ingot: [
    { materialId: 'mat_iron_ore', nameHint: 'iron ore', qty: 1 },
    { materialId: 'mat_corundum_ore', nameHint: 'corundum ore', qty: 1 },
    { materialId: 'mat_poor_charcoal', nameHint: 'poor charcoal', qty: 1 }
  ],
  mat_corundum_ingot: [
    { materialId: 'mat_corundum_ore', nameHint: 'corundum ore', qty: 2 },
    { materialId: 'mat_poor_charcoal', nameHint: 'poor charcoal', qty: 1 }
  ],
  mat_silver_ingot: [
    { materialId: 'mat_silver_ore', nameHint: 'silver ore', qty: 2 },
    { materialId: 'mat_charcoal', nameHint: 'charcoal', qty: 1 }
  ],
  mat_quicksilver_ingot: [
    { materialId: 'mat_quicksilver_ore', nameHint: 'quicksilver ore', qty: 2 },
    { materialId: 'mat_briquettes', nameHint: 'charcoal briquettes', qty: 1 }
  ],
  mat_dwarven_ingot: [{ materialId: 'mat_dwemer_plate', nameHint: 'small dwemer plate', qty: 1 }],
  mat_orichalcum_ingot: [
    { materialId: 'mat_orichalcum_ore', nameHint: 'orichalcum ore', qty: 2 },
    { materialId: 'mat_briquettes', nameHint: 'charcoal briquettes', qty: 1 }
  ],
  mat_malachite_ingot: [
    { materialId: 'mat_malachite_ore', nameHint: 'malachite ore', qty: 2 },
    { materialId: 'mat_coke', nameHint: 'coke', qty: 1 }
  ],
  mat_stalhrim_ingot: [
    { materialId: 'mat_stalhrim_ore', nameHint: 'stalhrim', qty: 2 },
    { materialId: 'mat_coke', nameHint: 'coke', qty: 1 }
  ],
  mat_ebony_ingot: [
    { materialId: 'mat_ebony_ore', nameHint: 'ebony ore', qty: 2 },
    { materialId: 'mat_coke', nameHint: 'coke', qty: 1 }
  ],
  mat_gold_ingot: [
    { materialId: 'mat_gold_ore', nameHint: 'gold ore', qty: 2 },
    { materialId: 'mat_charcoal', nameHint: 'charcoal', qty: 1 }
  ],
  mat_moonstone_ingot: [
    { materialId: 'mat_moonstone_ore', nameHint: 'moonstone ore', qty: 2 },
    { materialId: 'mat_briquettes', nameHint: 'charcoal briquettes', qty: 1 }
  ]
};

const ROLE_PRESETS = {
  guest: {
    label: 'Guest',
    title: 'Ledger Observer (View Only)',
    permissions: {
      viewDashboard: true,
      logSalesPurchases: false,
      manageOrders: false,
      editStock: false,
      editRecipes: false,
      isAdmin: false
    }
  },
  smith: {
    label: 'Smith',
    title: 'Skyforge Smith',
    permissions: {
      viewDashboard: true,
      logSalesPurchases: true,
      manageOrders: true,
      editStock: true,
      editRecipes: true,
      isAdmin: false
    }
  },
  harbinger: {
    label: 'Harbinger',
    title: 'Harbinger of the Companions',
    permissions: {
      viewDashboard: true,
      logSalesPurchases: true,
      manageOrders: true,
      editStock: true,
      editRecipes: true,
      isAdmin: false
    }
  },
  admin: {
    label: 'Admin',
    title: 'Master Forgemaster',
    permissions: {
      viewDashboard: true,
      logSalesPurchases: true,
      manageOrders: true,
      editStock: true,
      editRecipes: true,
      isAdmin: true
    }
  }
};

const PERMISSION_LABELS = [
  { key: 'viewDashboard', label: 'View Sales & Charts' },
  { key: 'logSalesPurchases', label: 'Log Sales & Purchases' },
  { key: 'manageOrders', label: 'Manage Orders & Deliveries' },
  { key: 'editStock', label: 'Edit Vault Stock & Prices' },
  { key: 'editRecipes', label: 'Edit Recipes & Margin' },
  { key: 'isAdmin', label: 'Master Admin Access' }
];

// --- HELPER: LOCAL DATE YYYY-MM-DD ---
function getLocalDateString(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// --- WUUTHRAD BANNER CREST SVG ---
function WuuthradBannerIcon({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 6H52V44L32 58L12 44V6Z"
        fill="#7f1d1d"
        stroke="#d97706"
        strokeWidth="3"
      />
      <path d="M16 10H48V41.5L32 52.8L16 41.5V10Z" stroke="#fbbf24" strokeWidth="1.2" strokeOpacity="0.65" />
      <path d="M32 14V45" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M32 19C25 16 20 18 19 24C20 30 25 32 32 29C39 32 44 30 45 24C44 18 39 16 32 19Z"
        fill="#fbbf24"
        fillOpacity="0.9"
      />
    </svg>
  );
}

export default function App() {
  // --- SET FAVICON & DOCUMENT TITLE ---
  useEffect(() => {
    document.title = 'The Skyforge';
    const svgIcon = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M12 6H52V44L32 58L12 44V6Z" fill="#7f1d1d" stroke="#d97706" stroke-width="3"/>
        <path d="M32 14V45" stroke="#fcd34d" stroke-width="3" stroke-linecap="round"/>
        <path d="M32 19C25 16 20 18 19 24C20 30 25 32 32 29C39 32 44 30 45 24C44 18 39 16 32 19Z" fill="#fbbf24"/>
      </svg>`
    );
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = `data:image/svg+xml,${svgIcon}`;
  }, []);

  // --- PERSISTED FORGE DATA (CLEAN SLATE v13) ---
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);

  const [materialCategories, setMaterialCategories] = useState(INITIAL_MATERIAL_CATEGORIES);

  const [catalogItems, setCatalogItems] = useState(INITIAL_CATALOG_ITEMS_RAW);

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const [subCategories, setSubCategories] = useState(DEFAULT_SUBCATEGORIES);

  const [profitMarginPct, setProfitMarginPct] = useState(0);

  const [buyBackRatePct, setBuyBackRatePct] = useState(70);

  const [sales, setSales] = useState([]);

  const [purchases, setPurchases] = useState([]);

  const [orders, setOrders] = useState([]);

  const [supplyRecords, setSupplyRecords] = useState([]);

  const [smithProfiles, setSmithProfiles] = useState([]);

  const [managedUsers, setManagedUsers] = useState([]);

  const [materialTrendHistory, setMaterialTrendHistory] = useState([]);

  // --- AUTH & NAVIGATION STATE ---
  const [viewMode, setViewMode] = useState('public'); // 'public' | 'login' | 'worker'
  const [loginMode, setLoginMode] = useState('account'); // 'account' | 'passcode'
  const [loginUsernameInput, setLoginUsernameInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [workerProfile, setWorkerProfile] = useState(null);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [activeWorkerTab, setActiveWorkerTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'stock' | 'pricing' | 'profiles'

  // --- REAL-TIME CLOUD SYNC STATE ---
  const [cloudUser, setCloudUser] = useState(null);
  const [cloudStatus, setCloudStatus] = useState('connecting'); // 'connecting' | 'synced' | 'offline'
  const [cloudErrorMsg, setCloudErrorMsg] = useState('');
  const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const [presenceList, setPresenceList] = useState([]);
  const [profileOnlineStatus, setProfileOnlineStatus] = useState(true);
  const dbRef = useRef(null);
  const sharedDocRef = useRef(null);
  const presenceColRef = useRef(null);
  const isApplyingRemoteRef = useRef(false);
  const hasHydratedFromCloudRef = useRef(false);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    let unsubscribeSnapshot = null;
    let unsubscribePresence = null;
    let unsubscribeAuth = null;

    async function initCloudSync() {
      try {
        const rawEnvConfig =
          typeof __firebase_config !== 'undefined' && __firebase_config
            ? JSON.parse(__firebase_config)
            : null;
        const activeConfig =
          rawEnvConfig && rawEnvConfig.apiKey
            ? rawEnvConfig
            : DEPLOYED_CLOUD_CONFIG.apiKey
            ? DEPLOYED_CLOUD_CONFIG
            : null;

        if (!activeConfig) {
          setCloudStatus('offline');
          setCloudErrorMsg('Cloud keys not configured yet — running in single-session mode.');
          return;
        }

        const app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        dbRef.current = db;

        const resolvedAppId =
          typeof __app_id !== 'undefined' && __app_id ? __app_id : 'skyforge-whiterun';
        const stateDoc = doc(db, 'artifacts', resolvedAppId, 'public', 'data', 'forge_state', 'main');
        const presenceCol = collection(db, 'artifacts', resolvedAppId, 'public', 'data', 'presence');
        sharedDocRef.current = stateDoc;
        presenceColRef.current = presenceCol;

        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }

        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          setCloudUser(user || null);
          if (!user) return;

          unsubscribePresence = onSnapshot(
            presenceCol,
            (snap) => {
              const now = Date.now();
              const active = [];
              snap.forEach((docSnap) => {
                const d = docSnap.data() || {};
                if (d.lastSeen && now - d.lastSeen < 45000) {
                  active.push({ id: docSnap.id, ...d });
                }
              });
              setPresenceList(active);
            },
            () => {}
          );

          unsubscribeSnapshot = onSnapshot(
            stateDoc,
            (snap) => {
              if (snap.exists()) {
                const data = snap.data() || {};
                isApplyingRemoteRef.current = true;
                if (Array.isArray(data.materials)) setMaterials(data.materials);
                if (Array.isArray(data.materialCategories)) {
                  setMaterialCategories(data.materialCategories);
                }
                if (Array.isArray(data.catalogItems)) setCatalogItems(data.catalogItems);
                if (Array.isArray(data.categories)) setCategories(data.categories);
                if (data.subCategories && typeof data.subCategories === 'object') {
                  setSubCategories(data.subCategories);
                }
                if (typeof data.profitMarginPct === 'number') {
                  setProfitMarginPct(data.profitMarginPct);
                }
                if (typeof data.buyBackRatePct === 'number') {
                  setBuyBackRatePct(data.buyBackRatePct);
                }
                if (Array.isArray(data.sales)) setSales(data.sales);
                if (Array.isArray(data.purchases)) setPurchases(data.purchases);
                if (Array.isArray(data.orders)) setOrders(data.orders);
                if (Array.isArray(data.supplyRecords)) setSupplyRecords(data.supplyRecords);
                if (Array.isArray(data.smithProfiles)) setSmithProfiles(data.smithProfiles);
                if (Array.isArray(data.managedUsers)) setManagedUsers(data.managedUsers);
                if (Array.isArray(data.materialTrendHistory)) {
                  setMaterialTrendHistory(data.materialTrendHistory);
                }
                setTimeout(() => {
                  isApplyingRemoteRef.current = false;
                }, 80);
              }
              hasHydratedFromCloudRef.current = true;
              setCloudStatus('synced');
              setCloudErrorMsg('');
            },
            (err) => {
              setCloudStatus('offline');
              setCloudErrorMsg(err?.message || 'Unable to reach live cloud ledger.');
            }
          );
        });
      } catch (err) {
        setCloudStatus('offline');
        setCloudErrorMsg(err?.message || 'Cloud sync initialization failed.');
      }
    }

    initCloudSync();

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      if (unsubscribePresence) unsubscribePresence();
      if (unsubscribeAuth) unsubscribeAuth();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // --- REAL-TIME PRESENCE HEARTBEAT (VIEWERS & ACTIVE PROFILES) ---
  useEffect(() => {
    if (!cloudUser || !presenceColRef.current) return;
    const myPresenceDoc = doc(presenceColRef.current, sessionId);

    const writeHeartbeat = () => {
      const hasSignedInProfile = Boolean(workerProfile);
      const isProfileVisibleOnline = hasSignedInProfile && profileOnlineStatus;
      setDoc(
        myPresenceDoc,
        {
          lastSeen: Date.now(),
          isViewing: true,
          hasProfile: hasSignedInProfile,
          isProfileOnline: isProfileVisibleOnline,
          userId: workerProfile?.userId || workerProfile?.id || null,
          profileName: workerProfile?.name || 'Visitor',
          role: workerProfile?.roleType || 'visitor'
        },
        { merge: true }
      ).catch(() => {});
    };

    writeHeartbeat();
    const interval = setInterval(writeHeartbeat, 15000);

    const handleBeforeUnload = () => {
      deleteDoc(myPresenceDoc).catch(() => {});
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cloudUser, sessionId, workerProfile, profileOnlineStatus]);

  const presenceStats = useMemo(() => {
    const activeSessions =
      presenceList.length > 0
        ? presenceList
        : [
            {
              id: sessionId,
              isViewing: true,
              isProfileOnline: Boolean(workerProfile) && profileOnlineStatus,
              userId: workerProfile?.userId || workerProfile?.id || null,
              profileName: workerProfile?.name || 'Visitor'
            }
          ];

    const viewersCount = activeSessions.length;
    const onlineProfileSessions = activeSessions.filter((s) => s.isProfileOnline);
    const uniqueProfileKeys = new Set(
      onlineProfileSessions.map((s) => s.userId || s.profileName || s.id)
    );
    return {
      viewersCount,
      activeProfilesCount: uniqueProfileKeys.size,
      onlineProfileSessions
    };
  }, [presenceList, sessionId, workerProfile, profileOnlineStatus]);

  // Push live changes to Firestore whenever local state is modified
  useEffect(() => {
    if (!cloudUser || !sharedDocRef.current || !hasHydratedFromCloudRef.current) return;
    if (isApplyingRemoteRef.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await setDoc(
          sharedDocRef.current,
          {
            materials,
            materialCategories,
            catalogItems,
            categories,
            subCategories,
            profitMarginPct,
            buyBackRatePct,
            sales,
            purchases,
            orders,
            supplyRecords,
            smithProfiles,
            managedUsers,
            materialTrendHistory,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
        setCloudStatus('synced');
      } catch (err) {
        setCloudStatus('offline');
        setCloudErrorMsg(err?.message || 'Failed to sync changes to cloud.');
      }
    }, 250);
  }, [
    cloudUser,
    materials,
    materialCategories,
    catalogItems,
    categories,
    subCategories,
    profitMarginPct,
    buyBackRatePct,
    sales,
    purchases,
    orders,
    supplyRecords,
    smithProfiles,
    managedUsers,
    materialTrendHistory
  ]);

  // Admin Sidebar & Modals
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSmeltModal, setShowSmeltModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSale, setEditingSale] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const backupFileInputRef = useRef(null);

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // --- PUBLIC CATALOG FILTER STATE ---
  const [publicCategory, setPublicCategory] = useState('All');
  const [publicSubCategory, setPublicSubCategory] = useState('All');
  const [publicSearch, setPublicSearch] = useState('');

  // --- DASHBOARD (SALE & PURCHASE) STATE ---
  const [pieMetricMode, setPieMetricMode] = useState('revenue'); // 'revenue' | 'profit'
  const [ledgerHistorySearch, setLedgerHistorySearch] = useState('');
  const [showRecordSaleModal, setShowRecordSaleModal] = useState(false);
  const [showRecordPurchaseModal, setShowRecordPurchaseModal] = useState(false);

  const [saleMode, setSaleMode] = useState('existing'); // 'existing' | 'custom'
  const [saleItemSearch, setSaleItemSearch] = useState('');
  const [saleItemId, setSaleItemId] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [saleCustomer, setSaleCustomer] = useState('');
  const [deductStockOnSale, setDeductStockOnSale] = useState(true);
  const [saleCartItems, setSaleCartItems] = useState([]);

  // Custom / Unlisted Sale Item + Recipe Builder State
  const [customSaleName, setCustomSaleName] = useState('');
  const [customSaleCat, setCustomSaleCat] = useState('Weapons');
  const [customSaleSubCat, setCustomSaleSubCat] = useState('Iron');
  const [customSaleMatSearch, setCustomSaleMatSearch] = useState('');
  const [customSaleMatId, setCustomSaleMatId] = useState('mat_iron_ingot');
  const [customSaleMatQty, setCustomSaleMatQty] = useState(1);
  const [customSaleRecipe, setCustomSaleRecipe] = useState([]);
  const [customSalePriceOverride, setCustomSalePriceOverride] = useState('');
  const [saveCustomSaleToRecipes, setSaveCustomSaleToRecipes] = useState(true);

  const [purchaseTargetType, setPurchaseTargetType] = useState('existing'); // 'existing' | 'new'
  const [purchaseExistingSearch, setPurchaseExistingSearch] = useState('');
  const [purchaseExistingKey, setPurchaseExistingKey] = useState('');
  const [purchaseNewName, setPurchaseNewName] = useState('');
  const [purchaseNewDest, setPurchaseNewDest] = useState('catalog'); // 'catalog' | 'material'
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchaseUnitCost, setPurchaseUnitCost] = useState(0);
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  const [updateUnitCostOnPurchase, setUpdateUnitCostOnPurchase] = useState(true);
  const [purchaseCartItems, setPurchaseCartItems] = useState([]);
  const [ordersLedgerSearch, setOrdersLedgerSearch] = useState('');
  const [orderItemSearch, setOrderItemSearch] = useState('');
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderItemId, setOrderItemId] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');

  const [supplyLedgerSearch, setSupplyLedgerSearch] = useState('');
  const [supplyMatSearch, setSupplyMatSearch] = useState('');
  const [supplySupplierName, setSupplySupplierName] = useState('');
  const [supplyMaterialId, setSupplyMaterialId] = useState('');
  const [supplyQty, setSupplyQty] = useState(1);
  const [supplyTotalCost, setSupplyTotalCost] = useState(0);
  const [supplyStatus, setSupplyStatus] = useState('pending'); // 'pending' | 'delivered'
  const [supplyFilter, setSupplyFilter] = useState('all'); // 'all' | 'pending' | 'delivered'

  // --- FORGE STOCK & ORE STATE ---
  const [stockSubTab, setStockSubTab] = useState('materials'); // 'materials' | 'finished'
  const [materialSearch, setMaterialSearch] = useState('');
  const [finishedStockSearch, setFinishedStockSearch] = useState('');
  const [trendMatSearch, setTrendMatSearch] = useState('');
  const [selectedTrendMatId, setSelectedTrendMatId] = useState('ALL');
  const [smeltModalSearch, setSmeltModalSearch] = useState('');
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState('Raw Ore');
  const [newMatPrice, setNewMatPrice] = useState(0);
  const [newMatStock, setNewMatStock] = useState(0);
  const [newResourceCatInput, setNewResourceCatInput] = useState('');

  // --- RECIPES & MARGIN STATE ---
  const [recipeBoardSearch, setRecipeBoardSearch] = useState('');
  const [recipeBoardCatFilter, setRecipeBoardCatFilter] = useState('All');
  const [recipeBoardSubFilter, setRecipeBoardSubFilter] = useState('All');
  const [inlineNewSubCat, setInlineNewSubCat] = useState('');

  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Weapons');
  const [newItemSubCat, setNewItemSubCat] = useState('Iron');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemMatSearch, setNewItemMatSearch] = useState('');
  const [newItemMatId, setNewItemMatId] = useState('mat_iron_ingot');
  const [newItemMatQty, setNewItemMatQty] = useState(1);
  const [newItemRecipe, setNewItemRecipe] = useState([]);

  // --- PROFILES & USER ACCOUNTS STATE ---
  const [smithRosterSearch, setSmithRosterSearch] = useState('');
  const [managedUsersSearch, setManagedUsersSearch] = useState('');
  const [newSmithName, setNewSmithName] = useState('');
  const [newSmithTitle, setNewSmithTitle] = useState('Apprentice Smith');
  const [newSmithRole, setNewSmithRole] = useState('smith');

  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('smith');

  // --- AUTOMATIC SMELTING COST RESOLUTION ---
  const baseMaterialMap = useMemo(() => {
    const map = {};
    materials.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [materials]);

  const findSmeltRecipeForMaterial = (mat, catalogList, matList = materials) => {
    const mappedCatId = SMELTED_MAT_TO_CATALOG_ID[mat.id];
    if (mappedCatId) {
      const found = catalogList.find((c) => c.id === mappedCatId);
      if (found && Array.isArray(found.recipe) && found.recipe.length > 0) return found.recipe;
    }
    if (mat.category === 'Smelted Ingots' || mat.id.endsWith('_ingot')) {
      const normalizedMatName = mat.name.toLowerCase().trim();
      const byName = catalogList.find((c) => {
        const cName = c.name.toLowerCase().trim();
        return (
          cName === normalizedMatName ||
          cName.startsWith(normalizedMatName) ||
          normalizedMatName.startsWith(cName)
        );
      });
      if (byName && Array.isArray(byName.recipe) && byName.recipe.length > 0) return byName.recipe;
    }
    if (DEFAULT_SMELT_RECIPES_BY_ID[mat.id]) {
      return DEFAULT_SMELT_RECIPES_BY_ID[mat.id].map((req) => {
        const matchedIng =
          matList.find((m) => m.id === req.materialId) ||
          matList.find((m) => m.name.toLowerCase().includes(req.nameHint));
        return { materialId: matchedIng ? matchedIng.id : req.materialId, qty: req.qty };
      });
    }
    return null;
  };

  const resolvedMaterials = useMemo(() => {
    return materials.map((mat) => {
      const smeltRecipe = findSmeltRecipeForMaterial(mat, catalogItems, materials);
      if (!smeltRecipe) {
        return { ...mat, isAutoSmeltedCost: false };
      }
      const smeltedUnitCost = smeltRecipe.reduce((sum, req) => {
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

  const handleManualRecalculateIngots = () => {
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
  };

  // --- ENRICHED CATALOG ITEMS (WITH COST, SELL PRICE & WE-BUY PRICE) ---
  const enrichedCatalog = useMemo(() => {
    return catalogItems.map((item) => {
      const materialCost = (item.recipe || []).reduce((sum, req) => {
        const mat = materialMap[req.materialId];
        return sum + (mat ? (Number(mat.buyPrice) || 0) * req.qty : 0);
      }, 0);

      const calculatedPrice = Math.round(materialCost * (1 + (Number(profitMarginPct) || 0) / 100));
      const sellPrice = item.useCustomPrice ? Number(item.customPrice) || 0 : calculatedPrice;
      const rawBuyBack = Math.round(materialCost * ((Number(buyBackRatePct) || 0) / 100));
      const buyFromCustomerPrice =
        sellPrice > 0 ? Math.min(rawBuyBack, Math.max(0, sellPrice - 1)) : rawBuyBack;
      const profitPerUnit = sellPrice - materialCost;

      return {
        ...item,
        materialCost,
        calculatedPrice,
        sellPrice,
        buyFromCustomerPrice,
        profitPerUnit
      };
    });
  }, [catalogItems, materialMap, profitMarginPct, buyBackRatePct]);

  const handleQuickChangeItemSubCategory = (itemId, nextSubCat) => {
    if (!canEditRecipes) return;
    setCatalogItems((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, subCategory: nextSubCat } : c))
    );
    showToast(`Updated type to ${nextSubCat || 'None'}.`);
  };

  // --- RECORD SNAPSHOT FOR TREND GRAPH ---
  const recordStockSnapshot = (nextMaterialsList) => {
    const today = getLocalDateString(0);
    const byMaterial = {};
    let totalUnits = 0;
    nextMaterialsList.forEach((m) => {
      const st = Number(m.stock) || 0;
      byMaterial[m.id] = st;
      totalUnits += st;
    });

    setMaterialTrendHistory((prev) => {
      const filtered = prev.filter((entry) => entry.date !== today);
      const updated = [...filtered, { date: today, totalUnits, byMaterial }].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      return updated.slice(-30);
    });
  };

  // --- KPI & CHART AGGREGATIONS ---
  const dashboardStats = useMemo(() => {
    const totalRevenue = sales.reduce((s, r) => s + (Number(r.totalRevenue) || 0), 0);
    const totalNetProfit = sales.reduce((s, r) => s + (Number(r.netProfit) || 0), 0);
    const totalUnitsSold = sales.reduce((s, r) => s + (Number(r.qty) || 0), 0);
    const totalSpent = purchases.reduce((s, p) => s + (Number(p.totalCost) || 0), 0);
    return { totalRevenue, totalNetProfit, totalUnitsSold, totalSpent };
  }, [sales, purchases]);

  const sevenDayChartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = getLocalDateString(-i);
      const label = new Date(dateStr + 'T12:00:00').toLocaleDateString(undefined, {
        weekday: 'short'
      });
      const daySales = sales.filter((s) => s.date === dateStr);
      const revenue = daySales.reduce((sum, s) => sum + (Number(s.totalRevenue) || 0), 0);
      const profit = daySales.reduce((sum, s) => sum + (Number(s.netProfit) || 0), 0);
      days.push({ date: dateStr, label, revenue, profit });
    }
    return days;
  }, [sales]);

  const breakdownChartsData = useMemo(() => {
    const itemLookup = {};
    catalogItems.forEach((c) => {
      itemLookup[c.id] = c;
    });

    const catTotals = {};
    const subTotals = {};

    sales.forEach((s) => {
      const catItem = itemLookup[s.itemId];
      const category = s.category || catItem?.category || 'Uncategorized';
      const subType =
        s.subCategory || (catItem?.subCategory ? catItem.subCategory : `${category} (General)`);
      const amount =
        pieMetricMode === 'profit'
          ? Math.max(0, Number(s.netProfit) || 0)
          : Math.max(0, Number(s.totalRevenue) || 0);

      catTotals[category] = (catTotals[category] || 0) + amount;
      subTotals[subType] = (subTotals[subType] || 0) + amount;
    });

    const palette = [
      '#f59e0b',
      '#ef4444',
      '#10b981',
      '#3b82f6',
      '#a855f7',
      '#f97316',
      '#14b8a6',
      '#eab308',
      '#ec4899',
      '#6366f1'
    ];

    const buildSlices = (totalsMap) => {
      const entries = Object.entries(totalsMap)
        .filter(([, val]) => val > 0)
        .sort((a, b) => b[1] - a[1]);
      const grandTotal = entries.reduce((sum, [, val]) => sum + val, 0);
      let cumulativePct = 0;

      return {
        grandTotal,
        slices: entries.map(([label, value], idx) => {
          const pct = grandTotal > 0 ? (value / grandTotal) * 100 : 0;
          const startPct = cumulativePct;
          cumulativePct += pct;
          return {
            label,
            value,
            pct,
            startPct,
            color: palette[idx % palette.length]
          };
        })
      };
    };

    return {
      byCategory: buildSlices(catTotals),
      bySubType: buildSlices(subTotals)
    };
  }, [sales, catalogItems, pieMetricMode]);

  const isGuest = workerProfile?.roleType === 'guest';

  // Resolve live permissions for active logged-in user (updates automatically if admin edits their account)
  const activeUserRecord = useMemo(() => {
    if (!workerProfile?.userId) return null;
    return managedUsers.find((u) => u.id === workerProfile.userId) || null;
  }, [workerProfile, managedUsers]);

  const effectiveRole = activeUserRecord?.role || workerProfile?.roleType || 'guest';
  const effectivePermissions = useMemo(() => {
    if (activeUserRecord?.permissions) {
      return activeUserRecord.permissions;
    }
    return ROLE_PRESETS[effectiveRole]?.permissions || ROLE_PRESETS.guest.permissions;
  }, [activeUserRecord, effectiveRole]);

  const effectiveAdminUnlocked = isAdminUnlocked || Boolean(effectivePermissions.isAdmin);
  const canLogSalesPurchases = Boolean(effectivePermissions.logSalesPurchases);
  const canManageOrders = Boolean(effectivePermissions.manageOrders);
  const canEditStock = Boolean(effectivePermissions.editStock);
  const canEditRecipes = Boolean(effectivePermissions.editRecipes);

  // --- LOGIN & PASSCODE HANDLERS ---
  const handleUserAccountLogin = (e) => {
    e.preventDefault();
    const uname = loginUsernameInput.trim().toLowerCase();
    const pwd = passcodeInput.trim();
    if (!uname || !pwd) {
      setLoginError('Enter both your username and password.');
      return;
    }

    // Master Admin shortcut if someone types Admin / Ysgramor
    if (uname === 'admin' && pwd === 'Ysgramor') {
      setWorkerProfile({
        id: 'admin_session',
        name: 'Master Forgemaster',
        username: 'admin',
        title: 'Keeper of the Skyforge',
        roleType: 'admin'
      });
      setIsAdminUnlocked(true);
      setViewMode('worker');
      setProfileOnlineStatus(true);
      setLoginUsernameInput('');
      setPasscodeInput('');
      setLoginError('');
      return;
    }

    const matchedUser = managedUsers.find(
      (u) => u.username.trim().toLowerCase() === uname && u.password === pwd
    );

    if (!matchedUser) {
      setLoginError('Invalid username or password.');
      return;
    }

    const roleMeta = ROLE_PRESETS[matchedUser.role] || ROLE_PRESETS.smith;
    setWorkerProfile({
      id: matchedUser.id,
      userId: matchedUser.id,
      name: matchedUser.displayName,
      username: matchedUser.username,
      title: matchedUser.title || roleMeta.title,
      roleType: matchedUser.role
    });
    setIsAdminUnlocked(Boolean(matchedUser.permissions?.isAdmin || matchedUser.role === 'admin'));
    setViewMode('worker');
    setProfileOnlineStatus(matchedUser.isOnline !== false);
    setLoginUsernameInput('');
    setPasscodeInput('');
    setLoginError('');
    showToast(`Welcome back, ${matchedUser.displayName} (${roleMeta.label})!`);
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    const code = passcodeInput.trim();
    if (code === 'Wuuthrad') {
      setWorkerProfile({
        id: 'smith_session',
        name: 'Skyforge Smith',
        title: 'Journeyman Forgemaster',
        roleType: 'smith'
      });
      setIsAdminUnlocked(false);
      setProfileOnlineStatus(true);
      setViewMode('worker');
      setPasscodeInput('');
      setLoginError('');
    } else if (code === 'Ysgramor') {
      setWorkerProfile({
        id: 'admin_session',
        name: 'Master Forgemaster',
        title: 'Keeper of the Skyforge',
        roleType: 'admin'
      });
      setIsAdminUnlocked(true);
      setProfileOnlineStatus(true);
      setViewMode('worker');
      setPasscodeInput('');
      setLoginError('');
    } else if (code === 'Whiterun') {
      setWorkerProfile({
        id: 'guest_session',
        name: 'Whiterun Guest',
        title: 'Ledger Observer (View Only)',
        roleType: 'guest'
      });
      setIsAdminUnlocked(false);
      setProfileOnlineStatus(true);
      setViewMode('worker');
      setPasscodeInput('');
      setLoginError('');
    } else {
      setLoginError('Invalid Forge Passcode. Speak the true words of Whiterun.');
    }
  };

  const handleToggleMyOnlineStatus = () => {
    const nextOnline = !profileOnlineStatus;
    setProfileOnlineStatus(nextOnline);
    if (workerProfile?.userId) {
      setManagedUsers((prev) =>
        prev.map((u) => (u.id === workerProfile.userId ? { ...u, isOnline: nextOnline } : u))
      );
    }
    showToast(nextOnline ? 'Your profile is now shown as Online.' : 'Your profile is now shown as Offline.');
  };

  const handleToggleManagedUserOnline = (userId) => {
    if (!effectiveAdminUnlocked) return;
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isOnline: u.isOnline === false ? true : false } : u
      )
    );
  };

  const handleUnlockAdmin = (e) => {
    e.preventDefault();
    if (adminPasscodeInput.trim() === 'Ysgramor') {
      setIsAdminUnlocked(true);
      setAdminPasscodeInput('');
      setAdminError('');
      showToast('Master Admin unlocked! Admin Sidebar & User Manager are now available.');
    } else {
      setAdminError('Incorrect Master Admin Passcode.');
    }
  };

  // --- USER ACCOUNT & PERMISSION HANDLERS (ADMIN ONLY) ---
  const handleCreateManagedUser = (e) => {
    e.preventDefault();
    if (!effectiveAdminUnlocked) return;
    const displayName = newUserDisplayName.trim();
    const username = newUserUsername.trim();
    const password = newUserPassword.trim();
    if (!displayName || !username || !password) {
      showToast('Please fill in Name, Username, and Password.', 'error');
      return;
    }
    const exists = managedUsers.some(
      (u) => u.username.trim().toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      showToast(`Username "${username}" is already taken.`, 'error');
      return;
    }

    const preset = ROLE_PRESETS[newUserRole] || ROLE_PRESETS.smith;
    const createdUser = {
      id: `usr_${Date.now()}`,
      displayName,
      username,
      password,
      role: newUserRole,
      title: preset.title,
      isOnline: true,
      permissions: { ...preset.permissions },
      createdAt: getLocalDateString(0)
    };

    setManagedUsers((prev) => [...prev, createdUser]);
    setNewUserDisplayName('');
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserRole('smith');
    showToast(`Created ${preset.label} account for ${displayName} (@${username})!`);
  };

  const handleUpdateUserRole = (userId, nextRole) => {
    if (!effectiveAdminUnlocked) return;
    const preset = ROLE_PRESETS[nextRole] || ROLE_PRESETS.smith;
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              role: nextRole,
              title: preset.title,
              permissions: { ...preset.permissions }
            }
          : u
      )
    );
    showToast(`Updated user role to ${preset.label}.`);
  };

  const handleToggleUserPermission = (userId, permKey) => {
    if (!effectiveAdminUnlocked) return;
    setManagedUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const currentPerms = u.permissions || ROLE_PRESETS[u.role]?.permissions || {};
        const nextVal = !currentPerms[permKey];
        const updatedPerms = { ...currentPerms, [permKey]: nextVal };
        return {
          ...u,
          role: permKey === 'isAdmin' && nextVal ? 'admin' : u.role,
          permissions: updatedPerms
        };
      })
    );
  };

  const handleDeleteManagedUser = (userId) => {
    if (!effectiveAdminUnlocked) return;
    setManagedUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('User account removed.');
  };

  // --- SALE & PURCHASE HANDLERS ---
  const customSalePricingPreview = useMemo(() => {
    const materialCost = customSaleRecipe.reduce((sum, req) => {
      const mat = materialMap[req.materialId];
      return sum + (mat ? (Number(mat.buyPrice) || 0) * req.qty : 0);
    }, 0);
    const calculatedSellPrice = Math.round(
      materialCost * (1 + (Number(profitMarginPct) || 0) / 100)
    );
    const hasOverride =
      customSalePriceOverride !== '' &&
      !Number.isNaN(Number(customSalePriceOverride)) &&
      Number(customSalePriceOverride) >= 0;
    const finalSellPrice = hasOverride ? Math.round(Number(customSalePriceOverride)) : calculatedSellPrice;
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

  const buildCurrentSaleLineItem = () => {
    const qty = Math.max(1, Number(saleQty) || 1);
    if (saleMode === 'custom') {
      const cleanName = customSaleName.trim();
      if (!cleanName) return null;
      const { materialCost, finalSellPrice, hasOverride } = customSalePricingPreview;
      return {
        lineId: `sline_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
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
      lineId: `sline_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      mode: 'existing',
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      subCategory: item.subCategory || '',
      qty,
      unitSell: item.sellPrice,
      unitCost: item.materialCost
    };
  };

  const handleAddSaleLineToCart = () => {
    const line = buildCurrentSaleLineItem();
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

  const handleRecordSale = (e) => {
    e.preventDefault();
    if (!canLogSalesPurchases) return;

    const currentDraft = buildCurrentSaleLineItem();
    const linesToProcess =
      saleCartItems.length > 0
        ? currentDraft
          ? [...saleCartItems, currentDraft]
          : [...saleCartItems]
        : currentDraft
        ? [currentDraft]
        : [];

    if (linesToProcess.length === 0) {
      showToast('Select an item or add at least one item to the sale.', 'error');
      return;
    }

    const todayStr = getLocalDateString(0);
    const buyerName = saleCustomer.trim() || 'Walk-in Traveler';
    const newCatalogEntries = [];
    const stockDeductions = {};
    const newSaleRecords = [];

    linesToProcess.forEach((line, idx) => {
      const totalRevenue = line.unitSell * line.qty;
      const netProfit = (line.unitSell - line.unitCost) * line.qty;
      let resolvedItemId = line.itemId;

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
            recipe: line.recipe || []
          });
        }
      } else if (deductStockOnSale && line.itemId) {
        stockDeductions[line.itemId] = (stockDeductions[line.itemId] || 0) + line.qty;
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

    if (newCatalogEntries.length > 0 || Object.keys(stockDeductions).length > 0) {
      setCatalogItems((prev) => {
        const updated = prev.map((c) =>
          stockDeductions[c.id]
            ? { ...c, stock: Math.max(0, (Number(c.stock) || 0) - stockDeductions[c.id]) }
            : c
        );
        return [...updated, ...newCatalogEntries];
      });
    }

    const grandRev = newSaleRecords.reduce((s, r) => s + r.totalRevenue, 0);
    setSaleCartItems([]);
    setSaleItemId('');
    setSaleQty(1);
    setSaleCustomer('');
    setCustomSaleName('');
    setCustomSaleRecipe([]);
    setCustomSalePriceOverride('');
    setShowRecordSaleModal(false);
    showToast(
      `Logged ${newSaleRecords.length} sale ${newSaleRecords.length === 1 ? 'item' : 'items'} (+${grandRev}g)!`
    );
  };
  const buildCurrentPurchaseLineItem = () => {
    const qty = Math.max(1, Number(purchaseQty) || 1);
    const unitCost = Math.max(0, Number(purchaseUnitCost) || 0);

    if (purchaseTargetType === 'existing') {
      if (!purchaseExistingKey) return null;
      const [kind, targetId] = purchaseExistingKey.split(':');
      if (kind === 'mat') {
        const targetMat = resolvedMaterials.find((m) => m.id === targetId);
        if (!targetMat) return null;
        return {
          lineId: `pline_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          targetType: 'existing',
          kind: 'mat',
          targetId,
          itemName: targetMat.name,
          displayKind: 'Resource Vault',
          isAutoSmeltedCost: Boolean(targetMat.isAutoSmeltedCost),
          qty,
          unitCost
        };
      }
      const targetCat = catalogItems.find((c) => c.id === targetId);
      if (!targetCat) return null;
      return {
        lineId: `pline_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        targetType: 'existing',
        kind: 'cat',
        targetId,
        itemName: targetCat.name,
        displayKind: targetCat.category,
        qty,
        unitCost
      };
    }

    const cleanName = purchaseNewName.trim();
    if (!cleanName) return null;
    return {
      lineId: `pline_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      targetType: 'new',
      dest: purchaseNewDest,
      itemName: cleanName,
      displayKind: purchaseNewDest === 'material' ? 'New Resource' : 'Unsorted (New)',
      qty,
      unitCost
    };
  };

  const handleAddPurchaseLineToCart = () => {
    const line = buildCurrentPurchaseLineItem();
    if (!line) {
      showToast(
        purchaseTargetType === 'new'
          ? 'Enter a name for the new purchased item first.'
          : 'Select an existing resource or ware first.',
        'error'
      );
      return;
    }
    setPurchaseCartItems((prev) => [...prev, line]);
    setPurchaseQty(1);
    setPurchaseUnitCost(0);
    if (purchaseTargetType === 'new') {
      setPurchaseNewName('');
    } else {
      setPurchaseExistingKey('');
    }
  };

  const handleRecordPurchase = (e) => {
    e.preventDefault();
    if (!canLogSalesPurchases) return;

    const currentDraft = buildCurrentPurchaseLineItem();
    const linesToProcess =
      purchaseCartItems.length > 0
        ? currentDraft
          ? [...purchaseCartItems, currentDraft]
          : [...purchaseCartItems]
        : currentDraft
        ? [currentDraft]
        : [];

    if (linesToProcess.length === 0) {
      showToast('Select or enter at least one item to purchase.', 'error');
      return;
    }

    const todayStr = getLocalDateString(0);
    const supplier = purchaseSupplier.trim() || 'Traveling Merchant';
    let nextMats = [...materials];
    let nextCats = [...catalogItems];
    let matsChanged = false;
    let needsUnsorted = false;
    const newPurchaseRecords = [];

    linesToProcess.forEach((line, idx) => {
      const totalCost = line.qty * line.unitCost;

      if (line.targetType === 'existing') {
        if (line.kind === 'mat') {
          matsChanged = true;
          nextMats = nextMats.map((m) => {
            if (m.id !== line.targetId) return m;
            const nextPrice =
              updateUnitCostOnPurchase && !line.isAutoSmeltedCost ? line.unitCost : m.buyPrice;
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
                  ...(updateUnitCostOnPurchase && line.unitCost > 0
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
          recipe: []
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
    setPurchaseCartItems([]);
    setPurchaseExistingKey('');
    setPurchaseNewName('');
    setPurchaseQty(1);
    setPurchaseUnitCost(0);
    setPurchaseSupplier('');
    setShowRecordPurchaseModal(false);
    showToast(
      `Logged ${newPurchaseRecords.length} purchased ${
        newPurchaseRecords.length === 1 ? 'item' : 'items'
      } (-${grandSpent}g)!`
    );
  };

  // --- EDIT & DELETE SALE / PURCHASE HANDLERS ---
  const handleSaveEditedSale = (e) => {
    e.preventDefault();
    if (!canLogSalesPurchases || !editingSale) return;
    const qty = Math.max(1, Number(editingSale.qty) || 1);
    const unitSell = Math.max(0, Number(editingSale.unitSell) || 0);
    const unitCost = Math.max(0, Number(editingSale.unitCost) || 0);
    const totalRevenue = unitSell * qty;
    const netProfit = (unitSell - unitCost) * qty;

    setSales((prev) =>
      prev.map((s) =>
        s.id === editingSale.id
          ? {
              ...s,
              itemName: editingSale.itemName?.trim() || s.itemName,
              qty,
              unitSell,
              unitCost,
              totalRevenue,
              netProfit,
              customer: editingSale.customer?.trim() || 'Walk-in Traveler',
              date: editingSale.date || s.date
            }
          : s
      )
    );
    setEditingSale(null);
    showToast('Updated sale record!');
  };

  const handleDeleteSale = (saleId) => {
    if (!canLogSalesPurchases) return;
    setSales((prev) => prev.filter((s) => s.id !== saleId));
    showToast('Removed sale entry.');
  };

  const handleSaveEditedPurchase = (e) => {
    e.preventDefault();
    if (!canLogSalesPurchases || !editingPurchase) return;
    const qty = Math.max(1, Number(editingPurchase.qty) || 1);
    const unitCost = Math.max(0, Number(editingPurchase.unitCost) || 0);
    const totalCost = unitCost * qty;

    setPurchases((prev) =>
      prev.map((p) =>
        p.id === editingPurchase.id
          ? {
              ...p,
              itemName: editingPurchase.itemName?.trim() || p.itemName,
              qty,
              unitCost,
              totalCost,
              supplier: editingPurchase.supplier?.trim() || 'Traveling Merchant',
              date: editingPurchase.date || p.date
            }
          : p
      )
    );
    setEditingPurchase(null);
    showToast('Updated purchase record!');
  };

  const handleDeletePurchase = (purchaseId) => {
    if (!canLogSalesPurchases) return;
    setPurchases((prev) => prev.filter((p) => p.id !== purchaseId));
    showToast('Removed purchase entry.');
  };

  // --- ORDERS & DELIVERIES HANDLERS ---
  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!canManageOrders || !orderItemId) return;
    const item = enrichedCatalog.find((i) => i.id === orderItemId);
    if (!item) return;
    const qty = Math.max(1, Number(orderQty) || 1);
    const newOrder = {
      id: `ord_${Date.now()}`,
      customerName: orderCustomerName.trim() || 'Whiterun Patron',
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      subCategory: item.subCategory || '',
      qty,
      agreedUnitPrice: item.sellPrice,
      unitCost: item.materialCost,
      agreedTotal: item.sellPrice * qty,
      notes: orderNotes.trim(),
      status: 'pending',
      date: getLocalDateString(0)
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderCustomerName('');
    setOrderItemId('');
    setOrderQty(1);
    setOrderNotes('');
    showToast(`Added commission for ${newOrder.customerName}!`);
  };

  const handleCompleteOrder = (ord) => {
    if (!canManageOrders) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === ord.id ? { ...o, status: 'completed' } : o))
    );
    const unitSell = Number(ord.agreedUnitPrice) || 0;
    const unitCost = Number(ord.unitCost) || 0;
    const qty = Math.max(1, Number(ord.qty) || 1);
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
    showToast(`Completed order & logged +${unitSell * qty}g sale!`);
  };

  const handleAddSupplyRecord = (e) => {
    e.preventDefault();
    if (!canManageOrders || !supplyMaterialId) return;
    const mat = resolvedMaterials.find((m) => m.id === supplyMaterialId);
    if (!mat) return;
    const qty = Math.max(1, Number(supplyQty) || 1);
    const totalCost = Math.max(0, Number(supplyTotalCost) || 0);
    const rec = {
      id: `sup_${Date.now()}`,
      supplierName: supplySupplierName.trim() || 'Mining Caravan',
      materialId: mat.id,
      materialName: mat.name,
      qty,
      totalCost,
      status: supplyStatus,
      date: getLocalDateString(0)
    };
    setSupplyRecords((prev) => [rec, ...prev]);
    if (supplyStatus === 'delivered') {
      const nextMats = materials.map((m) =>
        m.id === mat.id ? { ...m, stock: (Number(m.stock) || 0) + qty } : m
      );
      setMaterials(nextMats);
      recordStockSnapshot(nextMats);
    }
    setSupplySupplierName('');
    setSupplyMaterialId('');
    setSupplyQty(1);
    setSupplyTotalCost(0);
    showToast(`Logged material delivery for ${mat.name}!`);
  };

  const handleMarkSupplyDelivered = (rec) => {
    if (!canManageOrders) return;
    setSupplyRecords((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'delivered' } : r))
    );
    const nextMats = materials.map((m) =>
      m.id === rec.materialId ? { ...m, stock: (Number(m.stock) || 0) + (Number(rec.qty) || 0) } : m
    );
    setMaterials(nextMats);
    recordStockSnapshot(nextMats);
    showToast(`Marked ${rec.qty}x ${rec.materialName} delivered & added to vault!`);
  };

  // --- MATERIAL VAULT HANDLERS ---
  const updateMaterialBuyPrice = (matId, rawVal) => {
    if (!canEditStock) return;
    const val = Math.max(0, Number(rawVal) || 0);
    setMaterials((prev) => prev.map((m) => (m.id === matId ? { ...m, buyPrice: val } : m)));
  };

  const adjustMaterialStock = (matId, delta) => {
    if (!canEditStock) return;
    const nextMats = materials.map((m) =>
      m.id === matId ? { ...m, stock: Math.max(0, (Number(m.stock) || 0) + delta) } : m
    );
    setMaterials(nextMats);
    recordStockSnapshot(nextMats);
  };

  const setMaterialStockDirect = (matId, rawVal) => {
    if (!canEditStock) return;
    const val = Math.max(0, Number(rawVal) || 0);
    const nextMats = materials.map((m) => (m.id === matId ? { ...m, stock: val } : m));
    setMaterials(nextMats);
    recordStockSnapshot(nextMats);
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!canEditStock || !newMatName.trim()) return;
    const newMat = {
      id: `mat_${Date.now()}`,
      name: newMatName.trim(),
      category: newMatCategory,
      buyPrice: Math.max(0, Number(newMatPrice) || 0),
      stock: Math.max(0, Number(newMatStock) || 0),
      lowThreshold: 5
    };
    const nextMats = [...materials, newMat];
    setMaterials(nextMats);
    recordStockSnapshot(nextMats);
    setNewMatName('');
    setNewMatPrice(0);
    setNewMatStock(0);
    showToast(`Added ${newMat.name} to ${newMat.category}`);
  };

  const handleDeleteMaterial = (matId) => {
    if (!canEditStock) return;
    const nextMats = materials.filter((m) => m.id !== matId);
    setMaterials(nextMats);
    recordStockSnapshot(nextMats);
    setCatalogItems((prev) =>
      prev.map((item) => ({
        ...item,
        recipe: (item.recipe || []).filter((r) => r.materialId !== matId)
      }))
    );
    if (selectedTrendMatId === matId) setSelectedTrendMatId('ALL');
    showToast('Material removed from vault.');
  };

  const handleAddResourceCategory = (e) => {
    e.preventDefault();
    if (!canEditStock) return;
    const trimmed = newResourceCatInput.trim();
    if (!trimmed) return;
    if (!materialCategories.includes(trimmed)) {
      setMaterialCategories((prev) => [...prev, trimmed]);
      setNewMatCategory(trimmed);
      showToast(`Created resource category "${trimmed}"`);
    }
    setNewResourceCatInput('');
  };

  // --- RECIPES, CATEGORIES & SUB-TIERS HANDLERS ---
  const handleAddSubTierInline = (e) => {
    e.preventDefault();
    if (!canEditRecipes || recipeBoardCatFilter === 'All') return;
    const trimmed = inlineNewSubCat.trim();
    if (!trimmed) return;
    setSubCategories((prev) => {
      const existing = prev[recipeBoardCatFilter] || [];
      if (existing.includes(trimmed)) return prev;
      return { ...prev, [recipeBoardCatFilter]: [...existing, trimmed] };
    });
    setInlineNewSubCat('');
    showToast(`Added "${trimmed}" tier to ${recipeBoardCatFilter}`);
  };

  const handleRemoveSubTierInline = (catName, tierName) => {
    if (!canEditRecipes) return;
    setSubCategories((prev) => ({
      ...prev,
      [catName]: (prev[catName] || []).filter((t) => t !== tierName)
    }));
    if (recipeBoardSubFilter === tierName) setRecipeBoardSubFilter('All');
    showToast(`Removed tier "${tierName}"`);
  };

  const handleAddRecipeIngredientToNew = () => {
    if (!newItemMatId) return;
    const qty = Math.max(1, Number(newItemMatQty) || 1);
    setNewItemRecipe((prev) => {
      const existing = prev.find((r) => r.materialId === newItemMatId);
      if (existing) {
        return prev.map((r) => (r.materialId === newItemMatId ? { ...r, qty: r.qty + qty } : r));
      }
      return [...prev, { materialId: newItemMatId, qty }];
    });
  };

  const handleCreateCatalogItem = (e) => {
    e.preventDefault();
    if (!canEditRecipes || !newItemName.trim()) return;
    const created = {
      id: `cat_${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCat,
      subCategory: newItemSubCat || '',
      description: newItemDesc.trim() || 'Hand-forged at the Skyforge.',
      stock: 0,
      customPrice: 0,
      useCustomPrice: false,
      recipe: newItemRecipe
    };
    setCatalogItems((prev) => [...prev, created]);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemRecipe([]);
    showToast(`Added "${created.name}" to catalog!`);
  };

  // --- ADMIN BACKUP, RESTORE, EXPORT & RESET ---
  const handleDownloadFullBackupJson = () => {
    if (!effectiveAdminUnlocked) return;
    const payload = {
      version: 'skyforge-backup-v1',
      exportedAt: new Date().toISOString(),
      materials,
      materialCategories,
      catalogItems,
      categories,
      subCategories,
      profitMarginPct,
      buyBackRatePct,
      sales,
      purchases,
      orders,
      supplyRecords,
      smithProfiles,
      managedUsers,
      materialTrendHistory
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skyforge-backup-${getLocalDateString(0)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded full Skyforge backup (.json)!');
  };

  const handleImportFullBackupJson = (e) => {
    if (!effectiveAdminUnlocked) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result || '{}');
        if (Array.isArray(parsed.materials)) setMaterials(parsed.materials);
        if (Array.isArray(parsed.materialCategories)) setMaterialCategories(parsed.materialCategories);
        if (Array.isArray(parsed.catalogItems)) setCatalogItems(parsed.catalogItems);
        if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
        if (parsed.subCategories && typeof parsed.subCategories === 'object') {
          setSubCategories(parsed.subCategories);
        }
        if (typeof parsed.profitMarginPct === 'number') setProfitMarginPct(parsed.profitMarginPct);
        if (typeof parsed.buyBackRatePct === 'number') setBuyBackRatePct(parsed.buyBackRatePct);
        if (Array.isArray(parsed.sales)) setSales(parsed.sales);
        if (Array.isArray(parsed.purchases)) setPurchases(parsed.purchases);
        if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
        if (Array.isArray(parsed.supplyRecords)) setSupplyRecords(parsed.supplyRecords);
        if (Array.isArray(parsed.smithProfiles)) setSmithProfiles(parsed.smithProfiles);
        if (Array.isArray(parsed.managedUsers)) setManagedUsers(parsed.managedUsers);
        if (Array.isArray(parsed.materialTrendHistory)) {
          setMaterialTrendHistory(parsed.materialTrendHistory);
        }
        showToast('Backup restored successfully!');
      } catch {
        showToast('Could not read backup file. Ensure it is a valid Skyforge .json save.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportSpreadsheetCsv = () => {
    if (!effectiveAdminUnlocked) return;
    const rows = [
      ['Type', 'Name', 'Category', 'Sub-Tier', 'Buy/Material Cost (g)', 'We Buy Price (g)', 'Public Sell Price (g)', 'Stock']
    ];
    resolvedMaterials.forEach((m) => {
      rows.push(['Material', m.name, m.category, '', m.buyPrice, '', '', m.stock]);
    });
    enrichedCatalog.forEach((c) => {
      rows.push([
        'Catalog Item',
        c.name,
        c.category,
        c.subCategory || '',
        c.materialCost,
        c.buyFromCustomerPrice,
        c.sellPrice,
        c.stock
      ]);
    });
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skyforge-ledger-${getLocalDateString(0)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    showToast('Exported Skyforge spreadsheet (.csv)!');
  };

  const handleConfirmCleanReset = () => {
    if (!effectiveAdminUnlocked) return;
    setMaterials(INITIAL_MATERIALS);
    setMaterialCategories(INITIAL_MATERIAL_CATEGORIES);
    setCatalogItems(INITIAL_CATALOG_ITEMS_RAW);
    setCategories(DEFAULT_CATEGORIES);
    setSubCategories(DEFAULT_SUBCATEGORIES);
    setProfitMarginPct(0);
    setBuyBackRatePct(70);
    setSales([]);
    setPurchases([]);
    setOrders([]);
    setSupplyRecords([]);
    setSmithProfiles([]);
    setManagedUsers([]);
    setMaterialTrendHistory([]);
    setShowResetModal(false);
    setShowAdminSidebar(false);
    showToast('Forge wiped to a clean slate!');
  };

  // --- FILTERED PUBLIC CATALOG ---
  const filteredPublicItems = useMemo(() => {
    return enrichedCatalog.filter((item) => {
      if (publicCategory !== 'All' && item.category !== publicCategory) return false;
      if (publicSubCategory !== 'All' && (item.subCategory || '') !== publicSubCategory) {
        return false;
      }
      if (publicSearch.trim()) {
        const q = publicSearch.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          (item.subCategory || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [enrichedCatalog, publicCategory, publicSubCategory, publicSearch]);

  const availablePublicSubTiers = useMemo(() => {
    if (publicCategory === 'All') return [];
    const configured = subCategories[publicCategory] || [];
    const fromItems = enrichedCatalog
      .filter((i) => i.category === publicCategory && i.subCategory)
      .map((i) => i.subCategory);
    return Array.from(new Set([...configured, ...fromItems]));
  }, [publicCategory, subCategories, enrichedCatalog]);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg border shadow-2xl text-xs font-semibold flex items-center gap-2 transition-all ${
            toastMsg.type === 'error'
              ? 'bg-red-950/95 border-red-500/60 text-red-200'
              : 'bg-zinc-900/95 border-amber-500/60 text-amber-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-[#121215]/95 backdrop-blur border-b border-zinc-800/90">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setViewMode('public')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <WuuthradBannerIcon className="w-8 h-8 shrink-0 group-hover:scale-105 transition-transform" />
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-base sm:text-lg font-serif font-bold tracking-wide text-amber-200">
                THE SKYFORGE
              </h1>
              <span className="text-[11px] text-zinc-500 hidden md:inline">
                Whiterun Armory &amp; Smelting Ledger
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Multi-Device Sync Pill */}
            <div
              title={cloudErrorMsg || 'All user accounts, prices, stock & orders sync live across devices'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
                cloudStatus === 'synced'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : cloudStatus === 'connecting'
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  cloudStatus === 'synced'
                    ? 'bg-emerald-400 animate-pulse'
                    : cloudStatus === 'connecting'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-zinc-500'
                }`}
              />
              <span>
                {cloudStatus === 'synced'
                  ? 'Live Sync'
                  : cloudStatus === 'connecting'
                  ? 'Syncing...'
                  : 'Local Session'}
              </span>
            </div>

            {/* Active Profiles & Viewers Counter */}
            <div
              title="Live active profiles & total people viewing The Skyforge right now"
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300"
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <strong className="text-amber-200">{presenceStats.activeProfilesCount}</strong>{' '}
                <span className="text-zinc-400">
                  {presenceStats.activeProfilesCount === 1 ? 'Profile' : 'Profiles'}
                </span>
              </span>
              <span className="text-zinc-700">|</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-zinc-400" />
                <strong className="text-zinc-100">{presenceStats.viewersCount}</strong>{' '}
                <span className="text-zinc-400">Viewing</span>
              </span>
            </div>

            {viewMode === 'worker' && workerProfile ? (
              <>
                <button
                  type="button"
                  onClick={() => setViewMode('public')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-300 cursor-pointer"
                >
                  Public Price List
                </button>

                {effectiveAdminUnlocked && (
                  <button
                    type="button"
                    onClick={() => setShowAdminSidebar(true)}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900/80 border border-red-500/50 text-xs font-semibold text-amber-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Menu</span>
                  </button>
                )}

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      profileOnlineStatus ? 'bg-emerald-400' : 'bg-zinc-500'
                    }`}
                  />
                  <span className="font-semibold text-zinc-200">
                    {activeUserRecord?.displayName || workerProfile.name}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      effectiveRole === 'admin' || effectiveAdminUnlocked
                        ? 'bg-amber-500/20 text-amber-300'
                        : effectiveRole === 'harbinger'
                        ? 'bg-red-500/20 text-red-300'
                        : effectiveRole === 'smith'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {effectiveAdminUnlocked && effectiveRole !== 'admin'
                      ? `${ROLE_PRESETS[effectiveRole]?.label || effectiveRole} • Admin`
                      : ROLE_PRESETS[effectiveRole]?.label || effectiveRole}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setWorkerProfile(null);
                    setIsAdminUnlocked(false);
                    setShowAdminSidebar(false);
                    setViewMode('public');
                  }}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'login' ? 'public' : 'login')}
                className="px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{viewMode === 'login' ? 'Back to Price List' : 'Smith Access'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==================== PUBLIC PRICE LIST ==================== */}
      {viewMode === 'public' && (
        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          {/* Compact Banner + Search + Category Filter Strip */}
          <div className="bg-gradient-to-r from-[#18181b] via-[#1c1617] to-[#18181b] border border-zinc-800/90 rounded-xl p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Skyforge Exchange</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
                  Armory Wares &amp; Rates
                </h2>
                <span className="text-xs text-zinc-400">
                  Public purchase (<span className="text-amber-300 font-semibold">We Sell</span>) &amp; trade-in (<span className="text-emerald-300 font-semibold">We Buy</span>)
                </span>
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={publicSearch}
                  onChange={(e) => setPublicSearch(e.target.value)}
                  placeholder="Search weapons, armor, ingots..."
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
                />
                {publicSearch && (
                  <button
                    type="button"
                    onClick={() => setPublicSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category & Sub-Tier Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-zinc-800/80">
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setPublicCategory(cat);
                      setPublicSubCategory('All');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      publicCategory === cat
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-zinc-950/90 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-zinc-500">
                Showing <strong className="text-zinc-300">{filteredPublicItems.length}</strong>{' '}
                {filteredPublicItems.length === 1 ? 'ware' : 'wares'}
              </span>
            </div>

            {publicCategory !== 'All' && availablePublicSubTiers.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mr-1">
                  Tier:
                </span>
                {['All', ...availablePublicSubTiers].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPublicSubCategory(tier)}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      publicSubCategory === tier
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                        : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {tier === 'All' ? 'All Tiers' : tier}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4-Column Responsive Dark-Steel Card Grid */}
          {filteredPublicItems.length === 0 ? (
            <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-10 text-center space-y-1.5">
              <p className="text-sm font-serif font-semibold text-zinc-300">
                No wares match your current filter.
              </p>
              <p className="text-xs text-zinc-500">
                Try clearing the search bar or switching categories/tiers above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredPublicItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#18181b] border border-zinc-800/90 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between gap-3 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            {item.category}
                          </span>
                          {item.subCategory && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-semibold text-amber-300">
                              {item.subCategory}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-serif font-bold text-zinc-100 leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      {/* We Buy & We Sell Badges */}
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="px-2 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-right">
                          <div className="text-[8px] uppercase tracking-wider font-bold text-emerald-400">
                            We Buy
                          </div>
                          <div className="text-xs font-bold text-emerald-200">
                            {item.buyFromCustomerPrice}g
                          </div>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-right">
                          <div className="text-[8px] uppercase tracking-wider font-bold text-amber-400">
                            We Sell
                          </div>
                          <div className="text-xs font-bold text-amber-200">{item.sellPrice}g</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        item.stock > 0 ? 'text-emerald-400' : 'text-zinc-500'
                      }`}
                    >
                      {item.stock > 0 ? `${item.stock} Ready in Armory` : 'Forged to Order'}
                    </span>
                    <span className="text-zinc-500">
                      {(item.recipe || []).length > 0
                        ? `${item.recipe.length} component${item.recipe.length > 1 ? 's' : ''}`
                        : 'Direct stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ==================== LOGIN SCREEN ==================== */}
      {viewMode === 'login' && (
        <main className="max-w-md mx-auto px-4 py-16">
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <WuuthradBannerIcon className="w-12 h-12 mx-auto" />
              <h2 className="text-xl font-serif font-bold text-amber-200">Skyforge Guild Gate</h2>
              <p className="text-xs text-zinc-400">
                Sign in with your personal Smith/Guild account or enter a master Forge Passcode.
              </p>
            </div>

            {/* Login Mode Toggle */}
            <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('account');
                  setLoginError('');
                }}
                className={`py-1.5 rounded font-semibold cursor-pointer ${
                  loginMode === 'account'
                    ? 'bg-amber-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                User Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('passcode');
                  setLoginError('');
                }}
                className={`py-1.5 rounded font-semibold cursor-pointer ${
                  loginMode === 'passcode'
                    ? 'bg-amber-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Forge Passcode
              </button>
            </div>

            {loginMode === 'account' ? (
              <form onSubmit={handleUserAccountLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginUsernameInput}
                    onChange={(e) => setLoginUsernameInput(e.target.value)}
                    placeholder="Enter username..."
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>

                {loginError && <p className="text-xs text-red-400">{loginError}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Sign In to Profile
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Forge Passcode
                  </label>
                  <input
                    type="password"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter passcode..."
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>

                {loginError && <p className="text-xs text-red-400">{loginError}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Enter the Skyforge
                </button>
              </form>
            )}
          </div>
        </main>
      )}

      {/* ==================== WORKER & ADMIN PORTAL ==================== */}
      {viewMode === 'worker' && workerProfile && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Unified Portal Navigation & Active Profile Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'dashboard', label: 'Sales & Profits', icon: TrendingUp },
                { id: 'orders', label: 'Orders & Deliveries', icon: Truck },
                { id: 'stock', label: 'Forge Stock & Ore', icon: Package },
                { id: 'pricing', label: 'Recipes & Margin', icon: Hammer },
                { id: 'profiles', label: 'Smith Profiles', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeWorkerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveWorkerTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-[#18181b] text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold uppercase text-[10px]">
                {ROLE_PRESETS[effectiveRole]?.label || effectiveRole}
              </span>
              <span>
                <strong className="text-zinc-200">
                  {activeUserRecord?.displayName || workerProfile.name}
                </strong>
                {activeUserRecord?.username ? ` (@${activeUserRecord.username})` : ''}
              </span>
              {!canLogSalesPurchases && !canManageOrders && !canEditStock && !canEditRecipes && (
                <span className="text-amber-300 font-semibold flex items-center gap-1 ml-1">
                  <Lock className="w-3 h-3" /> View Only
                </span>
              )}
            </div>
          </div>

          {/* ==================== TAB 1: SALES & PROFITS ==================== */}
          {activeWorkerTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Top Row: 4 KPI Cards + Ledger Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5">
                  <div className="text-[11px] text-zinc-400">Gross Septim Revenue</div>
                  <div className="text-xl font-serif font-bold text-amber-300 mt-0.5">
                    {dashboardStats.totalRevenue.toLocaleString()}g
                  </div>
                </div>
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5">
                  <div className="text-[11px] text-zinc-400">Net Forge Profit</div>
                  <div className="text-xl font-serif font-bold text-emerald-400 mt-0.5">
                    {dashboardStats.totalNetProfit.toLocaleString()}g
                  </div>
                </div>
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5">
                  <div className="text-[11px] text-zinc-400">Wares Sold</div>
                  <div className="text-xl font-serif font-bold text-zinc-100 mt-0.5">
                    {dashboardStats.totalUnitsSold.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5">
                  <div className="text-[11px] text-zinc-400">Supply Purchases</div>
                  <div className="text-xl font-serif font-bold text-red-300 mt-0.5">
                    {dashboardStats.totalSpent.toLocaleString()}g
                  </div>
                </div>

                {canLogSalesPurchases ? (
                  <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3 flex flex-col justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRecordSaleModal(true)}
                      className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Record a Sale</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRecordPurchaseModal(true)}
                      className="w-full py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Record a Purchase</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-3.5 flex items-center justify-center text-xs text-zinc-500">
                    Ledger Read-Only
                  </div>
                )}
              </div>

              {/* Analytics Row: 7-Day Bar Chart (5 cols) + Category & Sub-Type Pie Charts (7 cols) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* 7-Day Revenue & Net Profit Bar Chart */}
                <div className="xl:col-span-5 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-serif font-bold text-zinc-100">
                        7-Day Revenue &amp; Net Profit
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Daily Septims earned vs. profit after costs.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-amber-300">
                        <span className="w-2 h-2 rounded-xs bg-amber-400" />
                        Revenue
                      </span>
                      <span className="flex items-center gap-1 text-emerald-300">
                        <span className="w-2 h-2 rounded-xs bg-emerald-400" />
                        Profit
                      </span>
                    </div>
                  </div>

                  {(() => {
                    const maxVal = Math.max(
                      10,
                      ...sevenDayChartData.map((d) => Math.max(d.revenue, d.profit))
                    );
                    return (
                      <div className="grid grid-cols-7 gap-2 pt-3 pb-1 h-44 items-end border-b border-zinc-800/80">
                        {sevenDayChartData.map((day) => {
                          const revPct = Math.round((day.revenue / maxVal) * 100);
                          const profPct = Math.round((day.profit / maxVal) * 100);
                          return (
                            <div
                              key={day.date}
                              className="flex flex-col items-center justify-end h-full gap-1"
                            >
                              <div className="text-[10px] text-zinc-400 font-medium">
                                {day.revenue > 0 ? `${day.revenue}g` : ''}
                              </div>
                              <div className="w-full flex items-end justify-center gap-1 h-28">
                                <div
                                  title={`Revenue: ${day.revenue}g`}
                                  style={{ height: `${Math.max(day.revenue > 0 ? 8 : 2, revPct)}%` }}
                                  className="w-2.5 sm:w-3.5 rounded-t bg-amber-400/90 transition-all"
                                />
                                <div
                                  title={`Net Profit: ${day.profit}g`}
                                  style={{ height: `${Math.max(day.profit > 0 ? 8 : 2, profPct)}%` }}
                                  className="w-2.5 sm:w-3.5 rounded-t bg-emerald-400/90 transition-all"
                                />
                              </div>
                              <div className="text-[10px] font-semibold text-zinc-400">
                                {day.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Category & Sub-Type Breakdown Pie Charts */}
                <div className="xl:col-span-7 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-serif font-bold text-zinc-100">
                        Earnings Breakdown by Category &amp; Sub-Type
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Share of gold earned across categories and material tiers.
                      </p>
                    </div>
                    <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setPieMetricMode('revenue')}
                        className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                          pieMetricMode === 'revenue'
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Gross Revenue
                      </button>
                      <button
                        type="button"
                        onClick={() => setPieMetricMode('profit')}
                        className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                          pieMetricMode === 'profit'
                            ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Net Profit
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {[
                      {
                        title: 'By Category',
                        subtitle: 'Weapons, Armor, Ingots & Materials',
                        dataset: breakdownChartsData.byCategory
                      },
                      {
                        title: 'By Sub-Type / Tier',
                        subtitle: 'Iron, Steel, Ebony, Smelted Ingots, etc.',
                        dataset: breakdownChartsData.bySubType
                      }
                    ].map((chart) => {
                      const radius = 38;
                      const circumference = 2 * Math.PI * radius;
                      return (
                        <div
                          key={chart.title}
                          className="p-3.5 rounded-lg bg-zinc-950/75 border border-zinc-800/80 flex flex-col justify-between gap-3"
                        >
                          <div>
                            <h4 className="text-xs font-serif font-bold text-amber-200">
                              {chart.title}
                            </h4>
                            <p className="text-[10px] text-zinc-500">{chart.subtitle}</p>
                          </div>

                          {chart.dataset.slices.length === 0 ? (
                            <div className="py-8 text-center text-xs text-zinc-500">
                              Log a sale to view distribution.
                            </div>
                          ) : (
                            <div className="flex items-center gap-3.5">
                              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#27272a"
                                    strokeWidth="16"
                                  />
                                  {chart.dataset.slices.map((slice) => {
                                    const dashLength = (slice.pct / 100) * circumference;
                                    const dashOffset = -(slice.startPct / 100) * circumference;
                                    return (
                                      <circle
                                        key={slice.label}
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        fill="transparent"
                                        stroke={slice.color}
                                        strokeWidth="16"
                                        strokeDasharray={`${dashLength} ${circumference}`}
                                        strokeDashoffset={dashOffset}
                                      >
                                        <title>
                                          {slice.label}: {slice.value.toLocaleString()}g (
                                          {slice.pct.toFixed(1)}%)
                                        </title>
                                      </circle>
                                    );
                                  })}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                  <span className="text-[8px] uppercase tracking-wider text-zinc-500">
                                    Total
                                  </span>
                                  <span className="text-[11px] font-bold text-zinc-100">
                                    {chart.dataset.grandTotal.toLocaleString()}g
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 min-w-0 space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                {chart.dataset.slices.map((slice) => (
                                  <div
                                    key={slice.label}
                                    className="flex items-center justify-between gap-1.5 text-[11px]"
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span
                                        style={{ backgroundColor: slice.color }}
                                        className="w-2 h-2 rounded-xs shrink-0"
                                      />
                                      <span className="text-zinc-200 truncate">{slice.label}</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="font-semibold text-zinc-100">
                                        {slice.value.toLocaleString()}g
                                      </span>{' '}
                                      <span className="text-zinc-500">
                                        ({Math.round(slice.pct)}%)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sales & Purchases Ledger */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-serif font-bold text-zinc-200">
                    Sales &amp; Purchases Ledger
                  </h3>
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ledgerHistorySearch}
                      onChange={(e) => setLedgerHistorySearch(e.target.value)}
                      placeholder="Search sales, buyers, suppliers..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/60"
                    />
                    {ledgerHistorySearch && (
                      <button
                        type="button"
                        onClick={() => setLedgerHistorySearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Sales History */}
                  <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
                    <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300">
                      Recent Sales ({sales.length})
                    </h4>
                    {(() => {
                      const filteredSales = sales.filter((s) => {
                        if (!ledgerHistorySearch.trim()) return true;
                        const q = ledgerHistorySearch.toLowerCase();
                        return (
                          (s.itemName || '').toLowerCase().includes(q) ||
                          (s.customer || '').toLowerCase().includes(q) ||
                          (s.date || '').includes(q)
                        );
                      });
                      return filteredSales.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-4">No matching sales found.</p>
                      ) : (
                        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                          {filteredSales.map((s) => (
                            <div
                              key={s.id}
                              className="px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="font-semibold text-zinc-100 truncate">
                                  {s.qty}x {s.itemName}
                                </div>
                                <div className="text-[11px] text-zinc-500 truncate">
                                  {s.date} • Buyer: {s.customer}
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0">
                                <div className="text-right">
                                  <div className="font-bold text-amber-300">+{s.totalRevenue}g</div>
                                  <div className="text-[11px] text-emerald-400">
                                    Profit: +{s.netProfit}g
                                  </div>
                                </div>
                                {canLogSalesPurchases && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditingSale({ ...s })}
                                      title="Edit Sale"
                                      className="p-1.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-300 cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSale(s.id)}
                                      title="Remove Sale"
                                      className="p-1.5 rounded bg-zinc-950 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Purchases History */}
                  <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
                    <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-emerald-300">
                      Recent Supply Purchases ({purchases.length})
                    </h4>
                    {(() => {
                      const filteredPurchases = purchases.filter((p) => {
                        if (!ledgerHistorySearch.trim()) return true;
                        const q = ledgerHistorySearch.toLowerCase();
                        return (
                          (p.itemName || '').toLowerCase().includes(q) ||
                          (p.supplier || '').toLowerCase().includes(q) ||
                          (p.kind || '').toLowerCase().includes(q) ||
                          (p.date || '').includes(q)
                        );
                      });
                      return filteredPurchases.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-4">No matching purchases found.</p>
                      ) : (
                        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                          {filteredPurchases.map((p) => (
                            <div
                              key={p.id}
                              className="px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="font-semibold text-zinc-100 truncate">
                                  {p.qty}x {p.itemName}
                                </div>
                                <div className="text-[11px] text-zinc-500 truncate">
                                  {p.date} • {p.kind} • {p.supplier}
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0">
                                <div className="text-right">
                                  <div className="font-bold text-red-300">-{p.totalCost}g</div>
                                  <div className="text-[11px] text-zinc-500">{p.unitCost}g each</div>
                                </div>
                                {canLogSalesPurchases && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditingPurchase({ ...p })}
                                      title="Edit Purchase"
                                      className="p-1.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-300 cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePurchase(p.id)}
                                      title="Remove Purchase"
                                      className="p-1.5 rounded bg-zinc-950 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: ORDERS & DELIVERIES ==================== */}
          {activeWorkerTab === 'orders' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Customer Commissions */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-amber-200">
                      Customer Commissions
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Track custom weapons &amp; armor ordered by patrons.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-48">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ordersLedgerSearch}
                      onChange={(e) => setOrdersLedgerSearch(e.target.value)}
                      placeholder="Search orders..."
                      className="w-full pl-8 pr-6 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    />
                    {ordersLedgerSearch && (
                      <button
                        type="button"
                        onClick={() => setOrdersLedgerSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {canManageOrders && (
                  <form onSubmit={handleAddOrder} className="space-y-3 p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderItemSearch}
                        onChange={(e) => setOrderItemSearch(e.target.value)}
                        placeholder="Quick-filter item dropdown..."
                        className="w-full pl-8 pr-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        value={orderCustomerName}
                        onChange={(e) => setOrderCustomerName(e.target.value)}
                        placeholder="Customer name"
                        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      <select
                        value={orderItemId}
                        onChange={(e) => setOrderItemId(e.target.value)}
                        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      >
                        <option value="">-- Select Item --</option>
                        {enrichedCatalog
                          .filter(
                            (item) =>
                              !orderItemSearch.trim() ||
                              item.name.toLowerCase().includes(orderItemSearch.toLowerCase()) ||
                              (item.subCategory || '')
                                .toLowerCase()
                                .includes(orderItemSearch.toLowerCase())
                          )
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.sellPrice}g)
                            </option>
                          ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={orderQty}
                        onChange={(e) => setOrderQty(e.target.value)}
                        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Optional notes (e.g. sharpened, urgent)"
                        className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                      >
                        Add Order
                      </button>
                    </div>
                  </form>
                )}

                {(() => {
                  const filteredOrders = orders.filter((ord) => {
                    if (!ordersLedgerSearch.trim()) return true;
                    const q = ordersLedgerSearch.toLowerCase();
                    return (
                      (ord.customerName || '').toLowerCase().includes(q) ||
                      (ord.itemName || '').toLowerCase().includes(q) ||
                      (ord.notes || '').toLowerCase().includes(q)
                    );
                  });
                  return filteredOrders.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-6 text-center">
                      No matching customer orders found.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                      {filteredOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-100">
                                {ord.qty}x {ord.itemName}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  ord.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              Patron: <strong className="text-zinc-200">{ord.customerName}</strong> •{' '}
                              {ord.agreedTotal}g
                            </div>
                            {ord.notes && (
                              <div className="text-[11px] text-zinc-500 italic">{ord.notes}</div>
                            )}
                          </div>

                          {canManageOrders && (
                            <div className="flex items-center gap-1.5">
                              {ord.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleCompleteOrder(ord)}
                                  className="px-2.5 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-semibold cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  setOrders((prev) => prev.filter((o) => o.id !== ord.id))
                                }
                                className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Material Deliveries & Pending Supply Orders */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-amber-200">
                      Material Deliveries &amp; Pending Supplies
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Track miners/caravans who delivered ores or pending shipments.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <div className="relative w-36 sm:w-44">
                      <Search className="w-3 h-3 text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={supplyLedgerSearch}
                        onChange={(e) => setSupplyLedgerSearch(e.target.value)}
                        placeholder="Search deliveries..."
                        className="w-full pl-7 pr-5 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      {supplyLedgerSearch && (
                        <button
                          type="button"
                          onClick={() => setSupplyLedgerSearch('')}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {['all', 'pending', 'delivered'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSupplyFilter(f)}
                        className={`px-2 py-1 rounded capitalize cursor-pointer ${
                          supplyFilter === f
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                            : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {canManageOrders && (
                  <form
                    onSubmit={handleAddSupplyRecord}
                    className="space-y-3 p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800"
                  >
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={supplyMatSearch}
                        onChange={(e) => setSupplyMatSearch(e.target.value)}
                        placeholder="Quick-filter material dropdown..."
                        className="w-full pl-8 pr-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={supplySupplierName}
                        onChange={(e) => setSupplySupplierName(e.target.value)}
                        placeholder="Delivered by / Supplier name"
                        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      <select
                        value={supplyMaterialId}
                        onChange={(e) => setSupplyMaterialId(e.target.value)}
                        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      >
                        <option value="">-- Select Material --</option>
                        {resolvedMaterials
                          .filter(
                            (m) =>
                              !supplyMatSearch.trim() ||
                              m.name.toLowerCase().includes(supplyMatSearch.toLowerCase()) ||
                              m.category.toLowerCase().includes(supplyMatSearch.toLowerCase())
                          )
                          .map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.category})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        type="number"
                        min="1"
                        value={supplyQty}
                        onChange={(e) => setSupplyQty(e.target.value)}
                        placeholder="Qty"
                        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      <input
                        type="number"
                        min="0"
                        value={supplyTotalCost}
                        onChange={(e) => setSupplyTotalCost(e.target.value)}
                        placeholder="Total Gold (g)"
                        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      <select
                        value={supplyStatus}
                        onChange={(e) => setSupplyStatus(e.target.value)}
                        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      >
                        <option value="pending">Pending Delivery</option>
                        <option value="delivered">Delivered (+Add Stock)</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                      >
                        Add Entry
                      </button>
                    </div>
                  </form>
                )}

                {(() => {
                  const filteredSupplies = supplyRecords.filter((r) => {
                    if (supplyFilter !== 'all' && r.status !== supplyFilter) return false;
                    if (!supplyLedgerSearch.trim()) return true;
                    const q = supplyLedgerSearch.toLowerCase();
                    return (
                      (r.supplierName || '').toLowerCase().includes(q) ||
                      (r.materialName || '').toLowerCase().includes(q)
                    );
                  });
                  return filteredSupplies.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-6 text-center">
                      No material delivery records in this view.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                      {filteredSupplies.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-100">
                                {rec.qty}x {rec.materialName}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  rec.status === 'delivered'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {rec.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              Supplier: <strong className="text-zinc-200">{rec.supplierName}</strong>{' '}
                              • {rec.date} • {rec.totalCost}g
                            </div>
                          </div>

                          {canManageOrders && (
                            <div className="flex items-center gap-1.5">
                              {rec.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkSupplyDelivered(rec)}
                                  className="px-2.5 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-semibold cursor-pointer"
                                >
                                  Mark Delivered
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  setSupplyRecords((prev) => prev.filter((r) => r.id !== rec.id))
                                }
                                className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: FORGE STOCK & ORE ==================== */}
          {activeWorkerTab === 'stock' && (() => {
            const points = (() => {
              const list = materialTrendHistory.map((snap) => ({
                date: snap.date,
                value:
                  selectedTrendMatId === 'ALL'
                    ? snap.totalUnits
                    : Number(snap.byMaterial?.[selectedTrendMatId]) || 0
              }));
              const todayStr = getLocalDateString(0);
              const liveVal =
                selectedTrendMatId === 'ALL'
                  ? resolvedMaterials.reduce((s, m) => s + (Number(m.stock) || 0), 0)
                  : Number(
                      resolvedMaterials.find((m) => m.id === selectedTrendMatId)?.stock
                    ) || 0;
              if (list.length === 0 || list[list.length - 1].date !== todayStr) {
                list.push({ date: todayStr, value: liveVal });
              } else {
                list[list.length - 1] = { date: todayStr, value: liveVal };
              }
              return list;
            })();

            const firstVal = points[0]?.value ?? 0;
            const lastVal = points[points.length - 1]?.value ?? 0;
            const diff = lastVal - firstVal;

            return (
              <div className="space-y-4">
                {/* Top Row: Resource Stock Trend Graph (7 cols) + Quick Vault Controls (5 cols) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                  {/* Resource Stock Trend Graph */}
                  <div className="xl:col-span-7 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-serif font-bold text-zinc-100">
                            Resource Stock Trend
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              diff < 0
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : diff > 0
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {diff < 0
                              ? `Down (${diff})`
                              : diff > 0
                              ? `Up (+${diff})`
                              : 'Steady'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Tracks vault ores, ingots, and fuel reserves over time.
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={selectedTrendMatId}
                          onChange={(e) => setSelectedTrendMatId(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                        >
                          <option value="ALL">All Vault Resources</option>
                          {resolvedMaterials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.stock})
                            </option>
                          ))}
                        </select>
                        {canEditStock && (
                          <button
                            type="button"
                            onClick={() => {
                              recordStockSnapshot(materials);
                              showToast('Logged today’s resource snapshot!');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
                          >
                            Snapshot
                          </button>
                        )}
                      </div>
                    </div>

                    {(() => {
                      const maxVal = Math.max(10, ...points.map((p) => p.value));
                      const w = 640;
                      const h = 120;
                      const padX = 28;
                      const padY = 20;
                      const coords = points.map((p, idx) => {
                        const x =
                          points.length === 1
                            ? w / 2
                            : padX + (idx / (points.length - 1)) * (w - padX * 2);
                        const y = h - padY - (p.value / maxVal) * (h - padY * 2);
                        return { ...p, x, y };
                      });
                      const polyPoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
                      const strokeColor = diff < 0 ? '#f87171' : '#fbbf24';

                      return (
                        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-2.5">
                          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28 overflow-visible">
                            {coords.length > 1 && (
                              <polyline
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={polyPoints}
                              />
                            )}
                            {coords.map((pt) => (
                              <g key={pt.date}>
                                <circle cx={pt.x} cy={pt.y} r="4.5" fill={strokeColor} />
                                <text
                                  x={pt.x}
                                  y={pt.y - 8}
                                  textAnchor="middle"
                                  fill="#e4e4e7"
                                  fontSize="10"
                                  fontWeight="bold"
                                >
                                  {pt.value}
                                </text>
                                <text
                                  x={pt.x}
                                  y={h - 3}
                                  textAnchor="middle"
                                  fill="#71717a"
                                  fontSize="9"
                                >
                                  {pt.date.slice(5)}
                                </text>
                              </g>
                            ))}
                          </svg>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Quick Add Material & Category Panel */}
                  <div className="xl:col-span-5 bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-serif font-bold text-amber-200">
                          Vault Tools &amp; Quick Add
                        </h3>
                        <p className="text-[11px] text-zinc-400">
                          Sync smelted ingot prices or add new ores &amp; categories.
                        </p>
                      </div>
                      {canEditStock && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleManualRecalculateIngots}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Recalculate Ingots</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSmeltModal(true)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer"
                          >
                            Smelt Recipes
                          </button>
                        </div>
                      )}
                    </div>

                    {canEditStock ? (
                      <div className="space-y-2.5">
                        <form onSubmit={handleAddMaterial} className="grid grid-cols-12 gap-2">
                          <input
                            type="text"
                            value={newMatName}
                            onChange={(e) => setNewMatName(e.target.value)}
                            placeholder="New material name..."
                            className="col-span-5 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          />
                          <select
                            value={newMatCategory}
                            onChange={(e) => setNewMatCategory(e.target.value)}
                            className="col-span-4 px-2 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          >
                            {materialCategories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            value={newMatPrice}
                            onChange={(e) => setNewMatPrice(e.target.value)}
                            placeholder="Buy (g)"
                            className="col-span-3 px-2 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="col-span-12 py-1.5 px-3 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                          >
                            + Add Material to Vault
                          </button>
                        </form>

                        <form onSubmit={handleAddResourceCategory} className="flex gap-2">
                          <input
                            type="text"
                            value={newResourceCatInput}
                            onChange={(e) => setNewResourceCatInput(e.target.value)}
                            placeholder="New resource group (e.g. Gems)..."
                            className="flex-1 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
                          >
                            + Group
                          </button>
                        </form>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500">
                        Vault editing is restricted to Smiths &amp; Admins.
                      </p>
                    )}
                  </div>
                </div>

                {/* Sub-Tab Toggle & Filter Bar */}
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

                    <div className="relative w-full sm:w-72">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={stockSubTab === 'materials' ? materialSearch : finishedStockSearch}
                        onChange={(e) =>
                          stockSubTab === 'materials'
                            ? setMaterialSearch(e.target.value)
                            : setFinishedStockSearch(e.target.value)
                        }
                        placeholder={
                          stockSubTab === 'materials'
                            ? 'Filter ores, ingots, fuel...'
                            : 'Filter finished wares...'
                        }
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                    </div>
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
                              <span className="text-[11px] text-zinc-500">
                                {itemsInCat.length} types
                              </span>
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
                                      {/* Buy Price / Smelt Cost */}
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

                                      {/* Stock Counter */}
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
                                          onChange={(e) =>
                                            setMaterialStockDirect(mat.id, e.target.value)
                                          }
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

                                      {/* Delete Material */}
                                      {canEditStock && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteMaterial(mat.id)}
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
                    /* 2-Column Finished Wares Stock */
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
                              <div className="text-xs font-bold text-zinc-100 truncate">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-zinc-500">
                                {item.category} {item.subCategory ? `• ${item.subCategory}` : ''} •
                                Sell: {item.sellPrice}g
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {canEditStock && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCatalogItems((prev) =>
                                      prev.map((c) =>
                                        c.id === item.id
                                          ? { ...c, stock: Math.max(0, (Number(c.stock) || 0) - 1) }
                                          : c
                                      )
                                    )
                                  }
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
                                  onClick={() =>
                                    setCatalogItems((prev) =>
                                      prev.map((c) =>
                                        c.id === item.id
                                          ? { ...c, stock: (Number(c.stock) || 0) + 1 }
                                          : c
                                      )
                                    )
                                  }
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
              </div>
            );
          })()}

          {/* ==================== TAB 4: RECIPES & MARGIN ==================== */}
          {activeWorkerTab === 'pricing' && (
            <div className="space-y-4">
              {/* Global Profit Margin & Customer Buy-Back Controls */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-zinc-200">Forge Profit Margin (%)</span>
                    <span className="font-bold text-amber-300">{profitMarginPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    disabled={!canEditRecipes}
                    value={profitMarginPct}
                    onChange={(e) => setProfitMarginPct(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-zinc-200">
                      Customer Buy-Back Rate (% of Cost)
                    </span>
                    <span className="font-bold text-emerald-300">{buyBackRatePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    disabled={!canEditRecipes}
                    value={buyBackRatePct}
                    onChange={(e) => setBuyBackRatePct(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSmeltModal(true)}
                    className="px-4 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 cursor-pointer"
                  >
                    Smelting Recipes Quick-Editor
                  </button>
                </div>
              </div>

              {/* Category & Sub-Tier Filter + 2-Column Recipe Grid */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['All', ...categories].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setRecipeBoardCatFilter(cat);
                          setRecipeBoardSubFilter('All');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          recipeBoardCatFilter === cat
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={recipeBoardSearch}
                      onChange={(e) => setRecipeBoardSearch(e.target.value)}
                      placeholder="Filter recipes..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Sub-Tiers Bar with Add & Remove */}
                {recipeBoardCatFilter !== 'All' && (
                  <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase text-zinc-500 mr-1">
                        {recipeBoardCatFilter} Tiers:
                      </span>
                      <button
                        type="button"
                        onClick={() => setRecipeBoardSubFilter('All')}
                        className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                          recipeBoardSubFilter === 'All'
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                            : 'bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        All
                      </button>
                      {(subCategories[recipeBoardCatFilter] || []).map((tier) => (
                        <span
                          key={tier}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                            recipeBoardSubFilter === tier
                              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setRecipeBoardSubFilter(tier)}
                            className="cursor-pointer"
                          >
                            {tier}
                          </button>
                          {canEditRecipes && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSubTierInline(recipeBoardCatFilter, tier)}
                              title={`Remove ${tier} tier`}
                              className="text-zinc-500 hover:text-red-400 ml-0.5 cursor-pointer"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    {canEditRecipes && (
                      <form onSubmit={handleAddSubTierInline} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={inlineNewSubCat}
                          onChange={(e) => setInlineNewSubCat(e.target.value)}
                          placeholder="New tier..."
                          className="w-28 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                        >
                          + Tier
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 2-Column Catalog Items & Recipes Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
                  {enrichedCatalog
                    .filter((item) => {
                      if (
                        recipeBoardCatFilter !== 'All' &&
                        item.category !== recipeBoardCatFilter
                      ) {
                        return false;
                      }
                      if (
                        recipeBoardSubFilter !== 'All' &&
                        (item.subCategory || '') !== recipeBoardSubFilter
                      ) {
                        return false;
                      }
                      if (
                        recipeBoardSearch.trim() &&
                        !item.name.toLowerCase().includes(recipeBoardSearch.toLowerCase())
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-lg bg-zinc-950/75 border border-zinc-800/90 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-serif font-bold text-zinc-100">
                              {item.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400">
                              {item.category}
                            </span>
                            {canEditRecipes ? (
                              <select
                                value={item.subCategory || ''}
                                onChange={(e) =>
                                  handleQuickChangeItemSubCategory(item.id, e.target.value)
                                }
                                title="Change armor/item type"
                                className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/35 text-[10px] font-semibold text-amber-300 focus:outline-none cursor-pointer"
                              >
                                <option value="" className="bg-zinc-950 text-zinc-300">
                                  No Type
                                </option>
                                {Array.from(
                                  new Set([
                                    ...(subCategories[item.category] || []),
                                    ...(item.subCategory ? [item.subCategory] : [])
                                  ])
                                ).map((t) => (
                                  <option key={t} value={t} className="bg-zinc-950 text-amber-200">
                                    {t}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              item.subCategory && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-[10px] text-amber-300">
                                  {item.subCategory}
                                </span>
                              )
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate">
                            {(item.recipe || []).length > 0
                              ? item.recipe
                                  .map(
                                    (r) =>
                                      `${r.qty}x ${materialMap[r.materialId]?.name || r.materialId}`
                                  )
                                  .join(' + ')
                              : 'No smelting/forging recipe assigned'}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 ml-auto text-xs">
                          <div>
                            <span className="text-zinc-500">Cost: </span>
                            <strong className="text-zinc-200">{item.materialCost}g</strong>
                          </div>
                          <div>
                            <span className="text-zinc-500">Buy: </span>
                            <strong className="text-emerald-300">
                              {item.buyFromCustomerPrice}g
                            </strong>
                          </div>
                          <div>
                            <span className="text-zinc-500">Sell: </span>
                            <strong className="text-amber-300">{item.sellPrice}g</strong>
                          </div>

                          {canEditRecipes && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingItem({ ...item })}
                                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3 text-amber-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCatalogItems((prev) => prev.filter((c) => c.id !== item.id))
                                }
                                className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Add New Craftable Ware Form */}
              {canEditRecipes && (
                <form
                  onSubmit={handleCreateCatalogItem}
                  className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-4 space-y-3"
                >
                  <h3 className="text-sm font-serif font-bold text-amber-200">
                    Forge New Catalog Item &amp; Recipe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Item name (e.g. Daedric Bow)"
                      className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    />
                    <select
                      value={newItemCat}
                      onChange={(e) => {
                        const c = e.target.value;
                        setNewItemCat(c);
                        setNewItemSubCat((subCategories[c] || [])[0] || '');
                      }}
                      className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newItemSubCat}
                      onChange={(e) => setNewItemSubCat(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    >
                      <option value="">-- No Tier --</option>
                      {(subCategories[newItemCat] || []).map((t) => (
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
                      className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    />
                  </div>

                  {/* Recipe Builder */}
                  <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={newItemMatSearch}
                          onChange={(e) => setNewItemMatSearch(e.target.value)}
                          placeholder="Search materials..."
                          className="w-40 pl-8 pr-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                        />
                      </div>
                      <select
                        value={newItemMatId}
                        onChange={(e) => setNewItemMatId(e.target.value)}
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      >
                        {resolvedMaterials
                          .filter(
                            (m) =>
                              !newItemMatSearch.trim() ||
                              m.name.toLowerCase().includes(newItemMatSearch.toLowerCase()) ||
                              m.category.toLowerCase().includes(newItemMatSearch.toLowerCase())
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
                        value={newItemMatQty}
                        onChange={(e) => setNewItemMatQty(e.target.value)}
                        className="w-20 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddRecipeIngredientToNew}
                        className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
                      >
                        + Add Ingredient
                      </button>
                    </div>

                    {newItemRecipe.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newItemRecipe.map((r) => (
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
                                setNewItemRecipe((prev) =>
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

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                  >
                    Create Catalog Item
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ==================== TAB 5: SMITH PROFILES & ADMIN UNLOCK ==================== */}
          {activeWorkerTab === 'profiles' && (
            <div className="space-y-6">
              {/* Your Profile Online / Offline Status Card */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      profileOnlineStatus
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                        : 'bg-zinc-600'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-serif font-bold text-zinc-100">
                        {activeUserRecord?.displayName || workerProfile.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          profileOnlineStatus
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {profileOnlineStatus ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Control whether your profile appears as active/online to others in the Skyforge.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleMyOnlineStatus}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    profileOnlineStatus
                      ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/50 text-emerald-200'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                >
                  {profileOnlineStatus ? 'Status: Online (Switch to Offline)' : 'Status: Offline (Switch to Online)'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Master Admin Controls */}
                <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-serif font-bold text-amber-200">
                        Master Admin Controls
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Unlock the Master Admin Sidebar to manage User Accounts, Backups, CSV Spreadsheets, and Clean Resets.
                      </p>
                    </div>
                    {effectiveAdminUnlocked ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  {!effectiveAdminUnlocked ? (
                    <form onSubmit={handleUnlockAdmin} className="space-y-3">
                      <input
                        type="password"
                        value={adminPasscodeInput}
                        onChange={(e) => setAdminPasscodeInput(e.target.value)}
                        placeholder="Enter Master Admin Passcode..."
                        className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      {adminError && <p className="text-xs text-red-400">{adminError}</p>}
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                      >
                        Unlock Master Admin
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 rounded-lg bg-zinc-950/80 border border-amber-500/30 space-y-3">
                      <p className="text-xs text-zinc-300">
                        Master Admin privileges are active. Manage user accounts &amp; role permissions below or open the Admin Sidebar Menu.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setShowUsersModal(true)}
                          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                        >
                          Manage User Accounts ({managedUsers.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAdminSidebar(true)}
                          className="px-4 py-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-500/50 text-xs font-bold text-amber-200 cursor-pointer"
                        >
                          Open Admin Sidebar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guild Smith Roster */}
                <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-serif font-bold text-zinc-100">
                        Skyforge Smith Roster
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Track active smiths working the Whiterun forge.
                      </p>
                    </div>
                    {smithProfiles.length > 0 && (
                      <div className="relative w-full sm:w-44">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={smithRosterSearch}
                          onChange={(e) => setSmithRosterSearch(e.target.value)}
                          placeholder="Search roster..."
                          className="w-full pl-8 pr-3 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {canEditStock && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newSmithName.trim()) return;
                        setSmithProfiles((prev) => [
                          ...prev,
                          {
                            id: `prof_${Date.now()}`,
                            name: newSmithName.trim(),
                            title: newSmithTitle.trim() || 'Skyforge Smith',
                            roleType: newSmithRole
                          }
                        ]);
                        setNewSmithName('');
                        showToast('Added smith profile to roster.');
                      }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                    >
                      <input
                        type="text"
                        value={newSmithName}
                        onChange={(e) => setNewSmithName(e.target.value)}
                        placeholder="Smith name"
                        className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newSmithTitle}
                        onChange={(e) => setNewSmithTitle(e.target.value)}
                        placeholder="Rank / Title"
                        className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                      >
                        Add Smith
                      </button>
                    </form>
                  )}

                  {smithProfiles.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4 text-center">
                      No smith profiles added yet.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {smithProfiles
                        .filter(
                          (prof) =>
                            !smithRosterSearch.trim() ||
                            prof.name.toLowerCase().includes(smithRosterSearch.toLowerCase()) ||
                            (prof.title || '').toLowerCase().includes(smithRosterSearch.toLowerCase())
                        )
                        .map((prof) => {
                          const isProfOnline = prof.isOnline !== false;
                          return (
                            <div
                              key={prof.id}
                              className="p-3 rounded-lg bg-zinc-950/75 border border-zinc-800 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isProfOnline ? 'bg-emerald-400' : 'bg-zinc-600'
                                  }`}
                                />
                                <div>
                                  <div className="font-bold text-zinc-100">{prof.name}</div>
                                  <div className="text-[11px] text-zinc-500">{prof.title}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {canEditStock ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSmithProfiles((prev) =>
                                        prev.map((p) =>
                                          p.id === prof.id
                                            ? { ...p, isOnline: p.isOnline === false ? true : false }
                                            : p
                                        )
                                      )
                                    }
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                                      isProfOnline
                                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                        : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                                    }`}
                                  >
                                    {isProfOnline ? 'Online' : 'Offline'}
                                  </button>
                                ) : (
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      isProfOnline ? 'text-emerald-400' : 'text-zinc-500'
                                    }`}
                                  >
                                    {isProfOnline ? 'Online' : 'Offline'}
                                  </span>
                                )}
                                {canEditStock && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSmithProfiles((prev) => prev.filter((p) => p.id !== prof.id))
                                    }
                                    className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 text-zinc-400 hover:text-red-300 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>

              {/* ADMIN-ONLY USER ACCOUNTS & PERMISSIONS MANAGER */}
              {effectiveAdminUnlocked && (
                <div className="bg-[#18181b] border border-amber-500/30 rounded-lg p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-serif font-bold text-amber-200">
                        User Accounts &amp; Role Permissions (Admin Only)
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Create login accounts with a Name, Username, Password, and Role (Guest, Smith, Harbinger, or Admin), and customize each member&apos;s permissions anytime.
                      </p>
                    </div>
                    {managedUsers.length > 0 && (
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={managedUsersSearch}
                          onChange={(e) => setManagedUsersSearch(e.target.value)}
                          placeholder="Search users or roles..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Create New User Form */}
                  <form
                    onSubmit={handleCreateManagedUser}
                    className="p-4 rounded-lg bg-zinc-950/85 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
                  >
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Display Name</label>
                      <input
                        type="text"
                        value={newUserDisplayName}
                        onChange={(e) => setNewUserDisplayName(e.target.value)}
                        placeholder="e.g. Kodlak Whitemane"
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Username</label>
                      <input
                        type="text"
                        value={newUserUsername}
                        onChange={(e) => setNewUserUsername(e.target.value)}
                        placeholder="e.g. kodlak"
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Password</label>
                      <input
                        type="text"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Set password..."
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Guild Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      >
                        <option value="guest">Guest (View Only)</option>
                        <option value="smith">Smith</option>
                        <option value="harbinger">Harbinger</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                    >
                      + Create User
                    </button>
                  </form>

                  {/* Managed Users List & Permission Toggles */}
                  {managedUsers.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4 text-center">
                      No custom user accounts created yet. Add one above so members can sign in with their own profile!
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
                      {managedUsers
                        .filter((usr) => {
                          if (!managedUsersSearch.trim()) return true;
                          const q = managedUsersSearch.toLowerCase();
                          return (
                            (usr.displayName || '').toLowerCase().includes(q) ||
                            (usr.username || '').toLowerCase().includes(q) ||
                            (usr.role || '').toLowerCase().includes(q)
                          );
                        })
                        .map((usr) => {
                          const perms =
                            usr.permissions || ROLE_PRESETS[usr.role]?.permissions || {};
                          const isLiveSession = presenceStats.onlineProfileSessions.some(
                            (s) => s.userId === usr.id
                          );
                          const isShownOnline =
                            usr.isOnline !== false && (isLiveSession || usr.isOnline === true);
                          return (
                            <div
                              key={usr.id}
                              className="p-4 rounded-lg bg-zinc-950/75 border border-zinc-800 space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      isShownOnline ? 'bg-emerald-400' : 'bg-zinc-600'
                                    }`}
                                  />
                                  <span className="text-sm font-bold text-zinc-100">
                                    {usr.displayName}
                                  </span>
                                  <span className="text-xs text-amber-300 font-mono">
                                    @{usr.username}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleManagedUserOnline(usr.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                                      isShownOnline
                                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                        : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                                    }`}
                                  >
                                    {isShownOnline ? 'Online' : 'Offline'}
                                  </button>
                                  <span className="text-[11px] text-zinc-500">
                                    • Pass: <code className="text-zinc-300">{usr.password}</code>
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <label className="text-[11px] text-zinc-400">Role:</label>
                                  <select
                                    value={usr.role}
                                    onChange={(e) => handleUpdateUserRole(usr.id, e.target.value)}
                                    className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-semibold text-amber-200 focus:outline-none"
                                  >
                                    <option value="guest">Guest</option>
                                    <option value="smith">Smith</option>
                                    <option value="harbinger">Harbinger</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteManagedUser(usr.id)}
                                    title="Delete User Account"
                                    className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Granular Permission Checkboxes */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-zinc-800/80">
                                {PERMISSION_LABELS.map((perm) => (
                                  <label
                                    key={perm.key}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[11px] cursor-pointer transition-colors ${
                                      perms[perm.key]
                                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                                        : 'bg-zinc-900/70 border-zinc-800 text-zinc-500'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={Boolean(perms[perm.key])}
                                      onChange={() => handleToggleUserPermission(usr.id, perm.key)}
                                      className="accent-amber-500"
                                    />
                                    <span className="truncate">{perm.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== MASTER ADMIN SIDEBAR DRAWER ==================== */}
      {showAdminSidebar && effectiveAdminUnlocked && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#141417] border-l border-zinc-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <WuuthradBannerIcon className="w-7 h-7" />
                  <div>
                    <h3 className="text-sm font-serif font-bold text-amber-200">
                      Master Admin Sidebar
                    </h3>
                    <p className="text-[11px] text-zinc-500">Keeper of the Skyforge</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdminSidebar(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Manage Users & Permissions */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Guild Users &amp; Permissions
                </h4>
                <p className="text-xs text-zinc-500">
                  Add users with their own login and assign Guest, Smith, Harbinger, or Admin roles &amp; permissions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminSidebar(false);
                    setShowUsersModal(true);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Manage Users &amp; Roles ({managedUsers.length})</span>
                </button>
              </div>

              {/* Full Backup & Restore */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Full Forge Backup &amp; Restore
                </h4>
                <p className="text-xs text-zinc-500">
                  Save all prices, recipes, stock, orders, deliveries, user accounts, and trend history to a single .json file.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadFullBackupJson}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Save Full Backup (.json)</span>
                </button>

                <input
                  ref={backupFileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFullBackupJson}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => backupFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Restore from Backup (.json)</span>
                </button>
              </div>

              {/* Spreadsheet Export */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Ledger Spreadsheet
                </h4>
                <button
                  type="button"
                  onClick={() => setShowExportModal(true)}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export Spreadsheet (.csv)</span>
                </button>
              </div>

              {/* Clean Slate Reset */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Danger Zone
                </h4>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-red-500/40 text-red-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Forge to Clean Slate</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAdminSidebar(false)}
              className="w-full py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              Close Sidebar
            </button>
          </div>
        </div>
      )}

      {/* ==================== MANAGE USERS & PERMISSIONS MODAL (ADMIN ONLY) ==================== */}
      {showUsersModal && effectiveAdminUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-4xl w-full max-h-[88vh] flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-amber-200">
                  Manage Users, Roles &amp; Permissions
                </h3>
                <p className="text-xs text-zinc-400">
                  Add guild members with a Name, Username, and Password, then assign Guest, Smith, Harbinger, or Admin permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUsersModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              <form
                onSubmit={handleCreateManagedUser}
                className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
              >
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={newUserDisplayName}
                    onChange={(e) => setNewUserDisplayName(e.target.value)}
                    placeholder="e.g. Aela the Huntress"
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    placeholder="e.g. aela"
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Password</label>
                  <input
                    type="text"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Set password..."
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  >
                    <option value="guest">Guest (View Only)</option>
                    <option value="smith">Smith</option>
                    <option value="harbinger">Harbinger</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                >
                  + Add User
                </button>
              </form>

              {managedUsers.length === 0 ? (
                <p className="text-xs text-zinc-500 py-8 text-center">
                  No user accounts added yet. Create one above!
                </p>
              ) : (
                <div className="space-y-3">
                  {managedUsers.map((usr) => {
                    const perms = usr.permissions || ROLE_PRESETS[usr.role]?.permissions || {};
                    return (
                      <div
                        key={usr.id}
                        className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-zinc-100">
                                {usr.displayName}
                              </span>
                              <span className="text-xs text-amber-300 font-mono">
                                @{usr.username}
                              </span>
                              <span className="text-[11px] text-zinc-500">
                                • Password: <code className="text-zinc-300">{usr.password}</code>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-zinc-400">Role:</span>
                            <select
                              value={usr.role}
                              onChange={(e) => handleUpdateUserRole(usr.id, e.target.value)}
                              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-semibold text-amber-200 focus:outline-none"
                            >
                              <option value="guest">Guest</option>
                              <option value="smith">Smith</option>
                              <option value="harbinger">Harbinger</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleDeleteManagedUser(usr.id)}
                              title="Remove User"
                              className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80">
                          {PERMISSION_LABELS.map((perm) => (
                            <label
                              key={perm.key}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[11px] cursor-pointer ${
                                perms[perm.key]
                                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                                  : 'bg-zinc-900/70 border-zinc-800 text-zinc-500'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(perms[perm.key])}
                                onChange={() => handleToggleUserPermission(usr.id, perm.key)}
                                className="accent-amber-500"
                              />
                              <span>{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SMELTING RECIPES QUICK-EDITOR MODAL ==================== */}
      {showSmeltModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-serif font-bold text-amber-200">
                  Ingot Smelting Formulas
                </h3>
                <p className="text-xs text-zinc-400">
                  Adjust ores and fuel ratios used to auto-calculate ingot costs.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-44 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={smeltModalSearch}
                    onChange={(e) => setSmeltModalSearch(e.target.value)}
                    placeholder="Search ingots or ores..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowSmeltModal(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              {catalogItems
                .filter((item) => {
                  if (item.category !== 'Ingots & Materials') return false;
                  if (!smeltModalSearch.trim()) return true;
                  const q = smeltModalSearch.toLowerCase();
                  const matchesName = item.name.toLowerCase().includes(q);
                  const matchesIng = (item.recipe || []).some((r) =>
                    (materialMap[r.materialId]?.name || r.materialId).toLowerCase().includes(q)
                  );
                  return matchesName || matchesIng;
                })
                .map((ingotItem) => {
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
                                setCatalogItems((prev) =>
                                  prev.map((c) =>
                                    c.id === ingotItem.id
                                      ? {
                                          ...c,
                                          recipe: c.recipe.map((r) =>
                                            r.materialId === req.materialId ? { ...r, qty: q } : r
                                          )
                                        }
                                      : c
                                  )
                                );
                              }}
                              className="w-10 bg-zinc-950 border border-zinc-800 rounded px-1 text-center text-zinc-100"
                            />
                            <span className="text-zinc-200">
                              {materialMap[req.materialId]?.name || req.materialId}
                            </span>
                            {canEditRecipes && (
                              <button
                                type="button"
                                onClick={() =>
                                  setCatalogItems((prev) =>
                                    prev.map((c) =>
                                      c.id === ingotItem.id
                                        ? {
                                            ...c,
                                            recipe: c.recipe.filter(
                                              (r) => r.materialId !== req.materialId
                                            )
                                          }
                                        : c
                                    )
                                  )
                                }
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
                              setCatalogItems((prev) =>
                                prev.map((c) => {
                                  if (c.id !== ingotItem.id) return c;
                                  const exists = (c.recipe || []).some(
                                    (r) => r.materialId === matId
                                  );
                                  if (exists) return c;
                                  return {
                                    ...c,
                                    recipe: [...(c.recipe || []), { materialId: matId, qty: 1 }]
                                  };
                                })
                              );
                            }}
                            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-amber-300 focus:outline-none"
                          >
                            <option value="">+ Add ore / fuel...</option>
                            {resolvedMaterials.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== RECIPE & ITEM EDITOR MODAL ==================== */}
      {editingItem && canEditRecipes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-serif font-bold text-amber-200">
                Edit {editingItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded bg-zinc-900 text-zinc-400 cursor-pointer"
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
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => {
                      const nextCat = e.target.value;
                      const availableTiers = subCategories[nextCat] || [];
                      setEditingItem({
                        ...editingItem,
                        category: nextCat,
                        subCategory: availableTiers.includes(editingItem.subCategory)
                          ? editingItem.subCategory
                          : ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">
                    {editingItem.category === 'Armor' ? 'Armor Type / Tier' : 'Sub-Type / Tier'}
                  </label>
                  <select
                    value={
                      (subCategories[editingItem.category] || []).includes(
                        editingItem.subCategory || ''
                      ) || !editingItem.subCategory
                        ? editingItem.subCategory || ''
                        : '__custom__'
                    }
                    onChange={(e) => {
                      if (e.target.value !== '__custom__') {
                        setEditingItem({ ...editingItem, subCategory: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
                  >
                    <option value="">-- None --</option>
                    {(subCategories[editingItem.category] || []).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    {editingItem.subCategory &&
                      !(subCategories[editingItem.category] || []).includes(
                        editingItem.subCategory
                      ) && (
                        <option value="__custom__">{editingItem.subCategory} (Custom)</option>
                      )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">
                  Custom {editingItem.category === 'Armor' ? 'Armor' : 'Item'} Type (Optional)
                </label>
                <input
                  type="text"
                  value={editingItem.subCategory || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, subCategory: e.target.value })
                  }
                  placeholder={
                    editingItem.category === 'Armor'
                      ? 'e.g. Heavy Plate, Light Leather, Daedric...'
                      : 'Enter custom type or material tier...'
                  }
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
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
                    value={editingItem.customPrice}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, customPrice: Number(e.target.value) || 0 })
                    }
                    className="w-24 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-right text-amber-300 font-bold"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setCatalogItems((prev) =>
                    prev.map((c) => (c.id === editingItem.id ? editingItem : c))
                  );
                  setEditingItem(null);
                  showToast('Saved item changes.');
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT SALE MODAL ==================== */}
      {editingSale && canLogSalesPurchases && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSaveEditedSale}
            className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-serif font-bold text-amber-200">Edit Sale Entry</h3>
              <button
                type="button"
                onClick={() => setEditingSale(null)}
                className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Item Sold</label>
                <input
                  type="text"
                  value={editingSale.itemName}
                  onChange={(e) => setEditingSale({ ...editingSale, itemName: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-zinc-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={editingSale.qty}
                    onChange={(e) => setEditingSale({ ...editingSale, qty: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Unit Sell (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingSale.unitSell}
                    onChange={(e) => setEditingSale({ ...editingSale, unitSell: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-amber-300 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Unit Cost (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingSale.unitCost}
                    onChange={(e) => setEditingSale({ ...editingSale, unitCost: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-zinc-400 mb-1">Buyer Name</label>
                  <input
                    type="text"
                    value={editingSale.customer}
                    onChange={(e) => setEditingSale({ ...editingSale, customer: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingSale.date}
                    onChange={(e) => setEditingSale({ ...editingSale, date: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingSale(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== EDIT PURCHASE MODAL ==================== */}
      {editingPurchase && canLogSalesPurchases && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSaveEditedPurchase}
            className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-serif font-bold text-emerald-300">
                Edit Purchase Entry
              </h3>
              <button
                type="button"
                onClick={() => setEditingPurchase(null)}
                className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Item Purchased</label>
                <input
                  type="text"
                  value={editingPurchase.itemName}
                  onChange={(e) =>
                    setEditingPurchase({ ...editingPurchase, itemName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-zinc-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={editingPurchase.qty}
                    onChange={(e) => setEditingPurchase({ ...editingPurchase, qty: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Unit Cost Paid (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPurchase.unitCost}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, unitCost: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-red-300 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-zinc-400 mb-1">Seller / Supplier</label>
                  <input
                    type="text"
                    value={editingPurchase.supplier}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, supplier: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingPurchase.date}
                    onChange={(e) =>
                      setEditingPurchase({ ...editingPurchase, date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingPurchase(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== EXPORT CSV MODAL (ADMIN ONLY) ==================== */}
      {showExportModal && effectiveAdminUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-serif font-bold text-amber-200">
              Export Forge Spreadsheet (.csv)
            </h3>
            <p className="text-xs text-zinc-400">
              Download a spreadsheet containing all vault material buy prices, stock counts, We Buy offers, and public sell prices.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExportSpreadsheetCsv}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RESET CONFIRMATION MODAL (ADMIN ONLY) ==================== */}
      {showResetModal && effectiveAdminUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-red-500/40 rounded-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold">Reset Forge to Clean Slate?</h3>
            </div>
            <p className="text-xs text-zinc-300">
              This will clear all prices, stock counts, sales, purchases, orders, deliveries, and trend history back to zero. Make sure you have saved a .json backup first if you want to keep your records.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCleanReset}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
              >
                Confirm Clean Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RECORD A SALE MODAL ==================== */}
      {showRecordSaleModal && canLogSalesPurchases && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-amber-200">Record a Sale</h3>
                <p className="text-xs text-zinc-400">
                  Add one or multiple catalog/custom items to this sale before logging.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRecordSaleModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordSale} className="p-5 overflow-y-auto space-y-4">
              {/* Queued Sale Items List */}
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
                          <span className="font-bold text-amber-300">
                            +{line.unitSell * line.qty}g
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSaleCartItems((prev) =>
                                prev.filter((x) => x.lineId !== line.lineId)
                              )
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

              {/* Mode Switcher: Existing Recipe vs New Custom Item */}
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

                  <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deductStockOnSale}
                      onChange={(e) => setDeductStockOnSale(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>Deduct from finished stock</span>
                  </label>
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

                  {/* Materials Used Builder */}
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

                  {/* Live Forge Calculation Summary */}
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
                        className="w-full mt-0.5 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-700 text-xs font-bold text-amber-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-emerald-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveCustomSaleToRecipes}
                      onChange={(e) => setSaveCustomSaleToRecipes(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>Save this new item &amp; recipe to catalog for future use</span>
                  </label>
                </div>
              )}

              {/* Quantity + Add Item to Sale Cart Button + Buyer */}
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
                    onClick={handleAddSaleLineToCart}
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
                  onClick={() => setShowRecordSaleModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                >
                  {saleCartItems.length > 0
                    ? `Log Sale (${
                        saleCartItems.length + (buildCurrentSaleLineItem() ? 1 : 0)
                      } Items)`
                    : 'Log Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== RECORD A PURCHASE MODAL ==================== */}
      {showRecordPurchaseModal && canLogSalesPurchases && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-emerald-300">
                  Record a Purchase
                </h3>
                <p className="text-xs text-zinc-400">
                  Add one or multiple ores, materials, or wares to this purchase before logging.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRecordPurchaseModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPurchase} className="p-5 overflow-y-auto space-y-4">
              {/* Queued Purchase Items List */}
              {purchaseCartItems.length > 0 && (
                <div className="p-3.5 rounded-lg bg-emerald-950/25 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-emerald-200">
                      Items in This Purchase ({purchaseCartItems.length})
                    </span>
                    <span className="font-bold text-red-300">
                      Total:{' '}
                      {purchaseCartItems
                        .reduce((sum, l) => sum + l.unitCost * l.qty, 0)
                        .toLocaleString()}
                      g
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {purchaseCartItems.map((line) => (
                      <div
                        key={line.lineId}
                        className="px-2.5 py-1.5 rounded bg-zinc-950/90 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-zinc-100">
                            {line.qty}x {line.itemName}
                          </span>
                          <span className="text-[11px] text-zinc-500 ml-2">
                            ({line.displayKind} • {line.unitCost}g each)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-red-300">
                            -{line.unitCost * line.qty}g
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setPurchaseCartItems((prev) =>
                                prev.filter((x) => x.lineId !== line.lineId)
                              )
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
                  onClick={() => setPurchaseTargetType('existing')}
                  className={`py-1.5 rounded font-semibold cursor-pointer ${
                    purchaseTargetType === 'existing'
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Existing Resource / Ware
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseTargetType('new')}
                  className={`py-1.5 rounded font-semibold cursor-pointer ${
                    purchaseTargetType === 'new'
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  + Brand New Item
                </button>
              </div>

              {purchaseTargetType === 'existing' ? (
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Search &amp; Select Resource or Ware
                  </label>
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={purchaseExistingSearch}
                      onChange={(e) => setPurchaseExistingSearch(e.target.value)}
                      placeholder="Type to filter vault resources & wares..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/60"
                    />
                  </div>
                  <select
                    value={purchaseExistingKey}
                    onChange={(e) => setPurchaseExistingKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  >
                    <option value="">-- Choose Item --</option>
                    <optgroup label="Resources & Ores">
                      {resolvedMaterials
                        .filter(
                          (m) =>
                            !purchaseExistingSearch.trim() ||
                            m.name.toLowerCase().includes(purchaseExistingSearch.toLowerCase()) ||
                            m.category.toLowerCase().includes(purchaseExistingSearch.toLowerCase())
                        )
                        .map((m) => (
                          <option key={m.id} value={`mat:${m.id}`}>
                            [Vault] {m.name} (Stock: {m.stock})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Catalog Wares">
                      {enrichedCatalog
                        .filter(
                          (c) =>
                            !purchaseExistingSearch.trim() ||
                            c.name.toLowerCase().includes(purchaseExistingSearch.toLowerCase()) ||
                            c.category.toLowerCase().includes(purchaseExistingSearch.toLowerCase())
                        )
                        .map((c) => (
                          <option key={c.id} value={`cat:${c.id}`}>
                            [{c.category}] {c.name} (Stock: {c.stock})
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">New Item Name</label>
                    <input
                      type="text"
                      value={purchaseNewName}
                      onChange={(e) => setPurchaseNewName(e.target.value)}
                      placeholder="e.g. Flawless Ruby"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Add To</label>
                    <select
                      value={purchaseNewDest}
                      onChange={(e) => setPurchaseNewDest(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    >
                      <option value="catalog">Catalog (Unsorted)</option>
                      <option value="material">Resource Vault</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-3">
                  <label className="block text-xs text-zinc-400 mb-1">Qty Bought</label>
                  <input
                    type="number"
                    min="1"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-xs text-zinc-400 mb-1">Unit Cost Paid (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={purchaseUnitCost}
                    onChange={(e) => setPurchaseUnitCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-5">
                  <button
                    type="button"
                    onClick={handleAddPurchaseLineToCart}
                    className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item to Purchase</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Seller / Supplier</label>
                  <input
                    type="text"
                    value={purchaseSupplier}
                    onChange={(e) => setPurchaseSupplier(e.target.value)}
                    placeholder="e.g. Traveling Merchant"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    checked={updateUnitCostOnPurchase}
                    onChange={(e) => setUpdateUnitCostOnPurchase(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Update unit buy price</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowRecordPurchaseModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
                >
                  {purchaseCartItems.length > 0
                    ? `Log Purchase (${
                        purchaseCartItems.length + (buildCurrentPurchaseLineItem() ? 1 : 0)
                      } Items)`
                    : 'Log Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
