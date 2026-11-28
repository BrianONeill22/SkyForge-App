export const DEFAULT_CATEGORIES = ['Weapons', 'Armor', 'Ingots & Materials', 'Unsorted'];

export const DEFAULT_SUBCATEGORIES = {
  Weapons: ['Iron', 'Steel', 'Dwarven', 'Orichalcum', 'Elven', 'Glass', 'Ebony', 'Daedric', 'Dragonbone'],
  Armor: ['Iron', 'Steel', 'Dwarven', 'Orichalcum', 'Elven', 'Glass', 'Ebony', 'Daedric', 'Dragonscale'],
  'Ingots & Materials': ['Smelted Ingots', 'Leather & Pelts', 'Specialty'],
  Unsorted: ['General']
};

export const INITIAL_MATERIAL_CATEGORIES = [
  'Smelted Ingots',
  'Raw Ore',
  'Fuel',
  'Leather & Pelts',
  'Dwemer Scrap & Gems'
];

export const INITIAL_MATERIALS = [
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

  { id: 'mat_poor_charcoal', name: 'Poor Charcoal', category: 'Fuel', buyPrice: 0, stock: 0, lowThreshold: 15 },
  { id: 'mat_charcoal', name: 'Charcoal', category: 'Fuel', buyPrice: 0, stock: 0, lowThreshold: 15 },
  { id: 'mat_briquettes', name: 'Charcoal Briquettes', category: 'Fuel', buyPrice: 0, stock: 0, lowThreshold: 15 },
  { id: 'mat_coke', name: 'Coke', category: 'Fuel', buyPrice: 0, stock: 0, lowThreshold: 15 },

  { id: 'mat_leather', name: 'Leather', category: 'Leather & Pelts', buyPrice: 0, stock: 0, lowThreshold: 10 },
  { id: 'mat_leather_strips', name: 'Leather Strips', category: 'Leather & Pelts', buyPrice: 0, stock: 0, lowThreshold: 20 },

  { id: 'mat_dwemer_plate', name: 'Small Dwemer Plate Metal', category: 'Dwemer Scrap & Gems', buyPrice: 0, stock: 0, lowThreshold: 5 },
  { id: 'mat_firewood', name: 'Firewood', category: 'Dwemer Scrap & Gems', buyPrice: 0, stock: 0, lowThreshold: 10 }
];

export const INITIAL_CATALOG_ITEMS_RAW = [
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

export const SMELTED_MAT_TO_CATALOG_ID = {
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

export const DEFAULT_SMELT_RECIPES_BY_ID = {
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
