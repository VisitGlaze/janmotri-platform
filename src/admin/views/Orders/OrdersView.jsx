import React, { useState, useMemo } from "react";
import { useAdminStore } from "../../../shared/useAdminStore";
import { ORDER_STATUSES, getOrderSummary } from "./ordersData";
import AppButton from "../../../shared/components/ui/AppButton";
import AppInput from "../../../shared/components/ui/AppInput";
import AppSelect from "../../../shared/components/ui/AppSelect";
import AppModal from "../../../shared/components/ui/AppModal";
import "./OrdersView.scss";

// ─────────────────────────────────────────────
// Status badges with matching colors
// ─────────────────────────────────────────────
const OrderStatusBadge = ({ status }) => {
  const map = {
    Pending: "ord-badge-amber",
    Processing: "ord-badge-blue",
    Shipped: "ord-badge-purple",
    Delivered: "ord-badge-green",
    Cancelled: "ord-badge-red"
  };
  return <span className={`ord-status-badge ${map[status] || "ord-badge-dark"}`}>{status}</span>;
};

const PaymentStatusBadge = ({ status }) => {
  const map = {
    Paid: "ord-badge-green",
    Pending: "ord-badge-amber",
    Unpaid: "ord-badge-red",
    Refunded: "ord-badge-blue"
  };
  return <span className={`ord-status-badge badge-outline ${map[status] || "ord-badge-dark"}`}>{status}</span>;
};

// ─────────────────────────────────────────────
// Product Details for checkout selection
// ─────────────────────────────────────────────
const CATALOG_PRODUCTS = [
  { id: "p1", name: "Groundnut Oil 15L", sku: "JMT-GNO-15L", price: 3300 },
  { id: "p2", name: "Groundnut Oil 1L", sku: "JMT-GNO-1L", price: 240 },
  { id: "p3", name: "Groundnut Oil 15kg Tin", sku: "JMT-GNO-15K", price: 3300 },
  { id: "p4", name: "Groundnut Oil 5L", sku: "JMT-GNO-5L", price: 1100 },
  { id: "p5", name: "Groundnut Oil Special Pack", sku: "JMT-GNO-SP", price: 550 }
];

