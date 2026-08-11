// ─────────────────────────────────────────────────────────────────
// Janmotri Oil Admin — Inventory Data
// ─────────────────────────────────────────────────────────────────

export const WAREHOUSES = ["All", "Rajkot Main", "Ahmedabad Hub", "Surat Depot"];
export const INV_CATEGORIES = ["All", "Retail Pack", "Bulk Pack", "Institutional"];
export const TRANSACTION_TYPES = ["All", "Stock In", "Stock Out", "Adjustment", "Reserved", "Released"];

// ── Stock Inventory Records ───────────────────────────────────────
export const initialInventory = [
  {
    id: "INV-001",
    productId: "PRD-001",
    sku: "JMT-GNO-1L",
    name: "Groundnut Oil 1L",
    category: "Retail Pack",
    warehouse: "Rajkot Main",
    currentStock: 82,
    reservedStock: 12,
    availableStock: 70,
    minStockLevel: 50,
    maxStockLevel: 500,
    unitCost: 185,
    totalValue: 15170,
    lastUpdated: "2026-06-10",
    lastStockIn: "2026-06-02",
    lastStockOut: "2026-06-09",
    batchNo: "B-2026-06-01",
    expiryDate: "2027-06-01",
    location: "Rack A-01",
  },
  {
    id: "INV-002",
    productId: "PRD-002",
    sku: "JMT-GNO-5L",
    name: "Groundnut Oil 5L",
    category: "Retail Pack",
    warehouse: "Rajkot Main",
    currentStock: 35,
    reservedStock: 5,
    availableStock: 30,
    minStockLevel: 40,
    maxStockLevel: 400,
    unitCost: 920,
    totalValue: 32200,
    lastUpdated: "2026-06-10",
    lastStockIn: "2026-06-02",
    lastStockOut: "2026-06-10",
    batchNo: "B-2026-06-02",
    expiryDate: "2027-06-02",
    location: "Rack B-01",
  },
  {
    id: "INV-003",
    productId: "PRD-003",
    sku: "JMT-GNO-15L",
    name: "Groundnut Oil 15L",
    category: "Bulk Pack",
    warehouse: "Rajkot Main",
    currentStock: 22,
    reservedStock: 4,
    availableStock: 18,
    minStockLevel: 30,
    maxStockLevel: 200,
    unitCost: 2750,
    totalValue: 60500,
    lastUpdated: "2026-06-08",
    lastStockIn: "2026-05-30",
    lastStockOut: "2026-06-08",
    batchNo: "B-2026-05-30",
    expiryDate: "2027-05-30",
    location: "Rack B-02",
  },
  {
    id: "INV-004",
    productId: "PRD-004",
    sku: "JMT-GNO-15K",
    name: "Groundnut Oil 15kg Tin",
    category: "Institutional",
    warehouse: "Ahmedabad Hub",
    currentStock: 18,
    reservedStock: 6,
    availableStock: 12,
    minStockLevel: 20,
    maxStockLevel: 150,
    unitCost: 2850,
    totalValue: 51300,
    lastUpdated: "2026-06-07",
    lastStockIn: "2026-06-05",
    lastStockOut: "2026-06-07",
    batchNo: "B-2026-06-05",
    expiryDate: "2027-06-05",
    location: "Bay C-01",
  },
  {
    id: "INV-005",
    productId: "PRD-005",
    sku: "JMT-GNO-SP",
    name: "Groundnut Oil Special Pack",
    category: "Retail Pack",
    warehouse: "Rajkot Main",
    currentStock: 48,
    reservedStock: 10,
    availableStock: 38,
    minStockLevel: 20,
    maxStockLevel: 200,
    unitCost: 460,
    totalValue: 22080,
    lastUpdated: "2026-06-09",
    lastStockIn: "2026-06-06",
    lastStockOut: "2026-06-09",
    batchNo: "B-2026-06-06",
    expiryDate: "2027-06-06",
    location: "Rack D-01",
  }
];

// ── Transaction History ───────────────────────────────────────────
export const initialHistory = [
  { id: "TXN-8821", date: "2026-06-10", time: "04:28 PM", type: "Stock Out",   sku: "JMT-GNO-5L",  name: "Groundnut Oil 5L",                  qty: 2,  balance: 35, warehouse: "Rajkot Main",    reason: "Sales Order #JMT-9858",       user: "Ramesh Admin", batchNo: "B-2026-06-02" },
  { id: "TXN-8820", date: "2026-06-10", time: "12:40 PM", type: "Stock Out",   sku: "JMT-GNO-15K", name: "Groundnut Oil 15kg Tin",            qty: 2,  balance: 18, warehouse: "Ahmedabad Hub",  reason: "Sales Order #JMT-9855",       user: "Geeta Admin",  batchNo: "B-2026-06-05" },
  { id: "TXN-8818", date: "2026-06-09", time: "06:45 PM", type: "Stock Out",   sku: "JMT-GNO-1L",  name: "Groundnut Oil 1L",                 qty: 5,  balance: 82, warehouse: "Rajkot Main",    reason: "Sales Order #JMT-9851",       user: "Ramesh Admin", batchNo: "B-2026-06-01" },
  { id: "TXN-8815", date: "2026-06-09", time: "10:00 AM", type: "Reserved",    sku: "JMT-GNO-15K", name: "Groundnut Oil 15kg Tin",            qty: 6,  balance: 18, warehouse: "Ahmedabad Hub",  reason: "Hold for Order #JMT-9860",    user: "Admin System", batchNo: "B-2026-06-05" },
  { id: "TXN-8810", date: "2026-06-07", time: "01:15 PM", type: "Released",    sku: "JMT-GNO-15L", name: "Groundnut Oil 15L",                 qty: 4,  balance: 22, warehouse: "Rajkot Main",    reason: "Order #JMT-9845 Cancelled",   user: "Admin System", batchNo: "B-2026-05-30" },
  { id: "TXN-8809", date: "2026-06-06", time: "10:45 AM", type: "Stock In",    sku: "JMT-GNO-SP",  name: "Groundnut Oil Special Pack",        qty: 20, balance: 48, warehouse: "Rajkot Main",    reason: "Purchase Order PO-2026-139",  user: "Admin System", batchNo: "B-2026-06-06" }
];

// ── Stock Status Helper ───────────────────────────────────────────
export const getStockStatus = (item) => {
  if (item.availableStock <= 0) return "Out of Stock";
  if (item.availableStock <= item.minStockLevel * 0.25) return "Critical";
  if (item.availableStock <= item.minStockLevel) return "Low";
  return "Healthy";
};

// ── Stock Summary Aggregation ─────────────────────────────────────
export const getInventorySummary = (inventory) => {
  const totalItems     = inventory.length;
  const totalStock     = inventory.reduce((s, i) => s + i.currentStock, 0);
  const totalReserved  = inventory.reduce((s, i) => s + i.reservedStock, 0);
  const totalAvailable = inventory.reduce((s, i) => s + i.availableStock, 0);
  const totalValue     = inventory.reduce((s, i) => s + i.totalValue, 0);
  const outOfStock     = inventory.filter((i) => i.availableStock <= 0).length;
  const critical       = inventory.filter((i) => {
    const st = getStockStatus(i);
    return st === "Critical";
  }).length;
  const lowStock = inventory.filter((i) => {
    const st = getStockStatus(i);
    return st === "Low" || st === "Critical";
  }).length;
  return { totalItems, totalStock, totalReserved, totalAvailable, totalValue, outOfStock, critical, lowStock };
};
