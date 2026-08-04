// ─────────────────────────────────────────────────────────────────
// Janmotri Oil Admin — Products Dummy Data
// ─────────────────────────────────────────────────────────────────

export const CATEGORIES = ["All", "Retail Pack", "Bulk Pack", "Institutional"];

export const STATUS_OPTIONS = ["All", "Active", "Inactive", "Draft", "Out of Stock"];

export const initialProducts = [
  {
    id: "PRD-001",
    name: "Groundnut Oil 1L",
    sku: "JMT-GNO-1L",
    category: "Retail Pack",
    price: 240,
    mrp: 300,
    shortDescription: "Pure cold-pressed traditional ghani groundnut oil in a convenient 1-litre package.",
    fullDescription: "Janmotri Groundnut Oil is extracted from premium Saurashtra groundnuts using cold-press techniques to retain natural taste, nutrients, and rich aroma. This 1L packaging variant is perfect for daily home frying and cooking. FSSAI certified.",
    images: [
      "https://placehold.co/400x400/fff7ed/EC1C24?text=Groundnut+Oil+1L",
    ],
    status: "Active",
    stock: 82,
    createdAt: "2026-01-15",
    updatedAt: "2026-06-01",
  },
  {
    id: "PRD-002",
    name: "Groundnut Oil 5L",
    sku: "JMT-GNO-5L",
    category: "Retail Pack",
    price: 1100,
    mrp: 1375,
    shortDescription: "Value pack 5-litre jerry can of Janmotri groundnut oil, suited for households and family meals.",
    fullDescription: "Our 5-litre jerry can offers cold-pressed Saurashtra peanut oil. Made under hygienic settings, it is a healthy option with high smoke point, ideal for deep frying, stir-frying, and traditional cooking.",
    images: [
      "https://placehold.co/400x400/fff7ed/EC1C24?text=Groundnut+Oil+5L",
    ],
    status: "Active",
    stock: 35,
    createdAt: "2026-01-15",
    updatedAt: "2026-06-02",
  },
  {
    id: "PRD-003",
    name: "Groundnut Oil 15L",
    sku: "JMT-GNO-15L",
    category: "Bulk Pack",
    price: 3300,
    mrp: 4125,
    shortDescription: "15-litre bulk jerry can designed for caterers, restaurants, and wholesale buyers.",
    fullDescription: "Heavy-duty 15-litre pack containing cold-pressed premium peanut oil. Equipped with a sturdy handle and spill-proof cap, it is well suited for regular cooking usage in commercial food establishments.",
    images: [
      "https://placehold.co/400x400/fff7ed/EC1C24?text=Groundnut+Oil+15L",
    ],
    status: "Active",
    stock: 22,
    createdAt: "2026-01-20",
    updatedAt: "2026-05-30",
  },
  {
    id: "PRD-004",
    name: "Groundnut Oil 15kg Tin",
    sku: "JMT-GNO-15K",
    category: "Institutional",
    price: 3300,
    mrp: 4125,
    shortDescription: "Standard 15kg steel tin packaging, tailored for institutional bulk supplies.",
    fullDescription: "Standard metal tin sealing helps to preserve natural freshness and extends shelf storage. Perfectly suited for wholesale distributors and large institutional buyers.",
    images: [
      "https://placehold.co/400x400/fff7ed/EC1C24?text=15kg+Tin",
    ],
    status: "Active",
    stock: 18,
    createdAt: "2026-02-01",
    updatedAt: "2026-06-05",
  },
  {
    id: "PRD-005",
    name: "Groundnut Oil Special Pack",
    sku: "JMT-GNO-SP",
    category: "Retail Pack",
    price: 550,
    mrp: 687.5,
    shortDescription: "Exclusive premium gift box pack containing cold-pressed groundnut oil, ideal for festive gifting.",
    fullDescription: "A festive special presentation box that contains our premium ghani groundnut oil. Elegant box packaging that makes it a perfect, health-conscious gift option for family, friends, and corporate associates.",
    images: [
      "https://placehold.co/400x400/fff7ed/EC1C24?text=Special+Pack",
    ],
    status: "Active",
    stock: 48,
    createdAt: "2026-04-12",
    updatedAt: "2026-06-06",
  }
];
