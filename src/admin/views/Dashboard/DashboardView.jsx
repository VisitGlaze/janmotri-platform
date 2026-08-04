import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdminStore } from "../../../shared/useAdminStore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  salesOverviewData,
  monthlyRevenueData,
  orderStatusData,
} from "./dashboardData";
import "./DashboardView.scss";

// ─────────────────────────────────────────────
// Custom Tooltip for Area/Bar Charts
// ─────────────────────────────────────────────
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dash-chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="tooltip-value">
            {entry.name === "revenue"
              ? `₹${entry.value.toLocaleString("en-IN")}`
              : entry.value}{" "}
            {entry.name === "orders" ? "orders" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dash-chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="tooltip-value">
            {entry.name === "revenue" ? "Revenue" : "Target"}: ₹
            {entry.value.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────────
// Custom Pie Legend
// ─────────────────────────────────────────────
const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="pie-legend-list">
      {payload.map((entry, index) => (
        <li key={index} className="pie-legend-item">
          <span
            className="pie-legend-dot"
            style={{ backgroundColor: entry.payload.color }}
          />
          <span className="pie-legend-label">{entry.value}</span>
          <span className="pie-legend-value">
            {entry.payload.value.toLocaleString("en-IN")}
          </span>
        </li>
      ))}
    </ul>
  );
};

