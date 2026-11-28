import React from 'react';
import CustomerOrdersPanel from './CustomerOrdersPanel';
import MaterialDeliveriesPanel from './MaterialDeliveriesPanel';

export default function OrdersTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CustomerOrdersPanel />
      <MaterialDeliveriesPanel />
    </div>
  );
}
