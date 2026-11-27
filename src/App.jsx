import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import {
  Hammer,
  Coins,
  TrendingUp,
  Package,
  Search,
  LogIn,
  LogOut,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Sword,
  Anvil,
  Calendar,
  User,
  Sliders,
  Calculator,
  RotateCcw,
  Edit3,
  X,
  Compass,
  Download,
  FileSpreadsheet,
  ClipboardList
} from 'lucide-react';

// --- FIREBASE INITIALIZATION ---
const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {
        apiKey: 'demo-api-key',
        authDomain: 'demo-skyforge.firebaseapp.com',
        projectId: 'demo-skyforge'
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- CUSTOM COMPANIONS CRIMSON & BRONZE-GOLD BANNER CREST (AUTHENTIC WUUTHRAD) ---
const SkyforgeEagleCrest = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 80 88" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bannerCloth" x1="16" y1="4" x2="64" y2="84" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7f1d1d" />
        <stop offset="50%" stopColor="#5c1315" />
        <stop offset="100%" stopColor="#35090b" />
      </linearGradient>
      <linearGradient id="wuuthradBronze" x1="20" y1="14" x2="60" y2="76" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="35%" stopColor="#d99b26" />
        <stop offset="70%" stopColor="#9a5b13" />
        <stop offset="100%" stopColor="#facc15" />
      </linearGradient>
      <linearGradient id="wuuthradDark" x1="24" y1="20" x2="56" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
    </defs>

    {/* Crimson Woven Tapestry Banner Shape */}
    <path
      d="M15 4H65V79C52 84 28 84 15 79V4Z"
      fill="url(#bannerCloth)"
      stroke="#b45309"
      strokeWidth="1.5"
    />
    {/* Subtle vertical fabric fold shading */}
    <path d="M25 5V81" stroke="#000000" strokeOpacity="0.22" strokeWidth="2.5" />
    <path d="M55 5V81" stroke="#000000" strokeOpacity="0.22" strokeWidth="2.5" />

    {/* Top Gold Diagonal-Slashed Banner Trim */}
    <path d="M15 9C30 12.5 50 12.5 65 9" stroke="url(#wuuthradBronze)" strokeWidth="1.6" />
    <path d="M15 14C30 17.5 50 17.5 65 14" stroke="url(#wuuthradBronze)" strokeWidth="1.6" />
    <path
      d="M19 10L22 14.5M25 11L28 15.5M31 11.5L34 16M37 11.8L40 16.2M43 11.8L46 16.2M49 11.5L52 16M55 11L58 15.5M61 10L63 14.5"
      stroke="url(#wuuthradBronze)"
      strokeWidth="1.4"
      strokeLinecap="round"
    />

    {/* Bottom Gold Diagonal-Slashed Banner Trim */}
    <path d="M15 71C30 74.5 50 74.5 65 71" stroke="url(#wuuthradBronze)" strokeWidth="1.6" />
    <path d="M15 76C30 79.5 50 79.5 65 76" stroke="url(#wuuthradBronze)" strokeWidth="1.6" />
    <path
      d="M19 72L22 76.5M25 73L28 77.5M31 73.5L34 78M37 73.8L40 78.2M43 73.8L46 78.2M49 73.5L52 78M55 73L58 77.5M61 72L63 76.5"
      stroke="url(#wuuthradBronze)"
      strokeWidth="1.4"
      strokeLinecap="round"
    />

    {/* Wuuthrad Battleaxe */}
    <path d="M40 16L42.2 24H37.8L40 16Z" fill="url(#wuuthradBronze)" />

    <path
      d="M36 25C31 23 25 21 21 22C19.5 28 20.5 39 23 47C26.5 46 31.5 43.5 36.5 42V39.5C32.5 40.5 29 42 26.5 43C25.5 37 25.5 30 26.5 26C30 26.5 33.5 28 36 29.5V25Z"
      fill="url(#wuuthradBronze)"
      stroke="url(#wuuthradDark)"
      strokeWidth="0.7"
    />
    <path
      d="M21 22C19.2 28.5 20.2 39.5 23 47"
      stroke="#fef08a"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path d="M27 28L35 34L27 41" stroke="url(#wuuthradBronze)" strokeWidth="1.4" fill="none" />

    <path
      d="M44 25C49 23 55 21 59 22C60.5 28 59.5 39 57 47C53.5 46 48.5 43.5 43.5 42V39.5C47.5 40.5 51 42 53.5 43C54.5 37 54.5 30 53.5 26C50 26.5 46.5 28 44 29.5V25Z"
      fill="url(#wuuthradBronze)"
      stroke="url(#wuuthradDark)"
      strokeWidth="0.7"
    />
    <path
      d="M59 22C60.8 28.5 59.8 39.5 57 47"
      stroke="#fef08a"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path d="M53 28L45 34L53 41" stroke="url(#wuuthradBronze)" strokeWidth="1.4" fill="none" />

    <path
      d="M36 24.5H44L44.8 32L43.5 41.5L40 43.5L36.5 41.5L35.2 32L36 24.5Z"
      fill="url(#wuuthradBronze)"
      stroke="url(#wuuthradDark)"
      strokeWidth="0.8"
    />
    <path d="M35.5 28L33.2 26.5L35.2 30.5Z" fill="url(#wuuthradBronze)" />
    <path d="M44.5 28L46.8 26.5L44.8 30.5Z" fill="url(#wuuthradBronze)" />
    <path d="M37 28.5L39.2 29.5M43 28.5L40.8 29.5" stroke="#451a03" strokeWidth="0.9" strokeLinecap="round" />
    <ellipse cx="40" cy="36.2" rx="1.7" ry="3.1" fill="#35090b" />
    <path d="M37.5 34C38.5 32.8 41.5 32.8 42.5 34" stroke="#78350f" strokeWidth="0.8" />

    <rect x="38.4" y="43" width="3.2" height="26" fill="url(#wuuthradBronze)" />
    <rect x="37.4" y="44" width="5.2" height="2" rx="0.6" fill="#fef08a" />
    <rect x="37.6" y="53.5" width="4.8" height="1.6" rx="0.5" fill="url(#wuuthradBronze)" />
    <path
      d="M38.4 47L41.6 49M41.6 50.5L38.4 52.5M38.4 56.5L41.6 58.5M41.6 60L38.4 62"
      stroke="#451a03"
      strokeWidth="0.8"
    />
    <path
      d="M37.4 63.5H42.6L42.2 68.5L40 70.5L37.8 68.5L37.4 63.5Z"
      fill="url(#wuuthradBronze)"
      stroke="url(#wuuthradDark)"
      strokeWidth="0.6"
    />
  </svg>
);

const NordicDivider = ({ runes = 'ᚹᚢᚢᚦᚱᚨᛞ • ᛃᛊᚷᚱᚨᛗᛟᚱ' }) => (
  <div className="flex items-center gap-3 my-2 select-none">
    <div className="h-px flex-1 bg-amber-500/35" />
    <span className="text-[11px] tracking-[0.25em] text-amber-300/80 font-mono">
      {runes}
    </span>
    <div className="h-px flex-1 bg-amber-500/35" />
  </div>
);

// --- INITIAL SKYFORGE MATERIALS ---

const NordicKnotDivider = ({ runes = 'ᚹᚢᚢᚦᚱᚨᛞ • ᛃᛊᚷᚱᚨᛗᛟᚱ • ᚲᛁᚾᛖ • ᛊᚺᛟᚱ' }) => (
  <div className="flex items-center justify-center gap-3 my-2.5 select-none opacity-95">
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/80 to-red-500/70" />
    <span className="text-xs sm:text-[13px] tracking-[0.3em] text-amber-300 font-mono uppercase drop-shadow">
      {runes}
    </span>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-500/80 to-red-500/70" />
  </div>
);

const RunicCornerFrame = () => (
  <>
    <span className="pointer-events-none absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/90 rounded-tl-sm" />
    <span className="pointer-events-none absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/90 rounded-tr-sm" />
    <span className="pointer-events-none absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-500/80 rounded-bl-sm" />
    <span className="pointer-events-none absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-500/80 rounded-br-sm" />
  </>
);

// --- INITIAL SKYFORGE MATERIALS (BLANK STOCK & BUY PRICES BY DEFAULT) ---
const INITIAL_MATERIALS = [
  // Raw Ores, Crystals & Scrap
  { id: 'mat-iron-ore', name: 'Iron Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-corundum-ore', name: 'Corundum Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-orichalcum-ore', name: 'Orichalcum Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-quicksilver-ore', name: 'Quicksilver Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-silver-ore', name: 'Silver Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-gold-ore', name: 'Gold Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-moonstone-ore', name: 'Moonstone Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-malachite-ore', name: 'Malachite Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-ebony-ore', name: 'Ebony Ore', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'ore' },
  { id: 'mat-glacial-crystal', name: 'Glacial Crystal', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'crystals' },
  { id: 'mat-dwemer-scrap', name: 'Dwemer Scrap Metal', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'scrap' },
  { id: 'mat-chaurus-chitin', name: 'Chaurus Chitin', category: 'Raw Ore', buyPrice: 0, stock: 0, minStock: 0, unit: 'plates' },

  // 4 Types of Fuel
  { id: 'mat-poor-charcoal', name: 'Poor Charcoal', category: 'Fuel', buyPrice: 0, stock: 0, minStock: 0, unit: 'chunks' },
  { id: 'mat-charcoal', name: 'Charcoal', category: 'Fuel', buyPrice: 0, stock: 0, minStock: 0, unit: 'chunks' },
  { id: 'mat-briquettes', name: 'Briquettes', category: 'Fuel', buyPrice: 0, stock: 0, minStock: 0, unit: 'blocks' },
  { id: 'mat-coke', name: 'Coke', category: 'Fuel', buyPrice: 0, stock: 0, minStock: 0, unit: 'chunks' },

  // Hides, Straps & Wood
  { id: 'mat-animal-pelt', name: 'Animal Pelt', category: 'Hides & Straps', buyPrice: 0, stock: 0, minStock: 0, unit: 'pelts' },
  { id: 'mat-deer-pelt', name: 'Deer Pelt', category: 'Hides & Straps', buyPrice: 0, stock: 0, minStock: 0, unit: 'pelts' },
  { id: 'mat-wolf-pelt', name: 'Wolf Pelt', category: 'Hides & Straps', buyPrice: 0, stock: 0, minStock: 0, unit: 'pelts' },
  { id: 'mat-bear-pelt', name: 'Bear Pelt', category: 'Hides & Straps', buyPrice: 0, stock: 0, minStock: 0, unit: 'pelts' },
  { id: 'mat-sabre-cat-pelt', name: 'Sabre Cat Pelt', category: 'Hides & Straps', buyPrice: 0, stock: 0, minStock: 0, unit: 'pelts' },
  { id: 'mat-leather', name: 'Tanned Leather', category: 'Hides & Straps', buyPrice: 0, stock: 0, minStock: 0, unit: 'hides' },
  { id: 'mat-leather-strips', name: 'Leather Strips', category: 'Hides & Straps', buyPrice: 0, stock: 0, minStock: 0, unit: 'strips' },
  { id: 'mat-wood', name: 'Wood', category: 'Hides & Straps', buyPrice: 0, stock: 0, minStock: 0, unit: 'logs' },

  // Smelted Ingots
  { id: 'mat-iron-ingot', name: 'Iron Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-steel-ingot', name: 'Steel Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-corundum-ingot', name: 'Corundum Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-dwarven-ingot', name: 'Dwarven Metal Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-orichalcum-ingot', name: 'Orichalcum Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-quicksilver-ingot', name: 'Quicksilver Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-silver-ingot', name: 'Silver Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-gold-ingot', name: 'Gold Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-moonstone-ingot', name: 'Refined Moonstone', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-malachite-ingot', name: 'Refined Malachite', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-ebony-ingot', name: 'Ebony Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' },
  { id: 'mat-stalhrim-ingot', name: 'Stalhrim Ingot', category: 'Smelted Ingots', buyPrice: 0, stock: 0, minStock: 0, unit: 'bars' }
];

// --- INITIAL SKYFORGE CATALOG ITEMS (UPDATED FROM SKYRIM CRAFTING RECIPES & MATERIALS) ---
const SUBCATEGORIES_BY_CATEGORY = {
  Weapons: [
    'Hunting & Wood',
    'Iron',
    'Imperial',
    'Steel',
    'Ancient Nord',
    'Nord Hero',
    'Skyforge Steel',
    'Wolf',
    'Silver',
    'Corundum',
    'Falmer',
    'Dwarven',
    'Elven',
    'Nordic',
    'Orichalcum',
    'Glass',
    'Ebony',
    'Stalhrim'
  ],
  Armor: [
    'Fur',
    'Leather',
    'Hide',
    'Studded',
    'Scaled',
    'Iron',
    'Ancient Nord',
    'Imperial',
    'Steel',
    'Wolf',
    'Corundum',
    'Steel Plate',
    'Falmer',
    'Dwarven',
    'Elven',
    'Nordic Carved',
    'Orichalcum',
    'Glass',
    'Ebony',
    'Stalhrim'
  ],
  'Ingots & Materials': ['Smelted Ingots', 'Raw Ore', 'Hides & Straps', 'Fuel']
};

