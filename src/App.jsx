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
  const [ledgerActionMode, setLedgerActionMode] = useState('sale'); // 'sale' | 'purchase'
  const [pieMetricMode, setPieMetricMode] = useState('revenue'); // 'revenue' | 'profit'
  const [saleItemId, setSaleItemId] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [saleCustomer, setSaleCustomer] = useState('');
  const [deductStockOnSale, setDeductStockOnSale] = useState(true);

  const [purchaseTargetType, setPurchaseTargetType] = useState('existing'); // 'existing' | 'new'
  const [purchaseExistingKey, setPurchaseExistingKey] = useState('');
  const [purchaseNewName, setPurchaseNewName] = useState('');
  const [purchaseNewDest, setPurchaseNewDest] = useState('catalog'); // 'catalog' | 'material'
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchaseUnitCost, setPurchaseUnitCost] = useState(0);
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  const [updateUnitCostOnPurchase, setUpdateUnitCostOnPurchase] = useState(true);

  // --- ORDERS & DELIVERIES STATE ---
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderItemId, setOrderItemId] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');

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
  const [selectedTrendMatId, setSelectedTrendMatId] = useState('ALL');
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
  const [newItemMatId, setNewItemMatId] = useState('mat_iron_ingot');
  const [newItemMatQty, setNewItemMatQty] = useState(1);
  const [newItemRecipe, setNewItemRecipe] = useState([]);

  // --- PROFILES & USER ACCOUNTS STATE ---
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

  const findSmeltRecipeForMaterial = (mat, catalogList) => {
    const mappedCatId = SMELTED_MAT_TO_CATALOG_ID[mat.id];
    if (mappedCatId) {
      const found = catalogList.find((c) => c.id === mappedCatId);
      if (found && Array.isArray(found.recipe) && found.recipe.length > 0) return found;
    }
    if (mat.category === 'Smelted Ingots') {
      const normalizedMatName = mat.name.toLowerCase().trim();
      const byName = catalogList.find((c) => {
        const cName = c.name.toLowerCase().trim();
        return (
          cName === normalizedMatName ||
          cName.startsWith(normalizedMatName) ||
          normalizedMatName.startsWith(cName)
        );
      });
      if (byName && Array.isArray(byName.recipe) && byName.recipe.length > 0) return byName;
    }
    return null;
  };

  const resolvedMaterials = useMemo(() => {
    return materials.map((mat) => {
      const smeltItem = findSmeltRecipeForMaterial(mat, catalogItems);
      if (!smeltItem) {
        return { ...mat, isAutoSmeltedCost: false };
      }
      const smeltedUnitCost = smeltItem.recipe.reduce((sum, req) => {
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
        const smeltItem = findSmeltRecipeForMaterial(mat, catalogItems);
        if (!smeltItem) return mat;
        const newCost = smeltItem.recipe.reduce((sum, req) => {
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
  const handleRecordSale = (e) => {
    e.preventDefault();
    if (!canLogSalesPurchases) return;
    const item = enrichedCatalog.find((i) => i.id === saleItemId);
    if (!item) {
      showToast('Please select an item to sell.', 'error');
      return;
    }
    const qty = Math.max(1, Number(saleQty) || 1);
    const unitSell = item.sellPrice;
    const unitCost = item.materialCost;
    const totalRevenue = unitSell * qty;
    const netProfit = (unitSell - unitCost) * qty;

    const newSale = {
      id: `sale_${Date.now()}`,
      date: getLocalDateString(0),
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      subCategory: item.subCategory || '',
      qty,
      unitSell,
      unitCost,
      totalRevenue,
      netProfit,
      customer: saleCustomer.trim() || 'Walk-in Traveler'
    };

    setSales((prev) => [newSale, ...prev]);

    if (deductStockOnSale) {
      setCatalogItems((prev) =>
        prev.map((c) =>
          c.id === item.id ? { ...c, stock: Math.max(0, (Number(c.stock) || 0) - qty) } : c
        )
      );
    }

    setSaleQty(1);
    setSaleCustomer('');
    showToast(`Recorded sale of ${qty}x ${item.name} (+${totalRevenue}g)`);
  };

  const handleRecordPurchase = (e) => {
    e.preventDefault();
    if (!canLogSalesPurchases) return;
    const qty = Math.max(1, Number(purchaseQty) || 1);
    const unitCost = Math.max(0, Number(purchaseUnitCost) || 0);
    const totalCost = qty * unitCost;
    const supplier = purchaseSupplier.trim() || 'Traveling Merchant';

    if (purchaseTargetType === 'existing') {
      if (!purchaseExistingKey) {
        showToast('Select an existing resource or catalog item.', 'error');
        return;
      }
      const [kind, targetId] = purchaseExistingKey.split(':');
      if (kind === 'mat') {
        const targetMat = resolvedMaterials.find((m) => m.id === targetId);
        if (!targetMat) return;
        const nextMats = materials.map((m) => {
          if (m.id !== targetId) return m;
          const nextPrice =
            updateUnitCostOnPurchase && !targetMat.isAutoSmeltedCost ? unitCost : m.buyPrice;
          return {
            ...m,
            stock: (Number(m.stock) || 0) + qty,
            buyPrice: nextPrice
          };
        });
        setMaterials(nextMats);
        recordStockSnapshot(nextMats);
        setPurchases((prev) => [
          {
            id: `pur_${Date.now()}`,
            date: getLocalDateString(0),
            itemName: targetMat.name,
            kind: 'Resource Vault',
            qty,
            unitCost,
            totalCost,
            supplier
          },
          ...prev
        ]);
        showToast(`Purchased ${qty}x ${targetMat.name} (-${totalCost}g) & added to Vault.`);
      } else {
        const targetCat = catalogItems.find((c) => c.id === targetId);
        if (!targetCat) return;
        setCatalogItems((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  stock: (Number(c.stock) || 0) + qty,
                  ...(updateUnitCostOnPurchase && unitCost > 0
                    ? { customPrice: unitCost, useCustomPrice: true }
                    : {})
                }
              : c
          )
        );
        setPurchases((prev) => [
          {
            id: `pur_${Date.now()}`,
            date: getLocalDateString(0),
            itemName: targetCat.name,
            kind: targetCat.category,
            qty,
            unitCost,
            totalCost,
            supplier
          },
          ...prev
        ]);
        showToast(`Purchased ${qty}x ${targetCat.name} (-${totalCost}g) & added to Wares.`);
      }
    } else {
      const cleanName = purchaseNewName.trim();
      if (!cleanName) {
        showToast('Enter a name for the new purchased item.', 'error');
        return;
      }
      if (purchaseNewDest === 'material') {
        const newMat = {
          id: `mat_${Date.now()}`,
          name: cleanName,
          category: materialCategories[0] || 'Raw Ore',
          buyPrice: unitCost,
          stock: qty,
          lowThreshold: 5
        };
        const nextMats = [...materials, newMat];
        setMaterials(nextMats);
        recordStockSnapshot(nextMats);
        setPurchases((prev) => [
          {
            id: `pur_${Date.now()}`,
            date: getLocalDateString(0),
            itemName: cleanName,
            kind: 'New Resource',
            qty,
            unitCost,
            totalCost,
            supplier
          },
          ...prev
        ]);
        showToast(`Added brand-new resource "${cleanName}" (${qty} in stock)!`);
      } else {
        if (!categories.includes('Unsorted')) {
          setCategories((prev) => [...prev, 'Unsorted']);
        }
        const newCatItem = {
          id: `cat_${Date.now()}`,
          name: cleanName,
          category: 'Unsorted',
          subCategory: 'General',
          description: `Purchased from ${supplier}.`,
          stock: qty,
          customPrice: unitCost,
          useCustomPrice: unitCost > 0,
          recipe: []
        };
        setCatalogItems((prev) => [...prev, newCatItem]);
        setPurchases((prev) => [
          {
            id: `pur_${Date.now()}`,
            date: getLocalDateString(0),
            itemName: cleanName,
            kind: 'Unsorted (New)',
            qty,
            unitCost,
            totalCost,
            supplier
          },
          ...prev
        ]);
        showToast(`Added "${cleanName}" into Unsorted category (${qty} in stock)!`);
      }
      setPurchaseNewName('');
    }
    setPurchaseQty(1);
    setPurchaseUnitCost(0);
    setPurchaseSupplier('');
  };

  // --- ORDERS & SUPPLY DELIVERIES HANDLERS ---
  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!canManageOrders) return;
    const item = enrichedCatalog.find((i) => i.id === orderItemId);
    if (!item || !orderCustomerName.trim()) {
      showToast('Enter a customer name and select an item.', 'error');
      return;
    }
    const qty = Math.max(1, Number(orderQty) || 1);
    const newOrder = {
      id: `ord_${Date.now()}`,
      date: getLocalDateString(0),
      customerName: orderCustomerName.trim(),
      itemId: item.id,
      itemName: item.name,
      qty,
      agreedTotal: item.sellPrice * qty,
      notes: orderNotes.trim(),
      status: 'pending'
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderCustomerName('');
    setOrderQty(1);
    setOrderNotes('');
    showToast(`Added commission for ${newOrder.customerName}`);
  };

  const handleCompleteOrder = (order) => {
    if (!canManageOrders) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'completed' } : o))
    );
    const item = enrichedCatalog.find((i) => i.id === order.itemId);
    const unitCost = item ? item.materialCost : 0;
    const unitSell = order.qty > 0 ? Math.round(order.agreedTotal / order.qty) : 0;
    setSales((prev) => [
      {
        id: `sale_${Date.now()}`,
        date: getLocalDateString(0),
        itemId: order.itemId,
        itemName: order.itemName,
        category: item?.category || 'Weapons',
        subCategory: item?.subCategory || '',
        qty: order.qty,
        unitSell,
        unitCost,
        totalRevenue: order.agreedTotal,
        netProfit: (unitSell - unitCost) * order.qty,
        customer: order.customerName
      },
      ...prev
    ]);
    showToast(`Order completed & logged to sales (+${order.agreedTotal}g)!`);
  };

  const handleAddSupplyRecord = (e) => {
    e.preventDefault();
    if (!canManageOrders) return;
    const mat = resolvedMaterials.find((m) => m.id === supplyMaterialId);
    if (!mat || !supplySupplierName.trim()) {
      showToast('Enter who is delivering and select a material.', 'error');
      return;
    }
    const qty = Math.max(1, Number(supplyQty) || 1);
    const totalCost = Math.max(0, Number(supplyTotalCost) || 0);
    const rec = {
      id: `sup_${Date.now()}`,
      date: getLocalDateString(0),
      supplierName: supplySupplierName.trim(),
      materialId: mat.id,
      materialName: mat.name,
      qty,
      totalCost,
      status: supplyStatus
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
    setSupplyQty(1);
    setSupplyTotalCost(0);
    showToast(
      supplyStatus === 'delivered'
        ? `Logged delivery from ${rec.supplierName} (+${qty} ${mat.name} added to vault)`
        : `Logged pending supply order from ${rec.supplierName}`
    );
  };

  const handleMarkSupplyDelivered = (rec) => {
    if (!canManageOrders) return;
    setSupplyRecords((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'delivered' } : r))
    );
    const nextMats = materials.map((m) =>
      m.id === rec.materialId ? { ...m, stock: (Number(m.stock) || 0) + rec.qty } : m
    );
    setMaterials(nextMats);
    recordStockSnapshot(nextMats);
    showToast(`Marked delivered & added +${rec.qty} ${rec.materialName} to vault!`);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setViewMode('public')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <WuuthradBannerIcon className="w-9 h-9 shrink-0 group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-bold tracking-wide text-amber-200">
                THE SKYFORGE
              </h1>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Whiterun Armory &amp; Smelting Ledger
              </p>
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#18181b] via-[#1c1617] to-[#18181b] border border-zinc-800/90 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Flame className="w-4 h-4" />
                <span>Forged in the Ancient Flames</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                Skyforge Wares &amp; Exchange Rates
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
                Browse live availability, public purchase rates (<span className="text-amber-300 font-semibold">We Sell</span>), and merchant trade-in offers (<span className="text-emerald-300 font-semibold">We Buy</span>).
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={publicSearch}
                onChange={(e) => setPublicSearch(e.target.value)}
                placeholder="Search weapons, armor, ingots..."
                className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-xs text-zinc-100 focus:outline-none"
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

          {/* Category Filter Pills */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setPublicCategory(cat);
                    setPublicSubCategory('All');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    publicCategory === cat
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-[#18181b] text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sub-Category / Tier Filter Pills */}
            {publicCategory !== 'All' && availablePublicSubTiers.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pl-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mr-1">
                  Tier:
                </span>
                {['All', ...availablePublicSubTiers].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPublicSubCategory(tier)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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

          {/* Classic Dark-Steel Card Grid */}
          {filteredPublicItems.length === 0 ? (
            <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-12 text-center space-y-2">
              <p className="text-sm font-serif font-semibold text-zinc-300">
                No wares match your current filter.
              </p>
              <p className="text-xs text-zinc-500">
                Try clearing the search bar or switching categories/tiers above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPublicItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#18181b] border border-zinc-800/90 hover:border-amber-500/40 rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            {item.category}
                          </span>
                          {item.subCategory && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-semibold text-amber-300">
                              {item.subCategory}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-serif font-bold text-zinc-100">{item.name}</h3>
                      </div>

                      {/* We Buy & We Sell Badges */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-right">
                          <div className="text-[9px] uppercase tracking-wider font-bold text-emerald-400">
                            We Buy
                          </div>
                          <div className="text-xs font-bold text-emerald-200">
                            {item.buyFromCustomerPrice}g
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-right">
                          <div className="text-[9px] uppercase tracking-wider font-bold text-amber-400">
                            We Sell
                          </div>
                          <div className="text-xs font-bold text-amber-200">{item.sellPrice}g</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        item.stock > 0 ? 'text-emerald-400' : 'text-zinc-500'
                      }`}
                    >
                      {item.stock > 0 ? `${item.stock} Ready in Armory` : 'Forged to Order'}
                    </span>
                    <span className="text-[11px] text-zinc-500">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Active Profile & Role Banner */}
          <div className="px-4 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold uppercase text-[10px]">
                {ROLE_PRESETS[effectiveRole]?.label || effectiveRole}
              </span>
              <span>
                Signed in as{' '}
                <strong className="text-zinc-100">
                  {activeUserRecord?.displayName || workerProfile.name}
                </strong>
                {activeUserRecord?.username ? ` (@${activeUserRecord.username})` : ''} —{' '}
                <span className="text-zinc-400">
                  {activeUserRecord?.title || workerProfile.title}
                </span>
              </span>
            </div>
            {!canLogSalesPurchases && !canManageOrders && !canEditStock && !canEditRecipes && (
              <span className="text-amber-300 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Read-Only Permissions
              </span>
            )}
          </div>

          {/* Portal Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
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
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
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

          {/* ==================== TAB 1: SALES & PROFITS ==================== */}
          {activeWorkerTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-4">
                  <div className="text-xs text-zinc-400">Gross Septim Revenue</div>
                  <div className="text-2xl font-serif font-bold text-amber-300 mt-1">
                    {dashboardStats.totalRevenue.toLocaleString()}g
                  </div>
                </div>
                <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-4">
                  <div className="text-xs text-zinc-400">Net Forge Profit</div>
                  <div className="text-2xl font-serif font-bold text-emerald-400 mt-1">
                    {dashboardStats.totalNetProfit.toLocaleString()}g
                  </div>
                </div>
                <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-4">
                  <div className="text-xs text-zinc-400">Wares Sold</div>
                  <div className="text-2xl font-serif font-bold text-zinc-100 mt-1">
                    {dashboardStats.totalUnitsSold.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-4">
                  <div className="text-xs text-zinc-400">Supply Purchases Logged</div>
                  <div className="text-2xl font-serif font-bold text-red-300 mt-1">
                    {dashboardStats.totalSpent.toLocaleString()}g
                  </div>
                </div>
              </div>

              {/* 7-Day Revenue & Net Profit Bar Chart */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-serif font-bold text-zinc-100">
                      7-Day Revenue &amp; Net Profit
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Daily Septims earned vs. profit after material costs.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
                      Revenue
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
                      Net Profit
                    </span>
                  </div>
                </div>

                {(() => {
                  const maxVal = Math.max(
                    10,
                    ...sevenDayChartData.map((d) => Math.max(d.revenue, d.profit))
                  );
                  return (
                    <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-1 h-44 items-end border-b border-zinc-800/80">
                      {sevenDayChartData.map((day) => {
                        const revPct = Math.round((day.revenue / maxVal) * 100);
                        const profPct = Math.round((day.profit / maxVal) * 100);
                        return (
                          <div
                            key={day.date}
                            className="flex flex-col items-center justify-end h-full gap-1.5"
                          >
                            <div className="text-[10px] text-zinc-400 font-medium">
                              {day.revenue > 0 ? `${day.revenue}g` : ''}
                            </div>
                            <div className="w-full flex items-end justify-center gap-1 h-28">
                              <div
                                title={`Revenue: ${day.revenue}g`}
                                style={{ height: `${Math.max(day.revenue > 0 ? 8 : 2, revPct)}%` }}
                                className="w-3 sm:w-4 rounded-t bg-amber-400/90 transition-all"
                              />
                              <div
                                title={`Net Profit: ${day.profit}g`}
                                style={{ height: `${Math.max(day.profit > 0 ? 8 : 2, profPct)}%` }}
                                className="w-3 sm:w-4 rounded-t bg-emerald-400/90 transition-all"
                              />
                            </div>
                            <div className="text-[11px] font-semibold text-zinc-400">
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
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-zinc-100">
                      Earnings Breakdown by Category &amp; Sub-Type
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Compare how much gold each weapon/armor category and material tier brings in.
                    </p>
                  </div>
                  <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setPieMetricMode('revenue')}
                      className={`px-3 py-1 rounded font-semibold cursor-pointer ${
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
                      className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                        pieMetricMode === 'profit'
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Net Profit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                        className="p-4 rounded-lg bg-zinc-950/75 border border-zinc-800/80 flex flex-col justify-between gap-4"
                      >
                        <div>
                          <h4 className="text-sm font-serif font-bold text-amber-200">
                            {chart.title}
                          </h4>
                          <p className="text-[11px] text-zinc-500">{chart.subtitle}</p>
                        </div>

                        {chart.dataset.slices.length === 0 ? (
                          <div className="py-10 text-center text-xs text-zinc-500">
                            Log a sale to see the {chart.title.toLowerCase()} distribution.
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center gap-5">
                            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                              <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
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
                                <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                                  Total
                                </span>
                                <span className="text-xs font-bold text-zinc-100">
                                  {chart.dataset.grandTotal.toLocaleString()}g
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 w-full space-y-2 max-h-40 overflow-y-auto pr-1">
                              {chart.dataset.slices.map((slice) => (
                                <div
                                  key={slice.label}
                                  className="flex items-center justify-between gap-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span
                                      style={{ backgroundColor: slice.color }}
                                      className="w-2.5 h-2.5 rounded-xs shrink-0"
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

              {/* Record a Sale OR Record a Purchase */}
              {canLogSalesPurchases && (
                <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setLedgerActionMode('sale')}
                        className={`px-3.5 py-1.5 rounded font-semibold cursor-pointer ${
                          ledgerActionMode === 'sale'
                            ? 'bg-amber-500 text-zinc-950'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Record a Sale
                      </button>
                      <button
                        type="button"
                        onClick={() => setLedgerActionMode('purchase')}
                        className={`px-3.5 py-1.5 rounded font-semibold cursor-pointer ${
                          ledgerActionMode === 'purchase'
                            ? 'bg-emerald-500 text-zinc-950'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Record a Purchase
                      </button>
                    </div>
                  </div>

                  {ledgerActionMode === 'sale' ? (
                    <form onSubmit={handleRecordSale} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Item Sold</label>
                        <select
                          value={saleItemId}
                          onChange={(e) => setSaleItemId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                        >
                          <option value="">-- Select Ware --</option>
                          {enrichedCatalog.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.sellPrice}g | Stock: {item.stock})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={saleQty}
                          onChange={(e) => setSaleQty(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Buyer Name</label>
                        <input
                          type="text"
                          value={saleCustomer}
                          onChange={(e) => setSaleCustomer(e.target.value)}
                          placeholder="e.g. Whiterun Guard"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={deductStockOnSale}
                            onChange={(e) => setDeductStockOnSale(e.target.checked)}
                            className="accent-amber-500"
                          />
                          <span>Deduct from finished stock</span>
                        </label>
                        <button
                          type="submit"
                          className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                        >
                          Log Sale
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleRecordPurchase} className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => setPurchaseTargetType('existing')}
                          className={`px-3 py-1 rounded border cursor-pointer ${
                            purchaseTargetType === 'existing'
                              ? 'bg-zinc-800 border-emerald-500/50 text-emerald-200'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          Existing Resource / Ware
                        </button>
                        <button
                          type="button"
                          onClick={() => setPurchaseTargetType('new')}
                          className={`px-3 py-1 rounded border cursor-pointer ${
                            purchaseTargetType === 'new'
                              ? 'bg-zinc-800 border-emerald-500/50 text-emerald-200'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          + Brand New Item
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                        {purchaseTargetType === 'existing' ? (
                          <div className="md:col-span-2">
                            <label className="block text-xs text-zinc-400 mb-1">
                              Select Material or Ware
                            </label>
                            <select
                              value={purchaseExistingKey}
                              onChange={(e) => setPurchaseExistingKey(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                            >
                              <option value="">-- Choose Item --</option>
                              <optgroup label="Resources & Ores">
                                {resolvedMaterials.map((m) => (
                                  <option key={m.id} value={`mat:${m.id}`}>
                                    [Vault] {m.name} (Stock: {m.stock})
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="Catalog Wares">
                                {enrichedCatalog.map((c) => (
                                  <option key={c.id} value={`cat:${c.id}`}>
                                    [{c.category}] {c.name} (Stock: {c.stock})
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs text-zinc-400 mb-1">
                                New Item Name
                              </label>
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
                          </>
                        )}

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Qty Bought</label>
                          <input
                            type="number"
                            min="1"
                            value={purchaseQty}
                            onChange={(e) => setPurchaseQty(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">
                            Unit Cost Paid (g)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={purchaseUnitCost}
                            onChange={(e) => setPurchaseUnitCost(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={updateUnitCostOnPurchase}
                              onChange={(e) => setUpdateUnitCostOnPurchase(e.target.checked)}
                              className="accent-emerald-500"
                            />
                            <span>Update buy price</span>
                          </label>
                          <button
                            type="submit"
                            className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
                          >
                            Log Purchase
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Sales & Purchases Ledger */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Sales History */}
                <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-3">
                  <h3 className="text-sm font-serif font-bold text-amber-200">Recent Sales</h3>
                  {sales.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4">No sales recorded yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {sales.map((s) => (
                        <div
                          key={s.id}
                          className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-zinc-100">
                              {s.qty}x {s.itemName}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {s.date} • Buyer: {s.customer}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-300">+{s.totalRevenue}g</div>
                            <div className="text-[11px] text-emerald-400">
                              Profit: +{s.netProfit}g
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Purchases History */}
                <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-3">
                  <h3 className="text-sm font-serif font-bold text-emerald-300">
                    Recent Supply Purchases
                  </h3>
                  {purchases.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4">No supply purchases recorded yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {purchases.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-zinc-100">
                              {p.qty}x {p.itemName}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {p.date} • {p.kind} • {p.supplier}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-300">-{p.totalCost}g</div>
                            <div className="text-[11px] text-zinc-500">{p.unitCost}g each</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: ORDERS & DELIVERIES ==================== */}
          {activeWorkerTab === 'orders' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Commissions */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <div>
                  <h3 className="text-base font-serif font-bold text-amber-200">
                    Customer Commissions
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Track custom weapons &amp; armor ordered by patrons.
                  </p>
                </div>

                {canManageOrders && (
                  <form onSubmit={handleAddOrder} className="space-y-3 p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800">
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
                        {enrichedCatalog.map((item) => (
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

                {orders.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">
                    No customer orders queued right now.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {orders.map((ord) => (
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
                )}
              </div>

              {/* Material Deliveries & Pending Supply Orders */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-serif font-bold text-amber-200">
                      Material Deliveries &amp; Pending Supplies
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Track miners/caravans who delivered ores or pending supply shipments.
                    </p>
                  </div>
                  <div className="flex gap-1 text-[11px]">
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
                        {resolvedMaterials.map((m) => (
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

                {supplyRecords.filter((r) => supplyFilter === 'all' || r.status === supplyFilter)
                  .length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">
                    No material delivery records in this view.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {supplyRecords
                      .filter((r) => supplyFilter === 'all' || r.status === supplyFilter)
                      .map((rec) => (
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
                )}
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
              <div className="space-y-6">
                {/* Resource Stock Trend Graph */}
                <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-serif font-bold text-zinc-100">
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
                            ? `Trending Down (${diff}) — Restock Soon`
                            : diff > 0
                            ? `Trending Up (+${diff})`
                            : 'Steady'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Monitors whether your ores, ingots, and fuel reserves are climbing or depleting over time.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTrendMatId}
                        onChange={(e) => setSelectedTrendMatId(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                      >
                        <option value="ALL">All Vault Resources (Total Units)</option>
                        {resolvedMaterials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.stock} in stock)
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
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
                        >
                          Log Snapshot
                        </button>
                      )}
                    </div>
                  </div>

                  {(() => {
                    const maxVal = Math.max(10, ...points.map((p) => p.value));
                    const w = 640;
                    const h = 140;
                    const padX = 28;
                    const padY = 22;
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
                      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-3">
                        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36 overflow-visible">
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
                                y={pt.y - 9}
                                textAnchor="middle"
                                fill="#e4e4e7"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                {pt.value}
                              </text>
                              <text
                                x={pt.x}
                                y={h - 4}
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

                {/* Sub-Tab Toggle: Ores & Ingots vs Finished Wares */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex p-1 rounded-lg bg-[#18181b] border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setStockSubTab('materials')}
                      className={`px-3.5 py-1.5 rounded font-semibold cursor-pointer ${
                        stockSubTab === 'materials'
                          ? 'bg-amber-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Ores, Ingots &amp; Fuel
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
                      Finished Wares Stock
                    </button>
                  </div>
                </div>

                {stockSubTab === 'materials' ? (
                  <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-5">
                    {/* Prominent Recalculate Ingots & Smelting Bar */}
                    <div className="p-3.5 rounded-lg bg-zinc-950 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-zinc-300">
                        <strong className="text-amber-300">Smelted Ingot Auto-Pricing:</strong>{' '}
                        Ingot costs calculate automatically from your Raw Ore &amp; Fuel buy prices.
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {canEditStock && (
                          <button
                            type="button"
                            onClick={handleManualRecalculateIngots}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Recalculate Ingots</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowSmeltModal(true)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer"
                        >
                          Edit Smelting Recipes
                        </button>
                      </div>
                    </div>

                    {/* Search & Add New Resource Category / Material */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={materialSearch}
                          onChange={(e) => setMaterialSearch(e.target.value)}
                          placeholder="Filter resources..."
                          className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                        />
                      </div>

                      {canEditStock && (
                        <form onSubmit={handleAddResourceCategory} className="flex gap-2">
                          <input
                            type="text"
                            value={newResourceCatInput}
                            onChange={(e) => setNewResourceCatInput(e.target.value)}
                            placeholder="New resource category..."
                            className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-200 cursor-pointer"
                          >
                            + Category
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Add New Material Form */}
                    {canEditStock && (
                      <form
                        onSubmit={handleAddMaterial}
                        className="p-3.5 rounded-lg bg-zinc-950/75 border border-zinc-800 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end"
                      >
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-zinc-400 mb-1">
                            New Material Name
                          </label>
                          <input
                            type="text"
                            value={newMatName}
                            onChange={(e) => setNewMatName(e.target.value)}
                            placeholder="e.g. Dragon Bone"
                            className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">Category</label>
                          <select
                            value={newMatCategory}
                            onChange={(e) => setNewMatCategory(e.target.value)}
                            className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          >
                            {materialCategories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">
                            Buy Price (g)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={newMatPrice}
                            onChange={(e) => setNewMatPrice(e.target.value)}
                            className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="py-1.5 px-3 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                        >
                          + Add Material
                        </button>
                      </form>
                    )}

                    {/* Grouped Resource Lists */}
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

                          <div className="space-y-2">
                            {itemsInCat.map((mat) => {
                              const isLow = (Number(mat.stock) || 0) <= (mat.lowThreshold ?? 5);
                              return (
                                <div
                                  key={mat.id}
                                  className="px-3.5 py-2.5 rounded-lg bg-zinc-950/75 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        isLow ? 'bg-amber-400' : 'bg-emerald-400'
                                      }`}
                                    />
                                    <span className="text-xs font-semibold text-zinc-100">
                                      {mat.name}
                                    </span>
                                    {isLow && (
                                      <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-semibold text-amber-300">
                                        Low (≤{mat.lowThreshold ?? 5})
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4 ml-auto">
                                    {/* Buy Price / Smelt Cost */}
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                      <span>{mat.isAutoSmeltedCost ? 'Smelt Cost' : 'Buy Price'}</span>
                                      {mat.isAutoSmeltedCost ? (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-amber-500/40">
                                          <span className="text-amber-300 font-bold text-xs">
                                            {mat.buyPrice}g
                                          </span>
                                          <span className="text-[10px] font-bold uppercase text-zinc-400">
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

                                    {/* Stock Counter */}
                                    <div className="flex items-center gap-1">
                                      {canEditStock && (
                                        <button
                                          type="button"
                                          onClick={() => adjustMaterialStock(mat.id, -1)}
                                          className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
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
                                        className="w-14 py-1 px-2 rounded bg-zinc-900 border border-zinc-800 text-center text-xs font-bold text-zinc-100 focus:outline-none"
                                      />
                                      {canEditStock && (
                                        <button
                                          type="button"
                                          onClick={() => adjustMaterialStock(mat.id, 1)}
                                          className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer"
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
                                        className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
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
                  /* Finished Wares Stock */
                  <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                    <div className="relative max-w-sm">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={finishedStockSearch}
                        onChange={(e) => setFinishedStockSearch(e.target.value)}
                        placeholder="Search finished wares..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      {enrichedCatalog
                        .filter(
                          (item) =>
                            !finishedStockSearch.trim() ||
                            item.name.toLowerCase().includes(finishedStockSearch.toLowerCase())
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="px-4 py-3 rounded-lg bg-zinc-950/75 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3"
                          >
                            <div>
                              <div className="text-xs font-bold text-zinc-100">{item.name}</div>
                              <div className="text-[11px] text-zinc-500">
                                {item.category} {item.subCategory ? `• ${item.subCategory}` : ''} •
                                Sell: {item.sellPrice}g
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
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
                              <span className="w-12 text-center text-xs font-bold text-zinc-100">
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
                  </div>
                )}
              </div>
            );
          })()}

          {/* ==================== TAB 4: RECIPES & MARGIN ==================== */}
          {activeWorkerTab === 'pricing' && (
            <div className="space-y-6">
              {/* Global Profit Margin & Customer Buy-Back Controls */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
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
                  <div className="flex items-center justify-between text-xs mb-1.5">
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
                    className="px-4 py-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-200 cursor-pointer"
                  >
                    Smelting Recipes Quick-Editor
                  </button>
                </div>
              </div>

              {/* Category & Sub-Tier Filter + Inline Sub-Tier Add/Remove */}
              <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {['All', ...categories].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setRecipeBoardCatFilter(cat);
                          setRecipeBoardSubFilter('All');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
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
                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase text-zinc-500 mr-1">
                        {recipeBoardCatFilter} Tiers:
                      </span>
                      <button
                        type="button"
                        onClick={() => setRecipeBoardSubFilter('All')}
                        className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
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
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs ${
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
                          className="w-32 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
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

                {/* Catalog Items & Recipes List */}
                <div className="space-y-2.5">
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
                        className="p-4 rounded-lg bg-zinc-950/75 border border-zinc-800/90 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-serif font-bold text-zinc-100">
                              {item.name}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400">
                              {item.category}
                            </span>
                            {item.subCategory && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-[10px] text-amber-300">
                                {item.subCategory}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400">
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

                        <div className="flex flex-wrap items-center gap-4 ml-auto text-xs">
                          <div>
                            <span className="text-zinc-500">Cost: </span>
                            <strong className="text-zinc-200">{item.materialCost}g</strong>
                          </div>
                          <div>
                            <span className="text-zinc-500">We Buy: </span>
                            <strong className="text-emerald-300">
                              {item.buyFromCustomerPrice}g
                            </strong>
                          </div>
                          <div>
                            <span className="text-zinc-500">We Sell: </span>
                            <strong className="text-amber-300">{item.sellPrice}g</strong>
                          </div>

                          {canEditRecipes && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingItem({ ...item })}
                                className="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCatalogItems((prev) => prev.filter((c) => c.id !== item.id))
                                }
                                className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
                  className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4"
                >
                  <h3 className="text-base font-serif font-bold text-amber-200">
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
                      <select
                        value={newItemMatId}
                        onChange={(e) => setNewItemMatId(e.target.value)}
                        className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
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
                  <div>
                    <h3 className="text-base font-serif font-bold text-zinc-100">
                      Skyforge Smith Roster
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Track active smiths working the Whiterun forge.
                    </p>
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
                    <div className="space-y-2">
                      {smithProfiles.map((prof) => {
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
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border cursor-pointer ${
                                    isProfOnline
                                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                                      : 'bg-zinc-900 text-zinc-400 border-zinc-700'
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
                  <div>
                    <h3 className="text-base font-serif font-bold text-amber-200">
                      User Accounts &amp; Role Permissions (Admin Only)
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Create login accounts with a Name, Username, Password, and Role (Guest, Smith, Harbinger, or Admin), and customize each member&apos;s permissions anytime.
                    </p>
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
                    <div className="space-y-3">
                      {managedUsers.map((usr) => {
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
                              <div>
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
                                    title="Toggle Online / Offline status"
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border cursor-pointer ${
                                      isShownOnline
                                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                                        : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                                    }`}
                                  >
                                    {isShownOnline ? 'Online' : 'Offline'}
                                  </button>
                                  <span className="text-[11px] text-zinc-500">
                                    • Pass: <code className="text-zinc-300">{usr.password}</code>
                                  </span>
                                </div>
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
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-amber-200">
                  Ingot Smelting Formulas
                </h3>
                <p className="text-xs text-zinc-400">
                  Adjust ores and fuel ratios used to auto-calculate ingot costs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSmeltModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              {catalogItems
                .filter((item) => item.category === 'Ingots & Materials')
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
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value, subCategory: '' })
                    }
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
                  <label className="block text-zinc-400 mb-1">Sub-Tier</label>
                  <select
                    value={editingItem.subCategory || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, subCategory: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-100"
                  >
                    <option value="">-- None --</option>
                    {(subCategories[editingItem.category] || []).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
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
    </div>
  );
}
