// ─────────────────────────────────────────────
// Janmotri Oil Admin — Dashboard Dummy Data
// ─────────────────────────────────────────────

// KPI Summary Cards
export const kpiCards = [
  {
    id: "total-orders",
    label: "Total Orders",
    value: "12,847",
    trend: "+18.4%",
    trendDir: "up",
    trendNote: "vs last month",
    icon: "pi-shopping-bag",
    colorClass: "bg-red",
  },
  {
    id: "total-revenue",
    label: "Total Revenue",
    value: "₹38,24,580",
    trend: "+22.1%",
    trendDir: "up",
    trendNote: "vs last month",
    icon: "pi-indian-rupee",
    colorClass: "bg-gold",
  },
  {
    id: "pending-orders",
    label: "Pending Orders",
    value: "284",
    trend: "+6.3%",
    trendDir: "up",
    trendNote: "need attention",
    icon: "pi-clock",
    colorClass: "bg-amber",
  },
  {
    id: "delivered-orders",
    label: "Delivered Orders",
    value: "11,920",
    trend: "+19.2%",
    trendDir: "up",
    trendNote: "vs last month",
    icon: "pi-check-circle",
    colorClass: "bg-green",
  },
  {
    id: "pay-later",
    label: "Pay Later Requests",
    value: "143",
    trend: "-4.8%",
    trendDir: "down",
    trendNote: "vs last month",
    icon: "pi-credit-card",
    colorClass: "bg-blue",
  },
  {
    id: "low-stock",
    label: "Low Stock Products",
    value: "2",
    trend: "+1",
    trendDir: "down",
    trendNote: "since last week",
    icon: "pi-exclamation-triangle",
    colorClass: "bg-red-light",
  },
];

// Sales Overview — Daily data for last 14 days
export const salesOverviewData = [
  { day: "27 May", orders: 312, revenue: 87400 },
  { day: "28 May", orders: 278, revenue: 79200 },
  { day: "29 May", orders: 345, revenue: 96800 },
  { day: "30 May", orders: 290, revenue: 81500 },
  { day: "31 May", orders: 410, revenue: 115200 },
  { day: "01 Jun", orders: 380, revenue: 106800 },
  { day: "02 Jun", orders: 325, revenue: 91200 },
  { day: "03 Jun", orders: 298, revenue: 83600 },
  { day: "04 Jun", orders: 440, revenue: 123500 },
  { day: "05 Jun", orders: 395, revenue: 110800 },
  { day: "06 Jun", orders: 420, revenue: 117900 },
  { day: "07 Jun", orders: 358, revenue: 100500 },
  { day: "08 Jun", orders: 485, revenue: 136200 },
  { day: "09 Jun", orders: 462, revenue: 129700 },
];

// Monthly Revenue — Last 6 months
export const monthlyRevenueData = [
  { month: "Jan", revenue: 412000, target: 380000 },
  { month: "Feb", revenue: 385000, target: 400000 },
  { month: "Mar", revenue: 548000, target: 450000 },
  { month: "Apr", revenue: 492000, target: 470000 },
  { month: "May", revenue: 623000, target: 550000 },
  { month: "Jun", revenue: 589000, target: 580000 },
];

// Order Status Distribution (Pie / Donut)
export const orderStatusData = [
  { name: "Delivered", value: 11920, color: "#22c55e" },
  { name: "Processing", value: 284, color: "#f59e0b" },
  { name: "Shipped", value: 421, color: "#3b82f6" },
  { name: "Cancelled", value: 189, color: "#ef4444" },
  { name: "Returned", value: 33, color: "#a855f7" },
];

// Recent Orders Table
export const recentOrders = [
  {
    id: "#JMT-9858",
    customer: "Ramesh Patel",
    product: "Groundnut Oil 5L",
    qty: 2,
    amount: "₹2,200",
    status: "Delivered",
    date: "10 Jun, 04:28 PM",
    payMethod: "UPI",
  },
  {
    id: "#JMT-9857",
    customer: "Sunita Sharma",
    product: "Groundnut Oil 15kg Tin",
    qty: 1,
    amount: "₹3,300",
    status: "Processing",
    date: "10 Jun, 03:52 PM",
    payMethod: "Pay Later",
  },
  {
    id: "#JMT-9856",
    customer: "Amit Verma",
    product: "Groundnut Oil 1L",
    qty: 6,
    amount: "₹1,440",
    status: "Shipped",
    date: "10 Jun, 02:15 PM",
    payMethod: "COD",
  },
  {
    id: "#JMT-9855",
    customer: "Geeta Desai",
    product: "Groundnut Oil 15kg Tin",
    qty: 2,
    amount: "₹6,600",
    status: "Delivered",
    date: "10 Jun, 12:40 PM",
    payMethod: "Net Banking",
  },
  {
    id: "#JMT-9854",
    customer: "Bhavesh Modi",
    product: "Groundnut Oil 5L",
    qty: 1,
    amount: "₹1,100",
    status: "Cancelled",
    date: "10 Jun, 11:05 AM",
    payMethod: "UPI",
  },
  {
    id: "#JMT-9853",
    customer: "Kiran Joshi",
    product: "Groundnut Oil 1L",
    qty: 3,
    amount: "₹720",
    status: "Delivered",
    date: "10 Jun, 09:30 AM",
    payMethod: "UPI",
  }
];

// Low Stock Alerts Table
export const lowStockAlerts = [
  {
    sku: "JMT-GNO-1L",
    product: "Groundnut Oil 1L",
    category: "Retail Pack",
    stock: 82,
    threshold: 50,
    lastRestocked: "02 Jun 2026",
    status: "Healthy",
  },
  {
    sku: "JMT-GNO-5L",
    product: "Groundnut Oil 5L",
    category: "Retail Pack",
    stock: 35,
    threshold: 40,
    lastRestocked: "28 May 2026",
    status: "Low",
  }
];
