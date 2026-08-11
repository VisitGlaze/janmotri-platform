// ─────────────────────────────────────────────────────────────────
// Janmotri Oil Admin — Reports & Analytics Data
// ─────────────────────────────────────────────────────────────────

export const REPORT_TYPES = ["Sales Report", "Product Report", "Inventory Report", "Customer Report", "Pay Later Report"];

export const DATE_FILTERS = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Custom Range"];

// Sales Report Mock Data
export const mockSalesReport = {
  summary: {
    totalRevenue: 334600,
    totalOrders: 154,
    avgOrderValue: 2172,
    grossMargin: "34.5%"
  },
  salesTrend: [
    { date: "June 05", sales: 24200, orders: 12 },
    { date: "June 06", sales: 34100, orders: 18 },
    { date: "June 07", sales: 18500, orders: 9 },
    { date: "June 08", sales: 28925, orders: 15 },
    { date: "June 09", sales: 42000, orders: 22 },
    { date: "June 10", sales: 56400, orders: 31 },
    { date: "June 11", sales: 84115, orders: 47 }
  ],
  paymentDistribution: [
    { method: "UPI", amount: 167300, percentage: 50 },
    { method: "COD", amount: 100380, percentage: 30 },
    { method: "Pay Later", amount: 66920, percentage: 20 }
  ]
};

// Product Performance Mock Data
export const mockProductReport = [
  { name: "Groundnut Oil 1L", sku: "JMT-GNO-1L", category: "Retail Pack", volumeSold: 120, revenue: 28800 },
  { name: "Groundnut Oil 5L", sku: "JMT-GNO-5L", category: "Retail Pack", volumeSold: 48, revenue: 52800 },
  { name: "Groundnut Oil 15L", sku: "JMT-GNO-15L", category: "Bulk Pack", volumeSold: 30, revenue: 99000 },
  { name: "Groundnut Oil 15kg Tin", sku: "JMT-GNO-15K", category: "Institutional", volumeSold: 42, revenue: 138600 },
  { name: "Groundnut Oil Special Pack", sku: "JMT-GNO-SP", category: "Retail Pack", volumeSold: 28, revenue: 15400 }
];

// Inventory Analytics Mock Data
export const mockInventoryReport = {
  summary: {
    totalSKUs: 5,
    totalStockValuation: 180250,
    warehouseShare: [
      { name: "Rajkot Main", value: 108250, percentage: 60 },
      { name: "Ahmedabad Hub", value: 54100, percentage: 30 },
      { name: "Surat Depot", value: 17900, percentage: 10 }
    ]
  },
  alerts: [
    { sku: "JMT-GNO-1L", name: "Groundnut Oil 1L", stock: 82, minLevel: 50, status: "Healthy" },
    { sku: "JMT-GNO-5L", name: "Groundnut Oil 5L", stock: 35, minLevel: 40, status: "Low" }
  ]
};

// Customer Segmentation Mock Data
export const mockCustomerReport = {
  summary: {
    totalCustomers: 840,
    newSignups: 42,
    activePercentage: "92.4%",
    churnRate: "1.8%"
  },
  vipCustomers: [
    { name: "Dwarkadhish Agro", mobile: "+91 94090 99887", orders: 41, spending: 243900 },
    { name: "Shreeji Distributors", mobile: "+91 90999 55667", orders: 33, spending: 185000 },
    { name: "Suresh Bhai Shah", mobile: "+91 94262 98765", orders: 22, spending: 89450 },
    { name: "Ramesh Patel", mobile: "+91 98250 12345", orders: 14, spending: 28420 }
  ]
};

// Pay Later Credits Analytics Mock Data
export const mockPayLaterReport = {
  summary: {
    totalRequested: 198250,
    approvedOutstanding: 142100,
    overdueOutstanding: 50400,
    repaymentRate: "74.5%"
  },
  overdueAccounts: [
    { customer: "Dwarkadhish Agro", order: "JMT-ORD-8798", amount: 32000, daysOverdue: 6 },
    { customer: "Maruti Foods & Beverage", order: "JMT-ORD-8740", amount: 18400, daysOverdue: 1 }
  ]
};
