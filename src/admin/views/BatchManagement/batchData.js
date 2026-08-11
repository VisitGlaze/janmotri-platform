// ─────────────────────────────────────────────────────────────────
// Janmotri Oil Admin — Batch Management Data
// ─────────────────────────────────────────────────────────────────

export const BATCH_PRODUCTS = [
  "Groundnut Oil 1L",
  "Groundnut Oil 5L",
  "Groundnut Oil 15L",
  "Groundnut Oil 15kg Tin",
  "Groundnut Oil Special Pack"
];

export const BATCH_CATEGORIES = ["All", "Retail Pack", "Bulk Pack", "Institutional"];
export const BATCH_STATUSES   = ["All", "Active", "Expiring Soon", "Expired", "Fully Sold", "Recalled"];
export const BATCH_PRODUCTS_FILTER = ["All", ...BATCH_PRODUCTS];

// ── Status Resolver ───────────────────────────────────────────────
export const getBatchStatus = (batch) => {
  if (batch.status === "Recalled") return "Recalled";
  const today    = new Date();
  const expiry   = new Date(batch.expiryDate);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0)  return "Expired";
  if (batch.availableQty <= 0 && daysLeft > 0) return "Fully Sold";
  if (daysLeft <= 30) return "Expiring Soon";
  return "Active";
};

export const getDaysToExpiry = (expiryDate) => {
  const today  = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

// ── Auto Batch Number Generator ───────────────────────────────────
export const generateBatchNumber = (existingBatches) => {
  const year = new Date().getFullYear();
  const prefix = `JMO-${year}-`;
  const existing = existingBatches
    .map((b) => {
      const parts = b.batchNo.split("-");
      return parseInt(parts[2] || "0", 10);
    })
    .filter((n) => !isNaN(n));
  const maxNum = existing.length ? Math.max(...existing) : 0;
  return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
};

// ── Dummy Batch Records ───────────────────────────────────────────
export const initialBatches = [
  {
    id: "B001",
    batchNo: "JMO-2026-001",
    product: "Groundnut Oil 1L",
    category: "Retail Pack",
    mfgDate: "2026-01-10",
    expiryDate: "2027-01-10",
    producedQty: 500,
    soldQty: 418,
    availableQty: 82,
    warehouse: "Rajkot Main",
    supervisor: "Bhavesh Shah",
    notes: "First batch of 2026 fiscal year. Premium Saurashtra Bold peanuts.",
    labTestStatus: "Passed",
    status: "Active",
  },
  {
    id: "B002",
    batchNo: "JMO-2026-002",
    product: "Groundnut Oil 5L",
    category: "Retail Pack",
    mfgDate: "2026-01-15",
    expiryDate: "2027-01-15",
    producedQty: 400,
    soldQty: 365,
    availableQty: 35,
    warehouse: "Rajkot Main",
    supervisor: "Bhavesh Shah",
    notes: "Upgraded bottle sealing machine used. FSSAI compliance check passed.",
    labTestStatus: "Passed",
    status: "Active",
  },
  {
    id: "B003",
    batchNo: "JMO-2026-003",
    product: "Groundnut Oil 15L",
    category: "Bulk Pack",
    mfgDate: "2026-02-15",
    expiryDate: "2027-02-15",
    producedQty: 200,
    soldQty: 178,
    availableQty: 22,
    warehouse: "Rajkot Main",
    supervisor: "Kiran Patel",
    notes: "Bulk pack run for Surat and Ahmedabad distributors.",
    labTestStatus: "Passed",
    status: "Active",
  },
  {
    id: "B004",
    batchNo: "JMO-2026-004",
    product: "Groundnut Oil 15kg Tin",
    category: "Institutional",
    mfgDate: "2026-03-01",
    expiryDate: "2027-03-01",
    producedQty: 150,
    soldQty: 132,
    availableQty: 18,
    warehouse: "Ahmedabad Hub",
    supervisor: "Dinesh Mehta",
    notes: "Institutional batch for hospital canteens and schools.",
    labTestStatus: "Passed",
    status: "Active",
  },
  {
    id: "B005",
    batchNo: "JMO-2026-005",
    product: "Groundnut Oil Special Pack",
    category: "Retail Pack",
    mfgDate: "2026-04-12",
    expiryDate: "2027-04-12",
    producedQty: 300,
    soldQty: 252,
    availableQty: 48,
    warehouse: "Rajkot Main",
    supervisor: "Bhavesh Shah",
    notes: "Diwali and Navratri season batch. Custom printed gift boxes.",
    labTestStatus: "Passed",
    status: "Active",
  }
];