const OrdersView = () => {
  const orders = useAdminStore((state) => state.orders);
  const addOrder = useAdminStore((state) => state.addOrder);
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);
  
  const customers = useAdminStore((state) => state.customers);
  const batches = useAdminStore((state) => state.batches);
  const companyDetails = useAdminStore((state) => state.companyDetails);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInvoicePrint, setShowInvoicePrint] = useState(false);

  // Manual Order Wizard States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardCustomer, setWizardCustomer] = useState(null);
  const [custSearch, setCustSearch] = useState("");
  
  // Cart items
  const [wizardItems, setWizardItems] = useState([]);
  const [selectedProdId, setSelectedProdId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);

  // Shipping details
  const [street, setStreet] = useState("");
  const [areaVillage, setAreaVillage] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("Rajkot");
  const [state, setState] = useState("Gujarat");
  const [pinCode, setPinCode] = useState("");

  // Billing
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Success confirmation details
  const [createdOrder, setCreatedOrder] = useState(null);

  // Sync selected order dynamically if changed in state
  const activeSelectedOrder = useMemo(() => {
    if (!selectedOrder) return null;
    return orders.find(o => o.id === selectedOrder.id) || selectedOrder;
  }, [orders, selectedOrder]);

  // Compute overall KPI cards
  const summary = useMemo(() => getOrderSummary(orders), [orders]);

  // Filtering logic
  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (activeTab !== "All") {
      list = list.filter((o) => o.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.mobile.includes(q) ||
          o.items.some((item) => item.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [orders, activeTab, search]);

  // Handle order status transition
  const handleUpdateStatusSubmit = () => {
    if (!statusToUpdate || !selectedOrder) return;
    updateOrderStatus(selectedOrder.id, statusToUpdate);
    setShowStatusModal(false);
  };

  const triggerPrint = () => {
    window.print();
  };

  // Step 1: Filtered Customer Search
  const filteredWizardCustomers = useMemo(() => {
    const q = custSearch.trim().toLowerCase();
    if (!q) return customers.filter(c => c.status === "Active");
    return customers.filter(
      (c) =>
        c.status === "Active" &&
        (c.name.toLowerCase().includes(q) || c.mobile.includes(q))
    );
  }, [customers, custSearch]);

  // Step 2: Product selection helpers
  const selectedProductObj = useMemo(() => {
    return CATALOG_PRODUCTS.find(p => p.id === selectedProdId) || null;
  }, [selectedProdId]);

  // Handle customer pick
  const selectCustomerForWizard = (cust) => {
    setWizardCustomer(cust);
    if (cust.address) {
      setStreet(cust.address.street || "");
      setAreaVillage(cust.address.areaVillage || "");
      setTaluka(cust.address.taluka || "");
      setDistrict(cust.address.district || "Rajkot");
      setState(cust.address.state || "Gujarat");
      setPinCode(cust.address.pinCode || "");
    } else {
      setStreet("");
      setAreaVillage("");
      setTaluka("");
      setDistrict("Rajkot");
      setState("Gujarat");
      setPinCode("");
    }
    setWizardStep(2);
  };

  // Handle item add to order
  const handleAddItemToOrder = () => {
    if (!selectedProductObj || selectedQty <= 0) return;

    // Check if already in wizard items
    const existingIdx = wizardItems.findIndex(i => i.id === selectedProductObj.id);
    if (existingIdx > -1) {
      const updated = [...wizardItems];
      updated[existingIdx].qty += selectedQty;
      setWizardItems(updated);
    } else {
      setWizardItems([
        ...wizardItems,
        {
          id: selectedProductObj.id,
          name: selectedProductObj.name,
          sku: selectedProductObj.sku,
          price: selectedProductObj.price,
          qty: selectedQty,
          batchNo: "",
          mfgDate: "",
          expDate: ""
        }
      ]);
    }

    // Clear item inputs
    setSelectedProdId("");
    setSelectedQty(1);
  };

  const handleAssignBatch = (index, batchNo) => {
    const batchObj = batches.find(b => b.batchNo === batchNo);
    const updated = [...wizardItems];
    if (batchObj) {
      updated[index] = {
        ...updated[index],
        batchNo: batchObj.batchNo,
        mfgDate: batchObj.mfgDate,
        expDate: batchObj.expiryDate
      };
    } else {
      updated[index] = {
        ...updated[index],
        batchNo: "",
        mfgDate: "",
        expDate: ""
      };
    }
    setWizardItems(updated);
  };

  const handleRemoveItem = (index) => {
    setWizardItems(wizardItems.filter((_, i) => i !== index));
  };

  // Wizard totals calculations
  const orderSubtotal = useMemo(() => {
    return wizardItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [wizardItems]);

  const orderGst = useMemo(() => Math.round(orderSubtotal * 0.05), [orderSubtotal]);
  
  const orderDelivery = useMemo(() => {
    if (orderSubtotal === 0 || orderSubtotal > 1500) return 0;
    return 50;
  }, [orderSubtotal]);

  const orderGrandTotal = useMemo(() => {
    return Math.max(0, orderSubtotal + orderGst + orderDelivery - Number(discountAmount || 0));
  }, [orderSubtotal, orderGst, orderDelivery, discountAmount]);

  // Credit limits validation
  const creditCheckPass = useMemo(() => {
    if (paymentMethod !== "Pay Later") return true;
    if (!wizardCustomer) return false;
    if (!wizardCustomer.payLaterActive) return false;
    
    const remainingCredit = wizardCustomer.payLaterLimit - wizardCustomer.payLaterBalance;
    return orderGrandTotal <= remainingCredit;
  }, [paymentMethod, wizardCustomer, orderGrandTotal]);

  const isStep3Valid = useMemo(() => {
    if (wizardItems.length === 0) return false;
    return wizardItems.every(item => {
      if (!item.batchNo) return false;
      const batchObj = batches.find(b => b.batchNo === item.batchNo);
      return batchObj && item.qty <= batchObj.availableQty;
    });
  }, [wizardItems, batches]);

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setWizardStep(1);
    setWizardCustomer(null);
    setCustSearch("");
    setWizardItems([]);
    setStreet("");
    setAreaVillage("");
    setTaluka("");
    setDistrict("Rajkot");
    setState("Gujarat");
    setPinCode("");
    setDiscountAmount(0);
    setPaymentMethod("Cash");
    setCreatedOrder(null);
  };

  // Final submit
  const handleSubmitManualOrder = (e) => {
    e.preventDefault();
    if (!wizardCustomer || wizardItems.length === 0) return;
    if (!creditCheckPass) {
      alert("Selected customer does not have enough remaining credit for this Pay Later order.");
      return;
    }
    if (!isStep3Valid) {
      alert("Please ensure all items have valid batches assigned with sufficient stock.");
      return;
    }

    const newOrd = addOrder({
      customer: {
        name: wizardCustomer.name,
        mobile: wizardCustomer.mobile,
        email: wizardCustomer.email || "N/A",
        status: wizardCustomer.status
      },
      shippingAddress: {
        street,
        areaVillage,
        taluka,
        district,
        state,
        pinCode
      },
      items: wizardItems,
      paymentMethod,
      transactionId: paymentMethod === "Pay Later" ? `PL-CRED-${Date.now().toString().slice(-4)}` : paymentMethod === "Cash" ? "CASH-DIRECT" : `UPI-${Date.now().toString().slice(-6)}`,
      totals: {
        subtotal: orderSubtotal,
        gst: orderGst,
        delivery: orderDelivery,
        discount: Number(discountAmount || 0),
        grandTotal: orderGrandTotal
      }
    });

    if (newOrd) {
      setCreatedOrder(newOrd);
      setWizardStep(7);
    } else {
      alert("Failed to create the order. Please try again.");
    }
  };

  return (
    <div className="admin-view-container ord-root">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Order Management</h1>
          <p className="admin-page-subtitle">Track, approve, dispatch, and manage invoices for customer orders.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="ord-kpi-grid">
        <div className="ord-kpi-card">
          <div className="ord-kpi-icon bg-gold">
            <i className="pi pi-dollar" />
          </div>
          <div className="ord-kpi-details">
            <span className="ord-kpi-label">Active Revenue</span>
            <span className="ord-kpi-value">₹{summary.totalRevenue.toLocaleString("en-IN")}</span>
            <span className="ord-kpi-sub">Excludes cancelled orders</span>
          </div>
        </div>
        <div className="ord-kpi-card">
          <div className="ord-kpi-icon bg-amber">
            <i className="pi pi-hourglass" />
          </div>
          <div className="ord-kpi-details">
            <span className="ord-kpi-label">Pending Approval</span>
            <span className="ord-kpi-value">{summary.pending}</span>
            <span className="ord-kpi-sub">Needs immediate action</span>
          </div>
        </div>
        <div className="ord-kpi-card">
          <div className="ord-kpi-icon bg-blue">
            <i className="pi pi-cog" />
          </div>
          <div className="ord-kpi-details">
            <span className="ord-kpi-label">Processing</span>
            <span className="ord-kpi-value">{summary.processing}</span>
            <span className="ord-kpi-sub">Packaging & assembling</span>
          </div>
        </div>
        <div className="ord-kpi-card">
          <div className="ord-kpi-icon bg-purple">
            <i className="pi pi-truck" />
          </div>
          <div className="ord-kpi-details">
            <span className="ord-kpi-label">Shipped / In Transit</span>
            <span className="ord-kpi-value">{summary.shipped}</span>
            <span className="ord-kpi-sub">Out with logistics</span>
          </div>
        </div>
        <div className="ord-kpi-card">
          <div className="ord-kpi-icon bg-green">
            <i className="pi pi-check-circle" />
          </div>
          <div className="ord-kpi-details">
            <span className="ord-kpi-label">Delivered Orders</span>
            <span className="ord-kpi-value">{summary.delivered}</span>
            <span className="ord-kpi-sub">Completed sales</span>
          </div>
        </div>
      </div>

      {/* Sticky Action Header */}
      <div className="admin-sticky-action-bar">
        {/* Tabs */}
        <div className="ord-tabs-nav" style={{ margin: 0 }}>
          {ORDER_STATUSES.map((status) => {
            let count = 0;
            if (status === "All") count = orders.length;
            else if (status === "Pending") count = summary.pending;
            else if (status === "Processing") count = summary.processing;
            else if (status === "Shipped") count = summary.shipped;
            else if (status === "Delivered") count = summary.delivered;
            else if (status === "Cancelled") count = summary.cancelled;

            return (
              <button
                key={status}
                className={`ord-tab-btn ${activeTab === status ? "is-active" : ""}`}
                onClick={() => setActiveTab(status)}
              >
                <span>{status} Orders</span>
                <span className="ord-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="widget-card ord-toolbar">
          <div className="ord-search-wrap">
            <i className="pi pi-search ord-search-icon" />
            <AppInput
              type="text"
              className="ord-search-input"
              placeholder="Search by Order ID, Customer, Phone, or Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <AppButton className="ord-search-clear" onClick={() => setSearch("")}>
                <i className="pi pi-times" />
              </AppButton>
            )}
          </div>
          <AppButton className="admin-action-btn" onClick={() => setShowCreateModal(true)}>
            <i className="pi pi-plus mr-2" /> Create Order
          </AppButton>
        </div>
      </div>

      {/* Orders Directory Table */}
      <div className="widget-card ord-table-card">
        <div className="ord-table-header">
          <span className="ord-table-title">
            Orders Directory <span className="ord-count-chip">{filteredOrders.length}</span>
          </span>
        </div>
        <div className="table-responsive">
          <table className="ord-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Products Ordered</th>
                <th className="th-num">Order Amount</th>
                <th>Payment Mode</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="ord-table-row">
                  <td>
                    <span className="ord-id-tag">{order.id}</span>
                  </td>
                  <td>
                    <span className="ord-date">{order.date}</span>
                    <span className="ord-time">{order.time}</span>
                  </td>
                  <td className="td-cust">
                    <div className="ord-cust-info">
                      <span className="ord-cust-name">{order.customer.name}</span>
                      <span className="ord-cust-mobile">{order.customer.mobile}</span>
                    </div>
                  </td>
                  <td className="td-items">
                    <div className="ord-item-summaries">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="ord-item-summary-line">
                          <span>{item.name}</span> <strong>x{item.qty}</strong>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="td-num">
                    <span className="ord-amount">₹{order.totals.grandTotal.toLocaleString("en-IN")}</span>
                  </td>
                  <td>
                    <span className="ord-payment-method">{order.paymentMethod}</span>
                  </td>
                  <td>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="text-right">
                    <AppButton className="ord-action-btn" onClick={() => setSelectedOrder(order)}>
                      <i className="pi pi-eye mr-1" /> View Details
                    </AppButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="ord-empty">
            <i className="pi pi-shopping-bag" />
            <p>No orders found matching the filters.</p>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          ORDER DETAILS DRAWER
      ───────────────────────────────────────────── */}
      {activeSelectedOrder && (
        <div className="ord-drawer-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="ord-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="ord-drawer-hdr">
              <div>
                <h2>Order {activeSelectedOrder.id}</h2>
                <span className="ord-drawer-sub">Placed on {activeSelectedOrder.date} at {activeSelectedOrder.time}</span>
              </div>
              <button className="ord-drawer-close" onClick={() => setSelectedOrder(null)}>
                <i className="pi pi-times" />
              </button>
            </div>

            <div className="ord-drawer-body">
              {/* Stepper Timeline */}
              <div className="ord-drawer-section">
                <h3>Order Status & Timeline</h3>
                <div className="ord-timeline-status-block">
                  <div className="ord-status-actions">
                    <span className="current-label">Current: <OrderStatusBadge status={activeSelectedOrder.status} /></span>
                    {activeSelectedOrder.status !== "Delivered" && activeSelectedOrder.status !== "Cancelled" && (
                      <AppButton
                        className="admin-action-btn ord-status-trigger"
                        onClick={() => {
                          setStatusToUpdate(activeSelectedOrder.status);
                          setShowStatusModal(true);
                        }}
                      >
                        <i className="pi pi-refresh mr-1" /> Update Status
                      </AppButton>
                    )}
                  </div>

                  <div className="ord-stepper-wrap">
                    {activeSelectedOrder.timeline.map((step, idx) => (
                      <div key={idx} className="ord-step-item">
                        <div className="ord-step-bullet-col">
                          <div className={`ord-bullet ${idx === activeSelectedOrder.timeline.length - 1 ? "bullet-pulse" : "bullet-done"}`}>
                            <i className="pi pi-check" />
                          </div>
                          {idx < activeSelectedOrder.timeline.length - 1 && <div className="ord-step-line" />}
                        </div>
                        <div className="ord-step-details">
                          <span className="ord-step-title">{step.title}</span>
                          <span className="ord-step-time">{step.time}</span>
                          <p className="ord-step-desc">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer and Shipping details */}
              <div className="ord-details-grid">
                <div className="ord-drawer-section">
                  <h3>Customer Information</h3>
                  <div className="ord-meta-card">
                    <div className="ord-meta-row">
                      <span>Name:</span> <strong>{activeSelectedOrder.customer.name}</strong>
                    </div>
                    <div className="ord-meta-row">
                      <span>Phone:</span> <strong>{activeSelectedOrder.customer.mobile}</strong>
                    </div>
                    <div className="ord-meta-row">
                      <span>Email:</span> <strong>{activeSelectedOrder.customer.email}</strong>
                    </div>
                    <div className="ord-meta-row">
                      <span>Account status:</span> <strong>{activeSelectedOrder.customer.status}</strong>
                    </div>
                  </div>
                </div>

                <div className="ord-drawer-section">
                  <h3>Shipping Address</h3>
                  <div className="ord-meta-card">
                    <p className="address-block">
                      {activeSelectedOrder.shippingAddress.street}, <br />
                      {activeSelectedOrder.shippingAddress.villageTaluka && <>{activeSelectedOrder.shippingAddress.villageTaluka}, <br /></>}
                      {activeSelectedOrder.shippingAddress.city}, <br />
                      {activeSelectedOrder.shippingAddress.state} — <strong>{activeSelectedOrder.shippingAddress.pinCode}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Products List & Batch No */}
              <div className="ord-drawer-section">
                <h3>Ordered Products</h3>
                <div className="ord-items-table-wrap">
                  <table className="ord-items-table">
                    <thead>
                      <tr>
                        <th>Item Description</th>
                        <th>SKU</th>
                        <th>Batch Info</th>
                        <th className="th-num">Unit Price</th>
                        <th className="th-num">Qty</th>
                        <th className="th-num">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSelectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <span className="item-name">{item.name}</span>
                          </td>
                          <td>
                            <span className="ord-sku-cell">{item.sku}</span>
                          </td>
                          <td>
                            <div className="item-batch-info">
                              <span className="batch-no">No: <strong>{item.batchNo}</strong></span>
                              <span className="batch-dates">MFG: {item.mfgDate} | EXP: {item.expDate}</span>
                            </div>
                          </td>
                          <td className="td-num">₹{item.price.toLocaleString("en-IN")}</td>
                          <td className="td-num">{item.qty}</td>
                          <td className="td-num">₹{(item.price * item.qty).toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Breakdown */}
              <div className="ord-details-grid grid-align-start">
                <div className="ord-drawer-section">
                  <h3>Payment Ledger</h3>
                  <div className="ord-meta-card">
                    <div className="ord-meta-row">
                      <span>Payment Method:</span> <strong>{activeSelectedOrder.paymentMethod}</strong>
                    </div>
                    <div className="ord-meta-row">
                      <span>Transaction ID:</span> <strong>{activeSelectedOrder.transactionId}</strong>
                    </div>
                    <div className="ord-meta-row">
                      <span>Payment Status:</span> <PaymentStatusBadge status={activeSelectedOrder.paymentStatus} />
                    </div>
                  </div>
                </div>

                <div className="ord-drawer-section">
                  <h3>Bill Summary</h3>
                  <div className="ord-summary-card">
                    <div className="ord-summary-row">
                      <span>Subtotal</span>
                      <span>₹{activeSelectedOrder.totals.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="ord-summary-row">
                      <span>GST (5%)</span>
                      <span>₹{activeSelectedOrder.totals.gst.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="ord-summary-row">
                      <span>Delivery Charge</span>
                      <span>{activeSelectedOrder.totals.delivery > 0 ? `₹${activeSelectedOrder.totals.delivery}` : "Free"}</span>
                    </div>
                    {activeSelectedOrder.totals.discount > 0 && (
                      <div className="ord-summary-row text-green">
                        <span>Discount</span>
                        <span>-₹{activeSelectedOrder.totals.discount}</span>
                      </div>
                    )}
                    <hr className="divider" />
                    <div className="ord-summary-row grand-total-row">
                      <span>Grand Total</span>
                      <span>₹{activeSelectedOrder.totals.grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ord-drawer-footer">
                <AppButton className="admin-action-btn print-invoice-btn" onClick={() => setShowInvoicePrint(true)}>
                  <i className="pi pi-download mr-1" /> View &amp; Print Invoice
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          STATUS UPDATE MODAL
      ───────────────────────────────────────────── */}
      <AppModal
        visible={showStatusModal && !!activeSelectedOrder}
        onHide={() => setShowStatusModal(false)}
        maskClassName="ord-modal-overlay"
        className="ord-modal-box"
      >
        <div className="ord-modal-hdr">
          <h3>Update Status — {activeSelectedOrder?.id}</h3>
          <AppButton className="ord-modal-close" onClick={() => setShowStatusModal(false)}>
            <i className="pi pi-times" />
          </AppButton>
        </div>
        <div className="ord-modal-body">
          <p>Change order status from <strong>{activeSelectedOrder?.status}</strong> to:</p>
          <AppSelect
            className="ord-status-select"
            value={statusToUpdate}
            onChange={(e) => setStatusToUpdate(e.value)}
            options={[
              { label: "Pending Verification", value: "Pending" },
              { label: "Processing / Packaging", value: "Processing" },
              { label: "Shipped / In Transit", value: "Shipped" },
              { label: "Delivered", value: "Delivered" },
              { label: "Cancelled", value: "Cancelled" }
            ]}
          />
        </div>
        <div className="ord-modal-footer">
          <AppButton className="ord-modal-cancel" onClick={() => setShowStatusModal(false)}>Cancel</AppButton>
          <AppButton className="ord-modal-submit" onClick={handleUpdateStatusSubmit}>Save Status</AppButton>
        </div>
      </AppModal>

      {/* ─────────────────────────────────────────────
          PRINTABLE INVOICE MODAL VIEW
      ───────────────────────────────────────────── */}
      {showInvoicePrint && activeSelectedOrder && (
        <div className="ord-invoice-print-overlay">
          <div className="ord-invoice-print-container">
            <div className="print-header-control no-print">
              <span>Previewing Invoice for {activeSelectedOrder.id}</span>
              <div className="print-actions">
                <button className="print-btn" onClick={triggerPrint}>
                  <i className="pi pi-print mr-1" /> Print / Download
                </button>
                <button className="close-btn" onClick={() => setShowInvoicePrint(false)}>
                  Close Preview
                </button>
              </div>
            </div>

            {/* Actual printable invoice bill */}
            <div className="ord-invoice-sheet" id="printable-bill">
              <div className="bill-hdr">
                <div className="bill-logo-area">
                  <h1>{companyDetails.brandName.toUpperCase()}</h1>
                  <span className="subtitle">100% Pure Traditional Groundnut Oil</span>
                  <span className="address">
                    {companyDetails.address}
                  </span>
                </div>
                <div className="bill-invoice-meta">
                  <h2 className="invoice-title">TAX INVOICE</h2>
                  <div className="invoice-meta-row">
                    <span>Invoice No:</span> <strong>INV-{activeSelectedOrder.id.replace("JMT-ORD-", "")}</strong>
                  </div>
                  <div className="invoice-meta-row">
                    <span>GSTIN:</span> <strong style={{ textTransform: "uppercase" }}>{companyDetails.gstin}</strong>
                  </div>
                  <div className="invoice-meta-row">
                    <span>Date:</span> <strong>{activeSelectedOrder.date}</strong>
                  </div>
                  <div className="invoice-meta-row">
                    <span>Time:</span> <strong>{activeSelectedOrder.time}</strong>
                  </div>
                </div>
              </div>

              <hr className="bill-divider" />

              <div className="bill-billing-section">
                <div className="billing-col">
                  <span className="col-label">Billed To (Customer):</span>
                  <span className="cust-name">{activeSelectedOrder.customer.name}</span>
                  <span className="cust-meta">Phone: {activeSelectedOrder.customer.mobile}</span>
                  <span className="cust-meta">Email: {activeSelectedOrder.customer.email}</span>
                </div>
                <div className="billing-col">
                  <span className="col-label">Shipping / Delivery Address:</span>
                  <p className="ship-addr">
                    {activeSelectedOrder.shippingAddress.street},<br />
                    {activeSelectedOrder.shippingAddress.villageTaluka && <>{activeSelectedOrder.shippingAddress.villageTaluka},<br /></>}
                    {activeSelectedOrder.shippingAddress.city},<br />
                    {activeSelectedOrder.shippingAddress.state} — <strong>{activeSelectedOrder.shippingAddress.pinCode}</strong>
                  </p>
                </div>
              </div>

              <div className="bill-items-table-section">
                <table className="bill-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Description</th>
                      <th>SKU</th>
                      <th>Batch Number</th>
                      <th className="th-num">Rate</th>
                      <th className="th-num">Qty</th>
                      <th className="th-num">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSelectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td className="td-desc">{item.name}</td>
                        <td>{item.sku}</td>
                        <td>{item.batchNo}</td>
                        <td className="th-num">₹{item.price.toLocaleString("en-IN")}</td>
                        <td className="th-num">{item.qty}</td>
                        <td className="th-num">₹{(item.price * item.qty).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bill-footer-section">
                <div className="terms-col">
                  <span className="terms-hdr">Terms &amp; Conditions:</span>
                  <ul className="terms-list">
                    <li>Goods once sold will not be taken back or exchanged.</li>
                    <li>Subject to Bhavnagar jurisdiction.</li>
                    <li>This is a system generated e-invoice. No signature required.</li>
                  </ul>
                </div>
                <div className="totals-col">
                  <table className="bill-totals-table">
                    <tbody>
                      <tr>
                        <td>Subtotal:</td>
                        <td className="th-num">₹{activeSelectedOrder.totals.subtotal.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td>GST (5%):</td>
                        <td className="th-num">₹{activeSelectedOrder.totals.gst.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td>Delivery:</td>
                        <td className="th-num">
                          {activeSelectedOrder.totals.delivery > 0 ? `₹${activeSelectedOrder.totals.delivery}` : "₹0 (Free)"}
                        </td>
                      </tr>
                      {activeSelectedOrder.totals.discount > 0 && (
                        <tr className="discount-row">
                          <td>Discount:</td>
                          <td className="th-num">-₹{activeSelectedOrder.totals.discount.toLocaleString("en-IN")}</td>
                        </tr>
                      )}
                      <tr className="grand-row">
                        <td>Grand Total:</td>
                        <td className="th-num">₹{activeSelectedOrder.totals.grandTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bill-sign-area">
                <div className="seal">
                  <span>{companyDetails.brandName.toUpperCase()} SEAL</span>
                </div>
                <div className="signature-line">
                  <span>Authorized Signatory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          CREATE MANUAL ORDER MODAL WIZARD (7-STEP)
      ───────────────────────────────────────────── */}
      <AppModal
        visible={showCreateModal}
        onHide={handleCloseCreateModal}
        maskClassName="ord-modal-overlay"
        className="ord-modal-box wizard-box"
        dismissableMask={false}
      >
        <div className="ord-modal-hdr">
          <h3>Manual Order Creation Wizard — Step {wizardStep} of 7</h3>
          <AppButton className="ord-modal-close" onClick={handleCloseCreateModal}>
            <i className="pi pi-times" />
          </AppButton>
        </div>
        
        <div className="wizard-progress-bar">
          <div className="progress-fill" style={{ width: `${(wizardStep / 7) * 100}%` }} />
        </div>

        <div className="ord-modal-body wizard-body">
          {/* STEP 1: CUSTOMER SELECTION */}
          {wizardStep === 1 && (
            <div className="wizard-step-content">
              <h4>Select Customer Profile</h4>
              <p className="step-instructions">Search and select an active customer. Manually registered customers will show up here.</p>
              <div className="search-wrap-box">
                <i className="pi pi-search search-icon" />
                <AppInput
                  type="text"
                  className="wizard-search-input"
                  placeholder="Search customer by name or phone..."
                  value={custSearch}
                  onChange={(e) => setCustSearch(e.target.value)}
                />
              </div>
              <div className="wizard-results-list">
                {filteredWizardCustomers.length === 0 ? (
                  <p className="no-results">No active customers found. Please add a customer in the Customers module first.</p>
                ) : (
                  filteredWizardCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      className={`wizard-cust-card ${wizardCustomer?.id === cust.id ? "is-selected" : ""}`}
                      onClick={() => selectCustomerForWizard(cust)}
                    >
                      <div className="cust-avatar">{cust.name.charAt(0)}</div>
                      <div className="cust-details">
                        <span className="cust-name">{cust.name}</span>
                        <span className="cust-meta"><i className="pi pi-phone" /> {cust.mobile} | {cust.email || "No Email"}</span>
                      </div>
                      <i className="pi pi-chevron-right arrow" />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 2: PRODUCT Selection */}
          {wizardStep === 2 && (
            <div className="wizard-step-content">
              <h4>Product &amp; Quantity Selection</h4>
              <p className="step-instructions">Select Groundnut Oil variants and input quantities to build the order cart.</p>
              
              <div className="item-selection-form">
                <div className="form-row align-end">
                  <div className="form-group flex-2">
                    <label>Product Variant</label>
                    <AppSelect
                      className="wizard-select"
                      value={selectedProdId}
                      onChange={(e) => setSelectedProdId(e.value)}
                      options={[
                        { label: "-- Select Product --", value: "" },
                        ...CATALOG_PRODUCTS.map(p => ({ label: `${p.name} (₹${p.price})`, value: p.id }))
                      ]}
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>Quantity</label>
                    <AppInput
                      type="number"
                      className="wizard-input"
                      min="1"
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Math.max(1, Number(e.target.value)))}
                    />
                  </div>

                  <AppButton
                    type="button"
                    className="wizard-add-item-btn"
                    disabled={!selectedProdId}
                    onClick={handleAddItemToOrder}
                  >
                    Add to Cart
                  </AppButton>
                </div>
              </div>

                  <div className="wizard-cart-section">
                    <h5>Items in Order Cart ({wizardItems.length})</h5>
                    {wizardItems.length === 0 ? (
                      <div className="empty-cart-msg">No products added to this order yet.</div>
                    ) : (
                      <table className="wizard-cart-table">
                        <thead>
                          <tr>
                            <th>Product Description</th>
                            <th>SKU</th>
                            <th className="th-num">Rate</th>
                            <th className="th-num">Qty</th>
                            <th className="th-num">Total</th>
                            <th className="th-actions"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {wizardItems.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td><span className="sku-cell">{item.sku}</span></td>
                              <td className="td-num">₹{item.price}</td>
                              <td className="td-num"><strong>x{item.qty}</strong></td>
                              <td className="td-num">₹{item.price * item.qty}</td>
                              <td className="td-actions">
                                <AppButton type="button" className="remove-item-btn" onClick={() => handleRemoveItem(index)}>
                                  <i className="pi pi-trash" />
                                </AppButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: BATCH Selection */}
              {wizardStep === 3 && (
                <div className="wizard-step-content">
                  <h4>Assign Production Batches</h4>
                  <p className="step-instructions">Assign an active manufacturing batch with available stock for each selected product.</p>
                  
                  <div className="wizard-batches-list">
                    {wizardItems.map((item, index) => {
                      const productBatches = batches.filter(b => b.product === item.name && b.status === "Active" && b.availableQty > 0);
                      const assignedBatchObj = batches.find(b => b.batchNo === item.batchNo);
                      const isQtyExceeded = assignedBatchObj && item.qty > assignedBatchObj.availableQty;

                      return (
                        <div key={index} className="wizard-batch-assign-card" style={{ marginBottom: "15px", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <div className="item-info" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <div>
                              <span className="item-name" style={{ fontWeight: "600", color: "#1e293b", display: "block" }}>{item.name}</span>
                              <span className="item-sku" style={{ fontSize: "0.8rem", color: "#64748b" }}>SKU: {item.sku}</span>
                            </div>
                            <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>Ordered: {item.qty} units</span>
                          </div>
                          <div className="batch-selector-group">
                            <label style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "5px" }}>Select Production Batch</label>
                            <AppSelect
                              className="wizard-select"
                              value={item.batchNo || ""}
                              onChange={(e) => handleAssignBatch(index, e.value)}
                              options={[
                                { label: "-- Select Batch (Available Stock) --", value: "" },
                                ...productBatches.map(b => ({
                                  label: `${b.batchNo} (Available: ${b.availableQty} units) - Mfg: ${b.mfgDate}`,
                                  value: b.batchNo
                                }))
                              ]}
                            />
                            {productBatches.length === 0 && (
                              <span className="stock-alert-text error" style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "5px", display: "block" }}>
                                <i className="pi pi-exclamation-triangle mr-1"/> No active stock batches found!
                              </span>
                            )}
                            {item.batchNo && isQtyExceeded && (
                              <span className="stock-alert-text error" style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "5px", display: "block" }}>
                                <i className="pi pi-exclamation-triangle mr-1"/> Insufficient stock. Only {assignedBatchObj.availableQty} units available.
                              </span>
                            )}
                            {item.batchNo && !isQtyExceeded && (
                              <span className="stock-alert-text success" style={{ color: "#10b981", fontSize: "0.8rem", marginTop: "5px", display: "block" }}>
                                <i className="pi pi-check mr-1"/> Batch stock verified.
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: SHIPPING DETAILS */}
              {wizardStep === 4 && (
                <div className="wizard-step-content">
                  <h4>Delivery Address Details</h4>
                  <p className="step-instructions">Verify or edit shipping destination details for this transaction.</p>
                  
                  <div className="wizard-address-form">
                    <div className="form-group full-width">
                      <label>Street Address / Landmark</label>
                      <AppInput
                        type="text"
                        className="wizard-input"
                        placeholder="Flat/Office No., Building Name, Street Road"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>Area / Village</label>
                        <AppInput
                          type="text"
                          className="wizard-input"
                          placeholder="Area name or village name"
                          value={areaVillage}
                          onChange={(e) => setAreaVillage(e.target.value)}
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label>Taluka</label>
                        <AppInput
                          type="text"
                          className="wizard-input"
                          placeholder="Taluka"
                          value={taluka}
                          onChange={(e) => setTaluka(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label>District</label>
                        <AppInput
                          type="text"
                          className="wizard-input"
                          placeholder="District"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label>State</label>
                        <AppInput
                          type="text"
                          className="wizard-input"
                          placeholder="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label>Pin Code</label>
                        <AppInput
                          type="text"
                          className="wizard-input"
                          placeholder="6 Digit PIN"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT MODE */}
              {wizardStep === 5 && (
                <div className="wizard-step-content">
                  <h4>Billing &amp; Payment Options</h4>
                  <p className="step-instructions">Select a payment mode. Pay Later orders are subject to credit availability checks.</p>
                  
                  <div className="wizard-billing-form">
                    <div className="form-group">
                      <label>Payment Method</label>
                      <AppSelect
                        className="wizard-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.value)}
                        options={[
                          { label: "Cash Sale", value: "Cash" },
                          { label: "UPI Transaction", value: "UPI" },
                          { label: "Cash On Delivery (COD)", value: "COD" },
                          { label: "Pay Later (Credit line)", value: "Pay Later" }
                        ]}
                      />
                    </div>

                    {/* Pay Later checks */}
                    {paymentMethod === "Pay Later" && wizardCustomer && (
                      <div className="pay-later-audit-card" style={{ marginTop: "20px", padding: "15px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc" }}>
                        <h5 style={{ fontWeight: "600", fontSize: "0.95rem", marginBottom: "10px", color: "#0f172a" }}>Pay Later Ledger Audit</h5>
                        <div className="audit-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                          <span>Pay Later Enabled:</span>
                          <strong className={wizardCustomer.payLaterActive ? "text-green" : "text-red"}>
                            {wizardCustomer.payLaterActive ? "YES" : "NO"}
                          </strong>
                        </div>
                        <div className="audit-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                          <span>Credit Limit:</span>
                          <strong>₹{wizardCustomer.payLaterLimit.toLocaleString("en-IN")}</strong>
                        </div>
                        <div className="audit-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                          <span>Outstanding Balance:</span>
                          <strong className="text-red">₹{wizardCustomer.payLaterBalance.toLocaleString("en-IN")}</strong>
                        </div>
                        <div className="audit-row border-top" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0 0", borderTop: "1px solid #e2e8f0", marginTop: "8px", marginBottom: "8px", fontSize: "0.85rem" }}>
                          <span>Remaining Credit:</span>
                          <strong className="text-green">
                            ₹{Math.max(0, wizardCustomer.payLaterLimit - wizardCustomer.payLaterBalance).toLocaleString("en-IN")}
                          </strong>
                        </div>
                        <div className="audit-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "0.85rem" }}>
                          <span>Order Total:</span>
                          <strong>₹{orderGrandTotal.toLocaleString("en-IN")}</strong>
                        </div>
                        
                        {!wizardCustomer.payLaterActive ? (
                          <div className="audit-alert alert-red" style={{ padding: "10px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "6px", fontSize: "0.8rem", display: "flex", alignItems: "center" }}>
                            <i className="pi pi-ban mr-2" /> Pay Later is NOT enabled for this customer.
                          </div>
                        ) : !creditCheckPass ? (
                          <div className="audit-alert alert-red" style={{ padding: "10px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "6px", fontSize: "0.8rem", display: "flex", alignItems: "center" }}>
                            <i className="pi pi-exclamation-triangle mr-2" /> Insufficient remaining credit limit to complete this order.
                          </div>
                        ) : (
                          <div className="audit-alert alert-green" style={{ padding: "10px", backgroundColor: "#ecfdf5", color: "#065f46", borderRadius: "6px", fontSize: "0.8rem", display: "flex", alignItems: "center" }}>
                            <i className="pi pi-check mr-2" /> Credit check successful. Eligible for Pay Later order.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: BILL BREAKDOWN SUMMARY */}
              {wizardStep === 6 && (
                <div className="wizard-step-content">
                  <h4>Review &amp; Place Order</h4>
                  <p className="step-instructions">Review the order summary sheet, apply any optional discount, and confirm the sale.</p>
                  
                  <div className="wizard-confirmation-sheet">
                    <div className="sheet-section">
                      <h5>Customer &amp; Shipment Info</h5>
                      <p>
                        <strong>Name:</strong> {wizardCustomer.name} | <strong>Mobile:</strong> {wizardCustomer.mobile}<br />
                        <strong>Address:</strong> {street}, {areaVillage ? `${areaVillage}, ` : ""}{taluka ? `${taluka}, ` : ""}{district}, {state} - {pinCode}
                      </p>
                    </div>

                    <div className="sheet-section">
                      <h5>Ordered Products &amp; Batches</h5>
                      <ul className="sheet-items-list">
                        {wizardItems.map((item, idx) => (
                          <li key={idx} className="sheet-item-line">
                            <span>{item.name} (SKU: {item.sku}, Batch: {item.batchNo})</span>
                            <span><strong>x{item.qty}</strong> — ₹{item.price * item.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="sheet-section totals-section">
                      <div className="form-group" style={{ marginBottom: "15px" }}>
                        <label style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "5px" }}>
                          Discount Amount (₹)
                        </label>
                        <AppInput
                          type="number"
                          className="wizard-input"
                          style={{ padding: "8px", fontSize: "0.9rem" }}
                          placeholder="Enter discount in rupees"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                        />
                      </div>

                      <div className="row-val"><span>Subtotal:</span> <span>₹{orderSubtotal.toLocaleString("en-IN")}</span></div>
                      <div className="row-val"><span>GST (5%):</span> <span>₹{orderGst.toLocaleString("en-IN")}</span></div>
                      <div className="row-val"><span>Delivery Charge:</span> <span>₹{orderDelivery.toLocaleString("en-IN")}</span></div>
                      {Number(discountAmount) > 0 && (
                        <div className="row-val text-green"><span>Discount Applied:</span> <span>-₹{Number(discountAmount).toLocaleString("en-IN")}</span></div>
                      )}
                      <hr />
                      <div className="row-val grand-row">
                        <span>Grand Total:</span> <span>₹{orderGrandTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="sheet-section payment-section">
                      <p>
                        <strong>Payment Mode:</strong> <span className="highlight-tag">{paymentMethod}</span><br />
                        <strong>Immediate Status:</strong> <span className="highlight-tag">{paymentMethod === "Pay Later" || paymentMethod === "COD" ? "Pending / Invoice Issued" : "Paid"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: ORDER CONFIRMATION SUCCESS */}
              {wizardStep === 7 && createdOrder && (
                <div className="wizard-step-content success-step" style={{ textAlign: "center", padding: "30px 10px" }}>
                  <div className="success-icon-wrapper" style={{ fontSize: "4rem", color: "#10b981", marginBottom: "15px" }}>
                    <i className="pi pi-check-circle" />
                  </div>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>Order Created Successfully!</h4>
                  <p className="success-msg" style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "25px" }}>Direct counter sales order has been logged and synced with inventory and batch logs.</p>
                  
                  <div className="success-details-card" style={{ padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", maxWidth: "400px", margin: "0 auto 30px auto" }}>
                    <div className="success-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                      <span>Order ID:</span>
                      <strong>{createdOrder.id}</strong>
                    </div>
                    <div className="success-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                      <span>Customer:</span>
                      <strong>{createdOrder.customer.name}</strong>
                    </div>
                    <div className="success-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                      <span>Total Amount:</span>
                      <strong>₹{createdOrder.totals.grandTotal.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="success-row" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span>Payment Method:</span>
                      <strong>{createdOrder.paymentMethod}</strong>
                    </div>
                  </div>

                  <div className="success-action-buttons">
                    <AppButton
                      type="button"
                      className="print-invoice-action-btn"
                      style={{ padding: "12px 24px", backgroundColor: "#851717", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                      onClick={() => {
                        setSelectedOrder(createdOrder);
                        setShowInvoicePrint(true);
                      }}
                    >
                      <i className="pi pi-print mr-2" /> View &amp; Print Invoice
                    </AppButton>
                  </div>
                </div>
              )}
        </div>

        <div className="ord-modal-footer wizard-footer">
          <div className="footer-left">
            {wizardStep > 1 && wizardStep < 7 && (
              <AppButton type="button" className="wizard-back-btn" onClick={() => setWizardStep(wizardStep - 1)}>
                <i className="pi pi-arrow-left mr-2" /> Back
              </AppButton>
            )}
          </div>
          <div className="footer-right" style={{ display: "flex", gap: "10px" }}>
            {wizardStep < 7 ? (
              <AppButton type="button" className="wizard-cancel-btn" onClick={handleCloseCreateModal}>
                Cancel
              </AppButton>
            ) : null}

            {wizardStep < 6 ? (
              <AppButton
                type="button"
                className="wizard-next-btn"
                disabled={
                  (wizardStep === 1 && !wizardCustomer) ||
                  (wizardStep === 2 && wizardItems.length === 0) ||
                  (wizardStep === 3 && !isStep3Valid) ||
                  (wizardStep === 5 && paymentMethod === "Pay Later" && !creditCheckPass)
                }
                onClick={() => setWizardStep(wizardStep + 1)}
              >
                Next <i className="pi pi-arrow-right ml-2" />
              </AppButton>
            ) : wizardStep === 6 ? (
              <AppButton
                type="button"
                className="wizard-submit-btn"
                onClick={handleSubmitManualOrder}
              >
                Confirm &amp; Place Order
              </AppButton>
            ) : (
              <AppButton
                type="button"
                className="wizard-done-btn"
                style={{ padding: "8px 20px", backgroundColor: "#851717", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}
                onClick={handleCloseCreateModal}
              >
                Done
              </AppButton>
            )}
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default OrdersView;
