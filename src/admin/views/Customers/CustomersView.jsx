import React, { useState, useMemo } from "react";
import { useAdminStore } from "../../../shared/useAdminStore";
import { CUSTOMER_STATUSES } from "./customersData";
import "./CustomersView.scss";

const CustomerStatusBadge = ({ status }) => {
  const map = {
    Active: "cust-badge-green",
    Suspended: "cust-badge-red",
    Inactive: "cust-badge-dark"
  };
  return <span className={`cust-status-badge ${map[status] || "cust-badge-dark"}`}>{status}</span>;
};

const CustomersView = () => {
  const customers = useAdminStore((state) => state.customers);
  const addCustomer = useAdminStore((state) => state.addCustomer);
  const toggleCustomerStatus = useAdminStore((state) => state.toggleCustomerStatus);

  const [activeTab, setActiveTab] = useState("All Customers");
  const [search, setSearch] = useState("");
  const [selectedCust, setSelectedCust] = useState(null);

  // Modal form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newAlternateMobile, setNewAlternateMobile] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newAreaVillage, setNewAreaVillage] = useState("");
  const [newTaluka, setNewTaluka] = useState("");
  const [newDistrict, setNewDistrict] = useState("Rajkot");
  const [newState, setNewState] = useState("Gujarat");
  const [newPinCode, setNewPinCode] = useState("");

  // Sync selectedCust details if state changes
  const activeSelectedCust = useMemo(() => {
    if (!selectedCust) return null;
    return customers.find(c => c.id === selectedCust.id) || selectedCust;
  }, [customers, selectedCust]);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    let list = [...customers];
    if (activeTab === "Active Customers") {
      list = list.filter((c) => c.status === "Active");
    } else if (activeTab === "Pay Later Customers") {
      list = list.filter((c) => c.payLaterActive);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.mobile.includes(q)
      );
    }
    return list;
  }, [customers, activeTab, search]);

  // Flat orders view for the "Customer Orders" tab
  const allCustomerOrders = useMemo(() => {
    const ordersList = [];
    customers.forEach((c) => {
      if (c.orders) {
        c.orders.forEach((o) => {
          ordersList.push({
            ...o,
            customerName: c.name,
            customerMobile: c.mobile,
            customerId: c.id
          });
        });
      }
    });
    // Sort orders by ID descending
    ordersList.sort((a, b) => b.id.localeCompare(a.id));
    return ordersList;
  }, [customers]);

  const filteredOrders = useMemo(() => {
    let list = [...allCustomerOrders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allCustomerOrders, search]);

  // Handle Add Customer Submit
  const handleAddNewCustomer = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newMobile.trim()) return;

    addCustomer({
      name: newName,
      mobile: newMobile,
      alternateMobile: newAlternateMobile,
      email: newEmail,
      address: {
        street: newStreet,
        areaVillage: newAreaVillage,
        taluka: newTaluka,
        district: newDistrict,
        state: newState,
        pinCode: newPinCode
      }
    });

    // Reset Form
    setNewName("");
    setNewMobile("");
    setNewAlternateMobile("");
    setNewEmail("");
    setNewStreet("");
    setNewAreaVillage("");
    setNewTaluka("");
    setNewDistrict("Rajkot");
    setNewState("Gujarat");
    setNewPinCode("");
    setShowAddModal(false);
  };

  return (
    <div className="admin-view-container cust-root">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Directory</h1>
          <p className="admin-page-subtitle">Manage store customer details, toggle accounts, and view direct client sales directories.</p>
        </div>
      </div>

      {/* Sticky Action Header */}
      <div className="admin-sticky-action-bar">
        {/* Tabs */}
        <div className="cust-tabs-nav" style={{ margin: 0 }}>
          {CUSTOMER_STATUSES.map((status) => {
            let count = 0;
            if (status === "All Customers") count = customers.length;
            else if (status === "Active Customers") count = customers.filter(c => c.status === "Active").length;
            else if (status === "Pay Later Customers") count = customers.filter(c => c.payLaterActive).length;
            else if (status === "Customer Orders") count = allCustomerOrders.length;

            return (
              <button
                key={status}
                className={`cust-tab-btn ${activeTab === status ? "is-active" : ""}`}
                onClick={() => setActiveTab(status)}
              >
                <span>{status}</span>
                <span className="cust-tab-badge">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Primary Action */}
        <div className="widget-card cust-toolbar">
          <div className="cust-search-wrap">
            <i className="pi pi-search cust-search-icon" />
            <input
              type="text"
              className="cust-search-input"
              placeholder={activeTab === "Customer Orders" ? "Search by Order ID, Customer..." : "Search by name, email, or mobile..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="cust-search-clear" onClick={() => setSearch("")}>
                <i className="pi pi-times" />
              </button>
            )}
          </div>
          <button className="admin-action-btn" onClick={() => setShowAddModal(true)}>
            <i className="pi pi-user-plus mr-2" /> Add Customer
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {activeTab === "Customer Orders" ? (
        /* Orders list table view */
        <div className="widget-card cust-table-card">
          <div className="cust-table-header">
            <span className="cust-table-title">
              Client Purchases Log <span className="cust-count-chip">{filteredOrders.length}</span>
            </span>
          </div>
          <div className="table-responsive">
            <table className="cust-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th className="th-num">Order Amount</th>
                  <th>Fulfillment Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord, idx) => (
                  <tr key={idx} className="cust-table-row">
                    <td>
                      <span className="cust-id-tag">{ord.id}</span>
                    </td>
                    <td>
                      <div className="cust-cell">
                        <span className="cust-name">{ord.customerName}</span>
                        <span className="cust-mobile">{ord.customerMobile}</span>
                      </div>
                    </td>
                    <td>{ord.date}</td>
                    <td className="td-num">₹{ord.amount.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`cust-status-badge ${ord.status === "Delivered" ? "cust-badge-green" : ord.status === "Cancelled" ? "cust-badge-red" : "cust-badge-blue"}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td>
                      <span className={`cust-status-badge badge-outline ${ord.payment === "Paid" ? "cust-badge-green" : "cust-badge-amber"}`}>
                        {ord.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Customer directory table */
        <div className="widget-card cust-table-card">
          <div className="cust-table-header">
            <span className="cust-table-title">
              Customers Directory <span className="cust-count-chip">{filteredCustomers.length}</span>
            </span>
          </div>
          <div className="table-responsive">
            <table className="cust-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Full Name</th>
                  <th>Contact Info</th>
                  <th className="th-num">Total Orders</th>
                  <th className="th-num">Total Spending</th>
                  <th>Account Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="cust-table-row">
                    <td>
                      <span className="cust-code-tag">{cust.id}</span>
                    </td>
                    <td>
                      <div className="cust-cell">
                        <span className="cust-name">{cust.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cust-contact-cell">
                        <span className="cust-mobile"><i className="pi pi-phone mr-1" />{cust.mobile}</span>
                        <span className="cust-email"><i className="pi pi-envelope mr-1" />{cust.email || "N/A"}</span>
                      </div>
                    </td>
                    <td className="td-num font-num">{cust.totalOrders}</td>
                    <td className="td-num font-num">₹{cust.totalSpending.toLocaleString("en-IN")}</td>
                    <td>
                      <CustomerStatusBadge status={cust.status} />
                    </td>
                    <td className="text-right">
                      <button className="cust-action-btn" onClick={() => setSelectedCust(cust)}>
                        <i className="pi pi-user mr-1" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCustomers.length === 0 && (
            <div className="cust-empty">
              <i className="pi pi-users" />
              <p>No customers matching filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          CUSTOMER PROFILE SLIDE DRAWER
      ───────────────────────────────────────────── */}
      {activeSelectedCust && (
        <div className="cust-drawer-overlay" onClick={() => setSelectedCust(null)}>
          <div className="cust-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cust-drawer-hdr">
              <div className="cust-drawer-profile-summary">
                <div className="cust-avatar-box">
                  {activeSelectedCust.name.charAt(0)}
                </div>
                <div>
                  <h2>{activeSelectedCust.name}</h2>
                  <span className="cust-drawer-sub">Member since {activeSelectedCust.createdDate}</span>
                </div>
              </div>
              <button className="cust-drawer-close" onClick={() => setSelectedCust(null)}>
                <i className="pi pi-times" />
              </button>
            </div>

            <div className="cust-drawer-body">
              {/* Profile Details Grid */}
              <div className="cust-drawer-section">
                <h3>Contact &amp; Account Details</h3>
                <div className="cust-details-grid">
                  <div className="cust-meta-card">
                    <span className="cust-meta-label">Customer ID</span>
                    <strong className="cust-meta-val">{activeSelectedCust.id}</strong>
                  </div>
                  <div className="cust-meta-card">
                    <span className="cust-meta-label">Mobile</span>
                    <strong className="cust-meta-val">{activeSelectedCust.mobile}</strong>
                  </div>
                  {activeSelectedCust.alternateMobile && (
                    <div className="cust-meta-card">
                      <span className="cust-meta-label">Alternate Mobile</span>
                      <strong className="cust-meta-val">{activeSelectedCust.alternateMobile}</strong>
                    </div>
                  )}
                  <div className="cust-meta-card">
                    <span className="cust-meta-label">Email Address</span>
                    <strong className="cust-meta-val">{activeSelectedCust.email || "N/A"}</strong>
                  </div>
                  <div className="cust-meta-card">
                    <span className="cust-meta-label">Status</span>
                    <div style={{ marginTop: "4px" }}>
                      <CustomerStatusBadge status={activeSelectedCust.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address details */}
              <div className="cust-drawer-section">
                <h3>Address Information</h3>
                <div className="cust-meta-card" style={{ display: "block" }}>
                  {activeSelectedCust.address ? (
                    <p className="address-block" style={{ margin: 0, fontSize: "0.85rem", lineHeight: "1.6", fontFamily: "'Poppins', sans-serif" }}>
                      {activeSelectedCust.address.street && <>{activeSelectedCust.address.street},<br /></>}
                      {activeSelectedCust.address.areaVillage && <>Area/Village: {activeSelectedCust.address.areaVillage},<br /></>}
                      {activeSelectedCust.address.taluka && <>Taluka: {activeSelectedCust.address.taluka},<br /></>}
                      {activeSelectedCust.address.district && <>District: {activeSelectedCust.address.district},<br /></>}
                      {activeSelectedCust.address.state && <>{activeSelectedCust.address.state} - </>}
                      {activeSelectedCust.address.pinCode && <strong>{activeSelectedCust.address.pinCode}</strong>}
                    </p>
                  ) : (
                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.82rem" }}>No address provided</p>
                  )}
                </div>
              </div>

              {/* Status Toggler Control */}
              <div className="cust-drawer-section">
                <h3>Quick Actions</h3>
                <div className="cust-actions-bar">
                  <button
                    className={`cust-toggle-btn ${activeSelectedCust.status === "Active" ? "suspend" : "activate"}`}
                    onClick={() => toggleCustomerStatus(activeSelectedCust.id)}
                  >
                    <i className="pi pi-power-off mr-2" />
                    {activeSelectedCust.status === "Active" ? "Suspend Account" : "Activate Account"}
                  </button>
                </div>
              </div>

              {/* Customer Orders list */}
              <div className="cust-drawer-section">
                <h3>Purchase History</h3>
                <div className="cust-order-history-list">
                  {!activeSelectedCust.orders || activeSelectedCust.orders.length === 0 ? (
                    <div className="cust-no-history">No orders placed by this customer yet.</div>
                  ) : (
                    activeSelectedCust.orders.map((o) => (
                      <div key={o.id} className="cust-history-card">
                        <div className="hdr-meta">
                          <span className="ord-id">{o.id}</span>
                          <span className="ord-date">{o.date}</span>
                        </div>
                        <div className="body-meta">
                          <span>Amount: <strong>₹{o.amount.toLocaleString("en-IN")}</strong></span>
                          <span>Delivery: <span className="badge-inline">{o.status}</span></span>
                          <span>Payment: <span className="badge-inline">{o.payment}</span></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          ADD CUSTOMER MODAL
      ───────────────────────────────────────────── */}
      {showAddModal && (
        <div className="cust-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="cust-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-hdr">
              <h3>Add New Customer</h3>
              <button className="cust-modal-close" onClick={() => setShowAddModal(false)}>
                <i className="pi pi-times" />
              </button>
            </div>
            <form onSubmit={handleAddNewCustomer} className="cust-modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter customer name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 98250 12345"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Alternate Mobile</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98250 54321"
                    value={newAlternateMobile}
                    onChange={(e) => setNewAlternateMobile(e.target.value)}
                  />
                </div>
                <div className="form-group col-span-2">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. customer@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="form-group col-span-2">
                  <label>Street Address</label>
                  <input
                    type="text"
                    placeholder="Enter street name, colony or landmark"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Area / Village</label>
                  <input
                    type="text"
                    placeholder="Enter area or village"
                    value={newAreaVillage}
                    onChange={(e) => setNewAreaVillage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Taluka</label>
                  <input
                    type="text"
                    placeholder="Enter taluka"
                    value={newTaluka}
                    onChange={(e) => setNewTaluka(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>District</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajkot"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Pin Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 360005"
                    value={newPinCode}
                    onChange={(e) => setNewPinCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="cust-modal-footer">
                <button type="button" className="cust-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="cust-modal-submit">Create Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersView;
