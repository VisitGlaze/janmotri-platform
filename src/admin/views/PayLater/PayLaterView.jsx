import React, { useState, useMemo } from "react";
import { useAdminStore } from "../../../shared/useAdminStore";
import { PAY_LATER_STATUSES, getPayLaterSummary } from "./payLaterData";
import AppButton from "../../../shared/components/ui/AppButton";
import AppInput from "../../../shared/components/ui/AppInput";
import AppSelect from "../../../shared/components/ui/AppSelect";
import AppModal from "../../../shared/components/ui/AppModal";
import AppToast from "../../../shared/components/ui/AppToast";
import AppTextarea from "../../../shared/components/ui/AppTextarea";
import "./PayLaterView.scss";

// Mini SVG Sparkline Trend Graph helper
const MiniTrendLine = ({ color, points }) => (
  <svg className="pl-mini-trend-chart" viewBox="0 0 100 30" width="80" height="24">
    <path
      d={`M ${points.map((p, i) => `${(i * 100) / (points.length - 1)} ${30 - p}`).join(" L ")}`}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Sells/Repayments remaining days urgency badge helper
const RemainingDaysBadge = ({ days, status }) => {
  if (status === "Rejected Requests") return <span className="pl-days-muted">—</span>;
  if (status === "Payment History") return <span className="pl-days-badge settled">Settled</span>;

  if (days < 0) {
    return <span className="pl-days-badge overdue">{Math.abs(days)} days overdue</span>;
  }
  if (days <= 3) {
    return <span className="pl-days-badge critical">{days} days left</span>;
  }
  return <span className="pl-days-badge safe">{days} days remaining</span>;
};

const PayLaterView = () => {
  const records = useAdminStore((state) => state.payLater);
  const addPayLaterCustomer = useAdminStore((state) => state.addPayLaterCustomer);
  const approvePayLaterRequest = useAdminStore((state) => state.approvePayLaterRequest);
  const rejectPayLaterRequest = useAdminStore((state) => state.rejectPayLaterRequest);
  const receivePayLaterRepayment = useAdminStore((state) => state.receivePayLaterRepayment);

  const [activeTab, setActiveTab] = useState("Pending Requests");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filters State
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  // Toast State for actions feedback
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Add Customer Form State
  const [newCustName, setNewCustName] = useState("");
  const [newCustBusiness, setNewCustBusiness] = useState("");
  const [newCustMobile, setNewCustMobile] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustType, setNewCustType] = useState("Retail Customer");
  const [newCustLimit, setNewCustLimit] = useState(20000);
  const [newCustPeriod, setNewCustPeriod] = useState("30 Days");
  const [newCustTerms, setNewCustTerms] = useState("Full Pay Later");
  const [newCustStatus, setNewCustStatus] = useState("Active");

  // Approval Form State
  const [approvedLimit, setApprovedLimit] = useState(25000);
  const [creditTerms, setCreditTerms] = useState(30);

  // Rejection Form State
  const [rejectReason, setRejectReason] = useState("");

  // Payment Form State
  const [payAmount, setPayAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [paymentRef, setPaymentRef] = useState("");

  // Credit Control settings
  const [autoBlockLimit, setAutoBlockLimit] = useState(true);
  const [autoBlockDueDate, setAutoBlockDueDate] = useState(true);
  const [allowTempExtension, setAllowTempExtension] = useState(false);

  // Detail Drawer Internal Active Tab
  const [drawerActiveTab, setDrawerActiveTab] = useState("overview");

  // Collections Tab Sub-Filter
  const [collectionSubTab, setCollectionSubTab] = useState("Pending");

  // Reports Tab Active Report
  const [selectedReport, setSelectedReport] = useState("Outstanding Report");

  // Sync selectedRequest details if state updates
  const activeSelectedRequest = useMemo(() => {
    if (!selectedRequest) return null;
    return records.find(r => r.id === selectedRequest.id) || selectedRequest;
  }, [records, selectedRequest]);

  // Trigger Action feedback Toast
  const showToastMsg = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  // Summary calculator
  const summary = useMemo(() => getPayLaterSummary(records), [records]);

  // Filter Logic for Credit Ledger
  const filteredRecords = useMemo(() => {
    let list = [...records];

    // Core tab filter (only if not viewing Collections/Reports tabs)
    if (activeTab !== "Collections" && activeTab !== "Reports") {
      list = list.filter((r) => r.status === activeTab);
    }

    // Customer type filter
    if (typeFilter !== "All") {
      list = list.filter((r) => r.customerType === typeFilter);
    }

    // Account status filter
    if (statusFilter !== "All") {
      list = list.filter((r) => r.accountStatus === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.businessName.toLowerCase().includes(q) ||
          r.mobile.includes(q) ||
          (r.orderNumber && r.orderNumber.toLowerCase().includes(q))
      );
    }
    return list;
  }, [records, activeTab, search, typeFilter, statusFilter]);

  // Flattened Collection records list for the Collections Tab
  const allCollectionsList = useMemo(() => {
    const list = [];
    records.forEach((r) => {
      if (r.collections && r.collections.length > 0) {
        r.collections.forEach((c) => {
          list.push({
            ...c,
            customerName: r.customerName,
            businessName: r.businessName,
            mobile: r.mobile,
            parentRecord: r
          });
        });
      }
    });
    return list.filter((c) => c.status === collectionSubTab);
  }, [records, collectionSubTab]);

  // Handle Add Customer Submission
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustName || !newCustMobile || !newCustLimit) {
      showToastMsg("Please fill out all required fields.", "error");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const newAcc = {
      customerName: newCustName,
      businessName: newCustBusiness || newCustName,
      mobile: newCustMobile,
      email: newCustEmail || "N/A",
      customerType: newCustType,
      creditLimit: Number(newCustLimit),
      paymentTerms: newCustTerms,
      status: newCustStatus === "Active" ? "Approved Requests" : newCustStatus === "Suspended" ? "Rejected Requests" : "Pending Requests",
      accountStatus: newCustStatus,
      notes: "Direct account creation from admin console."
    };

    addPayLaterCustomer(newAcc);
    setShowAddModal(false);
    showToastMsg(`Pay Later profile for "${newCustName}" created successfully!`);

    // Reset Form States
    setNewCustName("");
    setNewCustBusiness("");
    setNewCustMobile("");
    setNewCustEmail("");
    setNewCustType("Retail Customer");
    setNewCustLimit(20000);
    setNewCustPeriod("30 Days");
    setNewCustTerms("Full Pay Later");
    setNewCustStatus("Active");
  };

  // Handle Approve Action
  const handleApprove = () => {
    if (!selectedRequest) return;
    approvePayLaterRequest(selectedRequest.id, approvedLimit, creditTerms);
    setShowApproveModal(false);
    setSelectedRequest(null);
    showToastMsg("Credit terms approved successfully.");
  };

  // Handle Reject Action
  const handleReject = () => {
    if (!selectedRequest || !rejectReason.trim()) return;
    rejectPayLaterRequest(selectedRequest.id, rejectReason);
    setShowRejectModal(false);
    setSelectedRequest(null);
    showToastMsg("Credit request rejected.", "error");
  };

  // Handle Log Payment Action
  const handleLogPayment = () => {
    if (!selectedRequest || Number(payAmount) <= 0) return;
    receivePayLaterRepayment(selectedRequest.id, payAmount, paymentMode, paymentRef);
    setShowPayModal(false);
    setSelectedRequest(null);
    showToastMsg(`Repayment of ₹${payAmount} logged successfully.`);
  };

  // Action Dispatcher for manual reminder warnings (SMS / Email / WhatsApp)
  const triggerReminder = (medium, customer) => {
    showToastMsg(`${medium} notification warning dispatched to ${customer.customerName}!`);
  };

  // Client-Side CSV Reports downloader
  const handleExportCSV = (reportType) => {
    let headers = [];
    let rows = [];
    let filename = reportType.toLowerCase().replace(/ /g, "_");

    if (reportType === "Outstanding Report") {
      headers = ["Customer Name", "Business Name", "Customer Type", "Outstanding Balance", "Credit Limit", "Due Date"];
      rows = records
        .filter(r => r.outstandingAmount > 0)
        .map(r => [r.customerName, r.businessName, r.customerType, r.outstandingAmount, r.creditLimit, r.dueDate || "N/A"]);
    } else if (reportType === "Collection Report") {
      headers = ["Collection ID", "Customer Name", "Due Date", "Amount Scheduled", "Collection Status", "Terms Type"];
      records.forEach(r => {
        if (r.collections) {
          r.collections.forEach(c => {
            rows.push([c.id, r.customerName, c.date, c.amount, c.status, c.type]);
          });
        }
      });
    } else if (reportType === "Overdue Report") {
      headers = ["Customer Name", "Mobile", "Overdue Balance", "Days Overdue", "Due Date"];
      rows = records
        .filter(r => r.status === "Overdue Payments")
        .map(r => [r.customerName, r.mobile, r.outstandingAmount, Math.abs(r.remainingDays), r.dueDate]);
    } else {
      // Default Credit Usage
      headers = ["Customer Name", "Credit Limit", "Credit Utilized (₹)", "Credit Available (₹)", "Account Status"];
      rows = records.map(r => [r.customerName, r.creditLimit || 0, r.usedCredit || 0, r.availableCredit || 0, r.accountStatus]);
    }

    const content = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMsg(`Report "${reportType}" downloaded successfully!`);
  };

  // Helper metrics trends points
  const activeRecords = records.filter(r => r.status !== "Rejected Requests");

  return (
    <div className="admin-view-container pl-root">

      {/* Toast popup */}
      <AppToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ show: false, message: "", type: "success" })}
      />

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Enterprise Credit Management</h1>
          <p className="admin-page-subtitle">Configure limits, manage default risks, send automated invoicing alerts, and log payments.</p>
        </div>
        <AppButton className="admin-action-btn pl-upgrade-btn" onClick={() => setShowAddModal(true)}>
          <i className="pi pi-user-plus mr-2" /> Add Pay Later Customer
        </AppButton>
      </div>

      {/* Analytics Cards Grid */}
      <div className="pl-kpi-grid upgraded-analytics-grid">
        <div className="pl-kpi-card analytical">
          <div className="card-top">
            <div className="pl-kpi-icon bg-blue">
              <i className="pi pi-users" />
            </div>
            <MiniTrendLine color="#2563eb" points={[15, 18, 14, 22, 28, 25]} />
          </div>
          <div className="pl-kpi-details">
            <span className="pl-kpi-label">Total Credit Customers</span>
            <span className="pl-kpi-value">{summary.totalCreditCustomers}</span>
            <span className="pl-kpi-sub text-green"><i className="pi pi-arrow-up" /> +8.2% vs last month</span>
          </div>
        </div>

        <div className="pl-kpi-card analytical">
          <div className="card-top">
            <div className="pl-kpi-icon bg-gold">
              <i className="pi pi-briefcase" />
            </div>
            <MiniTrendLine color="#b45309" points={[10, 15, 12, 18, 22, 20]} />
          </div>
          <div className="pl-kpi-details">
            <span className="pl-kpi-label">Total Credit Issued</span>
            <span className="pl-kpi-value">₹{summary.totalCreditIssued.toLocaleString("en-IN")}</span>
            <span className="pl-kpi-sub text-green"><i className="pi pi-arrow-up" /> +14.5% new credit limit</span>
          </div>
        </div>

        <div className="pl-kpi-card analytical">
          <div className="card-top">
            <div className="pl-kpi-icon bg-amber">
              <i className="pi pi-wallet" />
            </div>
            <MiniTrendLine color="#d97706" points={[20, 16, 22, 14, 18, 15]} />
          </div>
          <div className="pl-kpi-details">
            <span className="pl-kpi-label">Outstanding Amount</span>
            <span className="pl-kpi-value">₹{summary.outstandingAmount.toLocaleString("en-IN")}</span>
            <span className="pl-kpi-sub text-amber"><i className="pi pi-info-circle" /> Active invoices</span>
          </div>
        </div>

        <div className="pl-kpi-card analytical">
          <div className="card-top">
            <div className="pl-kpi-icon bg-red">
              <i className="pi pi-exclamation-triangle" />
            </div>
            <MiniTrendLine color="#dc2626" points={[5, 10, 8, 12, 6, 9]} />
          </div>
          <div className="pl-kpi-details">
            <span className="pl-kpi-label">Overdue Amount</span>
            <span className="pl-kpi-value">₹{summary.overdueAmount.toLocaleString("en-IN")}</span>
            <span className="pl-kpi-sub text-danger"><i className="pi pi-arrow-up" /> Passed pay terms</span>
          </div>
        </div>

        <div className="pl-kpi-card analytical">
          <div className="card-top">
            <div className="pl-kpi-icon bg-green">
              <i className="pi pi-chart-line" />
            </div>
            <MiniTrendLine color="#16a34a" points={[10, 12, 15, 20, 22, 28]} />
          </div>
          <div className="pl-kpi-details">
            <span className="pl-kpi-label">Monthly Collection</span>
            <span className="pl-kpi-value">₹{summary.monthlyCollection.toLocaleString("en-IN")}</span>
            <span className="pl-kpi-sub text-green"><i className="pi pi-arrow-up" /> +19.3% in repayments</span>
          </div>
        </div>

        <div className="pl-kpi-card analytical">
          <div className="card-top">
            <div className="pl-kpi-icon bg-blue">
              <i className="pi pi-refresh" />
            </div>
            <MiniTrendLine color="#2563eb" points={[25, 26, 27, 28, 29, 30]} />
          </div>
          <div className="pl-kpi-details">
            <span className="pl-kpi-label">Recovery Rate</span>
            <span className="pl-kpi-value">{summary.recoveryRate}%</span>
            <span className="pl-kpi-sub text-green"><i className="pi pi-check" /> Clean collection curve</span>
          </div>
        </div>

        <div className="pl-kpi-card analytical">
          <div className="card-top">
            <div className="pl-kpi-icon bg-gold">
              <i className="pi pi-shield" />
            </div>
            <MiniTrendLine color="#b45309" points={[8, 10, 9, 11, 10, 12]} />
          </div>
          <div className="pl-kpi-details">
            <span className="pl-kpi-label">Active Credit Accounts</span>
            <span className="pl-kpi-value">{summary.activeCreditAccounts}</span>
            <span className="pl-kpi-sub text-green"><i className="pi pi-arrow-up" /> +2 new approved accounts</span>
          </div>
        </div>

        <div className="pl-kpi-card analytical">
          <div className="card-top">
            <div className="pl-kpi-icon bg-red">
              <i className="pi pi-ban" />
            </div>
            <MiniTrendLine color="#dc2626" points={[12, 10, 15, 8, 5, 2]} />
          </div>
          <div className="pl-kpi-details">
            <span className="pl-kpi-label">High-Risk Customers</span>
            <span className="pl-kpi-value">{summary.highRiskCustomers}</span>
            <span className="pl-kpi-sub text-green"><i className="pi pi-arrow-down" /> -1 suspended this week</span>
          </div>
        </div>
      </div>

      {/* Credit Control Settings Panel */}
      <div className="widget-card pl-credit-control-panel">
        <h3 className="control-title"><i className="pi pi-cog mr-2" /> Global Credit Control Policies</h3>
        <div className="controls-grid">
          <label className="control-checkbox-item">
            <input
              type="checkbox"
              checked={autoBlockLimit}
              onChange={(e) => setAutoBlockLimit(e.target.checked)}
            />
            <div className="control-lbl-group">
              <span className="lbl-title">Auto-Block Orders When Credit Limit Exceeded</span>
              <span className="lbl-desc">System prevents order placement if utilization breaches the limit.</span>
            </div>
          </label>
          <label className="control-checkbox-item">
            <input
              type="checkbox"
              checked={autoBlockDueDate}
              onChange={(e) => setAutoBlockDueDate(e.target.checked)}
            />
            <div className="control-lbl-group">
              <span className="lbl-title">Auto-Block Orders After Due Date Breach</span>
              <span className="lbl-desc">Automatically locks placing orders if any invoice is overdue.</span>
            </div>
          </label>
          <label className="control-checkbox-item">
            <input
              type="checkbox"
              checked={allowTempExtension}
              onChange={(e) => setAllowTempExtension(e.target.checked)}
            />
            <div className="control-lbl-group">
              <span className="lbl-title">Allow Temporary Credit Extensions</span>
              <span className="lbl-desc">Gives sales reps 5 days grace timeline buffer under custom rules.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Tabs Row & Filters toolbar */}
      <div className="admin-sticky-action-bar">

        {/* Navigation Tabs */}
        <div className="pl-tabs-nav">
          {PAY_LATER_STATUSES.map((status) => {
            let badgeVal = 0;
            if (status === "Pending Requests") badgeVal = records.filter(r => r.status === "Pending Requests").length;
            else if (status === "Approved Requests") badgeVal = records.filter(r => r.status === "Approved Requests").length;
            else if (status === "Rejected Requests") badgeVal = records.filter(r => r.status === "Rejected Requests").length;
            else if (status === "Overdue Payments") badgeVal = records.filter(r => r.status === "Overdue Payments").length;
            else if (status === "Payment History") badgeVal = records.filter(r => r.status === "Payment History").length;
            else if (status === "Collections") {
              badgeVal = records.reduce((sum, r) => sum + (r.collections ? r.collections.filter(c => c.status === "Pending" || c.status === "Upcoming").length : 0), 0);
            } else if (status === "Reports") badgeVal = 5;

            return (
              <button
                key={status}
                className={`pl-tab-btn ${activeTab === status ? "is-active" : ""}`}
                onClick={() => setActiveTab(status)}
              >
                <span>{status}</span>
                <span className="pl-tab-badge">{badgeVal}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar with Search and Advanced Filters */}
        <div className="widget-card pl-toolbar">
          <div className="pl-toolbar-flex">

            <div className="pl-search-wrap">
              <i className="pi pi-search pl-search-icon" />
              <AppInput
                type="text"
                className="pl-search-input"
                placeholder={activeTab === "Collections" ? "Search Collections by customer..." : "Search by name, business, UTR reference..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <AppButton className="pl-search-clear" onClick={() => setSearch("")}>
                  <i className="pi pi-times" />
                </AppButton>
              )}
            </div>

            {activeTab !== "Reports" && (
              <div className="pl-filters-row">

                <div className="pl-filter-item">
                  <label>Type</label>
                  <AppSelect
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.value)}
                    className="pl-select-filter"
                    options={[
                      { label: "All Types", value: "All" },
                      { label: "Retail", value: "Retail Customer" },
                      { label: "Wholesale", value: "Wholesale Customer" },
                      { label: "Distributor", value: "Distributor" },
                      { label: "Corporate", value: "Corporate Customer" }
                    ]}
                  />
                </div>

                <div className="pl-filter-item">
                  <label>Status</label>
                  <AppSelect
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.value)}
                    className="pl-select-filter"
                    options={[
                      { label: "All Statuses", value: "All" },
                      { label: "Active", value: "Active" },
                      { label: "Suspended", value: "Suspended" },
                      { label: "Blocked", value: "Blocked" }
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          RENDER TAB: CREDIT LEDGER & DIRECTORY LISTS
      ───────────────────────────────────────────── */}
      {activeTab !== "Collections" && activeTab !== "Reports" && (
        <div className="widget-card pl-table-card">
          <div className="pl-table-header">
            <span className="pl-table-title">
              Credit Customer Accounts Directory <span className="pl-count-chip">{filteredRecords.length}</span>
            </span>
          </div>
          <div className="table-responsive">
            <table className="pl-table">
              <thead>
                <tr>
                  <th>Customer Profile</th>
                  <th className="th-num">Credit Limit</th>
                  <th className="th-num">Used Credit</th>
                  <th className="th-num">Available Credit</th>
                  <th className="th-num">Outstanding Amount</th>
                  <th>Deadlines</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((req) => (
                  <tr key={req.id} className="pl-table-row">
                    <td className="td-cust">
                      <div className="pl-cust-cell">
                        <span className="pl-cust-name">{req.customerName}</span>
                        <span className="pl-cust-business">{req.businessName} <span className="pl-type-lbl">• {req.customerType.split(" ")[0]}</span></span>
                        <span className="pl-cust-mobile">{req.mobile}</span>
                      </div>
                    </td>
                    <td className="td-num">
                      <span className="pl-limit-val">₹{req.creditLimit ? req.creditLimit.toLocaleString("en-IN") : "—"}</span>
                    </td>
                    <td className="td-num text-red">
                      <span>₹{(req.usedCredit || 0).toLocaleString("en-IN")}</span>
                    </td>
                    <td className="td-num text-green">
                      <span>₹{(req.availableCredit || 0).toLocaleString("en-IN")}</span>
                    </td>
                    <td className="td-num">
                      <strong className="pl-amount">₹{req.outstandingAmount.toLocaleString("en-IN")}</strong>
                    </td>
                    <td>
                      <RemainingDaysBadge days={req.remainingDays} status={req.status} />
                      <span className="pl-due-date-lbl">Due: {req.dueDate || "—"}</span>
                    </td>
                    <td className="text-right">
                      <div className="pl-actions-group">
                        {req.status === "Pending Requests" && (
                          <>
                            <AppButton
                              className="pl-action-btn btn-approve"
                              onClick={() => {
                                setSelectedRequest(req);
                                setApprovedLimit(req.orderAmount || 25000);
                                setShowApproveModal(true);
                              }}
                            >
                              Approve
                            </AppButton>
                            <AppButton
                              className="pl-action-btn btn-reject"
                              onClick={() => {
                                setSelectedRequest(req);
                                setRejectReason("");
                                setShowRejectModal(true);
                              }}
                            >
                              Reject
                            </AppButton>
                          </>
                        )}

                        {req.outstandingAmount > 0 && (
                          <AppButton
                            className="pl-action-btn btn-pay"
                            onClick={() => {
                              setSelectedRequest(req);
                              setPayAmount(req.outstandingAmount);
                              setPaymentRef("");
                              setShowPayModal(true);
                            }}
                          >
                            Repay
                          </AppButton>
                        )}

                        <AppButton
                          className="pl-action-btn btn-view-history"
                          onClick={() => {
                            setSelectedRequest(req);
                            setDrawerActiveTab("overview");
                          }}
                        >
                          View Details
                        </AppButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRecords.length === 0 && (
            <div className="pl-empty">
              <i className="pi pi-users" />
              <p>No credit customer profiles match these filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          RENDER TAB: COLLECTIONS MANAGEMENT
      ───────────────────────────────────────────── */}
      {activeTab === "Collections" && (
        <div className="pl-collections-view">

          {/* Collection Status Category Subtabs */}
          <div className="collection-subtabs">
            {["Pending", "Upcoming", "Collected", "Failed"].map((sub) => {
              const count = records.reduce((sum, r) => sum + (r.collections ? r.collections.filter(c => c.status === sub).length : 0), 0);
              return (
                <button
                  key={sub}
                  className={`collection-subtab-btn ${collectionSubTab === sub ? "is-active" : ""}`}
                  onClick={() => setCollectionSubTab(sub)}
                >
                  <span>{sub} Collections</span>
                  <span className="count-pill">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Collections list card grid */}
          <div className="collections-grid">
            {allCollectionsList.map((c) => (
              <div key={c.id} className="collection-item-card">
                <div className="card-lbl-row">
                  <span className="collection-id">{c.id}</span>
                  <span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span>
                </div>
                <div className="customer-meta">
                  <h4>{c.customerName}</h4>
                  <p>{c.businessName} • {c.mobile}</p>
                </div>
                <div className="billing-meta">
                  <div className="meta-val">
                    <span className="lbl">Scheduled Amount</span>
                    <strong className="val">₹{c.amount.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="meta-val text-right">
                    <span className="lbl">Target Deadline</span>
                    <span className="val-date">{c.date}</span>
                  </div>
                </div>
                <div className="collection-footer">
                  <span className="terms-lbl"><i className="pi pi-tag" /> {c.type}</span>
                  <div className="collection-actions">
                    {c.status === "Failed" && (
                      <AppButton className="collection-btn retry" onClick={() => showToastMsg(`Retrying online autopay collection for UTR ID: ${c.id}...`)}>
                        <i className="pi pi-refresh" /> Retry
                      </AppButton>
                    )}
                    {(c.status === "Pending" || c.status === "Upcoming") && (
                      <>
                        <AppButton className="collection-btn remind" onClick={() => triggerReminder("WhatsApp", c)}>
                          <i className="pi pi-whatsapp" /> Remind
                        </AppButton>
                        <AppButton className="collection-btn collect" onClick={() => {
                          setSelectedRequest(c.parentRecord);
                          setPayAmount(c.amount);
                          setPaymentRef("");
                          setShowPayModal(true);
                        }}>
                          Log Payment
                        </AppButton>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {allCollectionsList.length === 0 && (
              <div className="widget-card pl-empty col-span-full">
                <i className="pi pi-wallet" />
                <p>No collections found in this status category.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          RENDER TAB: REPORTS MODULE
      ───────────────────────────────────────────── */}
      {activeTab === "Reports" && (
        <div className="pl-reports-view">
          <div className="reports-sidebar-layout">

            {/* Sidebar list of reports */}
            <div className="reports-menu-card widget-card">
              <h3>Select Financial Credit Report</h3>
              <ul className="reports-menu-list">
                {[
                  "Outstanding Report",
                  "Collection Report",
                  "Customer Ledger Report",
                  "Overdue Report",
                  "Credit Usage Report"
                ].map((repName) => (
                  <li key={repName}>
                    <button
                      className={`report-menu-btn ${selectedReport === repName ? "is-active" : ""}`}
                      onClick={() => setSelectedReport(repName)}
                    >
                      <i className="pi pi-file mr-2" />
                      <span>{repName}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Report Preview area */}
            <div className="report-content-card widget-card">
              <div className="report-hdr-actions">
                <div>
                  <h3 className="report-title">{selectedReport} Preview</h3>
                  <p className="report-desc">Previewing active credit rows compiled dynamically for analysis.</p>
                </div>
                <div className="report-exports">
                  <AppButton className="export-btn pdf" onClick={() => handleExportCSV(selectedReport)}>
                    <i className="pi pi-file-pdf" /> PDF
                  </AppButton>
                  <AppButton className="export-btn excel" onClick={() => handleExportCSV(selectedReport)}>
                    <i className="pi pi-file-excel" /> Excel
                  </AppButton>
                  <AppButton className="export-btn csv" onClick={() => handleExportCSV(selectedReport)}>
                    <i className="pi pi-file" /> CSV
                  </AppButton>
                </div>
              </div>

              {/* Table Preview */}
              <div className="table-responsive" style={{ marginTop: '20px' }}>
                {selectedReport === "Outstanding Report" && (
                  <table className="pl-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Type</th>
                        <th className="th-num">Outstanding</th>
                        <th className="th-num">Limit</th>
                        <th>Deadline Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.filter(r => r.outstandingAmount > 0).map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.customerName}</strong></td>
                          <td>{r.customerType}</td>
                          <td className="td-num">₹{r.outstandingAmount.toLocaleString("en-IN")}</td>
                          <td className="td-num">₹{r.creditLimit.toLocaleString("en-IN")}</td>
                          <td>{r.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedReport === "Collection Report" && (
                  <table className="pl-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Date Scheduled</th>
                        <th className="th-num">Amount</th>
                        <th>Status</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.flatMap(r => r.collections ? r.collections.map(c => ({ ...c, name: r.customerName })) : []).map((col, idx) => (
                        <tr key={idx}>
                          <td>{col.id}</td>
                          <td><strong>{col.name}</strong></td>
                          <td>{col.date}</td>
                          <td className="td-num">₹{col.amount.toLocaleString("en-IN")}</td>
                          <td><span className={`status-pill ${col.status.toLowerCase()}`}>{col.status}</span></td>
                          <td>{col.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedReport === "Overdue Report" && (
                  <table className="pl-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Mobile</th>
                        <th className="th-num">Overdue Amount</th>
                        <th>Days Exceeded</th>
                        <th>Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.filter(r => r.status === "Overdue Payments").map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.customerName}</strong></td>
                          <td>{r.mobile}</td>
                          <td className="td-num text-red">₹{r.outstandingAmount.toLocaleString("en-IN")}</td>
                          <td>{Math.abs(r.remainingDays)} days overdue</td>
                          <td>{r.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedReport === "Credit Usage Report" && (
                  <table className="pl-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th className="th-num">Credit Limit</th>
                        <th className="th-num">Utilized Credit</th>
                        <th className="th-num">Available Credit</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.customerName}</strong></td>
                          <td className="td-num">₹{(r.creditLimit || 0).toLocaleString("en-IN")}</td>
                          <td className="td-num text-red">₹{(r.usedCredit || 0).toLocaleString("en-IN")}</td>
                          <td className="td-num text-green">₹{(r.availableCredit || 0).toLocaleString("en-IN")}</td>
                          <td><span className={`pl-days-badge settled ${r.accountStatus.toLowerCase()}`}>{r.accountStatus}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedReport === "Customer Ledger Report" && (
                  <table className="pl-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Business Name</th>
                        <th>Mobile</th>
                        <th className="th-num">Requested</th>
                        <th className="th-num">Outstanding</th>
                        <th>Terms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.customerName}</strong></td>
                          <td>{r.businessName}</td>
                          <td>{r.mobile}</td>
                          <td className="td-num">₹{r.orderAmount.toLocaleString("en-IN")}</td>
                          <td className="td-num">₹{r.outstandingAmount.toLocaleString("en-IN")}</td>
                          <td>{r.paymentTerms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          UPGRADED CUSTOMER DETAILS SIDE DRAWER
      ───────────────────────────────────────────── */}
      {selectedRequest && !showApproveModal && !showRejectModal && !showPayModal && (
        <div className="pl-drawer-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="pl-drawer upgraded-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="pl-drawer-hdr">
              <div>
                <h2>{activeSelectedRequest.customerName}</h2>
                <span className="pl-drawer-sub">{activeSelectedRequest.businessName} • {activeSelectedRequest.customerType}</span>
              </div>
              <button className="pl-drawer-close" onClick={() => setSelectedRequest(null)}>
                <i className="pi pi-times" />
              </button>
            </div>

            {/* Drawer Tab Navigation */}
            <div className="drawer-tabs">
              <button className={`drawer-tab-btn ${drawerActiveTab === "overview" ? "active" : ""}`} onClick={() => setDrawerActiveTab("overview")}>Overview</button>
              <button className={`drawer-tab-btn ${drawerActiveTab === "timeline" ? "active" : ""}`} onClick={() => setDrawerActiveTab("timeline")}>Payments</button>
              <button className={`drawer-tab-btn ${drawerActiveTab === "orders" ? "active" : ""}`} onClick={() => setDrawerActiveTab("orders")}>Orders</button>
              <button className={`drawer-tab-btn ${drawerActiveTab === "reminders" ? "active" : ""}`} onClick={() => setDrawerActiveTab("reminders")}>Reminders</button>
            </div>

            <div className="pl-drawer-body">

              {/* Tab: Overview */}
              {drawerActiveTab === "overview" && (
                <>
                  <div className="pl-drawer-section">
                    <h3>Credit Utilization</h3>
                    <div className="pl-details-grid">
                      <div className="pl-meta-card">
                        <span className="pl-meta-label">Credit Limit</span>
                        <strong className="pl-meta-val">₹{(activeSelectedRequest.creditLimit || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="pl-meta-card">
                        <span className="pl-meta-label">Used Credit</span>
                        <strong className="pl-meta-val text-red">₹{(activeSelectedRequest.usedCredit || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="pl-meta-card">
                        <span className="pl-meta-label">Available Credit</span>
                        <strong className="pl-meta-val text-green">₹{(activeSelectedRequest.availableCredit || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="pl-meta-card">
                        <span className="pl-meta-label">Outstanding Balance</span>
                        <strong className="pl-meta-val text-red">₹{activeSelectedRequest.outstandingAmount.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pl-drawer-section">
                    <h3>General Info</h3>
                    <div className="pl-details-grid">
                      <div className="pl-meta-card">
                        <span className="pl-meta-label">Total Orders</span>
                        <strong className="pl-meta-val">{activeSelectedRequest.orderHistory ? activeSelectedRequest.orderHistory.length : 0} Orders</strong>
                      </div>
                      <div className="pl-meta-card">
                        <span className="pl-meta-label">Total Collections</span>
                        <strong className="pl-meta-val text-green">
                          ₹{(activeSelectedRequest.history ? activeSelectedRequest.history.filter(h => h.action.includes("Paid")).reduce((sum, h) => sum + 10000, 0) : 0).toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <div className="pl-meta-card">
                        <span className="pl-meta-label">Payment Terms</span>
                        <strong className="pl-meta-val-text">{activeSelectedRequest.paymentTerms}</strong>
                      </div>
                      <div className="pl-meta-card">
                        <span className="pl-meta-label">Account Status</span>
                        <strong className="pl-meta-val-text" style={{ color: activeSelectedRequest.accountStatus === "Active" ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                          {activeSelectedRequest.accountStatus}
                        </strong>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tab: Payments Timeline */}
              {drawerActiveTab === "timeline" && (
                <div className="pl-drawer-section">
                  <h3>Chronological Credit History</h3>
                  <div className="pl-history-timeline">
                    {activeSelectedRequest.history.length === 0 ? (
                      <div className="pl-no-logs">No ledger timeline entries logged.</div>
                    ) : (
                      activeSelectedRequest.history.map((h, idx) => (
                        <div key={idx} className="pl-history-item">
                          <div className="pl-hist-marker" />
                          <div className="pl-hist-content">
                            <span className="pl-hist-date">{h.date} — <strong>{h.action}</strong></span>
                            <p className="pl-hist-desc">{h.desc}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Linked Orders */}
              {drawerActiveTab === "orders" && (
                <div className="pl-drawer-section">
                  <h3>Order History &amp; Invoices</h3>
                  <div className="drawer-orders-list">
                    {activeSelectedRequest.orderHistory && activeSelectedRequest.orderHistory.length > 0 ? (
                      activeSelectedRequest.orderHistory.map((o) => (
                        <div key={o.id} className="drawer-order-item">
                          <div className="order-hdr">
                            <span className="order-id">{o.id}</span>
                            <span className="order-date">{o.date}</span>
                          </div>
                          <p className="order-items">{o.items}</p>
                          <div className="order-footer">
                            <span className="order-status-badge">{o.status}</span>
                            <strong className="order-amt">₹{o.amount.toLocaleString("en-IN")}</strong>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pl-no-logs">No linked orders for this customer.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Reminders & Management */}
              {drawerActiveTab === "reminders" && (
                <>
                  <div className="pl-drawer-section">
                    <h3>Manual Dispatch Reminders</h3>
                    <div className="manual-reminders-grid">
                      <AppButton className="manual-rem-btn wa" onClick={() => triggerReminder("WhatsApp", activeSelectedRequest)}>
                        <i className="pi pi-whatsapp" /> Send WhatsApp
                      </AppButton>
                      <AppButton className="manual-rem-btn sms" onClick={() => triggerReminder("SMS", activeSelectedRequest)}>
                        <i className="pi pi-envelope" /> Send SMS
                      </AppButton>
                      <AppButton className="manual-rem-btn email" onClick={() => triggerReminder("Email", activeSelectedRequest)}>
                        <i className="pi pi-send" /> Send Email
                      </AppButton>
                    </div>
                  </div>

                  <div className="pl-drawer-section">
                    <h3>Automatic Collection Rules</h3>
                    <div className="auto-rules-checklist">
                      <label className="rule-item">
                        <input type="checkbox" defaultChecked />
                        <span className="rule-lbl">7 Days Before Due Date (Soft Warning)</span>
                      </label>
                      <label className="rule-item">
                        <input type="checkbox" defaultChecked />
                        <span className="rule-lbl">5 Days Before Due Date</span>
                      </label>
                      <label className="rule-item">
                        <input type="checkbox" defaultChecked />
                        <span className="rule-lbl">3 Days Before Due Date</span>
                      </label>
                      <label className="rule-item">
                        <input type="checkbox" defaultChecked />
                        <span className="rule-lbl">Due Date (Urgent Collection Alert)</span>
                      </label>
                      <label className="rule-item">
                        <input type="checkbox" defaultChecked />
                        <span className="rule-lbl">After Due Date (Daily Reminders &amp; Suspense warning)</span>
                      </label>
                    </div>
                  </div>

                  <div className="pl-drawer-section">
                    <h3>Sent Reminder History</h3>
                    <div className="sent-reminders-list">
                      {activeSelectedRequest.reminders && activeSelectedRequest.reminders.length > 0 ? (
                        activeSelectedRequest.reminders.map((r, i) => (
                          <div key={i} className="sent-reminder-item">
                            <span className="rem-date">{r.date} • <strong>{r.type}</strong></span>
                            <p className="rem-desc">{r.desc}</p>
                          </div>
                        ))
                      ) : (
                        <div className="pl-no-logs">No notifications sent yet.</div>
                      )}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          UPGRADED ADD PAY LATER CUSTOMER MODAL / DRAWER
      ───────────────────────────────────────────── */}
      <AppModal
        visible={showAddModal}
        onHide={() => setShowAddModal(false)}
        maskClassName="pl-modal-overlay"
        className="pl-modal-box pl-add-customer-modal"
      >
        <div className="pl-modal-hdr">
          <h3>Create Pay Later Credit Account</h3>
          <AppButton className="pl-modal-close" onClick={() => setShowAddModal(false)}>
            <i className="pi pi-times" />
          </AppButton>
        </div>
        <form onSubmit={handleAddCustomer}>
          <div className="pl-modal-body">

            <h4 className="form-sub-title">1. Customer Information</h4>
            <div className="form-row">
              <div className="pl-form-group">
                <label>Customer Name <span className="req">*</span></label>
                <AppInput
                  type="text"
                  className="pl-modal-input"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                />
              </div>
              <div className="pl-form-group">
                <label>Business Name</label>
                <AppInput
                  type="text"
                  className="pl-modal-input"
                  value={newCustBusiness}
                  onChange={(e) => setNewCustBusiness(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="pl-form-group">
                <label>Mobile Number <span className="req">*</span></label>
                <AppInput
                  type="text"
                  className="pl-modal-input"
                  placeholder="+91 XXXXX XXXXX"
                  required
                  value={newCustMobile}
                  onChange={(e) => setNewCustMobile(e.target.value)}
                />
              </div>
              <div className="pl-form-group">
                <label>Email Address</label>
                <AppInput
                  type="email"
                  className="pl-modal-input"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pl-form-group">
              <label>Customer Category Profile</label>
              <AppSelect
                className="pl-modal-select"
                value={newCustType}
                onChange={(e) => setNewCustType(e.value)}
                options={["Retail Customer", "Wholesale Customer", "Distributor", "Corporate Customer"]}
              />
            </div>

            <h4 className="form-sub-title">2. Credit Configuration</h4>
            <div className="form-row">
              <div className="pl-form-group">
                <label>Credit Limit (₹) <span className="req">*</span></label>
                <AppInput
                  type="number"
                  className="pl-modal-input"
                  required
                  value={newCustLimit}
                  onChange={(e) => setNewCustLimit(e.target.value)}
                />
              </div>
              <div className="pl-form-group">
                <label>Credit Period</label>
                <AppSelect
                  className="pl-modal-select"
                  value={newCustPeriod}
                  onChange={(e) => setNewCustPeriod(e.value)}
                  options={["7 Days", "15 Days", "30 Days", "45 Days", "60 Days", "Custom"]}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="pl-form-group">
                <label>Payment Terms</label>
                <AppSelect
                  className="pl-modal-select"
                  value={newCustTerms}
                  onChange={(e) => setNewCustTerms(e.value)}
                  options={[
                    "Full Pay Later",
                    "Partial Advance + Remaining Later",
                    "Monthly Billing",
                    "Installment Plan"
                  ]}
                />
              </div>
              <div className="pl-form-group">
                <label>Initial Account Status</label>
                <AppSelect
                  className="pl-modal-select"
                  value={newCustStatus}
                  onChange={(e) => setNewCustStatus(e.value)}
                  options={["Active", "Suspended", "Blocked"]}
                />
              </div>
            </div>

          </div>
          <div className="pl-modal-footer">
            <AppButton type="button" className="pl-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</AppButton>
            <AppButton type="submit" className="pl-modal-submit btn-green">Create Credit Account</AppButton>
          </div>
        </form>
      </AppModal>

      {/* ─────────────────────────────────────────────
          APPROVE REQUEST MODAL
      ───────────────────────────────────────────── */}
      <AppModal
        visible={showApproveModal && !!activeSelectedRequest}
        onHide={() => setShowApproveModal(false)}
        maskClassName="pl-modal-overlay"
        className="pl-modal-box"
      >
        <div className="pl-modal-hdr">
          <h3>Approve Credit Terms — {activeSelectedRequest?.customerName}</h3>
          <AppButton className="pl-modal-close" onClick={() => setShowApproveModal(false)}>
            <i className="pi pi-times" />
          </AppButton>
        </div>
        <div className="pl-modal-body">
          <div className="pl-form-group">
            <label>Order Amount: <strong>₹{(activeSelectedRequest?.orderAmount || 0).toLocaleString("en-IN")}</strong></label>
          </div>
          <div className="pl-form-group">
            <label>Approved Credit Limit (₹) <span className="req">*</span></label>
            <AppInput
              type="number"
              className="pl-modal-input"
              value={approvedLimit}
              onChange={(e) => setApprovedLimit(e.target.value)}
            />
          </div>
          <div className="pl-form-group">
            <label>Credit Period / Terms (Days) <span className="req">*</span></label>
            <AppSelect
              className="pl-modal-select"
              value={creditTerms}
              onChange={(e) => setCreditTerms(e.value)}
              options={[
                { label: "7 Days", value: 7 },
                { label: "15 Days", value: 15 },
                { label: "30 Days", value: 30 },
                { label: "45 Days", value: 45 },
                { label: "60 Days", value: 60 }
              ]}
            />
          </div>
        </div>
        <div className="pl-modal-footer">
          <AppButton className="pl-modal-cancel" onClick={() => setShowApproveModal(false)}>Cancel</AppButton>
          <AppButton className="pl-modal-submit btn-green" onClick={handleApprove}>Approve Terms</AppButton>
        </div>
      </AppModal>

      {/* ─────────────────────────────────────────────
          REJECT REQUEST MODAL
      ───────────────────────────────────────────── */}
      <AppModal
        visible={showRejectModal && !!activeSelectedRequest}
        onHide={() => setShowRejectModal(false)}
        maskClassName="pl-modal-overlay"
        className="pl-modal-box"
      >
        <div className="pl-modal-hdr">
          <h3>Reject Credit Request — {activeSelectedRequest?.customerName}</h3>
          <AppButton className="pl-modal-close" onClick={() => setShowRejectModal(false)}>
            <i className="pi pi-times" />
          </AppButton>
        </div>
        <div className="pl-modal-body">
          <div className="pl-form-group">
            <label>Reason for Rejection <span className="req">*</span></label>
            <AppTextarea
              className="pl-modal-textarea"
              rows={3}
              placeholder="Specify credit scoring checks or reasons for denial..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        </div>
        <div className="pl-modal-footer">
          <AppButton className="pl-modal-cancel" onClick={() => setShowRejectModal(false)}>Cancel</AppButton>
          <AppButton className="pl-modal-submit btn-red" onClick={handleReject} disabled={!rejectReason.trim()}>
            Confirm Rejection
          </AppButton>
        </div>
      </AppModal>

      {/* ─────────────────────────────────────────────
          RECORD REPAYMENT MODAL
      ───────────────────────────────────────────── */}
      <AppModal
        visible={showPayModal && !!activeSelectedRequest}
        onHide={() => setShowPayModal(false)}
        maskClassName="pl-modal-overlay"
        className="pl-modal-box"
      >
        <div className="pl-modal-hdr">
          <h3>Log Collected Payment — {activeSelectedRequest?.customerName}</h3>
          <AppButton className="pl-modal-close" onClick={() => setShowPayModal(false)}>
            <i className="pi pi-times" />
          </AppButton>
        </div>
        <div className="pl-modal-body">
          <div className="pl-form-group">
            <label>Outstanding Amount: <strong>₹{activeSelectedRequest?.outstandingAmount.toLocaleString("en-IN")}</strong></label>
          </div>
          <div className="pl-form-group">
            <label>Amount Collected (₹) <span className="req">*</span></label>
            <AppInput
              type="number"
              className="pl-modal-input"
              value={payAmount}
              max={activeSelectedRequest?.outstandingAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
          </div>
          <div className="pl-form-group">
            <label>Payment Channel <span className="req">*</span></label>
            <AppSelect
              className="pl-modal-select"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.value)}
              options={[
                { label: "UPI Transfer", value: "UPI" },
                { label: "NEFT / RTGS Bank Transfer", value: "Bank Transfer" },
                { label: "Cash Receipt", value: "Cash" },
                { label: "Bank Cheque", value: "Cheque" }
              ]}
            />
          </div>
          <div className="pl-form-group">
            <label>Payment Reference / UTR Number</label>
            <AppInput
              type="text"
              className="pl-modal-input"
              placeholder="e.g. UTR-883271823"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
            />
          </div>
        </div>
        <div className="pl-modal-footer">
          <AppButton className="pl-modal-cancel" onClick={() => setShowPayModal(false)}>Cancel</AppButton>
          <AppButton className="pl-modal-submit btn-green" onClick={handleLogPayment} disabled={Number(payAmount) <= 0}>
            Record Payment
          </AppButton>
        </div>
      </AppModal>

    </div>
  );
};

export default PayLaterView;
