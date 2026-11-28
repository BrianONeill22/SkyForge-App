import { getLocalDateString } from './formatters.js';

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadFullBackupJson(ledgerState) {
  const payload = {
    version: 'skyforge-backup-v1',
    exportedAt: new Date().toISOString(),
    ...ledgerState
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  triggerBlobDownload(blob, `skyforge-backup-${getLocalDateString(0)}.json`);
}

export function downloadLedgerSpreadsheetCsv(resolvedMaterials, enrichedCatalog) {
  const rows = [
    [
      'Type',
      'Name',
      'Category',
      'Sub-Tier',
      'Buy/Material Cost (g)',
      'We Buy Price (g)',
      'Public Sell Price (g)',
      'Stock'
    ]
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
  triggerBlobDownload(blob, `skyforge-ledger-${getLocalDateString(0)}.csv`);
}
