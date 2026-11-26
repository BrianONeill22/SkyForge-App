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
  FileSpreadsheet
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

// --- INITIAL SKYFORGE MATERIALS (WITH EDITABLE SUPPLIER BUY PRICES) ---
const INITIAL_MATERIALS = [
  // Raw Ores, Crystals & Scrap
  { id: 'mat-iron-ore', name: 'Iron Ore', category: 'Raw Ore', buyPrice: 8, stock: 42, minStock: 15, unit: 'ore' },
  { id: 'mat-corundum-ore', name: 'Corundum Ore', category: 'Raw Ore', buyPrice: 22, stock: 18, minStock: 10, unit: 'ore' },
  { id: 'mat-orichalcum-ore', name: 'Orichalcum Ore', category: 'Raw Ore', buyPrice: 28, stock: 14, minStock: 8, unit: 'ore' },
  { id: 'mat-quicksilver-ore', name: 'Quicksilver Ore', category: 'Raw Ore', buyPrice: 32, stock: 12, minStock: 8, unit: 'ore' },
  { id: 'mat-silver-ore', name: 'Silver Ore', category: 'Raw Ore', buyPrice: 25, stock: 16, minStock: 8, unit: 'ore' },
  { id: 'mat-gold-ore', name: 'Gold Ore', category: 'Raw Ore', buyPrice: 40, stock: 10, minStock: 6, unit: 'ore' },
  { id: 'mat-moonstone-ore', name: 'Moonstone Ore', category: 'Raw Ore', buyPrice: 35, stock: 10, minStock: 6, unit: 'ore' },
  { id: 'mat-malachite-ore', name: 'Malachite Ore', category: 'Raw Ore', buyPrice: 45, stock: 8, minStock: 5, unit: 'ore' },
  { id: 'mat-ebony-ore', name: 'Ebony Ore', category: 'Raw Ore', buyPrice: 60, stock: 8, minStock: 5, unit: 'ore' },
  { id: 'mat-glacial-crystal', name: 'Glacial Crystal', category: 'Raw Ore', buyPrice: 75, stock: 6, minStock: 4, unit: 'crystals' },
  { id: 'mat-dwemer-scrap', name: 'Dwemer Scrap Metal', category: 'Raw Ore', buyPrice: 18, stock: 20, minStock: 8, unit: 'scrap' },
  { id: 'mat-chaurus-chitin', name: 'Chaurus Chitin', category: 'Raw Ore', buyPrice: 20, stock: 12, minStock: 5, unit: 'plates' },

  // 4 Types of Fuel
  { id: 'mat-poor-charcoal', name: 'Poor Charcoal', category: 'Fuel', buyPrice: 2, stock: 60, minStock: 20, unit: 'chunks' },
  { id: 'mat-charcoal', name: 'Charcoal', category: 'Fuel', buyPrice: 5, stock: 50, minStock: 20, unit: 'chunks' },
  { id: 'mat-briquettes', name: 'Briquettes', category: 'Fuel', buyPrice: 9, stock: 35, minStock: 15, unit: 'blocks' },
  { id: 'mat-coke', name: 'Coke', category: 'Fuel', buyPrice: 14, stock: 25, minStock: 10, unit: 'chunks' },

  // Hides, Straps & Wood
  { id: 'mat-animal-pelt', name: 'Animal Pelt', category: 'Hides & Straps', buyPrice: 8, stock: 30, minStock: 12, unit: 'pelts' },
  { id: 'mat-deer-pelt', name: 'Deer Pelt', category: 'Hides & Straps', buyPrice: 12, stock: 16, minStock: 6, unit: 'pelts' },
  { id: 'mat-wolf-pelt', name: 'Wolf Pelt', category: 'Hides & Straps', buyPrice: 10, stock: 20, minStock: 8, unit: 'pelts' },
  { id: 'mat-bear-pelt', name: 'Bear Pelt', category: 'Hides & Straps', buyPrice: 25, stock: 10, minStock: 4, unit: 'pelts' },
  { id: 'mat-sabre-cat-pelt', name: 'Sabre Cat Pelt', category: 'Hides & Straps', buyPrice: 22, stock: 10, minStock: 4, unit: 'pelts' },
  { id: 'mat-leather', name: 'Tanned Leather', category: 'Hides & Straps', buyPrice: 12, stock: 26, minStock: 10, unit: 'hides' },
  { id: 'mat-leather-strips', name: 'Leather Strips', category: 'Hides & Straps', buyPrice: 3, stock: 48, minStock: 20, unit: 'strips' },
  { id: 'mat-wood', name: 'Wood', category: 'Hides & Straps', buyPrice: 4, stock: 40, minStock: 15, unit: 'logs' },

  // Smelted Ingots
  { id: 'mat-iron-ingot', name: 'Iron Ingot', category: 'Smelted Ingots', buyPrice: 15, stock: 34, minStock: 12, unit: 'bars' },
  { id: 'mat-steel-ingot', name: 'Steel Ingot', category: 'Smelted Ingots', buyPrice: 35, stock: 22, minStock: 10, unit: 'bars' },
  { id: 'mat-corundum-ingot', name: 'Corundum Ingot', category: 'Smelted Ingots', buyPrice: 45, stock: 14, minStock: 8, unit: 'bars' },
  { id: 'mat-dwarven-ingot', name: 'Dwarven Metal Ingot', category: 'Smelted Ingots', buyPrice: 45, stock: 14, minStock: 8, unit: 'bars' },
  { id: 'mat-orichalcum-ingot', name: 'Orichalcum Ingot', category: 'Smelted Ingots', buyPrice: 55, stock: 9, minStock: 6, unit: 'bars' },
  { id: 'mat-quicksilver-ingot', name: 'Quicksilver Ingot', category: 'Smelted Ingots', buyPrice: 65, stock: 8, minStock: 5, unit: 'bars' },
  { id: 'mat-silver-ingot', name: 'Silver Ingot', category: 'Smelted Ingots', buyPrice: 50, stock: 10, minStock: 5, unit: 'bars' },
  { id: 'mat-gold-ingot', name: 'Gold Ingot', category: 'Smelted Ingots', buyPrice: 80, stock: 6, minStock: 4, unit: 'bars' },
  { id: 'mat-moonstone-ingot', name: 'Refined Moonstone', category: 'Smelted Ingots', buyPrice: 70, stock: 7, minStock: 4, unit: 'bars' },
  { id: 'mat-malachite-ingot', name: 'Refined Malachite', category: 'Smelted Ingots', buyPrice: 90, stock: 6, minStock: 4, unit: 'bars' },
  { id: 'mat-ebony-ingot', name: 'Ebony Ingot', category: 'Smelted Ingots', buyPrice: 120, stock: 5, minStock: 4, unit: 'bars' },
  { id: 'mat-stalhrim-ingot', name: 'Stalhrim Ingot', category: 'Smelted Ingots', buyPrice: 150, stock: 4, minStock: 3, unit: 'bars' }
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

const INITIAL_CATALOG_ITEMS = [
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

// --- HELPER: DATE FORMATTING ---
const getLocalDateString = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INITIAL_SALES = [
  {
    id: 'sale-101',
    itemId: 'item-skyforge-steel-sword',
    itemName: 'Skyforge Steel Sword',
    quantity: 1,
    unitPrice: 130,
    totalRevenue: 130,
    unitCost: 91,
    totalCost: 91,
    profit: 39,
    buyerName: 'Farkas',
    workerName: 'Eorlund Gray-Mane',
    dateStr: getLocalDateString(0)
  },
  {
    id: 'sale-102',
    itemId: 'item-wolf-armor',
    itemName: 'Wolf Cuirass',
    quantity: 1,
    unitPrice: 250,
    totalRevenue: 250,
    unitCost: 173,
    totalCost: 173,
    profit: 77,
    buyerName: 'Aela',
    workerName: 'Eorlund Gray-Mane',
    dateStr: getLocalDateString(-1)
  },
  {
    id: 'sale-103',
    itemId: 'item-nord-hero-battleaxe',
    itemName: 'Nord Hero Battleaxe',
    quantity: 1,
    unitPrice: 265,
    totalRevenue: 265,
    unitCost: 184,
    totalCost: 184,
    profit: 81,
    buyerName: 'Vilkas',
    workerName: 'Eorlund Gray-Mane',
    dateStr: getLocalDateString(-3)
  }
];

export default function App() {
  // --- AUTHENTICATION & ROLE STATE ---
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authTab, setAuthTab] = useState('quick');
  const [quickWorkerName, setQuickWorkerName] = useState('');
  const [quickPasscode, setQuickPasscode] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // --- PERSISTENT SKYFORGE DATA ---
  const [materials, setMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_materials_v9');
      return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
    } catch {
      return INITIAL_MATERIALS;
    }
  });

  const [catalogItems, setCatalogItems] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_catalog_v9');
      return saved ? JSON.parse(saved) : INITIAL_CATALOG_ITEMS;
    } catch {
      return INITIAL_CATALOG_ITEMS;
    }
  });

  const [profitMarginPct, setProfitMarginPct] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_margin_v9');
      return saved !== null ? Number(saved) : 40;
    } catch {
      return 40;
    }
  });

  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_sales_v9');
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_categories_v9');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [subCategoriesMap, setSubCategoriesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('skyforge_subcategories_v9');
      return saved ? JSON.parse(saved) : SUBCATEGORIES_BY_CATEGORY;
    } catch {
      return SUBCATEGORIES_BY_CATEGORY;
    }
  });

  // --- UI & NAVIGATION STATE ---
  const [activeWorkerTab, setActiveWorkerTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('All');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [confirmResetModal, setConfirmResetModal] = useState(false);

  // --- LOG SALE FORM STATE ---
  const [saleItemId, setSaleItemId] = useState(INITIAL_CATALOG_ITEMS[0].id);
  const [saleItemSearch, setSaleItemSearch] = useState(INITIAL_CATALOG_ITEMS[0].name);
  const [showSaleItemDropdown, setShowSaleItemDropdown] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [saleUnitPrice, setSaleUnitPrice] = useState(130);
  const [saleUnitCost, setSaleUnitCost] = useState(91);
  const [buyerName, setBuyerName] = useState('');
  const [workerNameInput, setWorkerNameInput] = useState('');
  const [saleDateStr, setSaleDateStr] = useState(getLocalDateString(0));
  const [deductStockOnSale, setDeductStockOnSale] = useState(true);

  // --- ADD NEW MATERIAL FORM STATE ---
  const [newMatName, setNewMatName] = useState('');
  const [newMatCat, setNewMatCat] = useState('Smelted Ingots');
  const [newMatBuyPrice, setNewMatBuyPrice] = useState(25);
  const [newMatStock, setNewMatStock] = useState(10);
  const [newMatUnit, setNewMatUnit] = useState('bars');

  // --- RECIPE EDITOR MODAL STATE ---
  const [editingItemId, setEditingItemId] = useState(null);
  const [addRecipeMatId, setAddRecipeMatId] = useState('');
  const [addRecipeQty, setAddRecipeQty] = useState(1);

  // --- ADD NEW CATALOG ITEM MODAL STATE ---
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Weapons');
  const [isCreatingNewCatInModal, setIsCreatingNewCatInModal] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newItemSubCategory, setNewItemSubCategory] = useState('Iron');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemStock, setNewItemStock] = useState(2);
  const [newItemMinStock, setNewItemMinStock] = useState(1);
  const [newItemRecipe, setNewItemRecipe] = useState([
    {
      materialId:
        INITIAL_MATERIALS.find((m) => m.id === 'mat-steel-ingot')?.id || INITIAL_MATERIALS[0]?.id,
      qty: 2
    }
  ]);
  const [newItemMatId, setNewItemMatId] = useState(INITIAL_MATERIALS[0]?.id || '');
  const [newItemMatQty, setNewItemMatQty] = useState(1);

  // --- MANAGE CATEGORIES & SUBCATEGORIES MODAL STATE ---
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [standaloneCategoryName, setStandaloneCategoryName] = useState('');
  const [selectedManageCat, setSelectedManageCat] = useState('Weapons');
  const [newSubCatInput, setNewSubCatInput] = useState('');
  const [renamingSubCat, setRenamingSubCat] = useState(null);
  const [renameSubCatValue, setRenameSubCatValue] = useState('');

  // --- DRAG & DROP RECIPE REASSIGNMENT STATE ---
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const [recipeBoardCatFilter, setRecipeBoardCatFilter] = useState('All');

  // --- EXPORT DATA MODAL STATE ---
  const [showExportModal, setShowExportModal] = useState(false);

  // --- SYNC TO LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('skyforge_materials_v9', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('skyforge_catalog_v9', JSON.stringify(catalogItems));
  }, [catalogItems]);

  useEffect(() => {
    localStorage.setItem('skyforge_margin_v9', String(profitMarginPct));
  }, [profitMarginPct]);

  useEffect(() => {
    localStorage.setItem('skyforge_sales_v9', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('skyforge_categories_v9', JSON.stringify(customCategories));
  }, [customCategories]);

  useEffect(() => {
    localStorage.setItem('skyforge_subcategories_v9', JSON.stringify(subCategoriesMap));
  }, [subCategoriesMap]);

  // --- ALL AVAILABLE CATEGORIES & SUBCATEGORIES (DEFAULT + CUSTOM + ANY ON ITEMS) ---
  const allCategories = useMemo(() => {
    const base = ['Weapons', 'Armor', 'Ingots & Materials'];
    const set = new Set([...base, ...customCategories, ...Object.keys(subCategoriesMap)]);
    catalogItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [customCategories, subCategoriesMap, catalogItems]);

  const resolvedSubCategoriesByCategory = useMemo(() => {
    const merged = {};
    allCategories.forEach((cat) => {
      const set = new Set(subCategoriesMap[cat] || []);
      catalogItems.forEach((item) => {
        if (item.category === cat && item.subCategory) {
          set.add(item.subCategory);
        }
      });
      merged[cat] = Array.from(set);
    });
    return merged;
  }, [allCategories, subCategoriesMap, catalogItems]);

  // --- FIREBASE ANONYMOUS SESSION ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setFirebaseUser(u);
      } else {
        signInAnonymously(auth).catch(() => {});
      }
    });
    return () => unsub();
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  // --- DYNAMIC RECIPE COST & FINAL PRICE CALCULATION ---
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
      const calculatedPrice = Math.ceil(materialCost * (1 + profitMarginPct / 100));
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

  // Keep selected sale item's price/cost updated when catalog or margin changes
  useEffect(() => {
    if (saleItemId !== 'custom') {
      const found = enrichedCatalog.find((i) => i.id === saleItemId);
      if (found) {
        setSaleUnitPrice(found.finalPrice);
        setSaleUnitCost(found.materialCost);
        setSaleItemSearch(found.name);
      }
    }
  }, [saleItemId, enrichedCatalog]);

  const filteredSaleOptions = useMemo(() => {
    const q = saleItemSearch.trim().toLowerCase();
    const selectedItem = enrichedCatalog.find((i) => i.id === saleItemId);
    // Show full list if the search input matches the currently selected item's exact name
    if (!q || (selectedItem && selectedItem.name.toLowerCase() === q)) {
      return enrichedCatalog;
    }
    return enrichedCatalog.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q))
    );
  }, [enrichedCatalog, saleItemSearch, saleItemId]);

  // --- WORKER LOGIN / LOGOUT HANDLERS ---
  const handleQuickWorkerLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const trimmedName = quickWorkerName.trim() || 'Eorlund Gray-Mane';
    const profile = {
      uid: firebaseUser?.uid || 'worker-session',
      name: trimmedName,
      role: 'Smith of The Skyforge'
    };
    setWorkerProfile(profile);
    setWorkerNameInput(trimmedName);
    setShowLoginModal(false);
    setQuickWorkerName('');
    setQuickPasscode('');
    triggerToast(`By Kyne and Ysgramor, well met ${trimmedName}. The Skyforge burns for you.`);
  };

  const handleFirebaseEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      let cred;
      if (isRegisterMode) {
        cred = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      } else {
        cred = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      }
      const displayName = cred.user.email.split('@')[0];
      const formatted = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      setWorkerProfile({
        uid: cred.user.uid,
        name: formatted,
        role: 'Smith of The Skyforge',
        email: cred.user.email
      });
      setWorkerNameInput(formatted);
      setShowLoginModal(false);
      setEmailInput('');
      setPasswordInput('');
      triggerToast(`Signed in at The Skyforge as ${formatted}.`);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Try Quick RP Shift / Demo.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleWorkerLogout = async () => {
    setWorkerProfile(null);
    setActiveWorkerTab('dashboard');
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error(e);
      }
    }
    triggerToast('Stepped down from The Skyforge anvil. Public board active.');
  };

  // --- SALES & PROFIT ANALYTICS ---
  const todayStr = getLocalDateString(0);
  const sevenDaysAgoStr = getLocalDateString(-6);

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

  const adjustCatalogStock = (id, delta) => {
    setCatalogItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item))
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
    setProfitMarginPct(40);
    setSales(INITIAL_SALES);
    setConfirmResetModal(false);
    triggerToast('The Skyforge ledgers, materials & prices restored to defaults.');
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
                  ? `On duty: ${workerProfile.name} • Margin: +${profitMarginPct}%`
                  : 'Whiterun • Weapons, Armor & Smelted Ingots'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {workerProfile ? (
              <>
                <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-zinc-900 border border-amber-500/45 text-sm font-semibold text-amber-200">
                  <Hammer className="w-4 h-4 text-red-500" />
                  {workerProfile.name}
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
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Smith Login</span>
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
              {/* Side Panel Header & Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveWorkerTab('dashboard')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeWorkerTab === 'dashboard'
                        ? 'bg-red-900/80 text-amber-200 border border-amber-500/60'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Sales &amp; Profits</span>
                  </button>

                  <button
                    onClick={() => setActiveWorkerTab('pricing')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeWorkerTab === 'pricing'
                        ? 'bg-red-900/80 text-amber-200 border border-amber-500/60'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Recipes &amp; Margin</span>
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-zinc-950 text-amber-300 border border-amber-500/45">
                      +{profitMarginPct}%
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveWorkerTab('stock')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeWorkerTab === 'stock'
                        ? 'bg-red-900/80 text-amber-200 border border-amber-500/60'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                  >
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>Forge Stock &amp; Ore</span>
                    {lowStockCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-900 text-amber-200 border border-amber-400/60">
                        {lowStockCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700 hover:border-amber-500/50 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => setConfirmResetModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-zinc-500 hover:text-amber-300 hover:bg-zinc-900 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* WORKER TAB 1: SALES LOGGER & DAILY/WEEKLY NET PROFITS             */}
              {/* ----------------------------------------------------------------- */}
              {activeWorkerTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* KPI Summary Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-lg bg-[#18181b] border border-zinc-800 border-l-2 border-l-amber-400 p-4 sm:p-5">
                      <div className="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase tracking-wider">
                        <span>Today Net</span>
                        <Coins className="w-4 h-4" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-1.5">
                        {profitStats.todayProfit.toLocaleString()}g
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        Gross: {profitStats.todayRevenue.toLocaleString()}g
                      </p>
                    </div>

                    <div className="rounded-lg bg-[#18181b] border border-zinc-800 border-l-2 border-l-red-600 p-4 sm:p-5">
                      <div className="flex items-center justify-between text-red-400 text-xs font-semibold uppercase tracking-wider">
                        <span>Weekly (7d)</span>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-1.5">
                        {profitStats.weeklyProfit.toLocaleString()}g
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        Gross: {profitStats.weeklyRevenue.toLocaleString()}g
                      </p>
                    </div>

                    <div className="rounded-lg bg-[#18181b] border border-zinc-800 p-4 sm:p-5">
                      <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                        <span>Margin</span>
                        <Sliders className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-amber-300 mt-1.5">+{profitMarginPct}%</div>
                      <button
                        onClick={() => setActiveWorkerTab('pricing')}
                        className="text-xs text-amber-400 hover:underline mt-1 cursor-pointer"
                      >
                        Adjust &rarr;
                      </button>
                    </div>

                    <div className="rounded-lg bg-[#18181b] border border-zinc-800 p-4 sm:p-5">
                      <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                        <span>Top Item</span>
                        <Anvil className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="text-base sm:text-lg font-bold text-zinc-100 mt-2 truncate" title={profitStats.topItem}>
                        {profitStats.topItem}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{profitStats.topCount} sold</p>
                    </div>
                  </div>

                  {/* 7-Day Net Profit Bar Breakdown */}
                  <div className="rounded-lg bg-[#18181b] border border-zinc-800 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-base font-serif font-bold text-zinc-100 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <span>7-Day Net Profit</span>
                        </h3>
                      </div>
                      <span className="text-xs sm:text-sm px-2.5 py-1 rounded bg-zinc-900 text-amber-300 border border-amber-500/40 font-semibold">
                        7-Day Net: {profitStats.weeklyProfit.toLocaleString()}g
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-3 items-end h-40 pt-2 px-1">
                      {profitStats.last7Days.map((day) => {
                        const heightPct = Math.max(8, Math.round((day.dayProfit / maxChartProfit) * 100));
                        const isToday = day.dateStr === todayStr;
                        return (
                          <div key={day.dateStr} className="flex flex-col items-center h-full justify-end gap-1.5">
                            <span className="text-xs font-semibold text-amber-300">
                              {day.dayProfit > 0 ? `+${day.dayProfit}g` : '0g'}
                            </span>
                            <div className="w-full max-w-[44px] bg-zinc-950 rounded-t h-24 flex items-end overflow-hidden border border-zinc-800">
                              <div
                                style={{ height: `${day.dayProfit > 0 ? heightPct : 4}%` }}
                                className={`w-full transition-all duration-300 rounded-t-sm ${
                                  isToday ? 'bg-amber-400' : 'bg-red-700'
                                }`}
                              />
                            </div>
                            <span
                              className={`text-xs ${
                                isToday ? 'text-amber-300 font-bold' : 'text-zinc-500'
                              }`}
                            >
                              {isToday ? 'Today' : day.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Log New Sale Form + Recent Transactions Table */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LOG SALE FORM */}
                    <form
                      onSubmit={handleLogSale}
                      className="lg:col-span-5 bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4 h-fit"
                    >
                      <div className="border-b border-zinc-800 pb-2.5">
                        <h3 className="text-base font-serif font-bold text-zinc-100 flex items-center gap-2">
                          <Hammer className="w-4 h-4 text-red-500" />
                          <span>Log Sale</span>
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
                            placeholder="Type to search item or tier..."
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
                              title="Clear search"
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {showSaleItemDropdown && (
                          <div className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto rounded-md bg-zinc-950 border border-zinc-700 shadow-2xl divide-y divide-zinc-900">
                            {filteredSaleOptions.length === 0 ? (
                              <div className="px-3 py-2.5 text-xs text-zinc-500">
                                No catalog items match "{saleItemSearch}"
                              </div>
                            ) : (
                              filteredSaleOptions.map((item) => {
                                const isSelected = saleItemId === item.id;
                                return (
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
                                      isSelected
                                        ? 'bg-red-950/90 text-amber-200'
                                        : 'hover:bg-zinc-900 text-zinc-100'
                                    }`}
                                  >
                                    <div className="min-w-0">
                                      <div className="font-semibold truncate">{item.name}</div>
                                      <div className="text-[11px] text-zinc-400">
                                        {item.subCategory ? `${item.subCategory} • ` : ''}
                                        Stock: {item.stock}
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="font-bold text-amber-300 text-xs">
                                        {item.finalPrice}g
                                      </div>
                                      <div className="text-[11px] text-zinc-500">
                                        Cost: {item.materialCost}g
                                      </div>
                                    </div>
                                  </button>
                                );
                              })
                            )}

                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSaleItemId('custom');
                                setSaleItemSearch('Custom Item / Tempering');
                                setSaleUnitPrice(100);
                                setSaleUnitCost(40);
                                setShowSaleItemDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                saleItemId === 'custom'
                                  ? 'bg-red-950 text-amber-300'
                                  : 'bg-zinc-900/70 hover:bg-zinc-900 text-amber-300'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Custom Item / Tempering</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {saleItemId === 'custom' && (
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-1.5">
                            Custom Item Name
                          </label>
                          <input
                            type="text"
                            required
                            value={customItemName}
                            onChange={(e) => setCustomItemName(e.target.value)}
                            placeholder="e.g., Tempered Greatsword"
                            className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={saleQty}
                            onChange={(e) => setSaleQty(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                            Sell (g)
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={saleUnitPrice}
                            onChange={(e) => setSaleUnitPrice(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-500/70"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                            Cost (g)
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={saleUnitCost}
                            onChange={(e) => setSaleUnitCost(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 text-sm focus:outline-none focus:border-amber-500/70"
                          />
                        </div>
                      </div>

                      <div className="px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-zinc-400">
                          Total: <strong className="text-zinc-100">{saleQty * saleUnitPrice}g</strong>
                        </span>
                        <span className="font-bold text-amber-300">
                          Net: +{saleQty * (saleUnitPrice - saleUnitCost)}g
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                            Buyer
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
                          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                            Smith
                          </label>
                          <input
                            type="text"
                            required
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
                        <Coins className="w-4 h-4 text-amber-300" />
                        <span>Record Sale</span>
                      </button>
                    </form>

                    {/* RECENT SALES LEDGER TABLE */}
                    <div className="lg:col-span-7 bg-[#18181b] border border-zinc-800 rounded-lg p-5">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3.5">
                        <h3 className="text-base font-serif font-bold text-zinc-100">
                          Sales Ledger
                        </h3>
                        <span className="text-xs sm:text-sm text-zinc-400">{sales.length} entries</span>
                      </div>

                      {sales.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 text-sm">
                          No sales logged yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                                <th className="py-2.5 pr-2">Date</th>
                                <th className="py-2.5 px-2">Item &amp; Buyer</th>
                                <th className="py-2.5 px-2 text-right">Gross</th>
                                <th className="py-2.5 px-2 text-right">Profit</th>
                                <th className="py-2.5 pl-1 text-right"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/80 text-sm">
                              {sales.map((s) => {
                                const rev = Number(s.totalRevenue ?? s.totalPrice ?? 0);
                                const cost = Number(s.totalCost ?? 0);
                                const prof = Number(s.profit ?? rev - cost);
                                return (
                                  <tr key={s.id} className="hover:bg-zinc-900/70 transition-colors">
                                    <td className="py-3 pr-2 whitespace-nowrap text-xs text-zinc-400">
                                      {s.dateStr === todayStr ? (
                                        <span className="px-2 py-0.5 rounded bg-red-950/90 text-amber-300 border border-red-800 font-semibold">
                                          Today
                                        </span>
                                      ) : (
                                        s.dateStr
                                      )}
                                    </td>
                                    <td className="py-3 px-2">
                                      <div className="font-semibold text-zinc-100">
                                        {s.quantity}x {s.itemName}
                                      </div>
                                      <div className="text-xs text-zinc-500">
                                        {s.buyerName} &bull; {s.workerName}
                                      </div>
                                    </td>
                                    <td className="py-3 px-2 text-right whitespace-nowrap">
                                      <span className="text-zinc-300 font-semibold">{rev}g</span>
                                    </td>
                                    <td className="py-3 px-2 text-right font-bold text-amber-300 whitespace-nowrap">
                                      +{prof}g
                                    </td>
                                    <td className="py-3 pl-1 text-right">
                                      <button
                                        onClick={() => handleDeleteSale(s.id)}
                                        title="Delete entry"
                                        className="p-1.5 rounded hover:bg-red-950 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
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
              {/* WORKER TAB 2: RECIPES & PROFIT MARGIN                             */}
              {/* ----------------------------------------------------------------- */}
              {activeWorkerTab === 'pricing' && (
                <div className="space-y-6">
                  {/* GLOBAL PROFIT MARGIN CONTROL */}
                  <div className="rounded-lg bg-[#18181b] border border-zinc-800 border-l-2 border-l-amber-400 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                          <Calculator className="w-4 h-4 text-amber-400" />
                          <span>Margin Calculator</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-zinc-100">
                          Profit Margin: <span className="text-amber-300">+{profitMarginPct}%</span>
                        </h3>
                        <p className="text-sm text-zinc-400">
                          Updates auto-priced items on the price list immediately.
                        </p>
                      </div>

                      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 w-full md:w-80 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-sm font-semibold text-zinc-300">Margin %</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              max="500"
                              value={profitMarginPct}
                              onChange={(e) => setProfitMarginPct(Math.max(0, Number(e.target.value) || 0))}
                              className="w-20 px-2.5 py-1 rounded bg-zinc-900 border border-amber-500/50 text-amber-300 font-bold text-right text-sm focus:outline-none"
                            />
                            <span className="text-sm font-bold text-amber-400">%</span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={Math.min(200, profitMarginPct)}
                          onChange={(e) => setProfitMarginPct(Number(e.target.value))}
                          className="w-full accent-red-700 cursor-pointer"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          {[0, 20, 35, 50, 75, 100].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setProfitMarginPct(preset)}
                              className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                                profitMarginPct === preset
                                  ? 'bg-red-800 text-amber-200 border border-amber-500/60'
                                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                              }`}
                            >
                              +{preset}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CATALOG RECIPES & PRICES */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                      <div>
                        <h3 className="text-base font-serif font-bold text-zinc-100">
                          Crafting Recipes &amp; Public Prices
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                          Drag any recipe onto a Category or Tier badge below to move it, or edit categories &amp; tiers.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedManageCat(allCategories[0] || 'Weapons');
                            setRenamingSubCat(null);
                            setShowCategoryModal(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700 hover:border-amber-500/50 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                        >
                          <Sliders className="w-4 h-4 text-amber-400" />
                          <span>Categories &amp; Tiers</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewItemMatId(materials[0]?.id || '');
                            setIsCreatingNewCatInModal(false);
                            setShowAddItemModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-amber-300" />
                          <span>Add New Item</span>
                        </button>
                      </div>
                    </div>

                    {/* DRAG & DROP TARGET BAR (CATEGORIES & SUB-CATEGORIES) */}
                    <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3.5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <Anvil className="w-3.5 h-3.5 text-red-500" />
                          <span>
                            {draggedItemId
                              ? 'Drop recipe onto a Category or Tier below:'
                              : 'Category & Tier Drop Zones (Click to filter • Drag recipe here to move)'}
                          </span>
                        </span>
                        {recipeBoardCatFilter !== 'All' && (
                          <button
                            type="button"
                            onClick={() => setRecipeBoardCatFilter('All')}
                            className="text-[11px] font-semibold text-amber-300 hover:underline cursor-pointer"
                          >
                            Show All ({enrichedCatalog.length})
                          </button>
                        )}
                      </div>

                      {/* Category Drop Zones */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRecipeBoardCatFilter('All')}
                          className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            recipeBoardCatFilter === 'All'
                              ? 'bg-zinc-800 text-amber-200 border border-amber-500/50'
                              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                          }`}
                        >
                          All ({enrichedCatalog.length})
                        </button>

                        {allCategories.map((cat) => {
                          const dropKey = `cat:${cat}`;
                          const isOver = dragOverTarget === dropKey;
                          const isSelected = recipeBoardCatFilter === cat;
                          const count = enrichedCatalog.filter((i) => i.category === cat).length;
                          return (
                            <div
                              key={cat}
                              onClick={() => setRecipeBoardCatFilter(cat)}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverTarget(dropKey);
                              }}
                              onDragLeave={() => {
                                if (dragOverTarget === dropKey) setDragOverTarget(null);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                handleDropRecipeTarget(cat, null);
                              }}
                              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                                isOver
                                  ? 'bg-amber-500/25 text-amber-200 border-2 border-dashed border-amber-400 scale-105'
                                  : isSelected
                                  ? 'bg-red-900/90 text-amber-200 border border-amber-500/60'
                                  : draggedItemId
                                  ? 'bg-zinc-900 text-zinc-200 border border-dashed border-amber-500/50 hover:border-amber-400'
                                  : 'bg-zinc-900 text-zinc-300 hover:text-zinc-100 border border-zinc-800'
                              }`}
                            >
                              <span>{cat}</span>
                              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-zinc-300">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Sub-Category / Tier Drop Zones for Active Category */}
                      {(() => {
                        const activeDropCat =
                          recipeBoardCatFilter !== 'All'
                            ? recipeBoardCatFilter
                            : allCategories[0] || 'Weapons';
                        const tiers = resolvedSubCategoriesByCategory[activeDropCat] || [];
                        if (tiers.length === 0) return null;
                        return (
                          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-zinc-500 mr-1">
                              {activeDropCat} Tiers:
                            </span>
                            {tiers.map((sub) => {
                              const subKey = `sub:${activeDropCat}:${sub}`;
                              const isSubOver = dragOverTarget === subKey;
                              return (
                                <div
                                  key={sub}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverTarget(subKey);
                                  }}
                                  onDragLeave={() => {
                                    if (dragOverTarget === subKey) setDragOverTarget(null);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    handleDropRecipeTarget(activeDropCat, sub);
                                  }}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all select-none ${
                                    isSubOver
                                      ? 'bg-amber-500/30 text-amber-200 border border-dashed border-amber-300 scale-105'
                                      : draggedItemId
                                      ? 'bg-zinc-900 text-amber-300 border border-dashed border-amber-500/50'
                                      : 'bg-zinc-900/70 text-zinc-400 border border-zinc-800/80'
                                  }`}
                                >
                                  {sub}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#18181b] z-10">
                          <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                            <th className="py-2.5 pr-2">Item &amp; Recipe (Drag to Move)</th>
                            <th className="py-2.5 px-2 text-right">Cost</th>
                            <th className="py-2.5 px-2 text-right">Price</th>
                            <th className="py-2.5 px-2 text-right">Profit</th>
                            <th className="py-2.5 pl-1 text-right">Mode</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80 text-sm">
                          {enrichedCatalog
                            .filter(
                              (item) =>
                                recipeBoardCatFilter === 'All' ||
                                item.category === recipeBoardCatFilter
                            )
                            .map((item) => (
                              <tr
                                key={item.id}
                                draggable
                                onDragStart={(e) => {
                                  setDraggedItemId(item.id);
                                  e.dataTransfer.effectAllowed = 'move';
                                  e.dataTransfer.setData('text/plain', item.id);
                                }}
                                onDragEnd={() => {
                                  setDraggedItemId(null);
                                  setDragOverTarget(null);
                                }}
                                className={`transition-colors cursor-grab active:cursor-grabbing ${
                                  draggedItemId === item.id
                                    ? 'opacity-45 bg-red-950/40'
                                    : 'hover:bg-zinc-900/70'
                                }`}
                              >
                                <td className="py-3 pr-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      title="Drag to move to another category or tier"
                                      className="text-zinc-500 hover:text-amber-300 font-mono text-xs select-none"
                                    >
                                      ⋮⋮
                                    </span>
                                    <span className="font-semibold text-zinc-100">{item.name}</span>
                                    <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-medium text-zinc-400">
                                      {item.category}
                                    </span>
                                    {item.subCategory && (
                                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-amber-300/90">
                                        {item.subCategory}
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingItemId(item.id);
                                        setAddRecipeMatId(materials[0]?.id || '');
                                        setAddRecipeQty(1);
                                      }}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950 hover:bg-red-950 text-zinc-300 hover:text-amber-300 border border-zinc-800 hover:border-amber-500/50 text-xs cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>Recipe</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCatalogItem(item.id, item.name)}
                                      title="Remove item from catalog"
                                      className="inline-flex items-center p-1 rounded bg-zinc-950 hover:bg-red-950 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="text-xs text-zinc-400 mt-1 pl-5">
                                    {(item.recipe || [])
                                      .map((r) => {
                                        const m = materialMap[r.materialId];
                                        return m ? `${r.qty}x ${m.name}` : `${r.qty}x Unknown`;
                                      })
                                      .join(' + ') || 'No materials'}
                                  </div>
                                </td>

                                <td className="py-3 px-2 text-right whitespace-nowrap text-zinc-400">
                                  {item.materialCost}g
                                </td>

                                <td className="py-3 px-2 text-right whitespace-nowrap">
                                  {item.useCustomPrice ? (
                                    <input
                                      type="number"
                                      min="0"
                                      value={item.customPrice}
                                      onChange={(e) => updateItemCustomPrice(item.id, e.target.value)}
                                      className="w-20 px-2 py-1 rounded bg-zinc-950 border border-amber-500/60 text-amber-300 font-bold text-right text-sm focus:outline-none"
                                    />
                                  ) : (
                                    <span className="font-bold text-amber-300">{item.finalPrice}g</span>
                                  )}
                                </td>

                                <td className="py-3 px-2 text-right whitespace-nowrap font-bold text-zinc-200">
                                  +{item.unitProfit}g
                                </td>

                                <td className="py-3 pl-1 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => toggleItemCustomPrice(item.id)}
                                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                                      item.useCustomPrice
                                        ? 'bg-red-900/90 text-amber-200 border border-amber-500/60'
                                        : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                                    }`}
                                  >
                                    {item.useCustomPrice ? 'Custom' : 'Auto'}
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
              {/* WORKER TAB 3: FORGE STOCK & MATERIAL BUY COSTS                    */}
              {/* ----------------------------------------------------------------- */}
              {activeWorkerTab === 'stock' && (
                <div className="space-y-6">
                  {/* ADD NEW MATERIAL / INGOT / FUEL */}
                  <form
                    onSubmit={handleAddMaterial}
                    className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4"
                  >
                    <h3 className="text-base font-serif font-bold text-zinc-100">
                      Add Raw Material, Ore or Fuel
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Name</label>
                        <input
                          type="text"
                          required
                          value={newMatName}
                          onChange={(e) => setNewMatName(e.target.value)}
                          placeholder="e.g., Gold Ingot"
                          className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Type</label>
                        <select
                          value={newMatCat}
                          onChange={(e) => setNewMatCat(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                        >
                          <option value="Smelted Ingots">Smelted Ingots</option>
                          <option value="Raw Ore">Raw Ore</option>
                          <option value="Fuel">Fuel</option>
                          <option value="Hides & Straps">Hides &amp; Straps</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                          Buy Cost (g)
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={newMatBuyPrice}
                          onChange={(e) => setNewMatBuyPrice(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-500/70"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Stock</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={newMatStock}
                          onChange={(e) => setNewMatStock(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-zinc-400">Unit:</label>
                        <input
                          type="text"
                          value={newMatUnit}
                          onChange={(e) => setNewMatUnit(e.target.value)}
                          className="w-28 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 font-bold text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                      >
                        + Add Material
                      </button>
                    </div>
                  </form>

                  {/* ORGANIZED RAW MATERIALS, ORES, FUEL & INGOTS VAULT */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                      <div>
                        <h3 className="text-base font-serif font-bold text-zinc-100">
                          Forge Stock &amp; Material Vault
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {materials.length} tracked materials &bull; Organized by ingots, raw ores, fuel &amp; hides
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-48 sm:w-56">
                          <Search className="w-3.5 h-3.5 text-amber-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={stockSearchQuery}
                            onChange={(e) => setStockSearchQuery(e.target.value)}
                            placeholder="Filter materials..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/70"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowLowStockOnly((prev) => !prev)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            showLowStockOnly
                              ? 'bg-red-900/90 text-amber-200 border border-amber-500/60'
                              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          <span>Low Stock Only</span>
                        </button>
                      </div>
                    </div>

                    {/* Category Filter Tabs with Live Counts */}
                    <div className="flex flex-wrap items-center gap-2">
                      {['All', 'Smelted Ingots', 'Raw Ore', 'Fuel', 'Hides & Straps'].map((cat) => {
                        const count =
                          cat === 'All'
                            ? materials.length
                            : materials.filter((m) => m.category === cat).length;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setStockCategoryFilter(cat)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                              stockCategoryFilter === cat
                                ? 'bg-red-800 text-amber-200 border border-amber-500/60 font-bold'
                                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                            }`}
                          >
                            <span>{cat}</span>
                            <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-zinc-300">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Grouped Material Sections */}
                    {groupedMaterials.length === 0 ? (
                      <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-8 text-center text-sm text-zinc-500">
                        No materials match your current vault filter.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {groupedMaterials.map((group) => (
                          <div key={group.category} className="space-y-3">
                            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                                <Anvil className="w-3.5 h-3.5 text-red-500" />
                                <span>{group.category}</span>
                              </h4>
                              <span className="text-[11px] text-zinc-500">
                                {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                              {group.items.map((mat) => {
                                const isLow = mat.stock <= mat.minStock;
                                return (
                                  <div
                                    key={mat.id}
                                    className={`rounded-lg p-3.5 border flex flex-col justify-between gap-2.5 transition-colors ${
                                      isLow
                                        ? 'bg-red-950/35 border-red-800'
                                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <div className="font-bold text-zinc-100 text-sm truncate" title={mat.name}>
                                          {mat.name}
                                        </div>
                                        <div className="text-[11px] text-zinc-500">
                                          Min alert: {mat.minStock} {mat.unit}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1 shrink-0">
                                        <span className="text-[11px] text-zinc-500">Buy:</span>
                                        <input
                                          type="number"
                                          min="0"
                                          value={mat.buyPrice}
                                          onChange={(e) => updateMaterialBuyPrice(mat.id, e.target.value)}
                                          className="w-14 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-amber-300 font-bold text-right text-xs focus:outline-none focus:border-amber-500/70"
                                        />
                                        <span className="text-[11px] text-amber-400">g</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={`text-sm font-bold ${
                                            isLow ? 'text-red-400' : 'text-zinc-200'
                                          }`}
                                        >
                                          {mat.stock}
                                        </span>
                                        <span className="text-xs text-zinc-500">{mat.unit}</span>
                                        {isLow && (
                                          <span className="px-1.5 py-0.5 rounded bg-red-900/90 text-amber-200 text-[10px] font-bold uppercase">
                                            Low
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => adjustMaterialStock(mat.id, -1)}
                                          className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-pointer"
                                          title="Remove 1"
                                        >
                                          <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => adjustMaterialStock(mat.id, 1)}
                                          className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-pointer"
                                          title="Add 1"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => adjustMaterialStock(mat.id, 5)}
                                          className="px-2 py-1 rounded bg-zinc-900 hover:bg-red-950 text-amber-300 border border-zinc-700 hover:border-amber-500/50 text-xs font-bold cursor-pointer"
                                          title="Add 5"
                                        >
                                          +5
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => adjustMaterialStock(mat.id, 10)}
                                          className="px-2 py-1 rounded bg-zinc-900 hover:bg-red-950 text-amber-300 border border-zinc-700 hover:border-amber-500/50 text-xs font-bold cursor-pointer"
                                          title="Add 10"
                                        >
                                          +10
                                        </button>
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

                  {/* FINISHED WARES STOCK */}
                  <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <h3 className="text-base font-serif font-bold text-zinc-100">
                        Finished Stock
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {enrichedCatalog.map((item) => {
                        const isLow = item.stock <= item.minStock;
                        return (
                          <div
                            key={item.id}
                            className={`rounded-lg p-3.5 border flex items-center justify-between gap-2.5 ${
                              isLow
                                ? 'bg-red-950/35 border-red-800'
                                : 'bg-zinc-950 border-zinc-800'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-zinc-100 text-sm truncate">
                                {item.name}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {item.stock} ready {isLow && '(Low)'}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => adjustCatalogStock(item.id, -1)}
                                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-bold text-zinc-100">
                                {item.stock}
                              </span>
                              <button
                                type="button"
                                onClick={() => adjustCatalogStock(item.id, 1)}
                                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </main>

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

      {/* CONFIRM RESET MODAL */}
      {confirmResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141416] border border-zinc-800 border-t-2 border-t-red-800 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-zinc-100">Reset Forge Data?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This restores all material buy costs, recipes, margin (40%), stock levels, and ledger entries to defaults.
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

      {/* EXPORT TO EXCEL / GOOGLE SHEETS MODAL */}
      {showExportModal && (
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

      {/* SMITH LOGIN MODAL */}
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
                  Smith Login
                </h3>
                <p className="text-xs text-zinc-400">
                  Sign in to manage sales, recipes, and stock
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-md bg-zinc-950 border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('quick');
                  setAuthError('');
                }}
                className={`py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  authTab === 'quick'
                    ? 'bg-red-800 text-amber-200 border border-amber-500/60'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Quick Shift
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('account');
                  setAuthError('');
                }}
                className={`py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  authTab === 'account'
                    ? 'bg-red-800 text-amber-200 border border-amber-500/60'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Account Login
              </button>
            </div>

            {authError && (
              <div className="p-2.5 rounded-md bg-red-950 border border-red-700 text-xs text-red-200">
                {authError}
              </div>
            )}

            {authTab === 'quick' ? (
              <form onSubmit={handleQuickWorkerLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Smith Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={quickWorkerName}
                      onChange={(e) => setQuickWorkerName(e.target.value)}
                      placeholder="e.g., Eorlund Gray-Mane"
                      className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Passphrase (Optional)
                  </label>
                  <input
                    type="password"
                    value={quickPasscode}
                    onChange={(e) => setQuickPasscode(e.target.value)}
                    placeholder="Optional..."
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-md font-bold uppercase tracking-wider text-xs bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Start Shift</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleFirebaseEmailAuth} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="smith@theskyforge.com"
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-amber-500/70"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2 px-4 rounded-md font-bold uppercase tracking-wider text-xs bg-red-800 hover:bg-red-700 text-amber-200 border border-amber-500/60 disabled:opacity-50 cursor-pointer"
                >
                  {authLoading
                    ? 'Signing in...'
                    : isRegisterMode
                    ? 'Register'
                    : 'Sign In'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="text-xs text-amber-300 hover:underline cursor-pointer"
                  >
                    {isRegisterMode
                      ? 'Already have an account? Sign in'
                      : 'Need an account? Register'}
                  </button>
                </div>
              </form>
            )}
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
