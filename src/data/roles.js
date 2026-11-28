export const ROLE_PRESETS = {
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

export const PERMISSION_LABELS = [
  { key: 'viewDashboard', label: 'View Sales & Charts' },
  { key: 'logSalesPurchases', label: 'Log Sales & Purchases' },
  { key: 'manageOrders', label: 'Manage Orders & Deliveries' },
  { key: 'editStock', label: 'Edit Vault Stock & Ore' },
  { key: 'editRecipes', label: 'Edit Recipes & Pricing' },
  { key: 'isAdmin', label: 'Master Admin Access' }
];

export const FORGE_PASSCODES = {
  smith: 'Wuuthrad',
  admin: 'Ysgramor',
  guest: 'Whiterun'
};
