import React from "react";

// Dashboard View
export const DashboardView = () => (
  <div className="admin-view-container">
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <p className="admin-page-subtitle">Real-time store statistics and business performance indicators.</p>
      </div>
      <button className="admin-action-btn">
        <i className="pi pi-refresh mr-2"></i> Sync Data
      </button>
    </div>

    {/* KPI Cards Grid */}
    <div className="admin-kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon-wrap bg-red">
          <i className="pi pi-shopping-bag"></i>
        </div>
        <div className="kpi-details">
          <span className="kpi-label">Today's Orders</span>
          <span className="kpi-value">148</span>
          <span className="kpi-trend trend-up"><i className="pi pi-arrow-up-right"></i> +12% vs yesterday</span>
        </div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon-wrap bg-gold">
          <i className="pi pi-dollar"></i>
        </div>
        <div className="kpi-details">
          <span className="kpi-label">Today's Revenue</span>
          <span className="kpi-value">₹84,240</span>
          <span className="kpi-trend trend-up"><i className="pi pi-arrow-up-right"></i> +8.5% vs yesterday</span>
        </div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon-wrap bg-blue">
          <i className="pi pi-users"></i>
        </div>
        <div className="kpi-details">
          <span className="kpi-label">New Customers</span>
          <span className="kpi-value">36</span>
          <span className="kpi-trend trend-up"><i className="pi pi-arrow-up-right"></i> +4.2% vs yesterday</span>
        </div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon-wrap bg-green">
          <i className="pi pi-percentage"></i>
        </div>
        <div className="kpi-details">
          <span className="kpi-label">Conversion Rate</span>
          <span className="kpi-value">3.45%</span>
          <span className="kpi-trend trend-down"><i className="pi pi-arrow-down-right"></i> -0.8% vs yesterday</span>
        </div>
      </div>
    </div>

    {/* Main Grid: Mock Charts and Tables */}
    <div className="admin-dashboard-layout">
      {/* Recent Orders List Widget */}
      <div className="widget-card col-span-2">
        <div className="widget-header">
          <h3>Recent Orders</h3>
          <span className="widget-action-link">View All</span>
        </div>
        <div className="widget-body table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#JMT-9841</td>
                <td>Ramesh Patel</td>
                <td>Groundnut Oil (5L)</td>
                <td>₹1,150</td>
                <td><span className="status-badge-pill status-green">Delivered</span></td>
                <td>Today, 04:12 PM</td>
              </tr>
              <tr>
                <td>#JMT-9840</td>
                <td>Sunita Sharma</td>
                <td>Groundnut Oil (15kg)</td>
                <td>₹3,420</td>
                <td><span className="status-badge-pill status-amber">Processing</span></td>
                <td>Today, 03:45 PM</td>
              </tr>
              <tr>
                <td>#JMT-9839</td>
                <td>Amit Kumar</td>
                <td>Groundnut Oil (1L x 3)</td>
                <td>₹720</td>
                <td><span className="status-badge-pill status-green">Delivered</span></td>
                <td>Today, 01:30 PM</td>
              </tr>
              <tr>
                <td>#JMT-9838</td>
                <td>Geeta Shah</td>
                <td>Groundnut Oil (15kg)</td>
                <td>₹3,420</td>
                <td><span className="status-badge-pill status-red">Cancelled</span></td>
                <td>Yesterday, 06:12 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Alert Widget */}
      <div className="widget-card">
        <div className="widget-header">
          <h3>Low Stock Alerts</h3>
          <i className="pi pi-exclamation-triangle text-amber"></i>
        </div>
        <div className="widget-body">
          <div className="stock-alert-list">
            <div className="stock-alert-item">
              <div className="alert-item-meta">
                <span className="item-title">Groundnut Oil 1L (Pouch)</span>
                <span className="item-quantity text-danger">Only 8 left in stock</span>
              </div>
              <button className="reorder-btn">Restock</button>
            </div>
            <div className="stock-alert-item">
              <div className="alert-item-meta">
                <span className="item-title">Groundnut Oil 5L (Can)</span>
                <span className="item-quantity text-warning">15 left in stock</span>
              </div>
              <button className="reorder-btn">Restock</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Generic Template View Helper
const GenericPlaceholderView = ({ title, subtitle, icon, fields = [] }) => (
  <div className="admin-view-container">
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        <p className="admin-page-subtitle">{subtitle}</p>
      </div>
    </div>

    {/* Sticky Action Header */}
    <div className="admin-sticky-action-bar">
      <div className="widget-card ph-toolbar">
        <div className="search-box-wrap">
          <i className="pi pi-search search-icon"></i>
          <input type="text" className="search-input" placeholder="Search entries..." />
        </div>
        <button className="admin-action-btn">
          <i className={`pi ${icon} mr-2`}></i> Add New Item
        </button>
      </div>
    </div>

    {/* Table Panel Card */}
    <div className="widget-card">
      <div className="widget-header">
        <h3>{title} Directory</h3>
      </div>
      <div className="widget-body table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              {fields.map((field, idx) => <th key={idx}>{field}</th>)}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {fields.map((field, idx) => (
                <td key={idx}>
                  {idx === 0 ? "Entry #1" : `Mock data for ${field}`}
                </td>
              ))}
              <td className="text-right">
                <button className="table-row-action"><i className="pi pi-pencil"></i></button>
                <button className="table-row-action text-danger"><i className="pi pi-trash"></i></button>
              </td>
            </tr>
            <tr>
              {fields.map((field, idx) => (
                <td key={idx}>
                  {idx === 0 ? "Entry #2" : `Mock data for ${field}`}
                </td>
              ))}
              <td className="text-right">
                <button className="table-row-action"><i className="pi pi-pencil"></i></button>
                <button className="table-row-action text-danger"><i className="pi pi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// View exports matching sidebar items