// ─────────────────────────────────────────────
// Status Badge Helper
// ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Delivered: "badge-green",
    Processing: "badge-amber",
    Shipped: "badge-blue",
    Cancelled: "badge-red",
    Returned: "badge-purple",
    Critical: "badge-red",
    Low: "badge-amber",
    Warning: "badge-blue",
  };
  return (
    <span className={`dash-status-badge ${map[status] || "badge-gray"}`}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────
// Main Dashboard View
// ─────────────────────────────────────────────
const DashboardView = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch collections from useAdminStore
  const reviews = useAdminStore((state) => state.reviews);
  const messages = useAdminStore((state) => state.messages);
  const orders = useAdminStore((state) => state.orders);
  const customers = useAdminStore((state) => state.customers);
  const inventory = useAdminStore((state) => state.inventory);
  
  const approveReview = useAdminStore((state) => state.approveReview);
  const rejectReview = useAdminStore((state) => state.rejectReview);

  // Dynamic KPI Cards
  const dynamicKpiCards = useMemo(() => {
    const totalOrdersCount = orders.length;
    const totalRev = orders
      .filter(o => o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.totals.grandTotal, 0);
    const pendingOrdersCount = orders.filter(o => o.status === "Pending").length;
    const deliveredOrdersCount = orders.filter(o => o.status === "Delivered").length;
    const payLaterActiveCount = customers.filter(c => c.payLaterActive).length;
    const lowStockCount = inventory.filter(i => i.availableStock <= i.minStockLevel).length;

    return [
      {
        id: "total-orders",
        label: "Total Orders",
        value: totalOrdersCount.toLocaleString("en-IN"),
        trend: "+18.4%",
        trendDir: "up",
        trendNote: "vs last month",
        icon: "pi-shopping-bag",
        colorClass: "bg-red",
      },
      {
        id: "total-revenue",
        label: "Total Revenue",
        value: `₹${totalRev.toLocaleString("en-IN")}`,
        trend: "+22.1%",
        trendDir: "up",
        trendNote: "vs last month",
        icon: "pi-indian-rupee",
        colorClass: "bg-gold",
      },
      {
        id: "pending-orders",
        label: "Pending Orders",
        value: pendingOrdersCount.toString(),
        trend: pendingOrdersCount > 0 ? "Needs action" : "Clear",
        trendDir: pendingOrdersCount > 0 ? "up" : "down",
        trendNote: "need attention",
        icon: "pi-clock",
        colorClass: "bg-amber",
      },
      {
        id: "delivered-orders",
        label: "Delivered Orders",
        value: deliveredOrdersCount.toLocaleString("en-IN"),
        trend: "+19.2%",
        trendDir: "up",
        trendNote: "vs last month",
        icon: "pi-check-circle",
        colorClass: "bg-green",
      },
      {
        id: "pay-later",
        label: "Pay Later Accounts",
        value: payLaterActiveCount.toString(),
        trend: "Active lines",
        trendDir: "up",
        trendNote: "vs last month",
        icon: "pi-credit-card",
        colorClass: "bg-blue",
      },
      {
        id: "low-stock",
        label: "Low Stock Products",
        value: lowStockCount.toString(),
        trend: lowStockCount > 0 ? "Restock needed" : "Healthy",
        trendDir: lowStockCount > 0 ? "down" : "up",
        trendNote: "items alerts",
        icon: "pi-exclamation-triangle",
        colorClass: "bg-red-light",
      },
    ];
  }, [orders, customers, inventory]);

  // Dynamic Recent Orders List
  const recentOrders = useMemo(() => {
    return orders.slice(0, 5).map(o => ({
      id: `#${o.id.replace("JMT-ORD-", "JMT-")}`,
      customer: o.customer.name,
      product: o.items.map(i => `${i.name} (x${i.qty})`).join(", "),
      qty: o.items.reduce((s, i) => s + i.qty, 0),
      amount: `₹${o.totals.grandTotal.toLocaleString("en-IN")}`,
      status: o.status,
      date: o.date,
      payMethod: o.paymentMethod
    }));
  }, [orders]);

  // Dynamic Low Stock Alerts
  const lowStockAlerts = useMemo(() => {
    return inventory
      .filter(i => i.availableStock <= i.minStockLevel)
      .map(i => ({
        sku: i.sku,
        product: i.name,
        category: i.category,
        stock: i.availableStock,
        threshold: i.minStockLevel,
        lastRestocked: i.lastStockIn || "N/A",
        status: i.availableStock <= 0 ? "Out of Stock" : i.availableStock <= i.minStockLevel * 0.25 ? "Critical" : "Low"
      }));
  }, [inventory]);

  // Stats calculations
  const pendingReviewsCount = reviews.filter((r) => r.status === "Pending").length;
  const approvedReviewsCount = reviews.filter((r) => r.status === "Approved").length;
  const newMessagesCount = messages.filter((m) => m.status === "New").length;
  const unreadMessagesCount = messages.filter((m) => m.status === "New").length;
  const repliedMessagesCount = messages.filter((m) => m.status === "Replied").length;

  const recentReviewsList = reviews.slice(0, 3);
  const recentMessagesList = messages.slice(0, 3);

  return (
    <div className="admin-view-container dash-root">
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">{today} · Real-time business performance</p>
        </div>
        <button className="admin-action-btn">
          <i className="pi pi-refresh mr-2" />
          Refresh Data
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="dash-kpi-grid">
        {dynamicKpiCards.map((card) => (
          <div key={card.id} className="dash-kpi-card">
            <div className={`dash-kpi-icon ${card.colorClass}`}>
              <i className={`pi ${card.icon}`} />
            </div>
            <div className="dash-kpi-body">
              <span className="dash-kpi-label">{card.label}</span>
              <span className="dash-kpi-value">{card.value}</span>
              <span
                className={`dash-kpi-trend ${
                  card.trendDir === "up" ? "trend-up" : "trend-down"
                }`}
              >
                <i
                  className={`pi ${
                    card.trendDir === "up"
                      ? "pi-arrow-up-right"
                      : "pi-arrow-down-right"
                  }`}
                />{" "}
                {card.trend}&nbsp;
                <span className="trend-note">{card.trendNote}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="dash-charts-row">
        {/* Sales Overview — Area Chart */}
        <div className="widget-card dash-chart-card dash-chart-large">
          <div className="widget-header">
            <div>
              <h3>Sales Overview</h3>
              <p className="chart-subtitle">Orders &amp; Revenue — Last 14 Days</p>
            </div>
            <div className="chart-legend-inline">
              <span className="legend-dot" style={{ background: "#EC1C24" }} />
              <span>Revenue</span>
              <span className="legend-dot" style={{ background: "#ffcc00" }} />
              <span>Orders</span>
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={salesOverviewData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC1C24" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#EC1C24" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#ffcc00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Poppins" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Poppins" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Poppins" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#EC1C24"
                  strokeWidth={2.5}
                  fill="url(#gradRevenue)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#EC1C24" }}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#ffcc00"
                  strokeWidth={2.5}
                  fill="url(#gradOrders)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#ffcc00" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status — Pie/Donut Chart */}
        <div className="widget-card dash-chart-card dash-chart-small">
          <div className="widget-header">
            <div>
              <h3>Order Status</h3>
              <p className="chart-subtitle">Distribution</p>
            </div>
          </div>
          <div className="chart-body chart-body-pie">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value.toLocaleString("en-IN"), "Orders"]}
                  contentStyle={{
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontFamily: "Poppins",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-total-overlay">
              <span className="pie-total-num">12,847</span>
              <span className="pie-total-label">Total</span>
            </div>
            {/* Legend */}
            <ul className="pie-legend-list">
              {orderStatusData.map((item, i) => (
                <li key={i} className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: item.color }} />
                  <span className="pie-legend-label">{item.name}</span>
                  <span className="pie-legend-value">{item.value.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Monthly Revenue Bar Chart ── */}
      <div className="widget-card dash-chart-card dash-chart-full">
        <div className="widget-header">
          <div>
            <h3>Monthly Revenue</h3>
            <p className="chart-subtitle">Actual vs Target — Jan to Jun 2026</p>
          </div>
          <div className="chart-legend-inline">
            <span className="legend-dot" style={{ background: "#EC1C24" }} />
            <span>Actual</span>
            <span className="legend-dot" style={{ background: "#e5e7eb" }} />
            <span>Target</span>
          </div>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={monthlyRevenueData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              barCategoryGap="35%"
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "Poppins" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Poppins" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Bar dataKey="target" fill="#f3f4f6" radius={[6, 6, 0, 0]} name="target" />
              <Bar dataKey="revenue" fill="#EC1C24" radius={[6, 6, 0, 0]} name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Tables Row ── */}
      <div className="dash-tables-row">
        {/* Recent Orders Table */}
        <div className="widget-card dash-table-card dash-table-large">
          <div className="widget-header">
            <h3>Recent Orders</h3>
            <span className="widget-action-link">View All Orders →</span>
          </div>
          <div className="table-responsive">
            <table className="admin-table dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="dash-table-row">
                    <td className="order-id-cell">{order.id}</td>
                    <td className="customer-cell">{order.customer}</td>
                    <td className="product-cell">{order.product}</td>
                    <td>{order.qty}</td>
                    <td className="amount-cell">{order.amount}</td>
                    <td>
                      <span className="pay-method-tag">{order.payMethod}</span>
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="date-cell">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="widget-card dash-table-card dash-table-small">
          <div className="widget-header">
            <div>
              <h3>Low Stock Alerts</h3>
              <p className="chart-subtitle">{lowStockAlerts.length} items need attention</p>
            </div>
            <button className="admin-action-btn btn-sm">
              <i className="pi pi-plus mr-2" />
              Restock All
            </button>
          </div>
          <div className="table-responsive">
            <table className="admin-table dash-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Min. Threshold</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockAlerts.map((item) => (
                  <tr key={item.sku} className="dash-table-row">
                    <td className="sku-cell">{item.sku}</td>
                    <td>
                      <div className="product-meta-cell">
                        <span className="product-name">{item.product}</span>
                        <span className="product-cat">{item.category}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`stock-count ${
                          item.stock <= 10 ? "stock-critical" : "stock-low"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td>{item.threshold}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <button className="reorder-btn">Restock</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Section Header: Feedback & Inquiries ── */}
      <div className="dash-section-header" style={{ marginTop: "40px", marginBottom: "20px", borderTop: "1.5px solid rgba(0,0,0,0.05)", paddingTop: "40px" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#1c1917", margin: "0 0 4px 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Feedback & Inquiries Center</h2>
        <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0, fontFamily: "'Poppins', sans-serif", fontWeight: "500" }}>Moderate recent customer reviews and track direct contact requests.</p>
      </div>

      {/* ── Reviews & Messages KPI grid ── */}
      <div className="dash-feedback-kpi-grid">
        {/* Pending Reviews */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-icon bg-amber">
            <i className="pi pi-star-fill" />
          </div>
          <div className="dash-kpi-body">
            <span className="dash-kpi-label">Pending Reviews</span>
            <span className="dash-kpi-value">{pendingReviewsCount}</span>
            <span className="dash-kpi-trend trend-up">
              <span className="trend-note">Awaiting moderation</span>
            </span>
          </div>
        </div>

        {/* Approved Reviews */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-icon bg-green">
            <i className="pi pi-check" />
          </div>
          <div className="dash-kpi-body">
            <span className="dash-kpi-label">Approved Reviews</span>
            <span className="dash-kpi-value">{approvedReviewsCount}</span>
            <span className="dash-kpi-trend trend-up">
              <span className="trend-note">Live on website</span>
            </span>
          </div>
        </div>

        {/* New Messages */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-icon bg-red">
            <i className="pi pi-envelope" />
          </div>
          <div className="dash-kpi-body">
            <span className="dash-kpi-label">New Messages</span>
            <span className="dash-kpi-value">{newMessagesCount}</span>
            <span className="dash-kpi-trend trend-up">
              <span className="trend-note">Unread emails</span>
            </span>
          </div>
        </div>

        {/* Unread Messages */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-icon bg-blue">
            <i className="pi pi-eye-slash" />
          </div>
          <div className="dash-kpi-body">
            <span className="dash-kpi-label">Unread Messages</span>
            <span className="dash-kpi-value">{unreadMessagesCount}</span>
            <span className="dash-kpi-trend trend-up">
              <span className="trend-note">In inbox</span>
            </span>
          </div>
        </div>

        {/* Replied Messages */}
        <div className="dash-kpi-card">
          <div className="dash-kpi-icon bg-green">
            <i className="pi pi-reply" />
          </div>
          <div className="dash-kpi-body">
            <span className="dash-kpi-label">Replied Messages</span>
            <span className="dash-kpi-value">{repliedMessagesCount}</span>
            <span className="dash-kpi-trend trend-up">
              <span className="trend-note">Responses sent</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Reviews & Messages Lists Row ── */}
      <div className="dash-charts-row" style={{ marginTop: "28px" }}>
        {/* Recent Reviews Table */}
        <div className="widget-card dash-table-card">
          <div className="widget-header" style={{ borderBottom: "1.5px solid rgba(0,0,0,0.03)", paddingBottom: "16px", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1c1917", margin: "0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Reviews</h3>
              <p className="chart-subtitle">Quick approval moderation</p>
            </div>
            <Link to="/admin/reviews" className="widget-action-link" style={{ textDecoration: "none", fontSize: "0.75rem", fontWeight: "800", color: "#EC1C24" }}>View All Reviews →</Link>
          </div>
          <div className="table-responsive">
            {recentReviewsList.length === 0 ? (
              <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", padding: "24px 0" }}>No customer reviews found.</p>
            ) : (
              <table className="admin-table dash-table">
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReviewsList.map((review) => (
                    <tr key={review.id} className="dash-table-row">
                      <td className="customer-cell">{review.customerName}</td>
                      <td className="product-cell">{review.productName}</td>
                      <td>
                        <span style={{ color: "#f59e0b", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                          {review.rating} <i className="pi pi-star-fill" style={{ fontSize: "0.72rem" }} />
                        </span>
                      </td>
                      <td>
                        <span className={`dash-status-badge ${review.status === "Approved" ? "badge-green" : review.status === "Pending" ? "badge-amber" : review.status === "Rejected" ? "badge-red" : "badge-gray"}`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="text-right">
                        {review.status === "Pending" ? (
                          <div style={{ display: "inline-flex", gap: "6px" }}>
                            <button
                              className="reorder-btn"
                              style={{ borderColor: "#16a34a", color: "#16a34a", padding: "4px 8px" }}
                              onClick={() => approveReview(review.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="reorder-btn"
                              style={{ borderColor: "#dc2626", color: "#dc2626", padding: "4px 8px" }}
                              onClick={() => rejectReview(review.id)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Moderated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Inquiries Table */}
        <div className="widget-card dash-table-card">
          <div className="widget-header" style={{ borderBottom: "1.5px solid rgba(0,0,0,0.03)", paddingBottom: "16px", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#1c1917", margin: "0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Inquiries</h3>
              <p className="chart-subtitle">Direct customer emails &amp; inquiries</p>
            </div>
            <Link to="/admin/messages" className="widget-action-link" style={{ textDecoration: "none", fontSize: "0.75rem", fontWeight: "800", color: "#EC1C24" }}>View All Messages →</Link>
          </div>
          <div className="table-responsive">
            {recentMessagesList.length === 0 ? (
              <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", padding: "24px 0" }}>No customer inquiries found.</p>
            ) : (
              <table className="admin-table dash-table">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Received</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMessagesList.map((msg) => (
                    <tr key={msg.id} className="dash-table-row">
                      <td className="customer-cell" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {msg.customerName}
                        {msg.status === "New" && <span style={{ width: "6px", height: "6px", background: "#EC1C24", borderRadius: "50%", display: "inline-block" }} />}
                      </td>
                      <td className="product-cell" title={msg.subject}>
                        {msg.subject.length > 25 ? `${msg.subject.slice(0, 25)}...` : msg.subject}
                      </td>
                      <td>
                        <span className={`dash-status-badge ${msg.status === "New" ? "badge-red" : msg.status === "Read" ? "badge-blue" : msg.status === "Replied" ? "badge-green" : "badge-gray"}`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="date-cell">{msg.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