const INITIAL_CATALOG_ITEMS_RAW = [
  // =========================================================================
  // WEAPONS (COMPLETE SKYRIM CRAFTING RECIPES & MATERIALS LIST)
  // =========================================================================
  // Hunting & Wood Bows
  {
    id: 'item-long-bow',
    name: 'Long Bow',
    category: 'Weapons',
    subCategory: 'Hunting & Wood',
    description: 'Simple carved wooden bow strung with leather.',
    recipe: [
      { materialId: 'mat-wood', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 20,
    stock: 5,
    minStock: 2
  },
  {
    id: 'item-hunting-bow',
    name: 'Hunting Bow',
    category: 'Weapons',
    subCategory: 'Hunting & Wood',
    description: 'Iron-reinforced wooden bow favored by Whiterun hunters.',
    recipe: [
      { materialId: 'mat-wood', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 35,
    stock: 5,
    minStock: 2
  },

  // Iron Weapons
  {
    id: 'item-iron-dagger',
    name: 'Iron Dagger',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Simple iron dagger forged for quick close-quarters defense.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 25,
    stock: 6,
    minStock: 3
  },
  {
    id: 'item-iron-sword',
    name: 'Iron Sword',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Sturdy iron arming sword suitable for watchmen and sellswords.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 45,
    stock: 6,
    minStock: 3
  },
  {
    id: 'item-iron-war-axe',
    name: 'Iron War Axe',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Single-handed iron chopping axe balanced for swift strikes.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 50,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-iron-mace',
    name: 'Iron Mace',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Flanged iron mace built to dent heavy armor.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 65,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-iron-greatsword',
    name: 'Iron Greatsword',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Two-handed iron claymore forged with a wide fuller.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 90,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-iron-battleaxe',
    name: 'Iron Battleaxe',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Two-handed iron battleaxe.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 95,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-iron-warhammer',
    name: 'Iron Warhammer',
    category: 'Weapons',
    subCategory: 'Iron',
    description: 'Two-handed iron warhammer.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 5 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 115,
    stock: 2,
    minStock: 1
  },

  // Imperial Weapons
  {
    id: 'item-imperial-sword',
    name: 'Imperial Sword',
    category: 'Weapons',
    subCategory: 'Imperial',
    description: 'Legion-issue steel gladius.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-imperial-bow',
    name: 'Imperial Bow',
    category: 'Weapons',
    subCategory: 'Imperial',
    description: 'Legion-issue recurve bow.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-wood', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 110,
    stock: 3,
    minStock: 1
  },

  // Steel Weapons
  {
    id: 'item-steel-dagger',
    name: 'Steel Dagger',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Keen steel dagger with leather-wrapped grip.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 55,
    stock: 5,
    minStock: 2
  },
  {
    id: 'item-steel-sword',
    name: 'Steel Sword',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Well-balanced steel arming sword.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 5,
    minStock: 2
  },
  {
    id: 'item-steel-war-axe',
    name: 'Steel War Axe',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Tempered steel war axe with bearded blade.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 130,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-steel-mace',
    name: 'Steel Mace',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Heavy flanged steel mace.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 170,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-steel-greatsword',
    name: 'Steel Greatsword',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Two-handed steel greatsword.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 250,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-steel-battleaxe',
    name: 'Steel Battleaxe',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Two-handed steel battleaxe.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 260,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-steel-warhammer',
    name: 'Steel Warhammer',
    category: 'Weapons',
    subCategory: 'Steel',
    description: 'Two-handed steel warhammer.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 5 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 310,
    stock: 2,
    minStock: 1
  },

  // Ancient Nord Weapons
  {
    id: 'item-ancient-nord-sword',
    name: 'Ancient Nord Sword',
    category: 'Weapons',
    subCategory: 'Ancient Nord',
    description: 'Ancient Nord relic sword.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 45,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ancient-nord-war-axe',
    name: 'Ancient Nord War Axe',
    category: 'Weapons',
    subCategory: 'Ancient Nord',
    description: 'Ancient Nord relic war axe.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 55,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ancient-nord-greatsword',
    name: 'Ancient Nord Greatsword',
    category: 'Weapons',
    subCategory: 'Ancient Nord',
    description: 'Ancient Nord two-handed greatsword.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 95,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ancient-nord-battleaxe',
    name: 'Ancient Nord Battleaxe',
    category: 'Weapons',
    subCategory: 'Ancient Nord',
    description: 'Ancient Nord two-handed battleaxe.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 105,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ancient-nord-bow',
    name: 'Ancient Nord Bow',
    category: 'Weapons',
    subCategory: 'Ancient Nord',
    description: 'Ancient Nord recurve bow.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 55,
    stock: 2,
    minStock: 1
  },

  // Nord Hero Weapons
  {
    id: 'item-nord-hero-sword',
    name: 'Nord Hero Sword',
    category: 'Weapons',
    subCategory: 'Nord Hero',
    description: 'Reforged Nord Hero sword.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 155,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-nord-hero-war-axe',
    name: 'Nord Hero War Axe',
    category: 'Weapons',
    subCategory: 'Nord Hero',
    description: 'Reforged Nord Hero war axe.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 160,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-nord-hero-greatsword',
    name: 'Nord Hero Greatsword',
    category: 'Weapons',
    subCategory: 'Nord Hero',
    description: 'Reforged Nord Hero greatsword.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 5 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 255,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nord-hero-battleaxe',
    name: 'Nord Hero Battleaxe',
    category: 'Weapons',
    subCategory: 'Nord Hero',
    description: 'Reforged Nord Hero battleaxe.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 5 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 265,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nord-hero-bow',
    name: 'Nord Hero Bow',
    category: 'Weapons',
    subCategory: 'Nord Hero',
    description: 'Reforged Nord Hero bow.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 160,
    stock: 2,
    minStock: 1
  },

  // Skyforge Steel Weapons
  {
    id: 'item-skyforge-steel-dagger',
    name: 'Skyforge Steel Dagger',
    category: 'Weapons',
    subCategory: 'Skyforge Steel',
    description: 'Honed at The Skyforge.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 55,
    stock: 5,
    minStock: 2
  },
  {
    id: 'item-skyforge-steel-sword',
    name: 'Skyforge Steel Sword',
    category: 'Weapons',
    subCategory: 'Skyforge Steel',
    description: 'Honed at The Skyforge.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 5,
    minStock: 2
  },
  {
    id: 'item-skyforge-steel-war-axe',
    name: 'Skyforge Steel War Axe',
    category: 'Weapons',
    subCategory: 'Skyforge Steel',
    description: 'Honed at The Skyforge.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 130,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-skyforge-steel-mace',
    name: 'Skyforge Steel Mace',
    category: 'Weapons',
    subCategory: 'Skyforge Steel',
    description: 'Honed at The Skyforge.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 170,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-skyforge-steel-greatsword',
    name: 'Skyforge Steel Greatsword',
    category: 'Weapons',
    subCategory: 'Skyforge Steel',
    description: 'Honed at The Skyforge.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 250,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-skyforge-steel-battleaxe',
    name: 'Skyforge Steel Battleaxe',
    category: 'Weapons',
    subCategory: 'Skyforge Steel',
    description: 'Honed at The Skyforge.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 260,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-skyforge-steel-warhammer',
    name: 'Skyforge Steel Warhammer',
    category: 'Weapons',
    subCategory: 'Skyforge Steel',
    description: 'Honed at The Skyforge.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 5 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 310,
    stock: 2,
    minStock: 1
  },

  // Wolf Weapons
  {
    id: 'item-wolf-dagger',
    name: 'Wolf Dagger',
    category: 'Weapons',
    subCategory: 'Wolf',
    description: 'Companions Skyforge Wolf dagger.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 55,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-wolf-sword',
    name: 'Wolf Sword',
    category: 'Weapons',
    subCategory: 'Wolf',
    description: 'Companions Skyforge Wolf sword.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-wolf-war-axe',
    name: 'Wolf War Axe',
    category: 'Weapons',
    subCategory: 'Wolf',
    description: 'Companions Skyforge Wolf war axe.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 130,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-wolf-mace',
    name: 'Wolf Mace',
    category: 'Weapons',
    subCategory: 'Wolf',
    description: 'Companions Skyforge Wolf mace.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 170,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-wolf-greatsword',
    name: 'Wolf Greatsword',
    category: 'Weapons',
    subCategory: 'Wolf',
    description: 'Companions Skyforge Wolf greatsword.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 250,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-wolf-battleaxe',
    name: 'Wolf Battleaxe',
    category: 'Weapons',
    subCategory: 'Wolf',
    description: 'Companions Skyforge Wolf battleaxe.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 260,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-wolf-warhammer',
    name: 'Wolf Warhammer',
    category: 'Weapons',
    subCategory: 'Wolf',
    description: 'Companions Skyforge Wolf warhammer.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 5 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 310,
    stock: 2,
    minStock: 1
  },

  // Silver Weapons
  {
    id: 'item-silver-dagger',
    name: 'Silver Dagger',
    category: 'Weapons',
    subCategory: 'Silver',
    description: 'Silver-edged hunter dagger.',
    recipe: [
      { materialId: 'mat-silver-ingot', qty: 1 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 125,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-silver-sword',
    name: 'Silver Sword',
    category: 'Weapons',
    subCategory: 'Silver',
    description: 'Pure silver-inlaid blade especially lethal to undead and beasts.',
    recipe: [
      { materialId: 'mat-silver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 195,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-silver-war-axe',
    name: 'Silver War Axe',
    category: 'Weapons',
    subCategory: 'Silver',
    description: 'Silver-bladed war axe.',
    recipe: [
      { materialId: 'mat-silver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 205,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-silver-mace',
    name: 'Silver Mace',
    category: 'Weapons',
    subCategory: 'Silver',
    description: 'Silver-plated flanged mace.',
    recipe: [
      { materialId: 'mat-silver-ingot', qty: 3 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 265,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-silver-greatsword',
    name: 'Silver Greatsword',
    category: 'Weapons',
    subCategory: 'Silver',
    description: 'Two-handed silver claymore prized by monster hunters.',
    recipe: [
      { materialId: 'mat-silver-ingot', qty: 4 },
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 390,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-silver-battleaxe',
    name: 'Silver Battleaxe',
    category: 'Weapons',
    subCategory: 'Silver',
    description: 'Two-handed silver battleaxe.',
    recipe: [
      { materialId: 'mat-silver-ingot', qty: 4 },
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 405,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-silver-warhammer',
    name: 'Silver Warhammer',
    category: 'Weapons',
    subCategory: 'Silver',
    description: 'Two-handed silver warhammer.',
    recipe: [
      { materialId: 'mat-silver-ingot', qty: 5 },
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 475,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-silver-bow',
    name: 'Silver Bow',
    category: 'Weapons',
    subCategory: 'Silver',
    description: 'Silver-laminated hunting bow.',
    recipe: [
      { materialId: 'mat-silver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 200,
    stock: 2,
    minStock: 1
  },

  // Corundum Weapons
  {
    id: 'item-corundum-dagger',
    name: 'Corundum Dagger',
    category: 'Weapons',
    subCategory: 'Corundum',
    description: 'Forged corundum dagger.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 90,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-corundum-sword',
    name: 'Corundum Sword',
    category: 'Weapons',
    subCategory: 'Corundum',
    description: 'Forged corundum sword.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 150,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-corundum-war-axe',
    name: 'Corundum War Axe',
    category: 'Weapons',
    subCategory: 'Corundum',
    description: 'Forged corundum war axe.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 160,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-corundum-mace',
    name: 'Corundum Mace',
    category: 'Weapons',
    subCategory: 'Corundum',
    description: 'Forged corundum mace.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 215,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-corundum-greatsword',
    name: 'Corundum Greatsword',
    category: 'Weapons',
    subCategory: 'Corundum',
    description: 'Two-handed corundum greatsword.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 310,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-corundum-battleaxe',
    name: 'Corundum Battleaxe',
    category: 'Weapons',
    subCategory: 'Corundum',
    description: 'Two-handed corundum battleaxe.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 320,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-corundum-warhammer',
    name: 'Corundum Warhammer',
    category: 'Weapons',
    subCategory: 'Corundum',
    description: 'Two-handed corundum warhammer.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 5 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 380,
    stock: 2,
    minStock: 1
  },

  // Falmer Weapons
  {
    id: 'item-falmer-sword',
    name: 'Falmer Sword',
    category: 'Weapons',
    subCategory: 'Falmer',
    description: 'Serrated subterranean blade crafted from layered chaurus chitin.',
    recipe: [
      { materialId: 'mat-chaurus-chitin', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 65,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-falmer-war-axe',
    name: 'Falmer War Axe',
    category: 'Weapons',
    subCategory: 'Falmer',
    description: 'Jagged chaurus-chitin war axe bound in rawhide.',
    recipe: [
      { materialId: 'mat-chaurus-chitin', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 70,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-falmer-bow',
    name: 'Falmer Bow',
    category: 'Weapons',
    subCategory: 'Falmer',
    description: 'Curved chitin recurve bow favored by subterranean stalkers.',
    recipe: [
      { materialId: 'mat-chaurus-chitin', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 70,
    stock: 2,
    minStock: 1
  },

  // Dwarven Weapons
  {
    id: 'item-dwarven-dagger',
    name: 'Dwarven Dagger',
    category: 'Weapons',
    subCategory: 'Dwarven',
    description: 'Angular Dwemer bronze dagger that never loses its edge.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 90,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-dwarven-sword',
    name: 'Dwarven Sword',
    category: 'Weapons',
    subCategory: 'Dwarven',
    description: 'Heavy golden-bronze Dwemer arming blade.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 150,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-dwarven-war-axe',
    name: 'Dwarven War Axe',
    category: 'Weapons',
    subCategory: 'Dwarven',
    description: 'Geometric Dwemer metal war axe.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 155,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-dwarven-mace',
    name: 'Dwarven Mace',
    category: 'Weapons',
    subCategory: 'Dwarven',
    description: 'Solid Dwemer bronze mace.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 215,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-dwarven-greatsword',
    name: 'Dwarven Greatsword',
    category: 'Weapons',
    subCategory: 'Dwarven',
    description: 'Massive two-handed Dwemer metal greatsword.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 4 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 335,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-dwarven-battleaxe',
    name: 'Dwarven Battleaxe',
    category: 'Weapons',
    subCategory: 'Dwarven',
    description: 'Two-handed Dwemer bronze battleaxe.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 4 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 335,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-dwarven-warhammer',
    name: 'Dwarven Warhammer',
    category: 'Weapons',
    subCategory: 'Dwarven',
    description: 'Heavy piston-headed Dwemer warhammer.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 5 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 400,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-dwarven-bow',
    name: 'Dwarven Bow',
    category: 'Weapons',
    subCategory: 'Dwarven',
    description: 'Rigid Dwemer alloy recurve bow.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 145,
    stock: 2,
    minStock: 1
  },

  // Elven Weapons
  {
    id: 'item-elven-dagger',
    name: 'Elven Dagger',
    category: 'Weapons',
    subCategory: 'Elven',
    description: 'Feather-light refined moonstone dagger.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 125,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-elven-sword',
    name: 'Elven Sword',
    category: 'Weapons',
    subCategory: 'Elven',
    description: 'Curved golden-silver moonstone blade.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 220,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-elven-war-axe',
    name: 'Elven War Axe',
    category: 'Weapons',
    subCategory: 'Elven',
    description: 'Ornate crescent-bladed moonstone war axe.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 295,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-elven-mace',
    name: 'Elven Mace',
    category: 'Weapons',
    subCategory: 'Elven',
    description: 'Sunburst-flanged refined moonstone mace.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 3 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 390,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-elven-greatsword',
    name: 'Elven Greatsword',
    category: 'Weapons',
    subCategory: 'Elven',
    description: 'Long sweeping two-handed moonstone greatsword.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 4 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 495,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-elven-battleaxe',
    name: 'Elven Battleaxe',
    category: 'Weapons',
    subCategory: 'Elven',
    description: 'Twin-winged moonstone battleaxe.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 4 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 495,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-elven-warhammer',
    name: 'Elven Warhammer',
    category: 'Weapons',
    subCategory: 'Elven',
    description: 'Balanced two-handed moonstone warhammer.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 5 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 595,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-elven-bow',
    name: 'Elven Bow',
    category: 'Weapons',
    subCategory: 'Elven',
    description: 'Swift longbow laminated with refined moonstone.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 285,
    stock: 2,
    minStock: 1
  },

  // Nordic Weapons
  {
    id: 'item-nordic-dagger',
    name: 'Nordic Dagger',
    category: 'Weapons',
    subCategory: 'Nordic',
    description: 'Carved quicksilver-and-steel dagger with bear-claw pommel.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 145,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-nordic-sword',
    name: 'Nordic Sword',
    category: 'Weapons',
    subCategory: 'Nordic',
    description: 'Engraved quicksilver-steel broadsword.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 235,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-nordic-war-axe',
    name: 'Nordic War Axe',
    category: 'Weapons',
    subCategory: 'Nordic',
    description: 'Intricately carved Nordic war axe.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 240,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nordic-mace',
    name: 'Nordic Mace',
    category: 'Weapons',
    subCategory: 'Nordic',
    description: 'Heavy carved quicksilver-and-steel mace.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 3 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 325,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nordic-greatsword',
    name: 'Nordic Greatsword',
    category: 'Weapons',
    subCategory: 'Nordic',
    description: 'Master-carved two-handed Nordic greatsword.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 4 },
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 475,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nordic-battleaxe',
    name: 'Nordic Battleaxe',
    category: 'Weapons',
    subCategory: 'Nordic',
    description: 'Twin-bladed Nordic battleaxe engraved with ancient beasts.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 4 },
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 475,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nordic-warhammer',
    name: 'Nordic Warhammer',
    category: 'Weapons',
    subCategory: 'Nordic',
    description: 'Carved quicksilver warhammer built for heavy combat.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 5 },
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 565,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-nordic-bow',
    name: 'Nordic Bow',
    category: 'Weapons',
    subCategory: 'Nordic',
    description: 'Heavy recurve bow inlaid with quicksilver knotwork.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 230,
    stock: 2,
    minStock: 1
  },

  // Orichalcum Weapons
  {
    id: 'item-orcish-dagger',
    name: 'Orichalcum Dagger',
    category: 'Weapons',
    subCategory: 'Orichalcum',
    description: 'Jagged dark-green orichalcum combat dagger.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 100,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-orcish-sword',
    name: 'Orichalcum Sword',
    category: 'Weapons',
    subCategory: 'Orichalcum',
    description: 'Brutal heavy-cleaving orichalcum blade.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 180,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-orcish-war-axe',
    name: 'Orichalcum War Axe',
    category: 'Weapons',
    subCategory: 'Orichalcum',
    description: 'Spiked stronghold-style war axe.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 185,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-orcish-mace',
    name: 'Orichalcum Mace',
    category: 'Weapons',
    subCategory: 'Orichalcum',
    description: 'Cruel spiked orichalcum mace.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 255,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-orcish-greatsword',
    name: 'Orichalcum Greatsword',
    category: 'Weapons',
    subCategory: 'Orichalcum',
    description: 'Massive notched two-handed orichalcum greatsword.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 365,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-orcish-battleaxe',
    name: 'Orichalcum Battleaxe',
    category: 'Weapons',
    subCategory: 'Orichalcum',
    description: 'Heavy double-horned orichalcum battleaxe.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 365,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-orcish-warhammer',
    name: 'Orichalcum Warhammer',
    category: 'Weapons',
    subCategory: 'Orichalcum',
    description: 'Crushing stronghold warhammer forged of solid orichalcum.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 5 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 440,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-orcish-bow',
    name: 'Orichalcum Bow',
    category: 'Weapons',
    subCategory: 'Orichalcum',
    description: 'Heavy-draw orichalcum warbow.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 175,
    stock: 2,
    minStock: 1
  },

  // Glass Weapons
  {
    id: 'item-glass-dagger',
    name: 'Glass Dagger',
    category: 'Weapons',
    subCategory: 'Glass',
    description: 'Crystalline malachite-and-moonstone dagger with razor edge.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 1 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 230,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-glass-sword',
    name: 'Glass Sword',
    category: 'Weapons',
    subCategory: 'Glass',
    description: 'Emerald-edged volcanic glass sword.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 2 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 355,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-glass-war-axe',
    name: 'Glass War Axe',
    category: 'Weapons',
    subCategory: 'Glass',
    description: 'Gleaming malachite-and-moonstone war axe.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 2 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 360,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-mace',
    name: 'Glass Mace',
    category: 'Weapons',
    subCategory: 'Glass',
    description: 'Crystalline flanged malachite mace.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 3 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 480,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-greatsword',
    name: 'Glass Greatsword',
    category: 'Weapons',
    subCategory: 'Glass',
    description: 'Two-handed volcanic glass greatsword.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 4 },
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 715,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-battleaxe',
    name: 'Glass Battleaxe',
    category: 'Weapons',
    subCategory: 'Glass',
    description: 'Two-handed malachite battleaxe.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 4 },
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 715,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-warhammer',
    name: 'Glass Warhammer',
    category: 'Weapons',
    subCategory: 'Glass',
    description: 'Heavy malachite-head warhammer.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 5 },
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 840,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-bow',
    name: 'Glass Bow',
    category: 'Weapons',
    subCategory: 'Glass',
    description: 'High-velocity malachite composite bow.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 2 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 350,
    stock: 1,
    minStock: 1
  },

  // Ebony Weapons
  {
    id: 'item-ebony-dagger',
    name: 'Ebony Dagger',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Obsidian-black ebony dagger.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 175,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ebony-sword',
    name: 'Ebony Sword',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Masterwork volcanic ebony blade.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 340,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ebony-war-axe',
    name: 'Ebony War Axe',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Sleek, deadly ebony war axe.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 345,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-mace',
    name: 'Ebony Mace',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Heavy flanged ebony mace.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 510,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-greatsword',
    name: 'Ebony Greatsword',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Two-handed ebony greatsword.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 685,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-battleaxe',
    name: 'Ebony Battleaxe',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Twin-bladed ebony battleaxe.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 685,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-warhammer',
    name: 'Ebony Warhammer',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Massive ebony warhammer.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 5 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 855,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-bow',
    name: 'Ebony Bow',
    category: 'Weapons',
    subCategory: 'Ebony',
    description: 'Blackened ebony recurve bow.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 1 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 505,
    stock: 1,
    minStock: 1
  },

  // Stalhrim Weapons
  {
    id: 'item-stalhrim-dagger',
    name: 'Stalhrim Dagger',
    category: 'Weapons',
    subCategory: 'Stalhrim',
    description: 'Enchanted frost-ice dagger carved from ancient Stalhrim.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 215,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-sword',
    name: 'Stalhrim Sword',
    category: 'Weapons',
    subCategory: 'Stalhrim',
    description: 'Glacial crystalline broadsword stronger than ebony.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 425,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-war-axe',
    name: 'Stalhrim War Axe',
    category: 'Weapons',
    subCategory: 'Stalhrim',
    description: 'Frost-hardened Stalhrim war axe.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 430,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-mace',
    name: 'Stalhrim Mace',
    category: 'Weapons',
    subCategory: 'Stalhrim',
    description: 'Heavy crystalline Stalhrim mace.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 635,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-greatsword',
    name: 'Stalhrim Greatsword',
    category: 'Weapons',
    subCategory: 'Stalhrim',
    description: 'Two-handed glacial Stalhrim greatsword.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 855,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-battleaxe',
    name: 'Stalhrim Battleaxe',
    category: 'Weapons',
    subCategory: 'Stalhrim',
    description: 'Two-handed Skaal-forged Stalhrim battleaxe.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 855,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-warhammer',
    name: 'Stalhrim Warhammer',
    category: 'Weapons',
    subCategory: 'Stalhrim',
    description: 'Crushing two-handed Stalhrim warhammer.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 5 },
      { materialId: 'mat-leather-strips', qty: 3 },
      { materialId: 'mat-wood', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 1065,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-bow',
    name: 'Stalhrim Bow',
    category: 'Weapons',
    subCategory: 'Stalhrim',
    description: 'Ancient ice-forged bow of Solstheim.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 2 },
      { materialId: 'mat-ebony-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 590,
    stock: 1,
    minStock: 1
  },

  // =========================================================================
  // ARMOR SETS & PIECES (COMPLETE SKYRIM CRAFTING RECIPES & MATERIALS LIST)
  // =========================================================================
  // Fur Armor
  {
    id: 'item-fur-helmet',
    name: 'Fur Helmet',
    category: 'Armor',
    subCategory: 'Fur',
    description: 'Thick winter wolf-and-bear fur hood.',
    recipe: [
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 25,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-fur-armor',
    name: 'Fur Armor',
    category: 'Armor',
    subCategory: 'Fur',
    description: 'Heavy layered northern fur cuirass.',
    recipe: [
      { materialId: 'mat-leather', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 60,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-fur-bracers',
    name: 'Fur Bracers',
    category: 'Armor',
    subCategory: 'Fur',
    description: 'Fur-lined leather wrist guards.',
    recipe: [
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 25,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-fur-boots',
    name: 'Fur Boots',
    category: 'Armor',
    subCategory: 'Fur',
    description: 'Thick fur-wrapped snow boots.',
    recipe: [
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 45,
    stock: 4,
    minStock: 2
  },

  // Leather Armor
  {
    id: 'item-leather-helmet',
    name: 'Leather Helmet',
    category: 'Armor',
    subCategory: 'Leather',
    description: 'Supple boiled-leather scout cap.',
    recipe: [
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 40,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-leather-armor',
    name: 'Leather Armor',
    category: 'Armor',
    subCategory: 'Leather',
    description: 'Fitted boiled-leather jerkin with shoulder guards.',
    recipe: [
      { materialId: 'mat-leather', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 80,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-leather-bracers',
    name: 'Leather Bracers',
    category: 'Armor',
    subCategory: 'Leather',
    description: 'Hardened leather forearm guards.',
    recipe: [
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 45,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-leather-boots',
    name: 'Leather Boots',
    category: 'Armor',
    subCategory: 'Leather',
    description: 'Sturdy laced leather marching boots.',
    recipe: [
      { materialId: 'mat-leather', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 60,
    stock: 4,
    minStock: 2
  },

  // Hide Armor
  {
    id: 'item-hide-helmet',
    name: 'Hide Helmet',
    category: 'Armor',
    subCategory: 'Hide',
    description: 'Fur-trimmed rawhide cap.',
    recipe: [
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 25,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-hide-armor',
    name: 'Hide Armor',
    category: 'Armor',
    subCategory: 'Hide',
    description: 'Layered animal hide cuirass for cold weather.',
    recipe: [
      { materialId: 'mat-leather', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 75,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-hide-bracers',
    name: 'Hide Bracers',
    category: 'Armor',
    subCategory: 'Hide',
    description: 'Simple hide wrist wraps.',
    recipe: [
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 25,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-hide-boots',
    name: 'Hide Boots',
    category: 'Armor',
    subCategory: 'Hide',
    description: 'Warm fur-lined hide boots.',
    recipe: [
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 40,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-hide-shield',
    name: 'Hide Shield',
    category: 'Armor',
    subCategory: 'Hide',
    description: 'Light wooden buckler stretched with cured hide.',
    recipe: [
      { materialId: 'mat-leather', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 100,
    stock: 3,
    minStock: 1
  },

  // Studded Armor
  {
    id: 'item-studded-armor',
    name: 'Studded Armor',
    category: 'Armor',
    subCategory: 'Studded',
    description: 'Boiled leather armor reinforced with iron rivets.',
    recipe: [
      { materialId: 'mat-leather', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 85,
    stock: 3,
    minStock: 1
  },

  // Scaled Armor
  {
    id: 'item-scaled-helmet',
    name: 'Scaled Helmet',
    category: 'Armor',
    subCategory: 'Scaled',
    description: 'Steel-scaled light helm with cheek guards.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-scaled-armor',
    name: 'Scaled Armor',
    category: 'Armor',
    subCategory: 'Scaled',
    description: 'Overlapping steel and corundum scales over leather.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-corundum-ingot', qty: 1 },
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 310,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-scaled-bracers',
    name: 'Scaled Bracers',
    category: 'Armor',
    subCategory: 'Scaled',
    description: 'Steel-scaled forearm guards.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 125,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-scaled-boots',
    name: 'Scaled Boots',
    category: 'Armor',
    subCategory: 'Scaled',
    description: 'Scale-plated leather boots.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 125,
    stock: 2,
    minStock: 1
  },

  // Iron Armor
  {
    id: 'item-iron-helmet',
    name: 'Iron Helmet',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Classic horned iron Nord helm.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 50,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-iron-armor',
    name: 'Iron Armor',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Heavy iron breastplate and pauldrons.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 5 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 115,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-banded-iron-armor',
    name: 'Banded Iron Armor',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Reinforced iron-banded cuirass.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 4 },
      { materialId: 'mat-corundum-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 160,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-iron-gauntlets',
    name: 'Iron Gauntlets',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Articulated iron plate gauntlets.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 50,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-iron-boots',
    name: 'Iron Boots',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Heavy iron-shod greaves and boots.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 75,
    stock: 4,
    minStock: 2
  },
  {
    id: 'item-iron-shield',
    name: 'Iron Shield',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Solid round iron shield.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 95,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-banded-iron-shield',
    name: 'Banded Iron Shield',
    category: 'Armor',
    subCategory: 'Iron',
    description: 'Oak plank shield bound with heavy iron rims and boss.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 },
      { materialId: 'mat-wood', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 75,
    stock: 4,
    minStock: 2
  },

  // Ancient Nord Armor
  {
    id: 'item-ancient-nord-helmet',
    name: 'Ancient Nord Helmet',
    category: 'Armor',
    subCategory: 'Ancient Nord',
    description: 'Horned barrow helmet of Ysgramor’s era.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 50,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ancient-nord-armor',
    name: 'Ancient Nord Armor',
    category: 'Armor',
    subCategory: 'Ancient Nord',
    description: 'Light ancient Nord mail.',
    recipe: [{ materialId: 'mat-iron-ingot', qty: 1 }],
    useCustomPrice: false,
    customPrice: 25,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ancient-nord-cuirass',
    name: 'Ancient Nord Cuirass',
    category: 'Armor',
    subCategory: 'Ancient Nord',
    description: 'Heavy ancient Nord cuirass reinforced with iron.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 5 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 115,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ancient-nord-gauntlets',
    name: 'Ancient Nord Gauntlets',
    category: 'Armor',
    subCategory: 'Ancient Nord',
    description: 'Runic iron-plated barrow gauntlets.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 50,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-ancient-nord-boots',
    name: 'Ancient Nord Boots',
    category: 'Armor',
    subCategory: 'Ancient Nord',
    description: 'Heavy ancient Nord greaves and boots.',
    recipe: [
      { materialId: 'mat-iron-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 75,
    stock: 2,
    minStock: 1
  },

  // Imperial Armor
  {
    id: 'item-imperial-light-helmet',
    name: 'Imperial Light Helmet',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion light leather helm.',
    recipe: [
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 60,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-imperial-light-armor',
    name: 'Imperial Light Armor',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion light leather cuirass.',
    recipe: [
      { materialId: 'mat-leather', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 105,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-imperial-light-bracers',
    name: 'Imperial Light Bracers',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion light leather bracers.',
    recipe: [
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 45,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-imperial-light-boots',
    name: 'Imperial Light Boots',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion light leather boots.',
    recipe: [
      { materialId: 'mat-leather', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 60,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-imperial-heavy-helmet',
    name: 'Imperial Heavy Helmet',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion heavy steel helm.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-imperial-heavy-armor',
    name: 'Imperial Heavy Armor',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion heavy steel cuirass.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 230,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-imperial-heavy-gauntlets',
    name: 'Imperial Heavy Gauntlets',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion heavy steel gauntlets.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 130,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-imperial-heavy-boots',
    name: 'Imperial Heavy Boots',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion heavy steel boots.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 175,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-imperial-shield',
    name: 'Imperial Shield',
    category: 'Armor',
    subCategory: 'Imperial',
    description: 'Legion steel tower shield.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 225,
    stock: 2,
    minStock: 1
  },

  // Steel Armor
  {
    id: 'item-steel-helmet',
    name: 'Steel Helmet',
    category: 'Armor',
    subCategory: 'Steel',
    description: 'Forged steel helmet.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-steel-armor',
    name: 'Steel Armor',
    category: 'Armor',
    subCategory: 'Steel',
    description: 'Heavy steel cuirass.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 230,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-steel-gauntlets',
    name: 'Steel Gauntlets',
    category: 'Armor',
    subCategory: 'Steel',
    description: 'Heavy steel gauntlets.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 130,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-steel-boots',
    name: 'Steel Boots',
    category: 'Armor',
    subCategory: 'Steel',
    description: 'Heavy steel boots.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 175,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-steel-shield',
    name: 'Steel Shield',
    category: 'Armor',
    subCategory: 'Steel',
    description: 'Heavy steel shield.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 225,
    stock: 3,
    minStock: 1
  },

  // Wolf Armor
  {
    id: 'item-wolf-helmet',
    name: 'Wolf Helmet',
    category: 'Armor',
    subCategory: 'Wolf',
    description: 'Skyforge Wolf helmet.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-wolf-armor',
    name: 'Wolf Armor',
    category: 'Armor',
    subCategory: 'Wolf',
    description: 'Skyforge Wolf cuirass.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 240,
    stock: 3,
    minStock: 2
  },
  {
    id: 'item-wolf-gauntlets',
    name: 'Wolf Gauntlets',
    category: 'Armor',
    subCategory: 'Wolf',
    description: 'Skyforge Wolf gauntlets.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 105,
    stock: 3,
    minStock: 1
  },
  {
    id: 'item-wolf-boots',
    name: 'Wolf Boots',
    category: 'Armor',
    subCategory: 'Wolf',
    description: 'Skyforge Wolf boots.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 155,
    stock: 3,
    minStock: 1
  },

  // Corundum Armor
  {
    id: 'item-corundum-helmet',
    name: 'Corundum Helmet',
    category: 'Armor',
    subCategory: 'Corundum',
    description: 'Forged corundum helmet.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 150,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-corundum-armor',
    name: 'Corundum Armor',
    category: 'Armor',
    subCategory: 'Corundum',
    description: 'Heavy corundum cuirass.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 290,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-corundum-gauntlets',
    name: 'Corundum Gauntlets',
    category: 'Armor',
    subCategory: 'Corundum',
    description: 'Heavy corundum gauntlets.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 155,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-corundum-boots',
    name: 'Corundum Boots',
    category: 'Armor',
    subCategory: 'Corundum',
    description: 'Heavy corundum boots.',
    recipe: [
      { materialId: 'mat-corundum-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 220,
    stock: 2,
    minStock: 1
  },

  // Steel Plate Armor
  {
    id: 'item-steel-plate-helmet',
    name: 'Steel Plate Helmet',
    category: 'Armor',
    subCategory: 'Steel Plate',
    description: 'Winged steel plate helmet.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-corundum-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 165,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-steel-plate-armor',
    name: 'Steel Plate Armor',
    category: 'Armor',
    subCategory: 'Steel Plate',
    description: 'Heavy steel plate cuirass.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-corundum-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 335,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-steel-plate-gauntlets',
    name: 'Steel Plate Gauntlets',
    category: 'Armor',
    subCategory: 'Steel Plate',
    description: 'Heavy steel plate gauntlets.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-corundum-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 170,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-steel-plate-boots',
    name: 'Steel Plate Boots',
    category: 'Armor',
    subCategory: 'Steel Plate',
    description: 'Heavy steel plate boots.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 3 },
      { materialId: 'mat-corundum-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 220,
    stock: 2,
    minStock: 1
  },

  // Falmer Armor
  {
    id: 'item-falmer-helmet',
    name: 'Falmer Helmet',
    category: 'Armor',
    subCategory: 'Falmer',
    description: 'Chaurus-chitin helmet.',
    recipe: [
      { materialId: 'mat-chaurus-chitin', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 60,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-falmer-armor',
    name: 'Falmer Armor',
    category: 'Armor',
    subCategory: 'Falmer',
    description: 'Chaurus-chitin cuirass.',
    recipe: [
      { materialId: 'mat-chaurus-chitin', qty: 5 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 175,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-falmer-gauntlets',
    name: 'Falmer Gauntlets',
    category: 'Armor',
    subCategory: 'Falmer',
    description: 'Segmented chaurus-plate gauntlets.',
    recipe: [
      { materialId: 'mat-chaurus-chitin', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 85,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-falmer-boots',
    name: 'Falmer Boots',
    category: 'Armor',
    subCategory: 'Falmer',
    description: 'Chaurus-shell greaves and boots.',
    recipe: [
      { materialId: 'mat-chaurus-chitin', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 115,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-falmer-shield',
    name: 'Falmer Shield',
    category: 'Armor',
    subCategory: 'Falmer',
    description: 'Curved chaurus-carapace shield.',
    recipe: [
      { materialId: 'mat-chaurus-chitin', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 120,
    stock: 2,
    minStock: 1
  },

  // Dwarven Armor
  {
    id: 'item-dwarven-helmet',
    name: 'Dwarven Helmet',
    category: 'Armor',
    subCategory: 'Dwarven',
    description: 'Bearded golden Dwemer bronze visage helm.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 150,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-dwarven-armor',
    name: 'Dwarven Armor',
    category: 'Armor',
    subCategory: 'Dwarven',
    description: 'Heavy interlocking Dwemer bronze plate cuirass.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 5 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 400,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-dwarven-gauntlets',
    name: 'Dwarven Gauntlets',
    category: 'Armor',
    subCategory: 'Dwarven',
    description: 'Thick Dwemer metal gauntlets.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 155,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-dwarven-boots',
    name: 'Dwarven Boots',
    category: 'Armor',
    subCategory: 'Dwarven',
    description: 'Heavy Dwemer metal boots.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 220,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-dwarven-shield',
    name: 'Dwarven Shield',
    category: 'Armor',
    subCategory: 'Dwarven',
    description: 'Ornate round Dwemer alloy shield.',
    recipe: [
      { materialId: 'mat-dwarven-ingot', qty: 4 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 310,
    stock: 2,
    minStock: 1
  },

  // Elven Armor
  {
    id: 'item-elven-helmet',
    name: 'Elven Helmet',
    category: 'Armor',
    subCategory: 'Elven',
    description: 'Crested moonstone light helmet.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 215,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-elven-armor',
    name: 'Elven Armor',
    category: 'Armor',
    subCategory: 'Elven',
    description: 'Gilded refined moonstone cuirass.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 4 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 530,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-elven-gilded-armor',
    name: 'Elven Gilded Armor',
    category: 'Armor',
    subCategory: 'Elven',
    description: 'Master-crafted gilded moonstone cuirass.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 4 },
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-gold-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 700,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-elven-gauntlets',
    name: 'Elven Gauntlets',
    category: 'Armor',
    subCategory: 'Elven',
    description: 'Light moonstone gauntlets.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 220,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-elven-boots',
    name: 'Elven Boots',
    category: 'Armor',
    subCategory: 'Elven',
    description: 'Graceful moonstone-plated boots.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 220,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-elven-shield',
    name: 'Elven Shield',
    category: 'Armor',
    subCategory: 'Elven',
    description: 'Leaf-shaped refined moonstone shield.',
    recipe: [
      { materialId: 'mat-moonstone-ingot', qty: 4 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 490,
    stock: 1,
    minStock: 1
  },

  // Nordic Carved Armor
  {
    id: 'item-nordic-carved-helmet',
    name: 'Nordic Carved Helmet',
    category: 'Armor',
    subCategory: 'Nordic Carved',
    description: 'Bear-motif carved quicksilver and steel helm.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 235,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nordic-carved-cuirass',
    name: 'Nordic Carved Armor',
    category: 'Armor',
    subCategory: 'Nordic Carved',
    description: 'Heavy steel and quicksilver plate etched with Old Nordic knotwork.',
    recipe: [
      { materialId: 'mat-steel-ingot', qty: 4 },
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-ebony-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 560,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-nordic-carved-gauntlets',
    name: 'Nordic Carved Gauntlets',
    category: 'Armor',
    subCategory: 'Nordic Carved',
    description: 'Engraved quicksilver-and-steel gauntlets.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 240,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nordic-carved-boots',
    name: 'Nordic Carved Boots',
    category: 'Armor',
    subCategory: 'Nordic Carved',
    description: 'Fur-trimmed carved quicksilver plate boots.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-steel-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 240,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-nordic-shield',
    name: 'Nordic Shield',
    category: 'Armor',
    subCategory: 'Nordic Carved',
    description: 'Carved quicksilver-trimmed round war shield.',
    recipe: [
      { materialId: 'mat-quicksilver-ingot', qty: 3 },
      { materialId: 'mat-steel-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 380,
    stock: 1,
    minStock: 1
  },

  // Orichalcum Armor
  {
    id: 'item-orcish-helmet',
    name: 'Orichalcum Helmet',
    category: 'Armor',
    subCategory: 'Orichalcum',
    description: 'Heavy horned orichalcum helm.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 180,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-orcish-armor',
    name: 'Orichalcum Armor',
    category: 'Armor',
    subCategory: 'Orichalcum',
    description: 'Layered green-metal stronghold plate armor.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 365,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-orcish-gauntlets',
    name: 'Orichalcum Gauntlets',
    category: 'Armor',
    subCategory: 'Orichalcum',
    description: 'Heavy spiked orichalcum gauntlets.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 2 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 185,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-orcish-boots',
    name: 'Orichalcum Boots',
    category: 'Armor',
    subCategory: 'Orichalcum',
    description: 'Heavy plated orichalcum boots.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 3 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 260,
    stock: 2,
    minStock: 1
  },
  {
    id: 'item-orcish-shield',
    name: 'Orichalcum Shield',
    category: 'Armor',
    subCategory: 'Orichalcum',
    description: 'Heavy jagged orichalcum tower shield.',
    recipe: [
      { materialId: 'mat-orichalcum-ingot', qty: 4 },
      { materialId: 'mat-iron-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 330,
    stock: 1,
    minStock: 1
  },

  // Glass Armor
  {
    id: 'item-glass-helmet',
    name: 'Glass Helmet',
    category: 'Armor',
    subCategory: 'Glass',
    description: 'Plumed malachite-and-moonstone light helmet.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 2 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 355,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-armor',
    name: 'Glass Armor',
    category: 'Armor',
    subCategory: 'Glass',
    description: 'Crystalline malachite scale cuirass trimmed in moonstone.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 4 },
      { materialId: 'mat-moonstone-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 730,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-gauntlets',
    name: 'Glass Gauntlets',
    category: 'Armor',
    subCategory: 'Glass',
    description: 'Lightweight crystalline malachite gauntlets.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 2 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 360,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-boots',
    name: 'Glass Boots',
    category: 'Armor',
    subCategory: 'Glass',
    description: 'Gleaming malachite-and-moonstone boots.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 2 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 360,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-glass-shield',
    name: 'Glass Shield',
    category: 'Armor',
    subCategory: 'Glass',
    description: 'Winged malachite-and-moonstone shield.',
    recipe: [
      { materialId: 'mat-malachite-ingot', qty: 4 },
      { materialId: 'mat-moonstone-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 610,
    stock: 1,
    minStock: 1
  },

  // Ebony Armor
  {
    id: 'item-ebony-helmet',
    name: 'Ebony Helmet',
    category: 'Armor',
    subCategory: 'Ebony',
    description: 'Full-face sculpted volcanic ebony helmet.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 340,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-armor',
    name: 'Ebony Armor',
    category: 'Armor',
    subCategory: 'Ebony',
    description: 'Masterwork heavy ebony plate cuirass.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 5 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 855,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-gauntlets',
    name: 'Ebony Gauntlets',
    category: 'Armor',
    subCategory: 'Ebony',
    description: 'Articulated volcanic ebony gauntlets.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 345,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-boots',
    name: 'Ebony Boots',
    category: 'Armor',
    subCategory: 'Ebony',
    description: 'Heavy blackened ebony plate boots.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 3 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 515,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-ebony-shield',
    name: 'Ebony Shield',
    category: 'Armor',
    subCategory: 'Ebony',
    description: 'Reinforced heavy ebony war shield.',
    recipe: [
      { materialId: 'mat-ebony-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 680,
    stock: 1,
    minStock: 1
  },

  // Stalhrim Armor (Light & Heavy)
  {
    id: 'item-stalhrim-light-helmet',
    name: 'Stalhrim Light Helmet',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Skaal-crafted frost-crystal light helm.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 445,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-light-armor',
    name: 'Stalhrim Light Armor',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Fur-lined Stalhrim crystalline light cuirass.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 4 },
      { materialId: 'mat-leather', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 885,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-light-bracers',
    name: 'Stalhrim Light Bracers',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Skaal Stalhrim light bracers.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 445,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-light-boots',
    name: 'Stalhrim Light Boots',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Fur-trimmed Stalhrim light boots.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 2 },
      { materialId: 'mat-leather', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 445,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-heavy-helmet',
    name: 'Stalhrim Heavy Helmet',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Horned glacial Stalhrim heavy helm.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 2 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 515,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-heavy-armor',
    name: 'Stalhrim Heavy Armor',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Heavy ancient frost-crystal plate cuirass.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 4 },
      { materialId: 'mat-quicksilver-ingot', qty: 2 },
      { materialId: 'mat-leather-strips', qty: 3 }
    ],
    useCustomPrice: false,
    customPrice: 1035,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-heavy-gauntlets',
    name: 'Stalhrim Heavy Gauntlets',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Heavy glacial Stalhrim gauntlets.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 2 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 520,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-heavy-boots',
    name: 'Stalhrim Heavy Boots',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Heavy glacial Stalhrim plate boots.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 3 },
      { materialId: 'mat-quicksilver-ingot', qty: 1 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 730,
    stock: 1,
    minStock: 1
  },
  {
    id: 'item-stalhrim-shield',
    name: 'Stalhrim Shield',
    category: 'Armor',
    subCategory: 'Stalhrim',
    description: 'Enchanted frost-ice round war shield.',
    recipe: [
      { materialId: 'mat-stalhrim-ingot', qty: 4 },
      { materialId: 'mat-leather-strips', qty: 2 }
    ],
    useCustomPrice: false,
    customPrice: 850,
    stock: 1,
    minStock: 1
  },

  // =========================================================================
  // SMELTED INGOTS, TANNING & FUEL (EXACT SMELTERY & RACK FORMULAS)
  // =========================================================================
  {
    id: 'item-smelted-iron-ingot',
    name: 'Iron Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Iron Ore + 1x Poor Charcoal.',
    recipe: [
      { materialId: 'mat-iron-ore', qty: 1 },
      { materialId: 'mat-poor-charcoal', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 20,
    stock: 20,
    minStock: 8
  },
  {
    id: 'item-smelted-steel-ingot',
    name: 'Steel Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Iron Ore + 1x Corundum Ore + 1x Charcoal.',
    recipe: [
      { materialId: 'mat-iron-ore', qty: 1 },
      { materialId: 'mat-corundum-ore', qty: 1 },
      { materialId: 'mat-charcoal', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 50,
    stock: 16,
    minStock: 6
  },
  {
    id: 'item-smelted-corundum-ingot',
    name: 'Corundum Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Corundum Ore + 1x Charcoal.',
    recipe: [
      { materialId: 'mat-corundum-ore', qty: 1 },
      { materialId: 'mat-charcoal', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 40,
    stock: 12,
    minStock: 5
  },
  {
    id: 'item-smelted-dwarven-ingot',
    name: 'Dwarven Metal Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Dwemer Scrap Metal + 1x Charcoal.',
    recipe: [
      { materialId: 'mat-dwemer-scrap', qty: 1 },
      { materialId: 'mat-charcoal', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 35,
    stock: 14,
    minStock: 6
  },
  {
    id: 'item-smelted-orichalcum-ingot',
    name: 'Orichalcum Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Orichalcum Ore + 1x Briquettes.',
    recipe: [
      { materialId: 'mat-orichalcum-ore', qty: 1 },
      { materialId: 'mat-briquettes', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 55,
    stock: 8,
    minStock: 4
  },
  {
    id: 'item-smelted-quicksilver-ingot',
    name: 'Quicksilver Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Quicksilver Ore + 1x Briquettes.',
    recipe: [
      { materialId: 'mat-quicksilver-ore', qty: 1 },
      { materialId: 'mat-briquettes', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 60,
    stock: 8,
    minStock: 4
  },
  {
    id: 'item-smelted-silver-ingot',
    name: 'Silver Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Silver Ore + 1x Charcoal.',
    recipe: [
      { materialId: 'mat-silver-ore', qty: 1 },
      { materialId: 'mat-charcoal', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 42,
    stock: 8,
    minStock: 4
  },
  {
    id: 'item-smelted-gold-ingot',
    name: 'Gold Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Gold Ore + 1x Briquettes.',
    recipe: [
      { materialId: 'mat-gold-ore', qty: 1 },
      { materialId: 'mat-briquettes', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 70,
    stock: 5,
    minStock: 3
  },
  {
    id: 'item-smelted-moonstone-ingot',
    name: 'Refined Moonstone',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Moonstone Ore + 1x Briquettes.',
    recipe: [
      { materialId: 'mat-moonstone-ore', qty: 1 },
      { materialId: 'mat-briquettes', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 62,
    stock: 6,
    minStock: 3
  },
  {
    id: 'item-smelted-malachite-ingot',
    name: 'Refined Malachite',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Malachite Ore + 1x Coke.',
    recipe: [
      { materialId: 'mat-malachite-ore', qty: 1 },
      { materialId: 'mat-coke', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 83,
    stock: 6,
    minStock: 3
  },
  {
    id: 'item-smelted-ebony-ingot',
    name: 'Ebony Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Ebony Ore + 1x Coke.',
    recipe: [
      { materialId: 'mat-ebony-ore', qty: 1 },
      { materialId: 'mat-coke', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 104,
    stock: 5,
    minStock: 3
  },
  {
    id: 'item-smelted-stalhrim-ingot',
    name: 'Stalhrim Ingot',
    category: 'Ingots & Materials',
    subCategory: 'Smelted Ingots',
    description: 'Smelted from 1x Glacial Crystal + 1x Coke.',
    recipe: [
      { materialId: 'mat-glacial-crystal', qty: 1 },
      { materialId: 'mat-coke', qty: 1 }
    ],
    useCustomPrice: false,
    customPrice: 125,
    stock: 4,
    minStock: 2
  },

  // Hides & Leather Strips (Tanning Rack Recipes)
  {
    id: 'item-catalog-leather',
    name: 'Tanned Leather (from Animal Pelt)',
    category: 'Ingots & Materials',
    subCategory: 'Hides & Straps',
    description: 'Cured from 1x Animal Pelt on the tanning rack.',
    recipe: [{ materialId: 'mat-animal-pelt', qty: 1 }],
    useCustomPrice: false,
    customPrice: 12,
    stock: 15,
    minStock: 5
  },
  {
    id: 'item-catalog-leather-wolf',
    name: 'Tanned Leather (from Wolf Pelt)',
    category: 'Ingots & Materials',
    subCategory: 'Hides & Straps',
    description: 'Cured from 1x Wolf Pelt on the tanning rack.',
    recipe: [{ materialId: 'mat-wolf-pelt', qty: 1 }],
    useCustomPrice: false,
    customPrice: 14,
    stock: 10,
    minStock: 4
  },
  {
    id: 'item-catalog-leather-deer',
    name: 'Tanned Leather (2x from Deer Pelt)',
    category: 'Ingots & Materials',
    subCategory: 'Hides & Straps',
    description: 'Cured from 1x Deer Pelt into 2 hides.',
    recipe: [{ materialId: 'mat-deer-pelt', qty: 1 }],
    useCustomPrice: false,
    customPrice: 17,
    stock: 10,
    minStock: 4
  },
  {
    id: 'item-catalog-leather-sabrecat',
    name: 'Tanned Leather (3x from Sabre Cat Pelt)',
    category: 'Ingots & Materials',
    subCategory: 'Hides & Straps',
    description: 'Cured from 1x Sabre Cat Pelt into 3 hides.',
    recipe: [{ materialId: 'mat-sabre-cat-pelt', qty: 1 }],
    useCustomPrice: false,
    customPrice: 31,
    stock: 6,
    minStock: 3
  },
  {
    id: 'item-catalog-leather-bear',
    name: 'Tanned Leather (4x from Bear Pelt)',
    category: 'Ingots & Materials',
    subCategory: 'Hides & Straps',
    description: 'Cured from 1x Bear Pelt into 4 hides.',
    recipe: [{ materialId: 'mat-bear-pelt', qty: 1 }],
    useCustomPrice: false,
    customPrice: 35,
    stock: 6,
    minStock: 3
  },
  {
    id: 'item-catalog-leather-strips',
    name: 'Leather Strips (Bundle of 4)',
    category: 'Ingots & Materials',
    subCategory: 'Hides & Straps',
    description: 'Cut from 1x Tanned Leather into 4 strips.',
    recipe: [{ materialId: 'mat-leather', qty: 1 }],
    useCustomPrice: false,
    customPrice: 17,
    stock: 20,
    minStock: 8
  },

  // Fuel
  {
    id: 'item-catalog-poor-charcoal',
    name: 'Poor Charcoal',
    category: 'Ingots & Materials',
    subCategory: 'Fuel',
    description: 'Basic wood charcoal for low-heat smelting.',
    recipe: [{ materialId: 'mat-poor-charcoal', qty: 1 }],
    useCustomPrice: false,
    customPrice: 3,
    stock: 30,
    minStock: 10
  },
  {
    id: 'item-catalog-charcoal',
    name: 'Charcoal',
    category: 'Ingots & Materials',
    subCategory: 'Fuel',
    description: 'Standard hardwood forge charcoal.',
    recipe: [{ materialId: 'mat-charcoal', qty: 1 }],
    useCustomPrice: false,
    customPrice: 7,
    stock: 25,
    minStock: 10
  },
  {
    id: 'item-catalog-briquettes',
    name: 'Briquettes',
    category: 'Ingots & Materials',
    subCategory: 'Fuel',
    description: 'Compressed coal briquettes for steady forge heat.',
    recipe: [{ materialId: 'mat-briquettes', qty: 1 }],
    useCustomPrice: false,
    customPrice: 13,
    stock: 20,
    minStock: 8
  },
  {
    id: 'item-catalog-coke',
    name: 'Coke',
    category: 'Ingots & Materials',
    subCategory: 'Fuel',
    description: 'High-heat purified forge coke for rare metals and Stalhrim.',
    recipe: [{ materialId: 'mat-coke', qty: 1 }],
    useCustomPrice: false,
    customPrice: 20,
    stock: 15,
    minStock: 6
  }
];

const INITIAL_CATALOG_ITEMS = INITIAL_CATALOG_ITEMS_RAW.map((item) => ({
  ...item,
  customPrice: 0,
  stock: 0,
  minStock: 0
}));

// --- HELPER: DATE FORMATTING ---
const getLocalDateString = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INITIAL_SALES = [];

const INITIAL_ORDERS = [];

const INITIAL_SUPPLY_RECORDS = [];

const INITIAL_PROFILES = [];

// Helper to compute total units & breakdown snapshot for a materials array
const buildMaterialSnapshotEntry = (matsList, dateStr) => {
  const byId = {};
  let totalUnits = 0;
  matsList.forEach((m) => {
    const qty = Math.max(0, Number(m.stock) || 0);
    byId[m.id] = qty;
    totalUnits += qty;
  });
  return { dateStr, totalUnits, byId };
};

export default function App() {
  // --- AUTHENTICATION & ROLE STATE ---
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState('smith'); // 'smith' | 'guest'
  const [loginNameInput, setLoginNameInput] = useState('');
  const [loginPasscodeInput, setLoginPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  // Configurable Forge Passcodes (Smiths: "Wuuthrad" | Guests: "Whiterun")
  const [forgePasscode] = useState('Wuuthrad');
  const [guestPasscode] = useState('Whiterun');

  // Admin Passcode & Admin Unlock State (default: "Ysgramor")
  const [adminPasscode] = useState('Ysgramor');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminUnlockInput, setAdminUnlockInput] = useState('');
  const [newAdminPasscodeDraft, setNewAdminPasscodeDraft] = useState('');

  // Registered / Active Profiles Roster
  const [memberProfiles, setMemberProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_profiles_v11');
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });
  const [selectedProfileDetail, setSelectedProfileDetail] = useState(null);

  // --- PERSISTENT SKYFORGE DATA (CLEAN SLATE v13) ---
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

  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_sales_v13');
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_categories_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [subCategoriesMap, setSubCategoriesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_subcategories_v13');
      return saved ? JSON.parse(saved) : SUBCATEGORIES_BY_CATEGORY;
    } catch {
      return SUBCATEGORIES_BY_CATEGORY;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_orders_v13');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [supplyRecords, setSupplyRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_supply_v13');
      return saved ? JSON.parse(saved) : INITIAL_SUPPLY_RECORDS;
    } catch {
      return INITIAL_SUPPLY_RECORDS;
    }
  });

  // Daily resource stock history snapshots for the Resource Trend Graph
  const [materialHistory, setMaterialHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_mat_history_v13');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [trendMaterialFilter, setTrendMaterialFilter] = useState('all'); // 'all' | materialId

  // --- UI & NAVIGATION STATE ---
  const [activeWorkerTab, setActiveWorkerTab] = useState('dashboard');
  const [stockSubView, setStockSubView] = useState('materials'); // 'materials' | 'finished'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('All');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [finishedStockSearch, setFinishedStockSearch] = useState('');
  const [recipeBoardSearch, setRecipeBoardSearch] = useState('');
  const [recipeBoardCatFilter, setRecipeBoardCatFilter] = useState('All');
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [confirmResetModal, setConfirmResetModal] = useState(false);

  // --- LOG SALE FORM STATE ---
  const [saleItemId, setSaleItemId] = useState(INITIAL_CATALOG_ITEMS[0].id);
  const [saleItemSearch, setSaleItemSearch] = useState(INITIAL_CATALOG_ITEMS[0].name);
  const [showSaleItemDropdown, setShowSaleItemDropdown] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [saleUnitPrice, setSaleUnitPrice] = useState(0);
  const [saleUnitCost, setSaleUnitCost] = useState(0);
  const [buyerName, setBuyerName] = useState('');
  const [workerNameInput, setWorkerNameInput] = useState('');
  const [saleDateStr, setSaleDateStr] = useState(getLocalDateString(0));
  const [deductStockOnSale, setDeductStockOnSale] = useState(true);

  // --- LOG COMMISSION / ORDER FORM STATE ---
  const [orderItemId, setOrderItemId] = useState(INITIAL_CATALOG_ITEMS[0].id);
  const [orderItemSearch, setOrderItemSearch] = useState(INITIAL_CATALOG_ITEMS[0].name);
  const [showOrderItemDropdown, setShowOrderItemDropdown] = useState(false);
  const [customOrderItemName, setCustomOrderItemName] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [orderAgreedPrice, setOrderAgreedPrice] = useState(0);
  const [orderBuyerName, setOrderBuyerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('pending'); // 'pending' | 'done' | 'all'
  const [logSaleOnOrderComplete, setLogSaleOnOrderComplete] = useState(true);

  // --- MATERIAL DELIVERIES & PENDING SUPPLY ORDERS STATE ---
  const [ordersSectionMode, setOrdersSectionMode] = useState('customer'); // 'customer' | 'supplies'
  const [supplierNameInput, setSupplierNameInput] = useState('');
  const [supplyMaterialId, setSupplyMaterialId] = useState(INITIAL_MATERIALS[0]?.id || '');
  const [customSupplyMatName, setCustomSupplyMatName] = useState('');
  const [supplyQty, setSupplyQty] = useState(0);
  const [supplyCostGold, setSupplyCostGold] = useState(0);
  const [supplyStatusInput, setSupplyStatusInput] = useState('delivered'); // 'delivered' | 'pending'
  const [supplyDateStr, setSupplyDateStr] = useState(getLocalDateString(0));
  const [supplyNotes, setSupplyNotes] = useState('');
  const [supplyFilter, setSupplyFilter] = useState('all'); // 'all' | 'pending' | 'delivered'
  const [addDeliveredStockToVault, setAddDeliveredStockToVault] = useState(true);

  // --- ADD NEW MATERIAL FORM STATE ---
  const [newMatName, setNewMatName] = useState('');
  const [newMatCat, setNewMatCat] = useState('Smelted Ingots');
  const [newMatBuyPrice, setNewMatBuyPrice] = useState(0);
  const [newMatStock, setNewMatStock] = useState(0);
  const [newMatUnit, setNewMatUnit] = useState('bars');

  // --- RECIPE EDITOR MODAL STATE ---
  const [editingItemId, setEditingItemId] = useState(null);
  const [addRecipeMatId, setAddRecipeMatId] = useState('');
  const [addRecipeQty, setAddRecipeQty] = useState(1);

  // --- CATEGORY & SUBCATEGORY MANAGER STATE ---
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedManageCat, setSelectedManageCat] = useState('Weapons');
  const [standaloneCategoryName, setStandaloneCategoryName] = useState('');
  const [newSubCatInput, setNewSubCatInput] = useState('');
  const [quickBoardSubCatInput, setQuickBoardSubCatInput] = useState('');
  const [renamingSubCat, setRenamingSubCat] = useState(null);
  const [renameSubCatValue, setRenameSubCatValue] = useState('');

  // --- ADD NEW CATALOG ITEM MODAL STATE ---
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Weapons');
  const [isCreatingNewCatInModal, setIsCreatingNewCatInModal] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newItemSubCategory, setNewItemSubCategory] = useState('Iron');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemStock, setNewItemStock] = useState(0);
  const [newItemMinStock, setNewItemMinStock] = useState(0);
  const [newItemMatId, setNewItemMatId] = useState(INITIAL_MATERIALS[0]?.id || '');
  const [newItemMatQty, setNewItemMatQty] = useState(1);
  const [newItemRecipe, setNewItemRecipe] = useState([]);
  // --- EXPORT DATA MODAL & ADMIN SIDEBAR STATE ---
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const backupFileInputRef = React.useRef(null);

  // --- SYNC TO LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('skyforge_profiles_v11', JSON.stringify(memberProfiles));
  }, [memberProfiles]);

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
    localStorage.setItem('skyforge_sales_v13', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('skyforge_categories_v13', JSON.stringify(customCategories));
  }, [customCategories]);

  useEffect(() => {
    localStorage.setItem('skyforge_subcategories_v13', JSON.stringify(subCategoriesMap));
  }, [subCategoriesMap]);

  useEffect(() => {
    localStorage.setItem('skyforge_orders_v13', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('skyforge_supply_v13', JSON.stringify(supplyRecords));
  }, [supplyRecords]);

  // Record/update today's material stock snapshot whenever materials change
  useEffect(() => {
    const today = getLocalDateString(0);
    setMaterialHistory((prev) => {
      const entry = buildMaterialSnapshotEntry(materials, today);
      const idx = prev.findIndex((h) => h.dateStr === today);
      let next;
      if (idx >= 0) {
        next = [...prev];
        next[idx] = entry;
      } else {
        next = [...prev, entry].slice(-30); // keep last 30 days
      }
      try {
        localStorage.setItem('skyforge_mat_history_v13', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [materials]);

  // --- ALL AVAILABLE CATEGORIES & SUBCATEGORIES (DEFAULT + CUSTOM + ANY ON ITEMS) ---
  const allCategories = useMemo(() => {
    const base = ['Weapons', 'Armor', 'Ingots & Materials'];
    const set = new Set([...base, ...customCategories]);
    catalogItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [customCategories, catalogItems]);

  const resolvedSubCategoriesByCategory = useMemo(() => {
    const merged = { ...subCategoriesMap };
    allCategories.forEach((cat) => {
      const existing = new Set(merged[cat] || SUBCATEGORIES_BY_CATEGORY[cat] || []);
      catalogItems.forEach((item) => {
        if (item.category === cat && item.subCategory) {
          existing.add(item.subCategory);
        }
      });
      merged[cat] = Array.from(existing);
    });
    return merged;
  }, [subCategoriesMap, allCategories, catalogItems]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // --- FIREBASE ANONYMOUS SESSION ---
  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsub();
  }, []);

  // --- MATERIAL LOOKUP & ENRICHED CATALOG ---
  const materialMap = useMemo(() => {
    const map = {};
    materials.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [materials]);

  const enrichedCatalog = useMemo(() => {
    return catalogItems.map((item) => {
      const materialCost = (item.recipe || []).reduce((sum, req) => {
        const mat = materialMap[req.materialId];
        return sum + (mat ? mat.buyPrice * req.qty : 0);
      }, 0);
      const calculatedPrice = Math.round(materialCost * (1 + profitMarginPct / 100));
      const finalPrice = item.useCustomPrice ? Number(item.customPrice || 0) : calculatedPrice;
      const unitProfit = finalPrice - materialCost;
      return {
        ...item,
        materialCost,
        calculatedPrice,
        finalPrice,
        unitProfit
      };
    });
  }, [catalogItems, materialMap, profitMarginPct]);

  useEffect(() => {
    if (saleItemId !== 'custom') {
      const found = enrichedCatalog.find((i) => i.id === saleItemId);
      if (found) {
        setSaleUnitPrice(found.finalPrice);
        setSaleUnitCost(found.materialCost);
      }
    }
  }, [saleItemId, enrichedCatalog]);

  useEffect(() => {
    if (orderItemId !== 'custom') {
      const found = enrichedCatalog.find((i) => i.id === orderItemId);
      if (found) {
        setOrderAgreedPrice(found.finalPrice);
      }
    }
  }, [orderItemId, enrichedCatalog]);

  const filteredSaleOptions = useMemo(() => {
    const q = saleItemSearch.trim().toLowerCase();
    if (!q) return enrichedCatalog;
    return enrichedCatalog.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.subCategory && i.subCategory.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q)
    );
  }, [enrichedCatalog, saleItemSearch]);

  const filteredOrderOptions = useMemo(() => {
    const q = orderItemSearch.trim().toLowerCase();
    if (!q) return enrichedCatalog;
    return enrichedCatalog.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.subCategory && i.subCategory.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q)
    );
  }, [enrichedCatalog, orderItemSearch]);

  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'pending').length,
    [orders]
  );

  const pendingSupplyCount = useMemo(
    () => supplyRecords.filter((s) => s.status === 'pending').length,
    [supplyRecords]
  );

  // --- WORKER / GUEST PASSCODE LOGIN & LOGOUT HANDLERS ---
  const handlePasscodeLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const trimmedName = loginNameInput.trim();
    if (!trimmedName) {
      setAuthError('Please enter your name or character name.');
      return;
    }

    const expectedPasscode = loginRole === 'guest' ? guestPasscode : forgePasscode;
    if (loginPasscodeInput.trim().toLowerCase() !== expectedPasscode.trim().toLowerCase()) {
      setAuthError(
        loginRole === 'guest'
          ? 'Incorrect Guest Passcode. Ask a Smith for the Guest Pass.'
          : 'Incorrect Smith Passcode. Ask the Master Smith for access.'
      );
      return;
    }

    const today = getLocalDateString(0);
    const roleLabel = loginRole === 'guest' ? 'Forge Guest' : 'Smith of The Skyforge';

    setMemberProfiles((prev) => {
      const idx = prev.findIndex((p) => p.name.toLowerCase() === trimmedName.toLowerCase());
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          role: loginRole,
          lastActive: today
        };
        return updated;
      }
      return [
        ...prev,
        {
          name: trimmedName,
          role: loginRole,
          joinedAt: today,
          lastActive: today
        }
      ];
    });

    const profile = {
      uid: firebaseUser?.uid || `user-${Date.now()}`,
      name: trimmedName,
      roleType: loginRole,
      role: roleLabel
    };
    setWorkerProfile(profile);
    setWorkerNameInput(trimmedName);
    setActiveWorkerTab('dashboard');
    setShowLoginModal(false);
    setLoginNameInput('');
    setLoginPasscodeInput('');

    if (loginRole === 'guest') {
      triggerToast(`Welcome to The Skyforge, ${trimmedName} (Guest Pass).`);
    } else {
      triggerToast(`By Kyne and Ysgramor, well met ${trimmedName}. Your profile is active.`);
    }
  };

  const handleUnlockAdmin = (e) => {
    e.preventDefault();
    if (adminUnlockInput.trim().toLowerCase() !== adminPasscode.trim().toLowerCase()) {
      triggerToast('Incorrect Admin Passcode.');
      return;
    }
    setIsAdminUnlocked(true);
    setAdminUnlockInput('');
    setShowAdminSidebar(true);
    triggerToast('Master Admin controls unlocked.');
  };

  const handleDeleteProfile = (profileName) => {
    if (!isAdminUnlocked) {
      triggerToast('Unlock Admin Controls to delete profiles.');
      return;
    }
    if (workerProfile?.name.toLowerCase() === profileName.toLowerCase()) {
      triggerToast('You cannot delete the profile you are currently signed in with.');
      return;
    }
    setMemberProfiles((prev) =>
      prev.filter((p) => p.name.toLowerCase() !== profileName.toLowerCase())
    );
    if (selectedProfileDetail?.toLowerCase() === profileName.toLowerCase()) {
      setSelectedProfileDetail(null);
    }
    triggerToast(`Removed "${profileName}" from the Forge Roster.`);
  };

  const handleWorkerLogout = async () => {
    setWorkerProfile(null);
    setIsAdminUnlocked(false);
    setShowAdminSidebar(false);
    setAdminUnlockInput('');
    setActiveWorkerTab('dashboard');
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error(e);
      }
    }
    triggerToast('Stepped down from The Skyforge. Public board active.');
  };

  // --- INDIVIDUAL PROFILE STATS AGGREGATION ---
  const todayStr = getLocalDateString(0);
  const sevenDaysAgoStr = getLocalDateString(-6);

  const profileStatsList = useMemo(() => {
    const map = {};

    memberProfiles.forEach((p) => {
      map[p.name.toLowerCase()] = {
        name: p.name,
        role: p.role || 'smith',
        joinedAt: p.joinedAt || todayStr,
        lastActive: p.lastActive || todayStr,
        salesCount: 0,
        itemsSold: 0,
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        todayProfit: 0,
        weeklyProfit: 0,
        itemBreakdown: {},
        recentSales: []
      };
    });

    sales.forEach((s) => {
      const smithRaw = (s.workerName || 'Skyforge Smith').trim();
      const key = smithRaw.toLowerCase();
      if (!map[key]) {
        map[key] = {
          name: smithRaw,
          role: 'smith',
          joinedAt: s.dateStr || todayStr,
          lastActive: s.dateStr || todayStr,
          salesCount: 0,
          itemsSold: 0,
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
          todayProfit: 0,
          weeklyProfit: 0,
          itemBreakdown: {},
          recentSales: []
        };
      }
      const entry = map[key];
      const qty = Number(s.quantity || 1);
      const rev = Number(s.totalRevenue ?? s.totalPrice ?? 0);
      const cost = Number(s.totalCost ?? 0);
      const prof = Number(s.profit ?? rev - cost);

      entry.salesCount += 1;
      entry.itemsSold += qty;
      entry.totalRevenue += rev;
      entry.totalCost += cost;
      entry.totalProfit += prof;
      if (s.dateStr === todayStr) entry.todayProfit += prof;
      if (s.dateStr >= sevenDaysAgoStr && s.dateStr <= todayStr) entry.weeklyProfit += prof;
      if (s.dateStr && s.dateStr > entry.lastActive) entry.lastActive = s.dateStr;

      entry.itemBreakdown[s.itemName] = (entry.itemBreakdown[s.itemName] || 0) + qty;
      entry.recentSales.push(s);
    });

    return Object.values(map)
      .map((entry) => {
        let topItem = 'None yet';
        let topQty = 0;
        Object.entries(entry.itemBreakdown).forEach(([itemName, count]) => {
          if (count > topQty) {
            topQty = count;
            topItem = itemName;
          }
        });
        return { ...entry, topItem, topQty };
      })
      .sort((a, b) => b.totalProfit - a.totalProfit || b.salesCount - a.salesCount);
  }, [memberProfiles, sales, todayStr, sevenDaysAgoStr]);

  // --- SALES & PROFIT ANALYTICS ---
  const profitStats = useMemo(() => {
    let todayProfit = 0;
    let todayRevenue = 0;
    let weeklyProfit = 0;
    let weeklyRevenue = 0;
    let allTimeProfit = 0;
    const itemCounts = {};

    sales.forEach((s) => {
      const rev = Number(s.totalRevenue ?? s.totalPrice ?? 0);
      const prof = Number(s.profit ?? rev);
      allTimeProfit += prof;

      if (s.dateStr === todayStr) {
        todayProfit += prof;
        todayRevenue += rev;
      }
      if (s.dateStr >= sevenDaysAgoStr && s.dateStr <= todayStr) {
        weeklyProfit += prof;
        weeklyRevenue += rev;
      }
      itemCounts[s.itemName] = (itemCounts[s.itemName] || 0) + Number(s.quantity || 1);
    });

    let topItem = 'None yet';
    let topCount = 0;
    Object.entries(itemCounts).forEach(([name, count]) => {
      if (count > topCount) {
        topCount = count;
        topItem = name;
      }
    });

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const dStr = getLocalDateString(-i);
      const daySales = sales.filter((s) => s.dateStr === dStr);
      const dayProfit = daySales.reduce((acc, s) => acc + Number(s.profit ?? s.totalRevenue ?? 0), 0);
      const dayRev = daySales.reduce((acc, s) => acc + Number(s.totalRevenue ?? s.totalPrice ?? 0), 0);
      const label = new Date(dStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({ dateStr: dStr, label, dayProfit, dayRev });
    }

    return {
      todayProfit,
      todayRevenue,
      weeklyProfit,
      weeklyRevenue,
      allTimeProfit,
      topItem,
      topCount,
      last7Days
    };
  }, [sales, todayStr, sevenDaysAgoStr]);

  // --- LOG SALE HANDLER ---
  const handleLogSale = (e) => {
    e.preventDefault();
    const qty = Math.max(1, Number(saleQty));
    const unitP = Math.max(0, Number(saleUnitPrice));
    const unitC = Math.max(0, Number(saleUnitCost));
    const totalRevenue = qty * unitP;
    const totalCost = qty * unitC;
    const profit = totalRevenue - totalCost;

    let itemName = customItemName.trim() || 'Custom Skyforge Commission';
    if (saleItemId !== 'custom') {
      const found = enrichedCatalog.find((i) => i.id === saleItemId);
      if (found) itemName = found.name;
    }

    const newSale = {
      id: `sale-${Date.now()}`,
      itemId: saleItemId,
      itemName,
      quantity: qty,
      unitPrice: unitP,
      totalRevenue,
      unitCost: unitC,
      totalCost,
      profit,
      buyerName: buyerName.trim() || 'Traveler',
      workerName: workerNameInput.trim() || workerProfile?.name || 'Skyforge Smith',
      dateStr: saleDateStr || todayStr
    };

    setSales((prev) => [newSale, ...prev]);

    if (deductStockOnSale && saleItemId !== 'custom') {
      setCatalogItems((prev) =>
        prev.map((item) =>
          item.id === saleItemId ? { ...item, stock: Math.max(0, item.stock - qty) } : item
        )
      );
    }

    setBuyerName('');
    setSaleQty(1);
    triggerToast(`Carved sale: ${qty}x ${itemName} (+${profit}g net profit).`);
  };

  const handleDeleteSale = (id) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    triggerToast('Entry struck from The Skyforge chronicle.');
  };

  // --- COMMISSION / ORDER HANDLERS ---
  const handleCreateOrder = (e) => {
    e.preventDefault();
    const qty = Math.max(1, Number(orderQty) || 1);
    const unitP = Math.max(0, Number(orderAgreedPrice) || 0);

    let itemName = customOrderItemName.trim() || 'Custom Skyforge Commission';
    if (orderItemId !== 'custom') {
      const found = enrichedCatalog.find((i) => i.id === orderItemId);
      if (found) itemName = found.name;
    }

    const createdOrder = {
      id: `ord-${Date.now()}`,
      itemId: orderItemId,
      itemName,
      quantity: qty,
      agreedPrice: unitP,
      buyerName: orderBuyerName.trim() || 'Traveler',
      assignedSmith: workerProfile?.name || 'Skyforge Smith',
      notes: orderNotes.trim(),
      status: 'pending',
      createdDate: getLocalDateString(0),
      completedDate: null
    };

    setOrders((prev) => [createdOrder, ...prev]);
    setOrderBuyerName('');
    setOrderNotes('');
    setOrderQty(1);
    triggerToast(`Logged commission: ${qty}x ${itemName} for ${createdOrder.buyerName}.`);
  };

  const handleToggleOrderStatus = (order) => {
    const markingDone = order.status !== 'done';
    const doneDate = getLocalDateString(0);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: markingDone ? 'done' : 'pending',
              completedDate: markingDone ? doneDate : null
            }
          : o
      )
    );

    if (markingDone && logSaleOnOrderComplete) {
      const catalogMatch = enrichedCatalog.find((i) => i.id === order.itemId);
      const qty = Math.max(1, Number(order.quantity) || 1);
      const unitP = Math.max(0, Number(order.agreedPrice) || 0);
      const unitC = catalogMatch ? catalogMatch.materialCost : 0;
      const totalRevenue = qty * unitP;
      const totalCost = qty * unitC;
      const profit = totalRevenue - totalCost;

      const completedSale = {
        id: `sale-${Date.now()}`,
        itemId: order.itemId,
        itemName: order.itemName,
        quantity: qty,
        unitPrice: unitP,
        totalRevenue,
        unitCost: unitC,
        totalCost,
        profit,
        buyerName: order.buyerName || 'Traveler',
        workerName: workerProfile?.name || order.assignedSmith || 'Skyforge Smith',
        dateStr: doneDate
      };

      setSales((prev) => [completedSale, ...prev]);
      triggerToast(
        `Order marked Done & logged to Sales Ledger (+${profit}g net profit)!`
      );
    } else if (markingDone) {
      triggerToast(`Marked "${order.itemName}" order as Done.`);
    } else {
      triggerToast(`Reopened "${order.itemName}" order as Pending.`);
    }
  };

  const handleDeleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    triggerToast('Order removed from commission board.');
  };

  // --- MATERIAL DELIVERIES & PENDING SUPPLY ORDER HANDLERS ---
  const handleAddSupplyRecord = (e) => {
    e.preventDefault();
    const qty = Math.max(1, Number(supplyQty) || 1);
    const cost = Math.max(0, Number(supplyCostGold) || 0);
    const chosenMat = materials.find((m) => m.id === supplyMaterialId);
    const matName =
      supplyMaterialId === 'custom'
        ? customSupplyMatName.trim() || 'Misc Forge Materials'
        : chosenMat?.name || 'Forge Material';
    const provider = supplierNameInput.trim() || 'Unnamed Supplier';
    const isDelivered = supplyStatusInput === 'delivered';
    const entryDate = supplyDateStr || getLocalDateString(0);

    const record = {
      id: `sup-${Date.now()}`,
      supplierName: provider,
      materialId: supplyMaterialId,
      materialName: matName,
      quantity: qty,
      costGold: cost,
      status: isDelivered ? 'delivered' : 'pending',
      dateStr: entryDate,
      notes: supplyNotes.trim()
    };

    setSupplyRecords((prev) => [record, ...prev]);

    if (isDelivered && addDeliveredStockToVault && supplyMaterialId !== 'custom') {
      adjustMaterialStock(supplyMaterialId, qty);
    }

    setSupplierNameInput('');
    setCustomSupplyMatName('');
    setSupplyNotes('');
    triggerToast(
      isDelivered
        ? `Logged delivery of ${qty}x ${matName} from ${provider}.`
        : `Added pending material order: ${qty}x ${matName} from ${provider}.`
    );
  };

  const handleMarkSupplyDelivered = (record) => {
    if (record.status === 'delivered') return;
    const doneDate = getLocalDateString(0);
    setSupplyRecords((prev) =>
      prev.map((r) =>
        r.id === record.id ? { ...r, status: 'delivered', dateStr: doneDate } : r
      )
    );
    if (addDeliveredStockToVault && record.materialId !== 'custom') {
      adjustMaterialStock(record.materialId, Math.max(1, Number(record.quantity) || 1));
    }
    triggerToast(
      `Marked ${record.quantity}x ${record.materialName} from ${record.supplierName} as Delivered!`
    );
  };

  const handleRemoveSupplyRecord = (id, label) => {
    setSupplyRecords((prev) => prev.filter((r) => r.id !== id));
    triggerToast(`Removed "${label}" from material supply log.`);
  };

  // --- MATERIAL & STOCK HANDLERS ---
  const updateMaterialBuyPrice = (id, newPrice) => {
    const val = Math.max(0, Number(newPrice) || 0);
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, buyPrice: val } : m)));
  };

  const adjustMaterialStock = (id, delta) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: Math.max(0, m.stock + delta) } : m))
    );
  };

  const setMaterialStockDirect = (id, newStock) => {
    const val = Math.max(0, Number(newStock) || 0);
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, stock: val } : m)));
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMatName.trim()) return;
    const created = {
      id: `mat-${Date.now()}`,
      name: newMatName.trim(),
      category: newMatCat,
      buyPrice: Math.max(0, Number(newMatBuyPrice) || 0),
      stock: Math.max(0, Number(newMatStock) || 0),
      minStock: 5,
      unit: newMatUnit.trim() || 'units'
    };
    setMaterials((prev) => [...prev, created]);
    setNewMatName('');
    triggerToast(`Added ${created.name} (${created.buyPrice}g buy cost) to vault.`);
  };

  const handleDeleteMaterial = (id, name) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    setCatalogItems((prev) =>
      prev.map((item) => ({
        ...item,
        recipe: (item.recipe || []).filter((r) => r.materialId !== id)
      }))
    );
    if (trendMaterialFilter === id) {
      setTrendMaterialFilter('all');
    }
    if (supplyMaterialId === id) {
      const fallback = materials.find((m) => m.id !== id);
      setSupplyMaterialId(fallback ? fallback.id : 'custom');
    }
    triggerToast(`Removed "${name}" from materials vault.`);
  };

  const adjustCatalogStock = (id, delta) => {
    setCatalogItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item))
    );
  };

  const setCatalogStockDirect = (id, newStock) => {
    const val = Math.max(0, Number(newStock) || 0);
    setCatalogItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: val } : item))
    );
  };

  const toggleItemCustomPrice = (id) => {
    setCatalogItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const enriched = enrichedCatalog.find((e) => e.id === id);
        return {
          ...item,
          useCustomPrice: !item.useCustomPrice,
          customPrice: item.customPrice || enriched?.calculatedPrice || 50
        };
      })
    );
  };

  const updateItemCustomPrice = (id, price) => {
    const val = Math.max(0, Number(price) || 0);
    setCatalogItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, customPrice: val } : item))
    );
  };

  // --- RECIPE EDITING HANDLERS ---
  const editingItem = useMemo(
    () => enrichedCatalog.find((i) => i.id === editingItemId) || null,
    [enrichedCatalog, editingItemId]
  );

  const updateRecipeIngredientQty = (itemId, materialId, newQty) => {
    const q = Math.max(1, Number(newQty) || 1);
    setCatalogItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          recipe: item.recipe.map((r) => (r.materialId === materialId ? { ...r, qty: q } : r))
        };
      })
    );
  };

  const removeRecipeIngredient = (itemId, materialId) => {
    setCatalogItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          recipe: item.recipe.filter((r) => r.materialId !== materialId)
        };
      })
    );
  };

  const handleAddIngredientToRecipe = (e) => {
    e.preventDefault();
    if (!editingItemId || !addRecipeMatId) return;
    const qtyToAdd = Math.max(1, Number(addRecipeQty) || 1);
    setCatalogItems((prev) =>
      prev.map((item) => {
        if (item.id !== editingItemId) return item;
        const exists = item.recipe.find((r) => r.materialId === addRecipeMatId);
        if (exists) {
          return {
            ...item,
            recipe: item.recipe.map((r) =>
              r.materialId === addRecipeMatId ? { ...r, qty: r.qty + qtyToAdd } : r
            )
          };
        }
        return {
          ...item,
          recipe: [...item.recipe, { materialId: addRecipeMatId, qty: qtyToAdd }]
        };
      })
    );
    setAddRecipeQty(1);
  };

  // --- ADD / DELETE CATALOG ITEM HANDLERS ---
  const handleAddIngredientToNewItem = () => {
    if (!newItemMatId) return;
    const qtyToAdd = Math.max(1, Number(newItemMatQty) || 1);
    setNewItemRecipe((prev) => {
      const exists = prev.find((r) => r.materialId === newItemMatId);
      if (exists) {
        return prev.map((r) =>
          r.materialId === newItemMatId ? { ...r, qty: r.qty + qtyToAdd } : r
        );
      }
      return [...prev, { materialId: newItemMatId, qty: qtyToAdd }];
    });
    setNewItemMatQty(1);
  };

  const handleCreateCatalogItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const resolvedCategory = isCreatingNewCatInModal
      ? newCategoryInput.trim() || 'Misc'
      : newItemCategory;
    const resolvedSub = newItemSubCategory.trim() || 'Standard';

    if (
      resolvedCategory &&
      !['Weapons', 'Armor', 'Ingots & Materials'].includes(resolvedCategory) &&
      !customCategories.includes(resolvedCategory)
    ) {
      setCustomCategories((prev) => [...prev, resolvedCategory]);
    }

    setSubCategoriesMap((prev) => {
      const existing = prev[resolvedCategory] || [];
      if (existing.includes(resolvedSub)) return prev;
      return {
        ...prev,
        [resolvedCategory]: [...existing, resolvedSub]
      };
    });

    const createdItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      category: resolvedCategory,
      subCategory: resolvedSub,
      description:
        newItemDesc.trim() || `Hand-forged ${newItemName.trim()} crafted at The Skyforge.`,
      recipe: newItemRecipe,
      useCustomPrice: false,
      customPrice: 100,
      stock: Math.max(0, Number(newItemStock) || 0),
      minStock: Math.max(0, Number(newItemMinStock) || 1)
    };
    setCatalogItems((prev) => [createdItem, ...prev]);
    setNewItemName('');
    setIsCreatingNewCatInModal(false);
    setNewCategoryInput('');
    setNewItemCategory(resolvedCategory);
    setNewItemSubCategory(resolvedSubCategoriesByCategory[resolvedCategory]?.[0] || 'Standard');
    setNewItemDesc('');
    setNewItemStock(2);
    setNewItemMinStock(1);
    setNewItemRecipe([{ materialId: materials[0]?.id || '', qty: 2 }]);
    setShowAddItemModal(false);
    triggerToast(`Added "${createdItem.name}" under ${resolvedCategory} (${resolvedSub}).`);
  };

  const handleAddStandaloneCategory = (e) => {
    e.preventDefault();
    const trimmed = standaloneCategoryName.trim();
    if (!trimmed) return;
    if (allCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      triggerToast(`Category "${trimmed}" already exists.`);
      return;
    }
    setCustomCategories((prev) => [...prev, trimmed]);
    setSubCategoriesMap((prev) => ({
      ...prev,
      [trimmed]: prev[trimmed] || ['Standard']
    }));
    setSelectedManageCat(trimmed);
    setStandaloneCategoryName('');
    triggerToast(`Created new category "${trimmed}".`);
  };

  const handleDeleteCustomCategory = (catName) => {
    setCustomCategories((prev) => prev.filter((c) => c !== catName));
    setSubCategoriesMap((prev) => {
      const copy = { ...prev };
      delete copy[catName];
      return copy;
    });
    if (selectedCategory === catName) {
      setSelectedCategory('All');
      setSelectedSubCategory('All');
    }
    if (selectedManageCat === catName) {
      setSelectedManageCat('Weapons');
    }
    triggerToast(`Removed category "${catName}".`);
  };

  // --- SUB-CATEGORY / TIER ADD, ALTER & REMOVE HANDLERS ---
  const handleAddSubCategory = (e) => {
    e.preventDefault();
    const trimmed = newSubCatInput.trim();
    if (!trimmed || !selectedManageCat) return;
    const currentList = resolvedSubCategoriesByCategory[selectedManageCat] || [];
    if (currentList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      triggerToast(`Tier "${trimmed}" already exists under ${selectedManageCat}.`);
      return;
    }
    setSubCategoriesMap((prev) => ({
      ...prev,
      [selectedManageCat]: [...(prev[selectedManageCat] || currentList), trimmed]
    }));
    setNewSubCatInput('');
    triggerToast(`Added "${trimmed}" tier to ${selectedManageCat}.`);
  };

  const handleRenameSubCategory = (catName, oldSub, newSubRaw) => {
    const newSub = newSubRaw.trim();
    setRenamingSubCat(null);
    if (!newSub || newSub === oldSub) return;

    setSubCategoriesMap((prev) => {
      const list = prev[catName] || resolvedSubCategoriesByCategory[catName] || [];
      const updated = Array.from(new Set(list.map((s) => (s === oldSub ? newSub : s))));
      return { ...prev, [catName]: updated };
    });

    setCatalogItems((prev) =>
      prev.map((item) =>
        item.category === catName && item.subCategory === oldSub
          ? { ...item, subCategory: newSub }
          : item
      )
    );

    if (selectedSubCategory === oldSub) {
      setSelectedSubCategory(newSub);
    }
    triggerToast(`Renamed "${oldSub}" to "${newSub}".`);
  };

  const handleDeleteSubCategory = (catName, subName) => {
    setSubCategoriesMap((prev) => {
      const list = prev[catName] || resolvedSubCategoriesByCategory[catName] || [];
      return {
        ...prev,
        [catName]: list.filter((s) => s !== subName)
      };
    });

    setCatalogItems((prev) =>
      prev.map((item) =>
        item.category === catName && item.subCategory === subName
          ? { ...item, subCategory: 'Standard' }
          : item
      )
    );

    if (selectedSubCategory === subName) {
      setSelectedSubCategory('All');
    }
    triggerToast(`Removed "${subName}" tier from ${catName}.`);
  };

  // --- DRAG & DROP RECIPE MOVE HANDLER ---
  const handleDropRecipeTarget = (targetCategory, targetSubCategory = null) => {
    if (!draggedItemId) return;
    const draggedItem = catalogItems.find((i) => i.id === draggedItemId);
    if (!draggedItem) return;

    const nextSub =
      targetSubCategory ||
      (draggedItem.category === targetCategory
        ? draggedItem.subCategory
        : resolvedSubCategoriesByCategory[targetCategory]?.[0] || 'Standard');

    setCatalogItems((prev) =>
      prev.map((item) =>
        item.id === draggedItemId
          ? { ...item, category: targetCategory, subCategory: nextSub }
          : item
      )
    );

    setSubCategoriesMap((prev) => {
      const existing = prev[targetCategory] || resolvedSubCategoriesByCategory[targetCategory] || [];
      if (!nextSub || existing.includes(nextSub)) return prev;
      return { ...prev, [targetCategory]: [...existing, nextSub] };
    });

    triggerToast(
      `Moved "${draggedItem.name}" → ${targetCategory}${nextSub ? ` (${nextSub})` : ''}.`
    );
    setDraggedItemId(null);
    setDragOverTarget(null);
  };

  const handleDeleteCatalogItem = (id, name) => {
    setCatalogItems((prev) => prev.filter((item) => item.id !== id));
    if (saleItemId === id) {
      setSaleItemId('custom');
    }
    triggerToast(`Removed "${name}" from catalog.`);
  };

  const handleResetDefaults = () => {
    setMaterials(INITIAL_MATERIALS);
    setCatalogItems(INITIAL_CATALOG_ITEMS);
    setCustomCategories([]);
    setSubCategoriesMap(SUBCATEGORIES_BY_CATEGORY);
    setProfitMarginPct(0);
    setSales([]);
    setOrders([]);
    setSupplyRecords([]);
    setMemberProfiles([]);
    setMaterialHistory([]);
    localStorage.setItem('skyforge_mat_history_v13', JSON.stringify([]));
    setSelectedProfileDetail(null);
    setConfirmResetModal(false);
    triggerToast('The Skyforge reset to a clean slate.');
  };

  // --- FULL FORGE BACKUP & RESTORE (.JSON SNAPSHOT) ---
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
        sales,
        customCategories,
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
        if (typeof payload.profitMarginPct === 'number') {
          setProfitMarginPct(payload.profitMarginPct);
        }
        if (Array.isArray(payload.sales)) setSales(payload.sales);
        if (Array.isArray(payload.customCategories)) setCustomCategories(payload.customCategories);
        if (payload.subCategoriesMap && typeof payload.subCategoriesMap === 'object') {
          setSubCategoriesMap(payload.subCategoriesMap);
        }
        if (Array.isArray(payload.orders)) setOrders(payload.orders);
        if (Array.isArray(payload.supplyRecords)) setSupplyRecords(payload.supplyRecords);
        if (Array.isArray(payload.memberProfiles)) setMemberProfiles(payload.memberProfiles);
        if (Array.isArray(payload.materialHistory)) {
          setMaterialHistory(payload.materialHistory);
          try {
            localStorage.setItem(
              'skyforge_mat_history_v13',
              JSON.stringify(payload.materialHistory)
            );
          } catch {}
        }
        setShowAdminSidebar(false);
        triggerToast('Restored all prices, stock, orders, deliveries & ledger from backup!');
      } catch {
        triggerToast('Could not read backup file. Ensure it is a valid .json file.');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // --- EXPORT TO EXCEL / GOOGLE SHEETS (CSV & MULTI-SHEET WORKBOOK) ---
  const triggerFileDownload = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const escapeCsvCell = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const toCsvString = (headers, rows) => {
    const headerLine = headers.map(escapeCsvCell).join(',');
    const bodyLines = rows.map((row) => row.map(escapeCsvCell).join(','));
    return '\uFEFF' + [headerLine, ...bodyLines].join('\r\n');
  };

  const buildExportDatasets = () => {
    const salesHeaders = [
      'Sale ID',
      'Date',
      'Item Name',
      'Quantity',
      'Unit Sell Price (g)',
      'Gross Revenue (g)',
      'Unit Material Cost (g)',
      'Total Cost (g)',
      'Net Profit (g)',
      'Buyer',
      'Smith'
    ];
    const salesRows = sales.map((s) => {
      const rev = Number(s.totalRevenue ?? s.totalPrice ?? 0);
      const cost = Number(s.totalCost ?? 0);
      const prof = Number(s.profit ?? rev - cost);
      return [
        s.id,
        s.dateStr,
        s.itemName,
        s.quantity,
        s.unitPrice,
        rev,
        s.unitCost ?? 0,
        cost,
        prof,
        s.buyerName,
        s.workerName
      ];
    });

    const catalogHeaders = [
      'Item ID',
      'Item Name',
      'Category',
      'Sub-Category / Tier',
      'Recipe Ingredients',
      'Material Cost (g)',
      'Auto Price (+' + profitMarginPct + '%) (g)',
      'Final List Price (g)',
      'Unit Net Profit (g)',
      'Pricing Mode',
      'Finished Stock',
      'Min Stock Alert',
      'Description'
    ];
    const catalogRows = enrichedCatalog.map((item) => {
      const recipeText =
        (item.recipe || [])
          .map((r) => {
            const m = materialMap[r.materialId];
            return m ? `${r.qty}x ${m.name}` : `${r.qty}x ${r.materialId}`;
          })
          .join(' + ') || 'None';
      return [
        item.id,
        item.name,
        item.category,
        item.subCategory || '',
        recipeText,
        item.materialCost,
        item.calculatedPrice,
        item.finalPrice,
        item.unitProfit,
        item.useCustomPrice ? 'Custom' : 'Auto',
        item.stock,
        item.minStock,
        item.description
      ];
    });

    const materialsHeaders = [
      'Material ID',
      'Material Name',
      'Type',
      'Supplier Buy Cost (g)',
      'Current Stock',
      'Unit',
      'Min Stock Alert',
      'Total Vault Value (g)'
    ];
    const materialsRows = materials.map((m) => [
      m.id,
      m.name,
      m.category,
      m.buyPrice,
      m.stock,
      m.unit,
      m.minStock,
      m.buyPrice * m.stock
    ]);

    return {
      salesHeaders,
      salesRows,
      catalogHeaders,
      catalogRows,
      materialsHeaders,
      materialsRows
    };
  };

  const handleExportCsv = (type) => {
    const dateStamp = getLocalDateString(0);
    const {
      salesHeaders,
      salesRows,
      catalogHeaders,
      catalogRows,
      materialsHeaders,
      materialsRows
    } = buildExportDatasets();

    if (type === 'sales') {
      triggerFileDownload(
        toCsvString(salesHeaders, salesRows),
        `skyforge-sales-ledger-${dateStamp}.csv`,
        'text/csv;charset=utf-8;'
      );
      triggerToast('Exported Sales Ledger (.csv) for Excel / Google Sheets.');
    } else if (type === 'catalog') {
      triggerFileDownload(
        toCsvString(catalogHeaders, catalogRows),
        `skyforge-catalog-recipes-${dateStamp}.csv`,
        'text/csv;charset=utf-8;'
      );
      triggerToast('Exported Catalog & Recipes (.csv) for Excel / Google Sheets.');
    } else if (type === 'materials') {
      triggerFileDownload(
        toCsvString(materialsHeaders, materialsRows),
        `skyforge-materials-stock-${dateStamp}.csv`,
        'text/csv;charset=utf-8;'
      );
      triggerToast('Exported Materials & Stock (.csv) for Excel / Google Sheets.');
    }
  };

  const handleExportFullWorkbook = () => {
    const dateStamp = getLocalDateString(0);
    const {
      salesHeaders,
      salesRows,
      catalogHeaders,
      catalogRows,
      materialsHeaders,
      materialsRows
    } = buildExportDatasets();

    const escapeXml = (val) =>
      String(val ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const buildWorksheetXml = (sheetName, headers, rows) => {
      const headerCells = headers
        .map(
          (h) =>
            `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`
        )
        .join('');
      const bodyRows = rows
        .map((row) => {
          const cells = row
            .map((cell) => {
              const isNum = typeof cell === 'number' && !Number.isNaN(cell);
              return `<Cell><Data ss:Type="${isNum ? 'Number' : 'String'}">${escapeXml(
                cell
              )}</Data></Cell>`;
            })
            .join('');
          return `<Row>${cells}</Row>`;
        })
        .join('\n');

      return `<Worksheet ss:Name="${escapeXml(sheetName)}">
        <Table>
          <Row>${headerCells}</Row>
          ${bodyRows}
        </Table>
      </Worksheet>`;
    };

    const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FDE68A"/>
   <Interior ss:Color="#7F1D1D" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 ${buildWorksheetXml('Sales Ledger', salesHeaders, salesRows)}
 ${buildWorksheetXml('Catalog & Recipes', catalogHeaders, catalogRows)}
 ${buildWorksheetXml('Materials & Stock', materialsHeaders, materialsRows)}
</Workbook>`;

    triggerFileDownload(
      workbookXml,
      `the-skyforge-full-ledger-${dateStamp}.xls`,
      'application/vnd.ms-excel;charset=utf-8;'
    );
    triggerToast('Exported all 3 sheets into one Excel / Google Sheets workbook!');
  };

  // --- FILTERED PUBLIC & WORKER CATALOG ---
  const availableSubCategories = useMemo(() => {
    const subs = new Set();
    if (selectedCategory === 'All') {
      allCategories.forEach((cat) => {
        (resolvedSubCategoriesByCategory[cat] || []).forEach((s) => subs.add(s));
      });
    } else {
      (resolvedSubCategoriesByCategory[selectedCategory] || []).forEach((s) => subs.add(s));
    }
    enrichedCatalog.forEach((item) => {
      if (selectedCategory === 'All' || item.category === selectedCategory) {
        if (item.subCategory) subs.add(item.subCategory);
      }
    });
    return ['All', ...Array.from(subs)];
  }, [enrichedCatalog, selectedCategory, allCategories, resolvedSubCategoriesByCategory]);

  const filteredCatalog = useMemo(() => {
    return enrichedCatalog.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSubCat =
        selectedSubCategory === 'All' || item.subCategory === selectedSubCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q));
      return matchesCat && matchesSubCat && matchesSearch;
    });
  }, [enrichedCatalog, selectedCategory, selectedSubCategory, searchQuery]);

  const lowStockCount = useMemo(() => {
    const lowMats = materials.filter((m) => m.stock <= m.minStock).length;
    const lowItems = enrichedCatalog.filter((i) => i.stock <= i.minStock).length;
    return lowMats + lowItems;
  }, [materials, enrichedCatalog]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) => {
      const matchesCat =
        stockCategoryFilter === 'All' || mat.category === stockCategoryFilter;
      const matchesLow = !showLowStockOnly || mat.stock <= mat.minStock;
      const q = stockSearchQuery.toLowerCase();
      const matchesSearch =
        mat.name.toLowerCase().includes(q) || mat.category.toLowerCase().includes(q);
      return matchesCat && matchesLow && matchesSearch;
    });
  }, [materials, stockCategoryFilter, showLowStockOnly, stockSearchQuery]);

  const groupedMaterials = useMemo(() => {
    const order = ['Smelted Ingots', 'Raw Ore', 'Fuel', 'Hides & Straps'];
    const groups = [];
    order.forEach((cat) => {
      const items = filteredMaterials.filter((m) => m.category === cat);
      if (items.length > 0) {
        groups.push({ category: cat, items });
      }
    });
    filteredMaterials.forEach((m) => {
      if (!order.includes(m.category)) {
        const existing = groups.find((g) => g.category === m.category);
        if (existing) existing.items.push(m);
        else groups.push({ category: m.category, items: [m] });
      }
    });
    return groups;
  }, [filteredMaterials]);

  const maxChartProfit = useMemo(() => {
    const maxVal = Math.max(...profitStats.last7Days.map((d) => d.dayProfit), 0);
    return maxVal > 0 ? maxVal : 100;
  }, [profitStats.last7Days]);

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-zinc-100 flex flex-col font-sans selection:bg-red-900 selection:text-amber-200">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-zinc-900 border border-amber-500/70 text-zinc-100 text-sm shadow-2xl">
          <Anvil className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-30 bg-[#101012]/95 backdrop-blur-sm border-b-2 border-red-900/85">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <SkyforgeEagleCrest className="w-12 h-14 shrink-0" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wider uppercase text-zinc-100">
                  The Skyforge
                </h1>
                <span className="hidden sm:inline text-sm font-mono tracking-[0.22em] text-amber-400/80">
                  ᛊᚲᛁᚠᛟᚱᚷᛖ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                {workerProfile
                  ? workerProfile.roleType === 'guest'
                    ? `Guest Pass: ${workerProfile.name} • Viewing Ledgers & Stock`
                    : isAdminUnlocked
                    ? `Master Admin: ${workerProfile.name} • Margin: +${profitMarginPct}%`
                    : `Smith on duty: ${workerProfile.name} • Margin: +${profitMarginPct}%`
                  : 'Whiterun • Weapons, Armor & Smelted Ingots'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {workerProfile ? (
              <>
                <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-zinc-900 border border-amber-500/45 text-sm font-semibold text-amber-200">
                  {workerProfile.roleType === 'guest' ? (
                    <Compass className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Hammer className="w-4 h-4 text-red-500" />
                  )}
                  <span>{workerProfile.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-[10px] uppercase tracking-wider text-zinc-400 border border-zinc-800">
                    {workerProfile.roleType === 'guest'
                      ? 'Guest'
                      : isAdminUnlocked
                      ? 'Master Admin'
                      : 'Smith'}
                  </span>
                </span>
                <button
                  onClick={handleWorkerLogout}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-semibold bg-zinc-900 hover:bg-red-950 text-zinc-200 hover:text-amber-200 border border-zinc-700 hover:border-red-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthError('');
                  setShowLoginModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Forge Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main
        className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 transition-all duration-300 ${
          workerProfile ? 'max-w-[1800px]' : 'max-w-7xl'
        }`}
      >
        <div
          className={
            workerProfile
              ? 'grid grid-cols-1 xl:grid-cols-12 gap-8 items-start'
              : 'block'
          }
        >
          {/* ===================================================================== */}
          {/* PRICE LIST COLUMN (ALWAYS VISIBLE, INDEPENDENTLY SCROLLABLE WHEN OPEN)*/}
          {/* ===================================================================== */}
          <section
            className={
              workerProfile
                ? 'xl:col-span-4 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7.5rem)] xl:overflow-y-auto xl:pr-2 space-y-5'
                : 'space-y-6'
            }
          >
            {/* Storefront Header & Filters */}
            <div className="rounded-lg bg-[#141416] border border-zinc-800 border-t-2 border-t-red-800 p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-serif font-bold uppercase tracking-wide text-zinc-100">
                    Price List
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                    Current Septim prices for forged weapons, armor, and ingots
                  </p>
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-amber-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wares..."
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                </div>
              </div>

              {/* Primary Category Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {['All', ...allCategories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubCategory('All');
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-red-800 text-amber-200 border border-amber-500/60 font-bold'
                        : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Subcategory / Tier Filter Pills */}
              {availableSubCategories.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800/80">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mr-1">
                    Tier:
                  </span>
                  {availableSubCategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        selectedSubCategory === sub
                          ? 'bg-zinc-800 text-amber-300 border border-amber-500/50 font-semibold'
                          : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Cards */}
            {filteredCatalog.length === 0 ? (
              <div className="rounded-lg bg-[#141416] border border-zinc-800 p-8 text-center text-sm text-zinc-500">
                No forged items match your current filter.
              </div>
            ) : (
              <div
                className={
                  workerProfile
                    ? 'grid grid-cols-1 gap-3.5'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                }
              >
                {filteredCatalog.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-[#141416] border border-zinc-800 hover:border-amber-500/45 p-5 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-semibold text-zinc-300">
                            {item.category === 'Weapons' && (
                              <Sword className="w-3 h-3 text-red-500" />
                            )}
                            {item.category === 'Armor' && (
                              <Shield className="w-3 h-3 text-red-500" />
                            )}
                            {item.category === 'Ingots & Materials' && (
                              <Anvil className="w-3 h-3 text-amber-400" />
                            )}
                            {!['Weapons', 'Armor', 'Ingots & Materials'].includes(item.category) && (
                              <Hammer className="w-3 h-3 text-amber-400" />
                            )}
                            <span>{item.category}</span>
                          </span>

                          {item.subCategory && (
                            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-900/70 text-[11px] font-semibold text-amber-300">
                              {item.subCategory}
                            </span>
                          )}
                        </div>

                        <span className="px-3 py-1 rounded bg-zinc-900 border border-amber-500/55 text-amber-300 font-bold text-base shrink-0">
                          {item.finalPrice}g
                        </span>
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

          {/* ===================================================================== */}
          {/* WORKER SIDE PANEL (OPENS ALONGSIDE PRICE LIST WHEN LOGGED IN)         */}
          {/* ===================================================================== */}
          {workerProfile && (
            <aside className="xl:col-span-8 rounded-xl bg-[#121214] border border-zinc-800 border-t-2 border-t-red-800 p-5 sm:p-7 space-y-6 shadow-2xl">
              {/* Guest Banner if logged in as Guest */}
              {workerProfile.roleType === 'guest' && (
                <div className="rounded-lg bg-zinc-950 border border-amber-500/40 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Signed in as <strong>{workerProfile.name} (Forge Guest — Read-Only)</strong> — You can view Sales &amp; Profits, Orders, Forge Stock, and Smith Profiles, but cannot record sales, place orders, or alter prices/stock.
                    </span>
                  </div>
                </div>
              )}

              {/* Side Panel Header & Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveWorkerTab('dashboard')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeWorkerTab === 'dashboard'
                        ? 'bg-red-900/80 text-amber-200 border border-amber-500/60'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Sales &amp; Profits</span>
                  </button>

                  <button
                    onClick={() => setActiveWorkerTab('orders')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeWorkerTab === 'orders'
                        ? 'bg-red-900/80 text-amber-200 border border-amber-500/60'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4 text-amber-400" />
                    <span>Orders &amp; Deliveries</span>
                    {pendingOrdersCount + pendingSupplyCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50">
                        {pendingOrdersCount + pendingSupplyCount}
                      </span>
                    )}
                  </button>

                  {workerProfile.roleType !== 'guest' && (
                    <button
                      onClick={() => setActiveWorkerTab('pricing')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        activeWorkerTab === 'pricing'
                          ? 'bg-red-900/80 text-amber-200 border border-amber-500/60'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                      }`}
                    >
                      <Calculator className="w-4 h-4 text-amber-400" />
                      <span>Recipes &amp; Margin</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveWorkerTab('stock')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeWorkerTab === 'stock'
                        ? 'bg-red-900/80 text-amber-200 border border-amber-500/60'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>Forge Stock &amp; Ore</span>
                    {lowStockCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-950 text-amber-300 border border-red-700">
                        {lowStockCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveWorkerTab('profiles')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeWorkerTab === 'profiles'
                        ? 'bg-red-900/80 text-amber-200 border border-amber-500/60'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>
                      {workerProfile.roleType === 'guest' ? 'Forge Roster' : 'Smith Profiles'}
                    </span>
                  </button>
                </div>

                {workerProfile.roleType !== 'guest' && isAdminUnlocked && (
                  <button
                    type="button"
                    onClick={() => setShowAdminSidebar(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/50 transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Admin Menu</span>
                  </button>
                )}
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* WORKER TAB 3: RECIPES, PROFIT MARGIN & DRAG-AND-DROP ORGANIZER    */}
              {/* ----------------------------------------------------------------- */}
              {activeWorkerTab === 'pricing' && workerProfile.roleType !== 'guest' && (
                <div className="space-y-6">
                  {/* Global Profit Margin Controller */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-serif font-bold text-zinc-100 flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-amber-400" />
                          <span>Global Forge Profit Margin</span>
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Automatically calculates Septim prices above raw material buy costs for all non-custom items.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded bg-red-950 border border-amber-500/50 text-amber-300 font-bold text-base">
                          +{profitMarginPct}%
                        </span>
                      </div>
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

                  {/* Recipes, Drag-and-Drop Drop Zones & Catalog Table */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                      <div>
                        <h3 className="text-base font-serif font-bold text-zinc-100">
                          Crafting Recipes &amp; Public Prices
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Drag any recipe row onto a Category or Tier badge below to move it, or click a recipe to edit materials.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-amber-400/80 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={recipeBoardSearch}
                            onChange={(e) => setRecipeBoardSearch(e.target.value)}
                            placeholder="Search recipes or mats..."
                            className="w-44 sm:w-52 pl-8 pr-7 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/70"
                          />
                          {recipeBoardSearch && (
                            <button
                              type="button"
                              onClick={() => setRecipeBoardSearch('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCategoryModal(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700 hover:border-amber-500/50 font-semibold text-xs cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-amber-400" />
                          <span>Categories &amp; Tiers</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewItemMatId(materials[0]?.id || '');
                            setIsCreatingNewCatInModal(false);
                            setShowAddItemModal(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-amber-300" />
                          <span>Add New Item</span>
                        </button>
                      </div>
                    </div>

                    {/* Drag-and-Drop Category & Tier Drop Zones */}
                    <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                          {draggedItemId
                            ? 'Drop Recipe onto a Category or Tier:'
                            : 'Filter or Drag Recipes onto Categories:'}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setRecipeBoardCatFilter('All')}
                            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                              recipeBoardCatFilter === 'All'
                                ? 'bg-zinc-800 text-amber-200 border border-amber-500/50'
                                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                            }`}
                          >
                            All ({enrichedCatalog.length})
                          </button>
                          {allCategories.map((cat) => {
                            const dropKey = `cat:${cat}`;
                            const isOver = dragOverTarget === dropKey;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setRecipeBoardCatFilter(cat)}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOverTarget(dropKey);
                                }}
                                onDragLeave={() => setDragOverTarget(null)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  handleDropRecipeTarget(cat, null);
                                }}
                                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
                                  isOver
                                    ? 'bg-amber-500/30 text-amber-200 border-amber-400 scale-105'
                                    : recipeBoardCatFilter === cat
                                    ? 'bg-red-900/80 text-amber-200 border-amber-500/60'
                                    : 'bg-zinc-900 text-zinc-300 hover:border-zinc-600 border-zinc-800'
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {recipeBoardCatFilter !== 'All' &&
                        (resolvedSubCategoriesByCategory[recipeBoardCatFilter] || []).length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-900">
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 mr-1">
                              Drop onto Tier:
                            </span>
                            {(resolvedSubCategoriesByCategory[recipeBoardCatFilter] || []).map(
                              (sub) => {
                                const subDropKey = `sub:${recipeBoardCatFilter}:${sub}`;
                                const isSubOver = dragOverTarget === subDropKey;
                                return (
                                  <span
                                    key={sub}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      setDragOverTarget(subDropKey);
                                    }}
                                    onDragLeave={() => setDragOverTarget(null)}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      handleDropRecipeTarget(recipeBoardCatFilter, sub);
                                    }}
                                    className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${
                                      isSubOver
                                        ? 'bg-amber-500/30 text-amber-200 border-amber-400 scale-105'
                                        : 'bg-zinc-900/90 text-zinc-400 border-zinc-800'
                                    }`}
                                  >
                                    {sub}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        )}
                    </div>

                    {/* Recipes & Pricing Table */}
                    <div className="overflow-x-auto max-h-[34rem] overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#18181b] z-10">
                          <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                            <th className="py-2.5 pr-2">Item &amp; Tier</th>
                            <th className="py-2.5 px-2">Recipe</th>
                            <th className="py-2.5 px-2 text-right">Mat Cost</th>
                            <th className="py-2.5 px-2 text-right">List Price</th>
                            <th className="py-2.5 pl-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80 text-sm">
                          {enrichedCatalog
                            .filter((item) => {
                              const matchesCat =
                                recipeBoardCatFilter === 'All' ||
                                item.category === recipeBoardCatFilter;
                              const q = recipeBoardSearch.trim().toLowerCase();
                              if (!q) return matchesCat;
                              const matchesName =
                                item.name.toLowerCase().includes(q) ||
                                (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
                                item.category.toLowerCase().includes(q);
                              const matchesMat = (item.recipe || []).some((r) => {
                                const m = materialMap[r.materialId];
                                return m && m.name.toLowerCase().includes(q);
                              });
                              return matchesCat && (matchesName || matchesMat);
                            })
                            .map((item) => (
                              <tr
                                key={item.id}
                                draggable
                                onDragStart={() => setDraggedItemId(item.id)}
                                onDragEnd={() => {
                                  setDraggedItemId(null);
                                  setDragOverTarget(null);
                                }}
                                className="hover:bg-zinc-900/70 transition-colors cursor-grab active:cursor-grabbing"
                              >
                                <td className="py-2.5 pr-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-zinc-600 select-none font-mono text-xs">
                                      ⋮⋮
                                    </span>
                                    <div>
                                      <div className="font-semibold text-zinc-100">{item.name}</div>
                                      <div className="text-[11px] text-zinc-400">
                                        {item.category}
                                        {item.subCategory ? ` • ${item.subCategory}` : ''}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-2.5 px-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingItemId(item.id);
                                      setAddRecipeMatId(materials[0]?.id || '');
                                    }}
                                    className="text-left text-xs text-zinc-300 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <span>
                                      {item.recipe.length === 0
                                        ? 'No materials'
                                        : item.recipe
                                            .map((r) => {
                                              const m = materialMap[r.materialId];
                                              return `${r.qty}x ${m ? m.name : r.materialId}`;
                                            })
                                            .join(', ')}
                                    </span>
                                    <Edit3 className="w-3 h-3 text-amber-400 shrink-0" />
                                  </button>
                                </td>

                                <td className="py-2.5 px-2 text-right text-xs text-zinc-400 whitespace-nowrap">
                                  {item.materialCost}g
                                </td>

                                <td className="py-2.5 px-2 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center justify-end gap-1.5">
                                    {item.useCustomPrice ? (
                                      <input
                                        type="number"
                                        min="0"
                                        value={item.customPrice}
                                        onChange={(e) =>
                                          updateItemCustomPrice(item.id, e.target.value)
                                        }
                                        className="w-16 px-1.5 py-0.5 rounded bg-zinc-950 border border-amber-500/60 text-amber-300 font-bold text-xs text-right"
                                      />
                                    ) : (
                                      <span className="font-bold text-amber-300">
                                        {item.finalPrice}g
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => toggleItemCustomPrice(item.id)}
                                      title={
                                        item.useCustomPrice
                                          ? 'Switch back to Auto Margin price'
                                          : 'Override with Custom Price'
                                      }
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border cursor-pointer ${
                                        item.useCustomPrice
                                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                          : 'bg-zinc-950 text-zinc-500 hover:text-zinc-200 border-zinc-800'
                                      }`}
                                    >
                                      {item.useCustomPrice ? 'Custom' : 'Auto'}
                                    </button>
                                  </div>
                                </td>

                                <td className="py-2.5 pl-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCatalogItem(item.id, item.name)}
                                    title="Delete item"
                                    className="p-1.5 rounded hover:bg-red-950 text-zinc-500 hover:text-red-400 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* WORKER TAB 1: SALES & PROFITS DASHBOARD                           */}
              {/* ----------------------------------------------------------------- */}
              {activeWorkerTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-lg bg-[#18181b] border border-zinc-800 border-l-2 border-l-amber-400 p-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        <span>Today&apos;s Net Profit</span>
                        <Coins className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-amber-300 mt-1.5">
                        +{profitStats.todayProfit.toLocaleString()}g
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        Gross sales: {profitStats.todayRevenue.toLocaleString()}g
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#18181b] border border-zinc-800 border-l-2 border-l-red-600 p-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        <span>7-Day Net Profit</span>
                        <TrendingUp className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="text-2xl font-bold text-zinc-100 mt-1.5">
                        +{profitStats.weeklyProfit.toLocaleString()}g
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        Gross sales: {profitStats.weeklyRevenue.toLocaleString()}g
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#18181b] border border-zinc-800 p-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        <span>All-Time Net Profit</span>
                        <Anvil className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-amber-300 mt-1.5">
                        +{profitStats.allTimeProfit.toLocaleString()}g
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {sales.length} logged transactions
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#18181b] border border-zinc-800 p-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        <span>Best-Selling Item</span>
                        <Sword className="w-4 h-4 text-red-400" />
                      </div>
                      <div
                        className="text-base font-serif font-bold text-zinc-100 mt-1.5 truncate"
                        title={profitStats.topItem}
                      >
                        {profitStats.topItem}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {profitStats.topCount} pieces forged &amp; sold
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Net Profit Bar Chart */}
                  <div className="rounded-lg bg-[#18181b] border border-zinc-800 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-serif font-bold text-zinc-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>7-Day Forge Profit Ledger</span>
                      </h3>
                      <span className="text-xs text-zinc-400">Daily net Septims</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2.5 items-end h-36 pt-4">
                      {profitStats.last7Days.map((day) => {
                        const heightPct = Math.max(
                          6,
                          Math.round((day.dayProfit / maxChartProfit) * 100)
                        );
                        const isToday = day.dateStr === todayStr;
                        return (
                          <div
                            key={day.dateStr}
                            className="flex flex-col items-center gap-1.5 h-full justify-end"
                          >
                            <span className="text-[11px] font-bold text-amber-300">
                              {day.dayProfit > 0 ? `+${day.dayProfit}g` : '0g'}
                            </span>
                            <div className="w-full max-w-[2.5rem] bg-zinc-950 rounded-t border border-zinc-800 h-24 flex items-end overflow-hidden">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full transition-all duration-300 ${
                                  isToday
                                    ? 'bg-gradient-to-t from-red-800 to-amber-400'
                                    : day.dayProfit > 0
                                    ? 'bg-red-800/85'
                                    : 'bg-zinc-900'
                                }`}
                              />
                            </div>
                            <span
                              className={`text-xs font-semibold ${
                                isToday ? 'text-amber-300' : 'text-zinc-500'
                              }`}
                            >
                              {day.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Log Sale Form & Sales Ledger */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {workerProfile.roleType !== 'guest' && (
                      <form
                        onSubmit={handleLogSale}
                        className="lg:col-span-5 bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4 h-fit"
                      >
                        <div className="border-b border-zinc-800 pb-2.5">
                          <h3 className="text-base font-serif font-bold text-zinc-100 flex items-center gap-2">
                            <Hammer className="w-4 h-4 text-red-500" />
                            <span>Record a Sale</span>
                          </h3>
                        </div>

                        <div className="relative">
                          <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-1.5">
                            Item Sold
                          </label>
                          <div className="relative">
                            <Search className="w-4 h-4 text-amber-400/80 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={saleItemSearch}
                              onFocus={() => setShowSaleItemDropdown(true)}
                              onBlur={() => setTimeout(() => setShowSaleItemDropdown(false), 160)}
                              onChange={(e) => {
                                setSaleItemSearch(e.target.value);
                                setShowSaleItemDropdown(true);
                              }}
                              placeholder="Search item or tier..."
                              className="w-full pl-9 pr-8 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500/70"
                            />
                            {saleItemSearch && (
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setSaleItemSearch('');
                                  setShowSaleItemDropdown(true);
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {showSaleItemDropdown && (
                            <div className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto rounded-md bg-zinc-950 border border-zinc-700 shadow-2xl divide-y divide-zinc-900">
                              {filteredSaleOptions.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSaleItemId(item.id);
                                    setSaleItemSearch(item.name);
                                    setShowSaleItemDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                    saleItemId === item.id
                                      ? 'bg-red-950/90 text-amber-200'
                                      : 'hover:bg-zinc-900 text-zinc-100'
                                  }`}
                                >
                                  <div className="min-w-0">
                                    <div className="font-semibold truncate">{item.name}</div>
                                    <div className="text-[11px] text-zinc-400">
                                      {item.subCategory || item.category} &bull; Stock: {item.stock}
                                    </div>
                                  </div>
                                  <span className="font-bold text-amber-300 text-xs shrink-0">
                                    {item.finalPrice}g
                                  </span>
                                </button>
                              ))}

                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setSaleItemId('custom');
                                  setSaleItemSearch('Custom Commission');
                                  setSaleUnitPrice(150);
                                  setSaleUnitCost(60);
                                  setShowSaleItemDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-bold flex items-center gap-1.5 bg-zinc-900/70 hover:bg-zinc-900 text-amber-300 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Custom Commission / Manual Entry</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {saleItemId === 'custom' && (
                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Custom Item Name
                            </label>
                            <input
                              type="text"
                              required
                              value={customItemName}
                              onChange={(e) => setCustomItemName(e.target.value)}
                              placeholder="e.g., Tempered Wuuthrad Replica"
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Qty
                            </label>
                            <input
                              type="number"
                              min="1"
                              required
                              value={saleQty}
                              onChange={(e) => setSaleQty(e.target.value)}
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Sell Each (g)
                            </label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={saleUnitPrice}
                              onChange={(e) => setSaleUnitPrice(e.target.value)}
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-500/70"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Mat Cost (g)
                            </label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={saleUnitCost}
                              onChange={(e) => setSaleUnitCost(e.target.value)}
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-amber-500/70"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Buyer Name
                            </label>
                            <input
                              type="text"
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)}
                              placeholder="e.g., Farkas"
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Smith Name
                            </label>
                            <input
                              type="text"
                              value={workerNameInput}
                              onChange={(e) => setWorkerNameInput(e.target.value)}
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                            Date
                          </label>
                          <input
                            type="date"
                            required
                            value={saleDateStr}
                            onChange={(e) => setSaleDateStr(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                          />
                        </div>

                        {saleItemId !== 'custom' && (
                          <label className="flex items-center gap-2 pt-0.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={deductStockOnSale}
                              onChange={(e) => setDeductStockOnSale(e.target.checked)}
                              className="w-4 h-4 rounded accent-red-700"
                            />
                            <span className="text-xs text-zinc-400">
                              Deduct from stock automatically
                            </span>
                          </label>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-md font-bold uppercase tracking-wider text-xs sm:text-sm bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-amber-300" />
                          <span>Log Sale to Ledger</span>
                        </button>
                      </form>
                    )}

                    {/* Sales Ledger Table */}
                    <div
                      className={`${
                        workerProfile.roleType !== 'guest' ? 'lg:col-span-7' : 'lg:col-span-12'
                      } bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4`}
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div>
                          <h3 className="text-base font-serif font-bold text-zinc-100">
                            Sales Ledger
                          </h3>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Complete transaction chronicle with material costs and net Septim profit.
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-zinc-400">
                          {sales.length} {sales.length === 1 ? 'entry' : 'entries'}
                        </span>
                      </div>

                      {sales.length === 0 ? (
                        <div className="text-center py-10 text-sm text-zinc-500">
                          No sales recorded yet. Log a sale to begin tracking forge profits.
                        </div>
                      ) : (
                        <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
                          <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#18181b] z-10">
                              <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                                <th className="py-2 pr-2">Item</th>
                                <th className="py-2 px-2">Buyer / Smith</th>
                                <th className="py-2 px-2 text-right">Gross</th>
                                <th className="py-2 px-2 text-right">Net Profit</th>
                                {workerProfile.roleType !== 'guest' && (
                                  <th className="py-2 pl-2 text-right">Del</th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/80 text-xs">
                              {sales.map((s) => {
                                const rev = Number(s.totalRevenue ?? s.totalPrice ?? 0);
                                const prof = Number(s.profit ?? rev);
                                return (
                                  <tr key={s.id} className="hover:bg-zinc-900/60">
                                    <td className="py-2.5 pr-2">
                                      <div className="font-semibold text-zinc-100">
                                        {s.quantity}x {s.itemName}
                                      </div>
                                      <div className="text-[11px] text-zinc-500">{s.dateStr}</div>
                                    </td>
                                    <td className="py-2.5 px-2 text-zinc-300">
                                      <div>{s.buyerName}</div>
                                      <div className="text-[11px] text-zinc-500">
                                        by {s.workerName}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-2 text-right text-zinc-300 font-medium whitespace-nowrap">
                                      {rev.toLocaleString()}g
                                    </td>
                                    <td className="py-2.5 px-2 text-right font-bold text-amber-300 whitespace-nowrap">
                                      +{prof.toLocaleString()}g
                                    </td>
                                    {workerProfile.roleType !== 'guest' && (
                                      <td className="py-2.5 pl-2 text-right">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteSale(s.id)}
                                          title="Delete entry"
                                          className="p-1 rounded hover:bg-red-950 text-zinc-500 hover:text-red-400 cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* WORKER TAB 2: ORDERS & COMMISSIONS QUEUE (WAITING ON RESOURCES)   */}
              {/* ----------------------------------------------------------------- */}
              {activeWorkerTab === 'orders' && (
                <div className="space-y-5">
                  {/* Switch Between Customer Commissions & Material Deliveries / Pending Supplies */}
                  <div className="rounded-lg bg-[#18181b] border border-zinc-800/90 p-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800/90">
                      <button
                        type="button"
                        onClick={() => setOrdersSectionMode('customer')}
                        className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                          ordersSectionMode === 'customer'
                            ? 'bg-zinc-800 text-amber-200 border border-amber-500/45'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <ClipboardList className="w-4 h-4 text-amber-400" />
                        <span>Customer Orders</span>
                        {pendingOrdersCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold">
                            {pendingOrdersCount}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrdersSectionMode('supplies')}
                        className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                          ordersSectionMode === 'supplies'
                            ? 'bg-zinc-800 text-amber-200 border border-amber-500/45'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Package className="w-4 h-4 text-amber-400" />
                        <span>Material Deliveries &amp; Pending</span>
                        {pendingSupplyCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold">
                            {pendingSupplyCount} pending
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-zinc-400 px-2">
                      {ordersSectionMode === 'customer'
                        ? `${pendingOrdersCount} pending • ${
                            orders.filter((o) => o.status === 'done').length
                          } done`
                        : `${
                            supplyRecords.filter((s) => s.status === 'delivered').length
                          } delivered • ${pendingSupplyCount} pending`}
                    </div>
                  </div>

                  {ordersSectionMode === 'customer' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* LOG NEW ORDER FORM (SMITHS ONLY) */}
                      {workerProfile.roleType !== 'guest' && (
                        <form
                          onSubmit={handleCreateOrder}
                          className="lg:col-span-5 bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4 h-fit"
                        >
                          <div className="border-b border-zinc-800 pb-2.5">
                            <h3 className="text-base font-serif font-bold text-zinc-100 flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-red-500" />
                              <span>Log Customer Order</span>
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              Save commissions when you are low on ore or leather, then mark them Done once forged.
                            </p>
                          </div>

                          <div className="relative">
                            <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-1.5">
                              Item Ordered
                            </label>
                            <div className="relative">
                              <Search className="w-4 h-4 text-amber-400/80 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={orderItemSearch}
                                onFocus={() => setShowOrderItemDropdown(true)}
                                onBlur={() => setTimeout(() => setShowOrderItemDropdown(false), 160)}
                                onChange={(e) => {
                                  setOrderItemSearch(e.target.value);
                                  setShowOrderItemDropdown(true);
                                }}
                                placeholder="Search item or tier..."
                                className="w-full pl-9 pr-8 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500/70"
                              />
                              {orderItemSearch && (
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setOrderItemSearch('');
                                    setShowOrderItemDropdown(true);
                                  }}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {showOrderItemDropdown && (
                              <div className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto rounded-md bg-zinc-950 border border-zinc-700 shadow-2xl divide-y divide-zinc-900">
                                {filteredOrderOptions.map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setOrderItemId(item.id);
                                      setOrderItemSearch(item.name);
                                      setShowOrderItemDropdown(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                      orderItemId === item.id
                                        ? 'bg-red-950/90 text-amber-200'
                                        : 'hover:bg-zinc-900 text-zinc-100'
                                    }`}
                                  >
                                    <div className="min-w-0">
                                      <div className="font-semibold truncate">{item.name}</div>
                                      <div className="text-[11px] text-zinc-400">
                                        {item.subCategory || item.category}
                                      </div>
                                    </div>
                                    <span className="font-bold text-amber-300 text-xs shrink-0">
                                      {item.finalPrice}g
                                    </span>
                                  </button>
                                ))}

                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setOrderItemId('custom');
                                    setOrderItemSearch('Custom Commission');
                                    setOrderAgreedPrice(150);
                                    setShowOrderItemDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-bold flex items-center gap-1.5 bg-zinc-900/70 hover:bg-zinc-900 text-amber-300 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Custom Commission / Special Request</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {orderItemId === 'custom' && (
                            <div>
                              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                Custom Request Name
                              </label>
                              <input
                                type="text"
                                required
                                value={customOrderItemName}
                                onChange={(e) => setCustomOrderItemName(e.target.value)}
                                placeholder="e.g., Full Nordic Carved Set"
                                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                Quantity
                              </label>
                              <input
                                type="number"
                                min="1"
                                required
                                value={orderQty}
                                onChange={(e) => setOrderQty(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                Agreed Price Each (g)
                              </label>
                              <input
                                type="number"
                                min="0"
                                required
                                value={orderAgreedPrice}
                                onChange={(e) => setOrderAgreedPrice(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-500/70"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Customer / Buyer Name
                            </label>
                            <input
                              type="text"
                              required
                              value={orderBuyerName}
                              onChange={(e) => setOrderBuyerName(e.target.value)}
                              placeholder="e.g., Adrianne, Lydia, Jarl's Guard..."
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Resource / Order Notes
                            </label>
                            <textarea
                              rows={2}
                              value={orderNotes}
                              onChange={(e) => setOrderNotes(e.target.value)}
                              placeholder="e.g., Need 3 more Malachite Ore before forging..."
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500/70"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 px-4 rounded-md font-bold uppercase tracking-wider text-xs sm:text-sm bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-amber-300" />
                            <span>Save Order to Queue</span>
                          </button>
                        </form>
                      )}

                      {/* COMMISSION QUEUE LIST */}
                      <div
                        className={`${
                          workerProfile.roleType !== 'guest' ? 'lg:col-span-7' : 'lg:col-span-12'
                        } bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                          <div>
                            <h3 className="text-base font-serif font-bold text-zinc-100">
                              Forge Commission Board
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              Automatically checks your vault stock against each order&apos;s recipe.
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {[
                              { id: 'pending', label: `Pending (${pendingOrdersCount})` },
                              {
                                id: 'done',
                                label: `Done (${orders.filter((o) => o.status === 'done').length})`
                              },
                              { id: 'all', label: 'All' }
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setOrderStatusFilter(tab.id)}
                                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                                  orderStatusFilter === tab.id
                                    ? 'bg-red-800 text-amber-200 border border-amber-500/60'
                                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {workerProfile.roleType !== 'guest' && (
                          <label className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={logSaleOnOrderComplete}
                              onChange={(e) => setLogSaleOnOrderComplete(e.target.checked)}
                              className="w-4 h-4 rounded accent-red-700"
                            />
                            <span>
                              Automatically record completed orders into the <strong>Sales &amp; Profits</strong> ledger when marked Done
                            </span>
                          </label>
                        )}

                        {(() => {
                          const visibleOrders = orders.filter((o) =>
                            orderStatusFilter === 'all' ? true : o.status === orderStatusFilter
                          );
                          if (visibleOrders.length === 0) {
                            return (
                              <div className="text-center py-10 text-zinc-500 text-sm">
                                No {orderStatusFilter === 'all' ? '' : orderStatusFilter} orders on the board.
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-3">
                              {visibleOrders.map((order) => {
                                const catalogMatch = enrichedCatalog.find(
                                  (i) => i.id === order.itemId
                                );
                                const qty = Math.max(1, Number(order.quantity) || 1);
                                const totalGold = qty * Number(order.agreedPrice || 0);
                                const isDone = order.status === 'done';

                                // Calculate missing materials from vault for this order
                                const missingMaterials = [];
                                if (catalogMatch && catalogMatch.recipe) {
                                  catalogMatch.recipe.forEach((req) => {
                                    const mat = materialMap[req.materialId];
                                    const needed = req.qty * qty;
                                    const have = mat ? mat.stock : 0;
                                    if (have < needed) {
                                      missingMaterials.push({
                                        name: mat ? mat.name : req.materialId,
                                        shortBy: needed - have,
                                        needed,
                                        have
                                      });
                                    }
                                  });
                                }

                                return (
                                  <div
                                    key={order.id}
                                    className={`rounded-lg p-4 border transition-colors space-y-2.5 ${
                                      isDone
                                        ? 'bg-zinc-950/60 border-zinc-800/80 opacity-80'
                                        : missingMaterials.length > 0
                                        ? 'bg-red-950/20 border-red-900/70'
                                        : 'bg-zinc-950 border-zinc-800'
                                    }`}
                                  >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                      <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                              isDone
                                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/70'
                                                : 'bg-amber-500/15 text-amber-300 border-amber-500/50'
                                            }`}
                                          >
                                            {isDone ? 'Done' : 'Pending'}
                                          </span>
                                          <h4
                                            className={`font-serif font-bold text-base ${
                                              isDone ? 'line-through text-zinc-400' : 'text-zinc-100'
                                            }`}
                                          >
                                            {qty}x {order.itemName}
                                          </h4>
                                        </div>
                                        <div className="text-xs text-zinc-400 mt-1">
                                          Buyer: <strong className="text-zinc-200">{order.buyerName}</strong>{' '}
                                          &bull; Taken by {order.assignedSmith} ({order.createdDate})
                                          {isDone && order.completedDate
                                            ? ` • Finished ${order.completedDate}`
                                            : ''}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="px-2.5 py-1 rounded bg-zinc-900 border border-amber-500/45 text-amber-300 font-bold text-sm">
                                          {totalGold}g
                                        </span>

                                        {workerProfile.roleType !== 'guest' && (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => handleToggleOrderStatus(order)}
                                              className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                                                isDone
                                                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                                                  : 'bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60'
                                              }`}
                                            >
                                              <CheckCircle2 className="w-3.5 h-3.5" />
                                              <span>{isDone ? 'Reopen' : 'Mark Done'}</span>
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteOrder(order.id)}
                                              title="Delete order"
                                              className="p-1.5 rounded hover:bg-red-950 text-zinc-500 hover:text-red-400 cursor-pointer"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {/* Resource Readiness Indicator */}
                                    {!isDone && catalogMatch && (
                                      <div className="text-xs">
                                        {missingMaterials.length > 0 ? (
                                          <div className="flex flex-wrap items-center gap-1.5 text-amber-300">
                                            <span className="inline-flex items-center gap-1 font-bold text-red-400">
                                              <AlertTriangle className="w-3.5 h-3.5" /> Missing Resources:
                                            </span>
                                            {missingMaterials.map((m) => (
                                              <span
                                                key={m.name}
                                                className="px-2 py-0.5 rounded bg-red-950/70 border border-red-800/80 text-amber-200"
                                              >
                                                {m.shortBy}x {m.name} ({m.have}/{m.needed} in vault)
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> All recipe materials ready in vault!
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {order.notes && (
                                      <p className="text-xs text-zinc-400 bg-zinc-900/80 border border-zinc-800/80 rounded px-3 py-1.5 italic">
                                        &ldquo;{order.notes}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    /* MATERIAL DELIVERIES & PENDING SUPPLY ORDERS */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* ADD MATERIAL DELIVERY OR PENDING ORDER (SMITHS ONLY) */}
                      {workerProfile.roleType !== 'guest' && (
                        <form
                          onSubmit={handleAddSupplyRecord}
                          className="lg:col-span-5 bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4 h-fit"
                        >
                          <div className="border-b border-zinc-800 pb-2.5">
                            <h3 className="text-base font-serif font-bold text-zinc-100 flex items-center gap-2">
                              <Package className="w-4 h-4 text-amber-400" />
                              <span>Log Delivery or Pending Order</span>
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              Track who delivered materials or keep a list of pending supply orders.
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Delivered By / Supplier Name
                            </label>
                            <input
                              type="text"
                              required
                              value={supplierNameInput}
                              onChange={(e) => setSupplierNameInput(e.target.value)}
                              placeholder="e.g., Gloombound Miners, Khajiit Caravan..."
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Material
                            </label>
                            <select
                              value={supplyMaterialId}
                              onChange={(e) => {
                                const nextId = e.target.value;
                                setSupplyMaterialId(nextId);
                                const found = materials.find((m) => m.id === nextId);
                                if (found) {
                                  setSupplyCostGold(
                                    found.buyPrice * Math.max(1, Number(supplyQty) || 1)
                                  );
                                }
                              }}
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                            >
                              {materials.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.category} • {m.buyPrice}g/ea)
                                </option>
                              ))}
                              <option value="custom">Custom / Other Material...</option>
                            </select>
                          </div>

                          {supplyMaterialId === 'custom' && (
                            <div>
                              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                Custom Material Name
                              </label>
                              <input
                                type="text"
                                required
                                value={customSupplyMatName}
                                onChange={(e) => setCustomSupplyMatName(e.target.value)}
                                placeholder="e.g., Dragon Bones, Void Salts..."
                                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                Quantity
                              </label>
                              <input
                                type="number"
                                min="1"
                                required
                                value={supplyQty}
                                onChange={(e) => {
                                  const nextQty = Math.max(1, Number(e.target.value) || 1);
                                  setSupplyQty(nextQty);
                                  const found = materials.find((m) => m.id === supplyMaterialId);
                                  if (found) setSupplyCostGold(found.buyPrice * nextQty);
                                }}
                                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                Total Cost (g)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={supplyCostGold}
                                onChange={(e) => setSupplyCostGold(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-500/70"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                Status
                              </label>
                              <select
                                value={supplyStatusInput}
                                onChange={(e) => setSupplyStatusInput(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                              >
                                <option value="delivered">Delivered Now</option>
                                <option value="pending">Pending Order</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                value={supplyDateStr}
                                onChange={(e) => setSupplyDateStr(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">
                              Notes (Optional)
                            </label>
                            <input
                              type="text"
                              value={supplyNotes}
                              onChange={(e) => setSupplyNotes(e.target.value)}
                              placeholder="e.g., Paid half upfront, courier from Markarth..."
                              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500/70"
                            />
                          </div>

                          <label className="flex items-center gap-2 pt-0.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={addDeliveredStockToVault}
                              onChange={(e) => setAddDeliveredStockToVault(e.target.checked)}
                              className="w-4 h-4 rounded accent-amber-500"
                            />
                            <span className="text-xs text-zinc-400">
                              Add delivered material quantity to vault stock
                            </span>
                          </label>

                          <button
                            type="submit"
                            className="w-full py-2.5 px-4 rounded-md font-bold uppercase tracking-wider text-xs sm:text-sm bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-amber-300" />
                            <span>
                              {supplyStatusInput === 'delivered'
                                ? 'Record Delivery'
                                : 'Add Pending Order'}
                            </span>
                          </button>
                        </form>
                      )}

                      {/* DELIVERIES & PENDING MATERIAL ORDERS LIST */}
                      <div
                        className={`${
                          workerProfile.roleType !== 'guest' ? 'lg:col-span-7' : 'lg:col-span-12'
                        } bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                          <div>
                            <h3 className="text-base font-serif font-bold text-zinc-100">
                              Material Deliveries &amp; Pending Orders
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              See who delivered forge materials and manage incoming orders.
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {[
                              { id: 'all', label: `All (${supplyRecords.length})` },
                              { id: 'pending', label: `Pending (${pendingSupplyCount})` },
                              {
                                id: 'delivered',
                                label: `Delivered (${
                                  supplyRecords.filter((s) => s.status === 'delivered').length
                                })`
                              }
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSupplyFilter(tab.id)}
                                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                                  supplyFilter === tab.id
                                    ? 'bg-red-800 text-amber-200 border border-amber-500/60'
                                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {(() => {
                          const visibleSupplies = supplyRecords.filter((s) =>
                            supplyFilter === 'all' ? true : s.status === supplyFilter
                          );

                          if (visibleSupplies.length === 0) {
                            return (
                              <div className="text-center py-10 text-zinc-500 text-sm">
                                No {supplyFilter === 'all' ? '' : supplyFilter} material records yet.
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-3">
                              {visibleSupplies.map((rec) => {
                                const isDelivered = rec.status === 'delivered';
                                return (
                                  <div
                                    key={rec.id}
                                    className="rounded-lg p-4 bg-zinc-950 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                  >
                                    <div className="space-y-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                            isDelivered
                                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                                              : 'bg-amber-500/15 text-amber-300 border-amber-500/45'
                                          }`}
                                        >
                                          {isDelivered ? 'Delivered' : 'Pending'}
                                        </span>
                                        <span className="font-serif font-bold text-sm sm:text-base text-zinc-100">
                                          {rec.quantity}x {rec.materialName}
                                        </span>
                                        {rec.costGold > 0 && (
                                          <span className="text-xs font-semibold text-amber-300/90">
                                            ({rec.costGold}g)
                                          </span>
                                        )}
                                      </div>

                                      <div className="text-xs text-zinc-400">
                                        {isDelivered ? 'Delivered by' : 'Supplier'}:{' '}
                                        <strong className="text-zinc-200">{rec.supplierName}</strong>{' '}
                                        &bull; {rec.dateStr}
                                      </div>

                                      {rec.notes && (
                                        <p className="text-xs text-zinc-500 italic">
                                          &ldquo;{rec.notes}&rdquo;
                                        </p>
                                      )}
                                    </div>

                                    {workerProfile.roleType !== 'guest' && (
                                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                        {!isDelivered && (
                                          <button
                                            type="button"
                                            onClick={() => handleMarkSupplyDelivered(rec)}
                                            className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-emerald-950/70 text-emerald-300 border border-zinc-700 hover:border-emerald-600/60 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                          >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Mark Delivered</span>
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveSupplyRecord(
                                              rec.id,
                                              `${rec.quantity}x ${rec.materialName}`
                                            )
                                          }
                                          title="Remove entry"
                                          className="p-1.5 rounded hover:bg-red-950 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* WORKER TAB 3: FORGE STOCK & ORE VAULT                             */}
              {/* ----------------------------------------------------------------- */}
              {activeWorkerTab === 'stock' && (() => {
                const lowMaterialsCount = materials.filter((m) => m.stock <= m.minStock).length;
                const lowFinishedCount = enrichedCatalog.filter((i) => i.stock <= i.minStock).length;
                const totalVaultValue = materials.reduce(
                  (sum, m) => sum + m.buyPrice * m.stock,
                  0
                );

                return (
                  <div className="space-y-5">
                    {/* Top Summary & Sub-Tab Switcher Bar */}
                    <div className="rounded-lg bg-[#18181b] border border-zinc-800/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Segmented View Toggle */}
                      <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-zinc-800/90 self-start">
                        <button
                          type="button"
                          onClick={() => setStockSubView('materials')}
                          className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                            stockSubView === 'materials'
                              ? 'bg-zinc-800 text-amber-200 border border-amber-500/40 shadow-xs'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Anvil className="w-4 h-4 text-amber-400/90" />
                          <span>Ores, Ingots &amp; Fuel</span>
                          {lowMaterialsCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold">
                              {lowMaterialsCount} low
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setStockSubView('finished')}
                          className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                            stockSubView === 'finished'
                              ? 'bg-zinc-800 text-amber-200 border border-amber-500/40 shadow-xs'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Sword className="w-4 h-4 text-red-400/90" />
                          <span>Finished Wares</span>
                          {lowFinishedCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold">
                              {lowFinishedCount} low
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Calm Vault Metrics & Low-Stock Filter */}
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div className="px-3 py-1.5 rounded-md bg-zinc-950/90 border border-zinc-800/80 text-zinc-400">
                          Vault Value:{' '}
                          <strong className="text-zinc-200 font-semibold">
                            {totalVaultValue.toLocaleString()}g
                          </strong>
                        </div>

                        <label className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-950/90 border border-zinc-800/80 text-zinc-300 cursor-pointer select-none hover:border-zinc-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={showLowStockOnly}
                            onChange={(e) => setShowLowStockOnly(e.target.checked)}
                            className="w-3.5 h-3.5 rounded accent-amber-500"
                          />
                          <span>Low Stock Only</span>
                        </label>
                      </div>
                    </div>

                    {/* RESOURCE & MATERIAL STOCK TREND GRAPH */}
                    {(() => {
                      const historyPoints =
                        materialHistory.length > 0
                          ? materialHistory
                          : [buildMaterialSnapshotEntry(materials, getLocalDateString(0))];

                      const series = historyPoints.map((pt) => {
                        const val =
                          trendMaterialFilter === 'all'
                            ? pt.totalUnits
                            : Number(pt.byId?.[trendMaterialFilter] ?? 0);
                        const shortLabel = new Date(pt.dateStr + 'T12:00:00').toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric' }
                        );
                        return { dateStr: pt.dateStr, label: shortLabel, value: val };
                      });

                      const latestVal = series[series.length - 1]?.value ?? 0;
                      const prevVal =
                        series.length > 1 ? series[series.length - 2].value : latestVal;
                      const firstVal = series[0]?.value ?? latestVal;
                      const netDelta = latestVal - firstVal;
                      const stepDelta = latestVal - prevVal;

                      const isTrendingDown = netDelta < 0 || stepDelta < 0;
                      const isTrendingUp = netDelta > 0 && stepDelta >= 0;

                      const maxVal = Math.max(...series.map((s) => s.value), 1);
                      const chartW = 640;
                      const chartH = 135;
                      const padX = 24;
                      const padY = 20;
                      const innerW = chartW - padX * 2;
                      const innerH = chartH - padY * 2;

                      const coords = series.map((pt, idx) => {
                        const x =
                          series.length === 1
                            ? chartW / 2
                            : padX + (idx / (series.length - 1)) * innerW;
                        const y = padY + innerH - (pt.value / maxVal) * innerH;
                        return { ...pt, x, y };
                      });

                      const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
                      const areaPoints =
                        coords.length > 1
                          ? `${coords[0].x},${padY + innerH} ${polylinePoints} ${
                              coords[coords.length - 1].x
                            },${padY + innerH}`
                          : '';

                      const strokeColor = isTrendingDown
                        ? '#f87171'
                        : isTrendingUp
                        ? '#34d399'
                        : '#fbbf24';

                      const selectedMatObj =
                        trendMaterialFilter === 'all'
                          ? null
                          : materials.find((m) => m.id === trendMaterialFilter);

                      return (
                        <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-amber-400" />
                                <h3 className="text-base font-serif font-bold text-zinc-100">
                                  Resource Stock Trend
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                    isTrendingDown
                                      ? 'bg-red-950/70 text-red-300 border-red-800/70'
                                      : isTrendingUp
                                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                                      : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                                  }`}
                                >
                                  {isTrendingDown
                                    ? `Trending Down (${netDelta >= 0 ? stepDelta : netDelta} units) — Restock Soon`
                                    : isTrendingUp
                                    ? `Trending Up (+${netDelta} units)`
                                    : 'Steady Stock'}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 mt-0.5">
                                Tracks daily resource levels over time so you can spot downward trends before running dry.
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={trendMaterialFilter}
                                onChange={(e) => setTrendMaterialFilter(e.target.value)}
                                className="px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500/60"
                              >
                                <option value="all">All Vault Resources (Total Units)</option>
                                {materials.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name} ({m.stock} {m.unit})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Trend Line SVG */}
                          <div className="rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-3">
                            <svg
                              viewBox={`0 0 ${chartW} ${chartH}`}
                              className="w-full h-36 overflow-visible"
                            >
                              <defs>
                                <linearGradient id="resTrendGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
                                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              {/* Horizontal reference gridlines */}
                              {[0, 0.5, 1].map((ratio) => {
                                const gy = padY + innerH - ratio * innerH;
                                return (
                                  <line
                                    key={ratio}
                                    x1={padX}
                                    y1={gy}
                                    x2={chartW - padX}
                                    y2={gy}
                                    stroke="#27272a"
                                    strokeDasharray="3 3"
                                    strokeWidth="1"
                                  />
                                );
                              })}

                              {areaPoints && (
                                <polygon points={areaPoints} fill="url(#resTrendGrad)" />
                              )}

                              {coords.length > 1 && (
                                <polyline
                                  fill="none"
                                  stroke={strokeColor}
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={polylinePoints}
                                />
                              )}

                              {coords.map((c, idx) => (
                                <g key={c.dateStr}>
                                  <circle
                                    cx={c.x}
                                    cy={c.y}
                                    r={idx === coords.length - 1 ? 4.5 : 3.2}
                                    fill="#09090b"
                                    stroke={strokeColor}
                                    strokeWidth="2"
                                  />
                                  <text
                                    x={c.x}
                                    y={c.y - 8}
                                    textAnchor="middle"
                                    fill="#e4e4e7"
                                    fontSize="10"
                                    fontWeight="600"
                                  >
                                    {c.value}
                                  </text>
                                  <text
                                    x={c.x}
                                    y={chartH - 3}
                                    textAnchor="middle"
                                    fill="#71717a"
                                    fontSize="9.5"
                                  >
                                    {c.label}
                                  </text>
                                </g>
                              ))}
                            </svg>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                            <span>
                              Showing:{' '}
                              <strong className="text-zinc-200">
                                {selectedMatObj ? selectedMatObj.name : 'All Vault Materials'}
                              </strong>{' '}
                              • Current:{' '}
                              <strong className="text-amber-300">
                                {latestVal} {selectedMatObj ? selectedMatObj.unit : 'total units'}
                              </strong>
                            </span>
                            <span>
                              {series.length} {series.length === 1 ? 'day' : 'days'} tracked
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* ============================================================= */}
                    {/* SUB-VIEW A: RAW MATERIALS, ORES, FUEL & SMELTED INGOTS VAULT  */}
                    {/* ============================================================= */}
                    {stockSubView === 'materials' && (
                      <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-5">
                        {/* Search & Pill Filter Bar */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {['All', 'Smelted Ingots', 'Raw Ore', 'Fuel', 'Hides & Straps'].map(
                              (cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setStockCategoryFilter(cat)}
                                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                    stockCategoryFilter === cat
                                      ? 'bg-zinc-800 text-amber-200 border border-amber-500/45 font-semibold'
                                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                                  }`}
                                >
                                  {cat}
                                </button>
                              )
                            )}
                          </div>

                          <div className="relative w-full lg:w-64">
                            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={stockSearchQuery}
                              onChange={(e) => setStockSearchQuery(e.target.value)}
                              placeholder="Filter ores, ingots, fuel..."
                              className="w-full pl-8 pr-7 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/60"
                            />
                            {stockSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setStockSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Add New Material Bar (Smiths Only) */}
                        {workerProfile.roleType !== 'guest' && (
                          <form
                            onSubmit={handleAddMaterial}
                            className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80"
                          >
                            <input
                              type="text"
                              required
                              value={newMatName}
                              onChange={(e) => setNewMatName(e.target.value)}
                              placeholder="Add new material..."
                              className="col-span-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/60"
                            />
                            <select
                              value={newMatCat}
                              onChange={(e) => setNewMatCat(e.target.value)}
                              className="px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none"
                            >
                              <option value="Smelted Ingots">Smelted Ingots</option>
                              <option value="Raw Ore">Raw Ore</option>
                              <option value="Fuel">Fuel</option>
                              <option value="Hides & Straps">Hides &amp; Straps</option>
                            </select>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                value={newMatBuyPrice}
                                onChange={(e) => setNewMatBuyPrice(e.target.value)}
                                title="Supplier buy price (g)"
                                className="w-full px-2.5 py-1.5 pr-6 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-zinc-500">
                                g
                              </span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              value={newMatStock}
                              onChange={(e) => setNewMatStock(e.target.value)}
                              placeholder="Qty"
                              title="Starting stock"
                              className="px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-red-900/80 text-amber-200 border border-zinc-700 hover:border-amber-500/50 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              + Add Mat
                            </button>
                          </form>
                        )}

                        {/* Clean Grouped Material Tables */}
                        {groupedMaterials.length === 0 ? (
                          <div className="text-center py-10 text-sm text-zinc-500">
                            No materials match your current filter.
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {groupedMaterials.map((group) => (
                              <div key={group.category} className="space-y-2.5">
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
                                        {/* Material Name & Subtle Low Indicator */}
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

                                        {/* Buy Cost & Stock Stepper */}
                                        <div className="flex items-center gap-5 shrink-0 ml-auto">
                                          {/* Buy Cost */}
                                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                            <span>Cost</span>
                                            {workerProfile.roleType !== 'guest' ? (
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
                                            {workerProfile.roleType !== 'guest' ? (
                                              <>
                                                <button
                                                  type="button"
                                                  onClick={() => adjustMaterialStock(mat.id, -1)}
                                                  className="w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
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
                                                  className="w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
                                                >
                                                  <Plus className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => handleDeleteMaterial(mat.id, mat.name)}
                                                  title={`Remove ${mat.name}`}
                                                  className="w-7 h-7 ml-1 rounded flex items-center justify-center bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-800/80 transition-colors cursor-pointer"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </>
                                            ) : (
                                              <span
                                                className={`min-w-[3rem] text-right font-semibold text-sm ${
                                                  isLow ? 'text-amber-300' : 'text-zinc-200'
                                                }`}
                                              >
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

                    {/* ============================================================= */}
                    {/* SUB-VIEW B: FINISHED WEAPONS, ARMOR & SMELTED WARES STOCK     */}
                    {/* ============================================================= */}
                    {stockSubView === 'finished' && (
                      <div className="bg-[#18181b] border border-zinc-800/90 rounded-lg p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                          <div>
                            <h3 className="text-base font-serif font-bold text-zinc-100">
                              Finished Wares Inventory
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              Ready-to-sell weapons, armor pieces, and smelted goods on the rack.
                            </p>
                          </div>

                          <div className="relative w-full sm:w-64">
                            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={finishedStockSearch}
                              onChange={(e) => setFinishedStockSearch(e.target.value)}
                              placeholder="Filter finished wares..."
                              className="w-full pl-8 pr-7 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/60"
                            />
                            {finishedStockSearch && (
                              <button
                                type="button"
                                onClick={() => setFinishedStockSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {(() => {
                          const visibleFinished = enrichedCatalog.filter((item) => {
                            const matchesLow = !showLowStockOnly || item.stock <= item.minStock;
                            const q = finishedStockSearch.trim().toLowerCase();
                            if (!q) return matchesLow;
                            const matchesQuery =
                              item.name.toLowerCase().includes(q) ||
                              (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
                              item.category.toLowerCase().includes(q);
                            return matchesLow && matchesQuery;
                          });

                          if (visibleFinished.length === 0) {
                            return (
                              <div className="text-center py-10 text-sm text-zinc-500">
                                No finished wares match your current filter.
                              </div>
                            );
                          }

                          return (
                            <div className="rounded-lg border border-zinc-800/90 bg-zinc-950/60 divide-y divide-zinc-800/60 max-h-[34rem] overflow-y-auto">
                              {visibleFinished.map((item) => {
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
                                        <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                                          <span>
                                            {item.category}
                                            {item.subCategory ? ` • ${item.subCategory}` : ''}
                                          </span>
                                          <span>• List: {item.finalPrice}g</span>
                                          {isLow && (
                                            <span className="text-amber-300/90 font-medium">
                                              • Low stock
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      {workerProfile.roleType !== 'guest' ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => adjustCatalogStock(item.id, -1)}
                                            className="w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
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
                                            className="w-7 h-7 rounded flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                          </button>
                                        </>
                                      ) : (
                                        <span
                                          className={`min-w-[3rem] text-right font-semibold text-sm ${
                                            isLow ? 'text-amber-300' : 'text-zinc-200'
                                          }`}
                                        >
                                          {item.stock} in stock
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ----------------------------------------------------------------- */}
              {/* WORKER TAB 4: SMITH PROFILES, INDIVIDUAL STATS & PASSCODE SETTINGS*/}
              {/* ----------------------------------------------------------------- */}
              {activeWorkerTab === 'profiles' && (
                <div className="space-y-6">
                  {/* Your Active Profile Card */}
                  {(() => {
                    const myStats = profileStatsList.find(
                      (p) => p.name.toLowerCase() === workerProfile.name.toLowerCase()
                    );
                    return (
                      <div className="rounded-lg bg-[#18181b] border border-zinc-800 border-l-2 border-l-amber-400 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                              {workerProfile.roleType === 'guest'
                                ? 'Forge Guest'
                                : isAdminUnlocked
                                ? 'Master Admin'
                                : 'Active Smith'}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {workerProfile.roleType === 'guest'
                                ? `Last visit: ${myStats?.lastActive || todayStr}`
                                : `Last shift: ${myStats?.lastActive || todayStr}`}
                            </span>
                          </div>
                          <h3 className="text-xl font-serif font-bold text-zinc-100">
                            {workerProfile.name}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            {workerProfile.roleType === 'guest'
                              ? 'Viewing The Skyforge profits, orders, vault stock, and smith standings with a Guest Pass.'
                              : isAdminUnlocked
                              ? `Master Admin unlocked • Personal Forge Record: ${
                                  myStats?.salesCount || 0
                                } sales (${myStats?.itemsSold || 0} items forged & sold)`
                              : `Personal Forge Record: ${myStats?.salesCount || 0} sales (${
                                  myStats?.itemsSold || 0
                                } items forged & sold)`}
                          </p>
                        </div>

                        {workerProfile.roleType === 'guest' ? (
                          <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-400 space-y-1">
                            <div className="font-bold uppercase tracking-wider text-amber-300">
                              Guest Pass Permissions
                            </div>
                            <div>
                              Read-only access to Sales &amp; Profits, Orders, Stock, and Smith Roster.
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3 bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 text-center">
                            <div>
                              <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                                Today Net
                              </div>
                              <div className="text-base font-bold text-amber-300 mt-0.5">
                                +{(myStats?.todayProfit || 0).toLocaleString()}g
                              </div>
                            </div>
                            <div className="border-x border-zinc-800 px-3">
                              <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                                Gross Sales
                              </div>
                              <div className="text-base font-bold text-zinc-100 mt-0.5">
                                {(myStats?.totalRevenue || 0).toLocaleString()}g
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                                All-Time Net
                              </div>
                              <div className="text-base font-bold text-amber-300 mt-0.5">
                                +{(myStats?.totalProfit || 0).toLocaleString()}g
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* All Smiths & Guests Individual Stats Leaderboard */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                      <div>
                        <h3 className="text-base font-serif font-bold text-zinc-100">
                          Forge Roster &amp; Individual Sales Stats
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {workerProfile.roleType === 'guest'
                            ? 'Inspect individual smith standings, crafted items, and logged sales.'
                            : isAdminUnlocked
                            ? 'Click any profile to inspect sales history, or use the trash icon to remove a profile.'
                            : 'Click any profile to inspect their personal sales log and top crafted items.'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profileStatsList.map((prof, idx) => {
                        const isExpanded =
                          selectedProfileDetail?.toLowerCase() === prof.name.toLowerCase();
                        const isCurrentUser =
                          workerProfile?.name.toLowerCase() === prof.name.toLowerCase();
                        return (
                          <div
                            key={prof.name}
                            onClick={() =>
                              setSelectedProfileDetail(isExpanded ? null : prof.name)
                            }
                            className={`rounded-lg p-4 border transition-colors cursor-pointer space-y-3 ${
                              isExpanded
                                ? 'bg-zinc-900 border-amber-500/60'
                                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  {idx === 0 && prof.totalProfit > 0 && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-[10px] font-bold text-amber-300">
                                      #1 TOP SMITH
                                    </span>
                                  )}
                                  <span className="font-serif font-bold text-base text-zinc-100">
                                    {prof.name}
                                  </span>
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">
                                  {prof.role === 'guest'
                                    ? `Forge Guest • Last visit: ${prof.lastActive}`
                                    : `Skyforge Smith • Last shift: ${prof.lastActive}`}
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                {prof.role === 'guest' ? (
                                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-400">
                                    Visitor
                                  </span>
                                ) : (
                                  <div className="text-right">
                                    <div className="text-base font-bold text-amber-300">
                                      +{prof.totalProfit.toLocaleString()}g
                                    </div>
                                    <div className="text-[11px] text-zinc-500">Net Profit</div>
                                  </div>
                                )}

                                {isAdminUnlocked && !isCurrentUser && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProfile(prof.name);
                                    }}
                                    title={`Delete ${prof.name}'s profile`}
                                    className="p-1.5 rounded bg-red-950/70 hover:bg-red-900 text-red-300 hover:text-amber-200 border border-red-800/80 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {prof.role !== 'guest' && (
                              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                                <div>
                                  <span className="text-zinc-500 block text-[10px] uppercase">
                                    Sales
                                  </span>
                                  <span className="font-bold text-zinc-200">
                                    {prof.salesCount} ({prof.itemsSold} items)
                                  </span>
                                </div>
                                <div>
                                  <span className="text-zinc-500 block text-[10px] uppercase">
                                    Gross
                                  </span>
                                  <span className="font-bold text-zinc-200">
                                    {prof.totalRevenue.toLocaleString()}g
                                  </span>
                                </div>
                                <div>
                                  <span className="text-zinc-500 block text-[10px] uppercase">
                                    Signature
                                  </span>
                                  <span
                                    className="font-bold text-amber-300/90 truncate block"
                                    title={prof.topItem}
                                  >
                                    {prof.topItem}
                                  </span>
                                </div>
                              </div>
                            )}

                            {isExpanded && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="pt-2.5 border-t border-zinc-800 space-y-2 cursor-default"
                              >
                                {prof.role === 'guest' ? (
                                  <p className="text-xs text-zinc-400">
                                    Guest Pass profile — holds read-only ledger &amp; stock viewing access.
                                  </p>
                                ) : (
                                  <>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                                      Recent Forge Sales by {prof.name}
                                    </div>
                                    {prof.recentSales.length === 0 ? (
                                      <p className="text-xs text-zinc-500">
                                        No sales recorded under this profile yet.
                                      </p>
                                    ) : (
                                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                        {prof.recentSales.map((s) => (
                                          <div
                                            key={s.id}
                                            className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800/80"
                                          >
                                            <div>
                                              <span className="font-semibold text-zinc-200">
                                                {s.quantity}x {s.itemName}
                                              </span>
                                              <span className="text-zinc-500 ml-1.5">
                                                to {s.buyerName} ({s.dateStr})
                                              </span>
                                            </div>
                                            <span className="font-bold text-amber-300">
                                              +{s.profit ?? s.totalRevenue}g
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Admin Passcode Gate & Profile Controls (Hidden for Guests) */}
                  {workerProfile.roleType !== 'guest' && (
                    <div className="bg-[#18181b] border border-zinc-800 border-t-2 border-t-red-800 rounded-lg p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-400" />
                            <h3 className="text-base font-serif font-bold text-zinc-100">
                              Master Admin Controls
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                isAdminUnlocked
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/70'
                                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                              }`}
                            >
                              {isAdminUnlocked ? 'Unlocked' : 'Locked'}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">
                            Smiths and Guests cannot alter passcodes. Unlock with the Admin Passcode to open the Admin Sidebar Menu (Spreadsheet Exports, Clean-Slate Reset, and Profile Removal).
                          </p>
                        </div>

                        {!isAdminUnlocked ? (
                          <form onSubmit={handleUnlockAdmin} className="flex items-center gap-2 shrink-0">
                            <input
                              type="password"
                              required
                              value={adminUnlockInput}
                              onChange={(e) => setAdminUnlockInput(e.target.value)}
                              placeholder="Enter Admin Passcode..."
                              className="w-44 px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500/70"
                            />
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs cursor-pointer"
                            >
                              Unlock Admin
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setShowAdminSidebar(true)}
                              className="px-3 py-1.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 text-xs font-bold cursor-pointer"
                            >
                              Open Admin Sidebar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAdminUnlocked(false);
                                setShowAdminSidebar(false);
                              }}
                              className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold cursor-pointer"
                            >
                              Lock Admin
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </aside>
          )}
        </div>
      </main>

      {/* ADMIN SIDEBAR DRAWER (EXPORT SPREADSHEETS & CLEAN-SLATE RESET) */}
      {workerProfile && workerProfile.roleType !== 'guest' && isAdminUnlocked && showAdminSidebar && (
        <div
          onClick={() => setShowAdminSidebar(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-end"
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm h-full bg-[#141416] border-l-2 border-red-800/90 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Master Admin Sidebar
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-zinc-100 mt-1">
                    Forge Administration
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Spreadsheet exports, clean-slate reset, and admin session controls.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdminSidebar(false)}
                  className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Spreadsheet Export Tools */}
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <span>Spreadsheets &amp; Ledgers</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Download Excel (<code className="text-amber-300">.xls</code>) workbooks or individual <code className="text-amber-300">.csv</code> sheets for Google Sheets.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminSidebar(false);
                    setShowExportModal(true);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>Open Spreadsheet Export</span>
                </button>
              </div>

              {/* Full Forge Backup & Restore (.JSON) */}
              <div className="rounded-lg bg-zinc-950 border border-amber-500/45 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Save &amp; Restore Forge Data</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Save a complete <code className="text-amber-300">.json</code> snapshot of all prices, stock, orders, deliveries, profiles, and sales—or restore one anytime.
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleExportFullBackupJson}
                    className="w-full py-2.5 px-3.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-amber-200 border border-amber-500/50 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
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
                    className="w-full py-2 px-3.5 rounded-md bg-zinc-900/70 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Restore from Backup (.json)</span>
                  </button>
                </div>
              </div>

              {/* Clean Slate Reset Tools */}
              <div className="rounded-lg bg-zinc-950 border border-red-900/60 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                  <RotateCcw className="w-4 h-4 text-red-400" />
                  <span>Clean Slate Reset</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Wipes all resource stock, buy/sell prices, orders, deliveries, sales logs, and roster profiles back to zero.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminSidebar(false);
                    setConfirmResetModal(true);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-md bg-zinc-900 hover:bg-red-950 text-red-300 hover:text-amber-200 border border-red-800/80 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Forge to Clean Slate</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdminUnlocked(false);
                  setShowAdminSidebar(false);
                  triggerToast('Master Admin controls locked.');
                }}
                className="flex-1 py-2 px-3 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold cursor-pointer"
              >
                Lock Admin Mode
              </button>
              <button
                type="button"
                onClick={() => setShowAdminSidebar(false)}
                className="py-2 px-3.5 rounded-md bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* RECIPE EDITOR MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#141416] border border-zinc-800 border-t-2 border-t-red-800 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setEditingItemId(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Recipe
              </span>
              <h3 className="text-lg font-serif font-bold text-zinc-100 mt-0.5">
                {editingItem.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Cost: <strong className="text-zinc-100">{editingItem.materialCost}g</strong> &bull;
                List: <strong className="text-amber-300">{editingItem.finalPrice}g</strong>
              </p>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {editingItem.recipe.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-3">
                  No materials assigned.
                </p>
              ) : (
                editingItem.recipe.map((req) => {
                  const mat = materialMap[req.materialId];
                  return (
                    <div
                      key={req.materialId}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-sm"
                    >
                      <div>
                        <div className="font-semibold text-zinc-100">
                          {mat ? mat.name : req.materialId}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {mat ? `${mat.buyPrice}g each` : 'Unknown'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          value={req.qty}
                          onChange={(e) =>
                            updateRecipeIngredientQty(editingItem.id, req.materialId, e.target.value)
                          }
                          className="w-14 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-amber-300 font-bold text-center text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeRecipeIngredient(editingItem.id, req.materialId)}
                          className="p-1.5 rounded hover:bg-red-950 text-zinc-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form
              onSubmit={handleAddIngredientToRecipe}
              className="pt-3 border-t border-zinc-800 flex items-end gap-2"
            >
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Add Material</label>
                <select
                  value={addRecipeMatId}
                  onChange={(e) => setAddRecipeMatId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.buyPrice}g)
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-16">
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={addRecipeQty}
                  onChange={(e) => setAddRecipeQty(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm text-center"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-red-950 border border-zinc-700 hover:border-amber-500/50 text-amber-300 font-bold text-sm cursor-pointer"
              >
                Add
              </button>
            </form>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setEditingItemId(null)}
                className="px-4 py-1.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL (ADMIN ONLY) */}
      {confirmResetModal && isAdminUnlocked && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141416] border border-zinc-800 border-t-2 border-t-red-800 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-zinc-100">Reset Forge to Clean Slate?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This clears all material stock, buy/sell prices, profit margin (0%), orders, deliveries, and ledger entries back to a clean slate.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmResetModal(false)}
                className="px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3.5 py-1.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 text-xs font-bold cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT TO EXCEL / GOOGLE SHEETS MODAL (ADMIN ONLY) */}
      {showExportModal && isAdminUnlocked && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#141416] border border-zinc-800 border-t-2 border-t-red-800 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Excel &amp; Google Sheets
              </span>
              <h3 className="text-lg font-serif font-bold text-zinc-100 mt-0.5 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                <span>Export Skyforge Data</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Download your ledgers and recipes as spreadsheet files. Open directly in Microsoft Excel or import via{' '}
                <span className="text-zinc-200 font-semibold">File &rarr; Import &rarr; Upload</span> in Google Sheets.
              </p>
            </div>

            {/* All-in-One Workbook */}
            <div className="rounded-lg bg-zinc-950 border border-amber-500/45 p-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-amber-200">
                    Full Forge Workbook (All 3 Tabs)
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Single <code className="text-amber-300">.xls</code> file containing{' '}
                    <strong>Sales Ledger</strong>, <strong>Catalog &amp; Recipes</strong>, and{' '}
                    <strong>Materials &amp; Stock</strong> on separate tabs.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleExportFullWorkbook}
                className="w-full py-2 px-3.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download Full Workbook (.xls)</span>
              </button>
            </div>

            {/* Individual CSV Exports */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Or Download Individual CSV Sheets
              </div>

              <button
                type="button"
                onClick={() => handleExportCsv('sales')}
                className="w-full px-3.5 py-2.5 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-100">Sales &amp; Profit Ledger</div>
                  <div className="text-xs text-zinc-500">{sales.length} logged transactions</div>
                </div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> .CSV
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleExportCsv('catalog')}
                className="w-full px-3.5 py-2.5 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-100">Catalog, Recipes &amp; Prices</div>
                  <div className="text-xs text-zinc-500">{enrichedCatalog.length} forged wares</div>
                </div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> .CSV
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleExportCsv('materials')}
                className="w-full px-3.5 py-2.5 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-100">Raw Materials, Ores &amp; Stock</div>
                  <div className="text-xs text-zinc-500">{materials.length} tracked materials</div>
                </div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> .CSV
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW CATALOG ITEM MODAL */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#141416] border border-zinc-800 border-t-2 border-t-red-800 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowAddItemModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Forge Catalog
              </span>
              <h3 className="text-lg font-serif font-bold text-zinc-100 mt-0.5">
                Add New Forged Item
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                New items appear immediately on the public price list and sales logger.
              </p>
            </div>

            <form onSubmit={handleCreateCatalogItem} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Gold Diamond Ring"
                    className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewCatInModal((prev) => !prev);
                        setNewCategoryInput('');
                      }}
                      className="text-[11px] font-bold text-amber-300 hover:underline cursor-pointer"
                    >
                      {isCreatingNewCatInModal ? 'Choose Existing' : '+ New'}
                    </button>
                  </div>
                  {isCreatingNewCatInModal ? (
                    <input
                      type="text"
                      required
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      placeholder="e.g., Jewelry, Arrows..."
                      className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-amber-500/60 text-amber-200 text-sm focus:outline-none"
                    />
                  ) : (
                    <select
                      value={newItemCategory}
                      onChange={(e) => {
                        const nextCat = e.target.value;
                        setNewItemCategory(nextCat);
                        setNewItemSubCategory(
                          resolvedSubCategoriesByCategory[nextCat]?.[0] || 'Standard'
                        );
                      }}
                      className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Sub-Category / Tier
                  </label>
                  <input
                    type="text"
                    list="subcategory-suggestions"
                    required
                    value={newItemSubCategory}
                    onChange={(e) => setNewItemSubCategory(e.target.value)}
                    placeholder="e.g., Iron, Gold, Steel"
                    className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-amber-200 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                  <datalist id="subcategory-suggestions">
                    {(resolvedSubCategoriesByCategory[newItemCategory] || []).map((sub) => (
                      <option key={sub} value={sub} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Description (Shown on Public Price List)
                </label>
                <input
                  type="text"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g., Heavy dark-metal axe tempered in the Skyforge."
                  className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Starting Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Low-Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 space-y-2.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Crafting Recipe Materials
                </label>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {newItemRecipe.map((req) => {
                    const mat = materialMap[req.materialId];
                    return (
                      <div
                        key={req.materialId}
                        className="flex items-center justify-between px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs"
                      >
                        <span className="font-semibold text-zinc-200">
                          {req.qty}x {mat ? mat.name : req.materialId}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setNewItemRecipe((prev) =>
                              prev.filter((r) => r.materialId !== req.materialId)
                            )
                          }
                          className="text-zinc-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <select
                      value={newItemMatId}
                      onChange={(e) => setNewItemMatId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                    >
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.buyPrice}g)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      min="1"
                      value={newItemMatQty}
                      onChange={(e) => setNewItemMatQty(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs text-center"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddIngredientToNewItem}
                    className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-red-950 border border-zinc-700 text-amber-300 font-bold text-xs cursor-pointer"
                  >
                    + Mat
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE CATEGORIES & SUB-CATEGORIES MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#141416] border border-zinc-800 border-t-2 border-t-red-800 rounded-xl max-w-2xl w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowCategoryModal(false);
                setRenamingSubCat(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Catalog Organization
              </span>
              <h3 className="text-lg font-serif font-bold text-zinc-100 mt-0.5">
                Manage Categories &amp; Sub-Categories
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Create new categories, or add, rename, and remove sub-category tiers for any category.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* LEFT COLUMN: CATEGORIES */}
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3.5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  1. Categories
                </div>

                <form onSubmit={handleAddStandaloneCategory} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    value={standaloneCategoryName}
                    onChange={(e) => setStandaloneCategoryName(e.target.value)}
                    placeholder="New category..."
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500/70"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </form>

                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {allCategories.map((cat) => {
                    const isBuiltIn = ['Weapons', 'Armor', 'Ingots & Materials'].includes(cat);
                    const itemCount = catalogItems.filter((i) => i.category === cat).length;
                    const isSelected = selectedManageCat === cat;
                    return (
                      <div
                        key={cat}
                        onClick={() => {
                          setSelectedManageCat(cat);
                          setRenamingSubCat(null);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-md border text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-red-950/70 border-amber-500/60 text-amber-200'
                            : 'bg-zinc-900/70 border-zinc-800 text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-semibold truncate">{cat}</span>
                          <span className="text-[11px] text-zinc-400 ml-1.5">({itemCount})</span>
                        </div>
                        {isBuiltIn ? (
                          <span className="text-[10px] text-zinc-500">Default</span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomCategory(cat);
                            }}
                            disabled={itemCount > 0}
                            title={
                              itemCount > 0
                                ? 'Move or remove items in this category first'
                                : 'Delete custom category'
                            }
                            className="p-1 rounded hover:bg-red-950 text-zinc-400 hover:text-red-400 disabled:opacity-35 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: SUB-CATEGORIES FOR SELECTED CATEGORY */}
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    2. {selectedManageCat} Tiers
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {(resolvedSubCategoriesByCategory[selectedManageCat] || []).length} tiers
                  </span>
                </div>

                <form onSubmit={handleAddSubCategory} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    value={newSubCatInput}
                    onChange={(e) => setNewSubCatInput(e.target.value)}
                    placeholder={`Add tier to ${selectedManageCat}...`}
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500/70"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs cursor-pointer shrink-0"
                  >
                    + Tier
                  </button>
                </form>

                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {(resolvedSubCategoriesByCategory[selectedManageCat] || []).length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-4">
                      No sub-categories yet. Add one above!
                    </p>
                  ) : (
                    (resolvedSubCategoriesByCategory[selectedManageCat] || []).map((sub) => {
                      const subItemCount = catalogItems.filter(
                        (i) => i.category === selectedManageCat && i.subCategory === sub
                      ).length;
                      const isRenaming =
                        renamingSubCat?.cat === selectedManageCat && renamingSubCat?.sub === sub;

                      return (
                        <div
                          key={sub}
                          className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs"
                        >
                          {isRenaming ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleRenameSubCategory(
                                  selectedManageCat,
                                  sub,
                                  renameSubCatValue
                                );
                              }}
                              className="flex-1 flex items-center gap-1.5"
                            >
                              <input
                                type="text"
                                autoFocus
                                value={renameSubCatValue}
                                onChange={(e) => setRenameSubCatValue(e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1 rounded bg-zinc-950 border border-amber-500/70 text-amber-200 text-xs focus:outline-none"
                              />
                              <button
                                type="submit"
                                className="px-2 py-1 rounded bg-red-800 text-amber-200 font-bold text-[11px] cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setRenamingSubCat(null)}
                                className="px-1.5 py-1 rounded bg-zinc-800 text-zinc-300 text-[11px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <>
                              <div className="min-w-0">
                                <span className="font-semibold text-zinc-100">{sub}</span>
                                <span className="text-[11px] text-zinc-500 ml-1.5">
                                  ({subItemCount})
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRenamingSubCat({ cat: selectedManageCat, sub });
                                    setRenameSubCatValue(sub);
                                  }}
                                  title="Rename sub-category"
                                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubCategory(selectedManageCat, sub)}
                                  title="Delete sub-category (items move to Standard)"
                                  className="p-1 rounded hover:bg-red-950 text-zinc-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setRenamingSubCat(null);
                }}
                className="px-4 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGE PASSCODE LOGIN MODAL (SMITH OR GUEST) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#141416] border border-zinc-800 border-t-2 border-t-red-800 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <SkyforgeEagleCrest className="w-10 h-11 shrink-0" />
              <div>
                <h3 className="text-lg font-serif font-bold uppercase text-zinc-100">
                  The Skyforge Login
                </h3>
                <p className="text-xs text-zinc-400">
                  Enter your name and the Forge Passcode to sign in
                </p>
              </div>
            </div>

            {/* Role Toggle: Smith vs Guest */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-md bg-zinc-950 border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('smith');
                  setAuthError('');
                }}
                className={`py-2 text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginRole === 'smith'
                    ? 'bg-red-800 text-amber-200 border border-amber-500/60'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>Smith Profile</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('guest');
                  setAuthError('');
                }}
                className={`py-2 text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginRole === 'guest'
                    ? 'bg-red-800 text-amber-200 border border-amber-500/60'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Guest Access</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 bg-zinc-950 border border-zinc-800/80 rounded-md px-3 py-2">
              {loginRole === 'smith'
                ? 'Smith Profile: Tracks your personal sales stats, logs orders under your name, and unlocks recipes & stock management.'
                : 'Guest Access: Uses the Guest Passcode to view profits, sales stats, orders, stock levels, and export ledgers in read-only mode.'}
            </p>

            {authError && (
              <div className="p-2.5 rounded-md bg-red-950 border border-red-700 text-xs text-red-200">
                {authError}
              </div>
            )}

            <form onSubmit={handlePasscodeLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {loginRole === 'smith' ? 'Smith Name (Profile Name)' : 'Guest Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginNameInput}
                    onChange={(e) => setLoginNameInput(e.target.value)}
                    placeholder={
                      loginRole === 'smith' ? 'e.g., Eorlund Gray-Mane' : 'e.g., Kodlak Whitemane'
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                </div>

                {/* Quick Pick Existing Profiles */}
                {memberProfiles.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                      Existing:
                    </span>
                    {memberProfiles.slice(0, 6).map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setLoginNameInput(p.name)}
                        className="px-2 py-0.5 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-[11px] text-amber-300/90 cursor-pointer"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {loginRole === 'smith' ? 'Smith Passcode' : 'Guest Passcode'}
                </label>
                <input
                  type="password"
                  required
                  value={loginPasscodeInput}
                  onChange={(e) => setLoginPasscodeInput(e.target.value)}
                  placeholder={
                    loginRole === 'smith'
                      ? 'Enter Smith Passcode...'
                      : 'Enter Guest Passcode...'
                  }
                  className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-md font-bold uppercase tracking-wider text-xs bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>
                  {loginRole === 'smith' ? 'Enter Forge as Smith' : 'Enter Forge as Guest'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-[#0e0e10] py-5 px-4 text-center text-xs text-zinc-500">
        <NordicDivider />
        <p className="mt-2 font-serif uppercase tracking-wider text-zinc-400">
          The Skyforge &bull; Whiterun
        </p>
      </footer>
    </div>
  );
}