export const OrdersView = () => (
  <GenericPlaceholderView 
    title="Orders Management" 
    subtitle="View, update, track, and dispatch customer order shipments."
    icon="pi-shopping-cart"
    fields={["Order ID", "Customer Name", "Total Price", "Payment Method", "Status", "Order Date"]}
  />
);

export const ProductsView = () => (
  <GenericPlaceholderView 
    title="Products Catalog" 
    subtitle="Manage Janmotri Oil sizes, variations, images, and descriptions."
    icon="pi-box"
    fields={["Product ID", "Name", "Packaging Size", "Base Price", "Status", "Weight"]}
  />
);

export const InventoryView = () => (
  <GenericPlaceholderView 
    title="Inventory Tracking" 
    subtitle="Check real-time stock counts, alerts, and dispatch batches."
    icon="pi-database"
    fields={["SKU", "Product Name", "Available Stock", "Reserved", "Warehouse Location", "Last Updated"]}
  />
);

export const BatchManagementView = () => (
  <GenericPlaceholderView 
    title="Batch Management" 
    subtitle="Monitor oil extraction runs, wood ghani press batches, and quality test records."
    icon="pi-list"
    fields={["Batch ID", "Oil Yield (L)", "Saurashtra Peanuts Seed Lot", "Extraction Date", "Lab Test Status", "Quality Rating"]}
  />
);

export const PayLaterView = () => (
  <GenericPlaceholderView 
    title="Pay Later Accounts" 
    subtitle="Review customer credit limits, outstanding balances, invoices, and payment cycles."
    icon="pi-credit-card"
    fields={["Account ID", "Customer", "Credit Limit", "Outstanding Balance", "Due Date", "Account Status"]}
  />
);

export const CustomersView = () => (
  <GenericPlaceholderView 
    title="Customers Base" 
    subtitle="Manage verified user directories, active profiles, and credit ledger logs."
    icon="pi-users"
    fields={["Customer ID", "Name", "Email Address", "Phone Number", "Total Orders", "Credit Balance"]}
  />
);





export const ContentView = () => (
  <GenericPlaceholderView 
    title="Content Management" 
    subtitle="Edit static page sections, FAQ accordion contents, and blog columns."
    icon="pi-file-edit"
    fields={["Page Section ID", "Page Route", "Last Edited By", "Status", "Update Date"]}
  />
);

export const ReportsView = () => (
  <GenericPlaceholderView 
    title="Reports & Analytics" 
    subtitle="Generate sales graphs, order charts, inventory forecasts, and tax summaries."
    icon="pi-chart-bar"
    fields={["Report ID", "Report Name", "Date Range", "Author", "Download PDF"]}
  />
);

export const NotificationsView = () => (
  <GenericPlaceholderView 
    title="Notifications Center" 
    subtitle="Dispatch marketing broadcasts, bulk emails, and push alert notifications."
    icon="pi-bell"
    fields={["Notification ID", "Target Audience", "Subject Message", "Status", "Scheduled Date"]}
  />
);

export const SettingsView = () => (
  <div className="admin-view-container">
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">General Settings</h1>
        <p className="admin-page-subtitle">Configure Janmotri Oil global variables, contact info, and system attributes.</p>
      </div>
      <button className="admin-action-btn">
        <i className="pi pi-save mr-2"></i> Save Settings
      </button>
    </div>

    {/* Form Panel Grid */}
    <div className="widget-card">
      <div className="widget-header">
        <h3>System Settings</h3>
      </div>
      <div className="widget-body">
        <div className="admin-mock-form-layout">
          <div className="form-group-wrap">
            <label className="admin-mock-label">Store Brand Name</label>
            <input type="text" className="admin-mock-input" defaultValue="Janmotri Oil" />
          </div>
          <div className="form-group-wrap">
            <label className="admin-mock-label">Admin Support Email</label>
            <input type="email" className="admin-mock-input" defaultValue="admin@janmotrioil.com" />
          </div>
          <div className="form-group-wrap">
            <label className="admin-mock-label">Notification Phone Number</label>
            <input type="text" className="admin-mock-input" defaultValue="+91 98765 43210" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AdminUsersView = () => (
  <GenericPlaceholderView 
    title="Admin Users Management" 
    subtitle="Manage dashboard administrative users, access permissions, and role models."
    icon="pi-user-plus"
    fields={["Admin ID", "User Name", "Email Address", "Access Role Level", "Status", "Date Registered"]}
  />
);
