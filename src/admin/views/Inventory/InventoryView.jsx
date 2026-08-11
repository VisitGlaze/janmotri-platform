import React, { useState, useMemo } from "react";
import { useAdminStore } from "../../../shared/useAdminStore";
import {
  getStockStatus,
  getInventorySummary,
  WAREHOUSES,
  INV_CATEGORIES,
  TRANSACTION_TYPES,
} from "./inventoryData";
import "./InventoryView.scss";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const StockStatusBadge = ({ item }) => {
  const status = getStockStatus(item);
  const map = {
    Healthy:      "inv-badge-green",
    Low:          "inv-badge-amber",
    Critical:     "inv-badge-red",
    "Out of Stock": "inv-badge-dark",
  };
  return <span className={`inv-status-badge ${map[status]}`}>{status}</span>;
};

const TxnTypeBadge = ({ type }) => {
  const map = {
    "Stock In":   "txn-in",
    "Stock Out":  "txn-out",
    Adjustment:   "txn-adj",
    Reserved:     "txn-res",
    Released:     "txn-rel",
  };
  return <span className={`inv-txn-badge ${map[type] || ""}`}>{type}</span>;
};

const StockBar = ({ value, min, max }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const color = value <= 0 ? "#94a3b8" : value <= min * 0.25 ? "#dc2626" : value <= min ? "#f59e0b" : "#22c55e";
  return (
    <div className="inv-stock-bar-wrap">
      <div className="inv-stock-bar-track">
        <div className="inv-stock-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="inv-stock-bar-pct">{pct}%</span>
    </div>
  );
};

// ─────────────────────────────────────────────
// KPI Widget Cards
// ─────────────────────────────────────────────
const KpiWidget = ({ label, value, sub, icon, colorClass, trend }) => (
  <div className="inv-kpi-card">
    <div className={`inv-kpi-icon ${colorClass}`}>
      <i className={`pi ${icon}`} />
    </div>
    <div className="inv-kpi-body">
      <span className="inv-kpi-label">{label}</span>
      <span className="inv-kpi-value">{value}</span>
      {sub  && <span className="inv-kpi-sub">{sub}</span>}
      {trend && <span className={`inv-kpi-trend ${trend.dir}`}><i className={`pi ${trend.dir === "up" ? "pi-arrow-up-right" : "pi-arrow-down-right"}`} />{trend.text}</span>}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// TAB 1: Stock Overview
// ─────────────────────────────────────────────
const StockOverview = ({
  inventory,
  summary,
  search,
  setSearch,
  catFilter,
  setCat,
  whFilter,
  setWh,
  statFilter,
  setStat
}) => {
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let d = [...inventory];
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    if (catFilter !== "All") d = d.filter((i) => i.category === catFilter);
    if (whFilter  !== "All") d = d.filter((i) => i.warehouse === whFilter);
    if (statFilter !== "All") d = d.filter((i) => getStockStatus(i) === statFilter);
    d.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
    });
    return d;
  }, [inventory, search, catFilter, whFilter, statFilter, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) =>
    sortCol !== col ? <i className="pi pi-sort inv-sort-icon muted" /> :
    sortDir === "asc" ? <i className="pi pi-sort-up inv-sort-icon active" /> :
    <i className="pi pi-sort-down inv-sort-icon active" />;

  return (
    <div className="inv-tab-content">
      {/* KPI Grid */}
      <div className="inv-kpi-grid">
        <KpiWidget label="Total SKUs Tracked"     value={summary.totalItems}    icon="pi-box"                  colorClass="kpi-blue"  sub={`Across ${WAREHOUSES.length - 1} warehouses`} />
        <KpiWidget label="Total Stock Units"       value={summary.totalStock.toLocaleString("en-IN")} icon="pi-warehouse"  colorClass="kpi-gold"  sub={`₹${summary.totalValue.toLocaleString("en-IN")} inventory value`} />
        <KpiWidget label="Reserved Stock"          value={summary.totalReserved.toLocaleString("en-IN")} icon="pi-lock"   colorClass="kpi-amber" sub="Held for pending orders" />
        <KpiWidget label="Available Stock"         value={summary.totalAvailable.toLocaleString("en-IN")} icon="pi-check-circle" colorClass="kpi-green" sub="Ready for dispatch" />
        <KpiWidget label="Low Stock Products"      value={summary.lowStock}      icon="pi-exclamation-triangle"  colorClass="kpi-amber" sub={`${summary.critical} critical`} trend={{ dir: "down", text: "Needs restocking" }} />
        <KpiWidget label="Out of Stock Products"   value={summary.outOfStock}    icon="pi-times-circle"           colorClass="kpi-red"   sub="Zero available units" trend={{ dir: "down", text: "Immediate action" }} />
      </div>

      {/* Table */}
      <div className="widget-card inv-table-card">
        <div className="inv-table-header">
          <span className="inv-table-title">Inventory Records <span className="inv-count-chip">{filtered.length}</span></span>
        </div>
        <div className="table-responsive">
          <table className="inv-table">
            <thead>
              <tr>
                <th className="th-sortable" onClick={() => handleSort("sku")}>SKU <SortIcon col="sku" /></th>
                <th className="th-sortable" onClick={() => handleSort("name")}>Product <SortIcon col="name" /></th>
                <th>Category</th>
                <th>Warehouse</th>
                <th className="th-sortable th-num" onClick={() => handleSort("currentStock")}>Current Stock <SortIcon col="currentStock" /></th>
                <th className="th-num">Reserved</th>
                <th className="th-sortable th-num" onClick={() => handleSort("availableStock")}>Available <SortIcon col="availableStock" /></th>
                <th className="th-num">Min Level</th>
                <th>Fill Rate</th>
                <th className="th-sortable" onClick={() => handleSort("totalValue")}>Value <SortIcon col="totalValue" /></th>
                <th>Status</th>
                <th>Location</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className={`inv-table-row ${getStockStatus(item) === "Critical" || getStockStatus(item) === "Out of Stock" ? "row-alert" : ""}`}>
                  <td><span className="inv-sku-tag">{item.sku}</span></td>
                  <td className="td-name">
                    <div className="inv-product-cell">
                      <span className="inv-product-name">{item.name}</span>
                      <span className="inv-product-batch">Batch: {item.batchNo}</span>
                    </div>
                  </td>
                  <td><span className="inv-cat-tag">{item.category}</span></td>
                  <td><span className="inv-wh-tag"><i className="pi pi-map-marker" />{item.warehouse}</span></td>
                  <td className="td-num"><span className={`inv-num ${item.currentStock <= 0 ? "num-zero" : ""}`}>{item.currentStock}</span></td>
                  <td className="td-num"><span className="inv-num num-reserved">{item.reservedStock}</span></td>
                  <td className="td-num"><span className={`inv-num ${item.availableStock <= 0 ? "num-zero" : item.availableStock <= item.minStockLevel ? "num-low" : "num-ok"}`}>{item.availableStock}</span></td>
                  <td className="td-num"><span className="inv-num">{item.minStockLevel}</span></td>
                  <td className="td-bar"><StockBar value={item.availableStock} min={item.minStockLevel} max={item.maxStockLevel} /></td>
                  <td><span className="inv-value">₹{item.totalValue.toLocaleString("en-IN")}</span></td>
                  <td><StockStatusBadge item={item} /></td>
                  <td><span className="inv-location"><i className="pi pi-tag" />{item.location}</span></td>
                  <td><span className="inv-date">{item.lastUpdated}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="inv-empty"><i className="pi pi-database" /><p>No inventory records match your filters.</p></div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB 2: Stock In Form
// ─────────────────────────────────────────────
const StockInForm = ({ inventory, onStockIn }) => {
  const [form, setForm] = useState({
    sku: "",
    supplier: "",
    qty: "",
    unitCost: "",
    batchNo: "",
    expiryDate: "",
    warehouse: "Rajkot Main",
    notes: "",
    invoiceNo: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectedItem = inventory.find((i) => i.sku === form.sku);

  const validate = () => {
    const e = {};
    if (!form.sku)           e.sku     = "Please select a product.";
    if (!form.qty || form.qty <= 0) e.qty = "Enter a valid quantity.";
    if (!form.supplier.trim()) e.supplier = "Supplier name is required.";
    if (!form.batchNo.trim()) e.batchNo = "Batch number is required.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onStockIn({ ...form, qty: Number(form.qty) });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ sku: "", supplier: "", qty: "", unitCost: "", batchNo: "", expiryDate: "", warehouse: "Rajkot Main", notes: "", invoiceNo: "" }); }, 2000);
  };

  return (
    <div className="inv-tab-content">
      <div className="inv-form-layout">
        {/* Main Form */}
        <div className="widget-card inv-form-card">
          <div className="inv-form-card-hdr">
            <i className="pi pi-arrow-circle-down inv-icon-in" />
            <span>Stock In — Receive New Stock</span>
          </div>
          <form className="inv-form-fields" onSubmit={handleSubmit} noValidate>
            {/* Product Select */}
            <div className={`inv-field ${errors.sku ? "field-err" : ""}`}>
              <label>Product / SKU <span className="req">*</span></label>
              <select
                value={form.sku}
                onChange={(e) => { setForm((f) => ({ ...f, sku: e.target.value })); if (errors.sku) setErrors((er) => { const n = {...er}; delete n.sku; return n; }); }}
                className="inv-input inv-select-field"
              >
                <option value="">— Select Product —</option>
                {inventory.map((i) => <option key={i.id} value={i.sku}>{i.sku} · {i.name}</option>)}
              </select>
              {errors.sku && <span className="inv-err">{errors.sku}</span>}
            </div>

            {/* Current Stock Preview */}
            {selectedItem && (
              <div className="inv-stock-preview">
                <div className="inv-preview-row">
                  <span>Current Stock</span><strong>{selectedItem.currentStock} units</strong>
                </div>
                <div className="inv-preview-row">
                  <span>Available</span><strong className={selectedItem.availableStock <= selectedItem.minStockLevel ? "text-amber" : "text-green"}>{selectedItem.availableStock} units</strong>
                </div>
                <div className="inv-preview-row">
                  <span>Min Level</span><strong>{selectedItem.minStockLevel} units</strong>
                </div>
                <div className="inv-preview-row">
                  <span>Status</span><StockStatusBadge item={selectedItem} />
                </div>
              </div>
            )}

            <div className="inv-field-row">
              <div className={`inv-field ${errors.qty ? "field-err" : ""}`}>
                <label>Quantity Received <span className="req">*</span></label>
                <input type="number" min="1" value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} placeholder="0" className="inv-input" />
                {errors.qty && <span className="inv-err">{errors.qty}</span>}
                {selectedItem && form.qty > 0 && (
                  <span className="inv-field-hint">New stock will be: <strong>{selectedItem.currentStock + Number(form.qty)} units</strong></span>
                )}
              </div>
              <div className="inv-field">
                <label>Unit Cost (₹)</label>
                <div className="inv-prefix-wrap"><span className="inv-prefix">₹</span>
                  <input type="number" min="0" value={form.unitCost} onChange={(e) => setForm((f) => ({ ...f, unitCost: e.target.value }))} placeholder="0.00" className="inv-input inv-with-prefix" />
                </div>
              </div>
            </div>

            <div className="inv-field-row">
              <div className={`inv-field ${errors.supplier ? "field-err" : ""}`}>
                <label>Supplier Name <span className="req">*</span></label>
                <input type="text" value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))} placeholder="e.g. Rajkot Agro Traders" className="inv-input" />
                {errors.supplier && <span className="inv-err">{errors.supplier}</span>}
              </div>
              <div className="inv-field">
                <label>Invoice No.</label>
                <input type="text" value={form.invoiceNo} onChange={(e) => setForm((f) => ({ ...f, invoiceNo: e.target.value }))} placeholder="e.g. INV-2026-441" className="inv-input" />
              </div>
            </div>

            <div className="inv-field-row">
              <div className={`inv-field ${errors.batchNo ? "field-err" : ""}`}>
                <label>Batch Number <span className="req">*</span></label>
                <input type="text" value={form.batchNo} onChange={(e) => setForm((f) => ({ ...f, batchNo: e.target.value }))} placeholder="e.g. B-2026-06-10" className="inv-input" />
                {errors.batchNo && <span className="inv-err">{errors.batchNo}</span>}
              </div>
              <div className="inv-field">
                <label>Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} className="inv-input" />
              </div>
            </div>

            <div className="inv-field">
              <label>Destination Warehouse</label>
              <select value={form.warehouse} onChange={(e) => setForm((f) => ({ ...f, warehouse: e.target.value }))} className="inv-input inv-select-field">
                {WAREHOUSES.filter((w) => w !== "All").map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>

            <div className="inv-field">
              <label>Notes / Remarks</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Additional notes about this stock receipt…" className="inv-input inv-textarea" />
            </div>

            <button type="submit" className={`admin-action-btn inv-submit-btn ${submitted ? "btn-done" : ""}`}>
              <i className={`pi ${submitted ? "pi-check" : "pi-arrow-circle-down"} mr-2`} />
              {submitted ? "Stock Added!" : "Confirm Stock In"}
            </button>
          </form>
        </div>

        {/* Info sidebar */}
        <div className="inv-form-side">
          <div className="widget-card inv-info-card">
            <div className="inv-form-card-hdr inv-form-card-hdr-sm">
              <i className="pi pi-info-circle" /><span>Stock In Guidelines</span>
            </div>
            <ul className="inv-guideline-list">
              <li><i className="pi pi-check-circle text-green" />Verify physical count before entry</li>
              <li><i className="pi pi-check-circle text-green" />Match invoice quantity with actual received</li>
              <li><i className="pi pi-check-circle text-green" />Enter batch number from packaging</li>
              <li><i className="pi pi-check-circle text-green" />Check expiry date on each unit</li>
              <li><i className="pi pi-check-circle text-green" />Assign correct warehouse location</li>
            </ul>
          </div>
          <div className="widget-card inv-info-card">
            <div className="inv-form-card-hdr inv-form-card-hdr-sm">
              <i className="pi pi-chart-bar" /><span>Today's Receipts</span>
            </div>
            <div className="inv-today-stats">
              <div className="inv-today-row"><span>Stock In Events</span><strong>3</strong></div>
              <div className="inv-today-row"><span>Units Received</span><strong>36</strong></div>
              <div className="inv-today-row"><span>Total Value</span><strong>₹54,200</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB 3: Stock Out Form
// ─────────────────────────────────────────────
const STOCK_OUT_REASONS = ["Sales Order", "Damaged / Wastage", "Lab Testing", "Sample / Demo", "Transfer to Depot", "Adjustment", "Other"];

const StockOutForm = ({ inventory, onStockOut }) => {
  const [form, setForm] = useState({ sku: "", qty: "", reason: "Sales Order", refNo: "", notes: "", warehouse: "Rajkot Main" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectedItem = inventory.find((i) => i.sku === form.sku);

  const validate = () => {
    const e = {};
    if (!form.sku) e.sku = "Please select a product.";
    if (!form.qty || Number(form.qty) <= 0) e.qty = "Enter a valid quantity.";
    if (selectedItem && Number(form.qty) > selectedItem.availableStock) e.qty = `Only ${selectedItem.availableStock} units available.`;
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onStockOut({ ...form, qty: Number(form.qty) });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ sku: "", qty: "", reason: "Sales Order", refNo: "", notes: "", warehouse: "Rajkot Main" }); }, 2000);
  };

  return (
    <div className="inv-tab-content">
      <div className="inv-form-layout">
        <div className="widget-card inv-form-card">
          <div className="inv-form-card-hdr">
            <i className="pi pi-arrow-circle-up inv-icon-out" />
            <span>Stock Out — Dispatch / Remove Stock</span>
          </div>
          <form className="inv-form-fields" onSubmit={handleSubmit} noValidate>
            <div className={`inv-field ${errors.sku ? "field-err" : ""}`}>
              <label>Product / SKU <span className="req">*</span></label>
              <select value={form.sku} onChange={(e) => { setForm((f) => ({ ...f, sku: e.target.value })); setErrors({}); }} className="inv-input inv-select-field">
                <option value="">— Select Product —</option>
                {inventory.map((i) => <option key={i.id} value={i.sku} disabled={i.availableStock <= 0}>{i.sku} · {i.name} {i.availableStock <= 0 ? "(Out of Stock)" : `(Avail: ${i.availableStock})`}</option>)}
              </select>
              {errors.sku && <span className="inv-err">{errors.sku}</span>}
            </div>

            {selectedItem && (
              <div className="inv-stock-preview inv-stock-preview-out">
                <div className="inv-preview-row"><span>Current Stock</span><strong>{selectedItem.currentStock}</strong></div>
                <div className="inv-preview-row"><span>Reserved</span><strong className="text-amber">{selectedItem.reservedStock}</strong></div>
                <div className="inv-preview-row"><span>Available to Dispatch</span><strong className={selectedItem.availableStock <= 0 ? "text-red" : "text-green"}>{selectedItem.availableStock}</strong></div>
                <div className="inv-preview-row"><span>Status</span><StockStatusBadge item={selectedItem} /></div>
              </div>
            )}

            <div className="inv-field-row">
              <div className={`inv-field ${errors.qty ? "field-err" : ""}`}>
                <label>Quantity to Remove <span className="req">*</span></label>
                <input type="number" min="1" max={selectedItem?.availableStock || undefined} value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} placeholder="0" className="inv-input" />
                {errors.qty && <span className="inv-err">{errors.qty}</span>}
                {selectedItem && form.qty > 0 && Number(form.qty) <= selectedItem.availableStock && (
                  <span className="inv-field-hint">Remaining after: <strong>{selectedItem.currentStock - Number(form.qty)} units</strong></span>
                )}
              </div>
              <div className="inv-field">
                <label>Reason</label>
                <select value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} className="inv-input inv-select-field">
                  {STOCK_OUT_REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="inv-field-row">
              <div className="inv-field">
                <label>Reference No. (Order / PO)</label>
                <input type="text" value={form.refNo} onChange={(e) => setForm((f) => ({ ...f, refNo: e.target.value }))} placeholder="e.g. #JMT-9858" className="inv-input" />
              </div>
              <div className="inv-field">
                <label>Source Warehouse</label>
                <select value={form.warehouse} onChange={(e) => setForm((f) => ({ ...f, warehouse: e.target.value }))} className="inv-input inv-select-field">
                  {WAREHOUSES.filter((w) => w !== "All").map((w) => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>

            <div className="inv-field">
              <label>Notes</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Additional remarks about this dispatch…" className="inv-input inv-textarea" />
            </div>

            <button type="submit" className={`admin-action-btn inv-submit-btn inv-btn-out ${submitted ? "btn-done" : ""}`}>
              <i className={`pi ${submitted ? "pi-check" : "pi-arrow-circle-up"} mr-2`} />
              {submitted ? "Stock Removed!" : "Confirm Stock Out"}
            </button>
          </form>
        </div>

        <div className="inv-form-side">
          <div className="widget-card inv-info-card">
            <div className="inv-form-card-hdr inv-form-card-hdr-sm">
              <i className="pi pi-info-circle" /><span>Stock Out Guidelines</span>
            </div>
            <ul className="inv-guideline-list">
              <li><i className="pi pi-check-circle text-green" />Always reference a Sales Order or PO</li>
              <li><i className="pi pi-check-circle text-green" />Verify physical dispatch before logging</li>
              <li><i className="pi pi-check-circle text-green" />Mark damaged goods with Adjustment reason</li>
              <li><i className="pi pi-check-circle text-green" />Stock Out reduces available stock immediately</li>
            </ul>
          </div>
          <div className="widget-card inv-info-card">
            <div className="inv-form-card-hdr inv-form-card-hdr-sm">
              <i className="pi pi-chart-bar" /><span>Today's Dispatches</span>
            </div>
            <div className="inv-today-stats">
              <div className="inv-today-row"><span>Stock Out Events</span><strong>5</strong></div>
              <div className="inv-today-row"><span>Units Dispatched</span><strong>14</strong></div>
              <div className="inv-today-row"><span>Orders Fulfilled</span><strong>4</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB 4: Low Stock Alerts
// ─────────────────────────────────────────────
const LowStockAlerts = ({ inventory }) => {
  const alerts = useMemo(
    () => inventory.filter((i) => ["Low", "Critical", "Out of Stock"].includes(getStockStatus(i)))
      .sort((a, b) => a.availableStock - b.availableStock),
    [inventory]
  );

  const critical   = alerts.filter((i) => getStockStatus(i) === "Critical");
  const outOfStock = alerts.filter((i) => getStockStatus(i) === "Out of Stock");
  const low        = alerts.filter((i) => getStockStatus(i) === "Low");

  return (
    <div className="inv-tab-content">
      {/* Alert Summary */}
      <div className="inv-alert-strip">
        <div className="inv-alert-chip chip-red">
          <i className="pi pi-times-circle" /><span>{outOfStock.length} Out of Stock</span>
        </div>
        <div className="inv-alert-chip chip-amber">
          <i className="pi pi-exclamation-triangle" /><span>{critical.length} Critical</span>
        </div>
        <div className="inv-alert-chip chip-yellow">
          <i className="pi pi-exclamation-circle" /><span>{low.length} Low Stock</span>
        </div>
        <span className="inv-alert-total">{alerts.length} total items requiring attention</span>
      </div>

      {/* Alerts Table */}
      <div className="widget-card inv-table-card">
        <div className="inv-table-header">
          <span className="inv-table-title">Low Stock &amp; Out-of-Stock Items</span>
        </div>
        {alerts.length === 0 ? (
          <div className="inv-empty inv-all-ok">
            <i className="pi pi-check-circle" />
            <p>All products are adequately stocked. No alerts at this time.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Warehouse</th>
                  <th className="th-num">Available</th>
                  <th className="th-num">Min Level</th>
                  <th className="th-num">Shortage</th>
                  <th>Fill Rate</th>
                  <th>Status</th>
                  <th>Last Restocked</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((item) => {
                  const shortage = Math.max(0, item.minStockLevel - item.availableStock);
                  return (
                    <tr key={item.id} className={`inv-table-row ${getStockStatus(item) === "Critical" ? "row-critical" : getStockStatus(item) === "Out of Stock" ? "row-oos" : "row-low"}`}>
                      <td><span className="inv-sku-tag">{item.sku}</span></td>
                      <td className="td-name">
                        <div className="inv-product-cell">
                          <span className="inv-product-name">{item.name}</span>
                          <span className="inv-product-batch">{item.location} · {item.warehouse}</span>
                        </div>
                      </td>
                      <td><span className="inv-cat-tag">{item.category}</span></td>
                      <td><span className="inv-wh-tag"><i className="pi pi-map-marker" />{item.warehouse}</span></td>
                      <td className="td-num"><span className={`inv-num ${item.availableStock <= 0 ? "num-zero" : "num-low"}`}>{item.availableStock}</span></td>
                      <td className="td-num"><span className="inv-num">{item.minStockLevel}</span></td>
                      <td className="td-num"><span className="inv-num num-shortage">{shortage > 0 ? `−${shortage}` : "—"}</span></td>
                      <td><StockBar value={item.availableStock} min={item.minStockLevel} max={item.maxStockLevel} /></td>
                      <td><StockStatusBadge item={item} /></td>
                      <td><span className="inv-date">{item.lastStockIn}</span></td>
                      <td>
                        <button className="inv-restock-btn"><i className="pi pi-arrow-circle-down mr-2" />Restock</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB 5: Inventory History / Transaction Log
// ─────────────────────────────────────────────
const InventoryHistory = ({
  history,
  search,
  setSearch,
  txnFilter,
  setTxnFilter
}) => {
  const filtered = useMemo(() => {
    let d = [...history];
    if (txnFilter !== "All") d = d.filter((h) => h.type === txnFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((h) => h.sku.toLowerCase().includes(q) || h.name.toLowerCase().includes(q) || h.reason.toLowerCase().includes(q));
    }
    return d;
  }, [history, txnFilter, search]);

  return (
    <div className="inv-tab-content">

      {/* History Table */}
      <div className="widget-card inv-table-card">
        <div className="inv-table-header">
          <span className="inv-table-title">Transaction Log <span className="inv-count-chip">{filtered.length}</span></span>
          <button className="admin-action-btn inv-action-sm"><i className="pi pi-download mr-2" />Export CSV</button>
        </div>
        <div className="table-responsive">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Date &amp; Time</th>
                <th>Type</th>
                <th>SKU</th>
                <th>Product</th>
                <th className="th-num">Qty Change</th>
                <th className="th-num">Balance After</th>
                <th>Warehouse</th>
                <th>Reason / Reference</th>
                <th>Batch</th>
                <th>Processed By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr key={txn.id} className="inv-table-row">
                  <td><span className="inv-txn-id">{txn.id}</span></td>
                  <td>
                    <div className="inv-datetime-cell">
                      <span className="inv-date">{txn.date}</span>
                      <span className="inv-time">{txn.time}</span>
                    </div>
                  </td>
                  <td><TxnTypeBadge type={txn.type} /></td>
                  <td><span className="inv-sku-tag">{txn.sku}</span></td>
                  <td className="td-name"><span className="inv-product-name">{txn.name}</span></td>
                  <td className="td-num">
                    <span className={`inv-qty-change ${txn.type === "Stock In" || txn.type === "Released" ? "qty-in" : txn.type === "Stock Out" || txn.type === "Reserved" ? "qty-out" : "qty-adj"}`}>
                      {txn.type === "Stock In" || txn.type === "Released" ? "+" : txn.type === "Adjustment" && txn.qty < 0 ? "" : txn.type === "Stock Out" || txn.type === "Reserved" ? "−" : ""}{Math.abs(txn.qty)}
                    </span>
                  </td>
                  <td className="td-num"><span className="inv-num">{txn.balance}</span></td>
                  <td><span className="inv-wh-tag"><i className="pi pi-map-marker" />{txn.warehouse}</span></td>
                  <td className="td-reason"><span className="inv-reason">{txn.reason}</span></td>
                  <td><span className="inv-batch">{txn.batchNo}</span></td>
                  <td><span className="inv-user"><i className="pi pi-user" />{txn.user}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="inv-empty"><i className="pi pi-history" /><p>No transactions match your search.</p></div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Inventory View — Tab Controller
// ─────────────────────────────────────────────
const TABS = [
  { key: "overview",  label: "Stock Overview",    icon: "pi-warehouse" },
  { key: "stock-in",  label: "Stock In",           icon: "pi-arrow-circle-down" },
  { key: "stock-out", label: "Stock Out",          icon: "pi-arrow-circle-up" },
  { key: "alerts",    label: "Low Stock Alerts",   icon: "pi-exclamation-triangle" },
  { key: "history",   label: "Inventory History",  icon: "pi-history" },
];

const InventoryView = () => {
  const [activeTab, setActiveTab]   = useState("overview");

  // Stock Overview Filters state
  const [overviewSearch, setOverviewSearch] = useState("");
  const [overviewCat, setOverviewCat] = useState("All");
  const [overviewWh, setOverviewWh] = useState("All");
  const [overviewStat, setOverviewStat] = useState("All");

  // History Filters state
  const [historySearch, setHistorySearch] = useState("");
  const [historyTxn, setHistoryTxn] = useState("All");
  
  const inventory = useAdminStore((state) => state.inventory);
  const history = useAdminStore((state) => state.inventoryHistory);
  const stockIn = useAdminStore((state) => state.stockIn);
  const stockOut = useAdminStore((state) => state.stockOut);

  const summary = useMemo(() => getInventorySummary(inventory), [inventory]);

  const alertCount = inventory.filter((i) => ["Low","Critical","Out of Stock"].includes(getStockStatus(i))).length;

  const handleStockIn = (payload) => {
    stockIn(payload);
  };

  const handleStockOut = (payload) => {
    stockOut(payload);
  };

  return (
    <div className="admin-view-container inv-root">
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory Management</h1>
          <p className="admin-page-subtitle">Track stock levels, receive goods, dispatch orders, and monitor alerts across all warehouses.</p>
        </div>
      </div>

      {/* Sticky Action Header */}
      <div className="admin-sticky-action-bar">
        {/* ── Tab Navigation ── */}
        <div className="inv-tabs-nav" style={{ margin: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`inv-tab-btn ${activeTab === tab.key ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`pi ${tab.icon}`} />
              <span>{tab.label}</span>
              {tab.key === "alerts" && alertCount > 0 && (
                <span className="inv-tab-badge">{alertCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Toolbar inside Sticky Header */}
        {activeTab === "overview" && (
          <div className="widget-card inv-toolbar">
            <div className="inv-search-wrap">
              <i className="pi pi-search inv-search-icon" />
              <input
                type="text"
                className="inv-search-input"
                placeholder="Search by product name or SKU…"
                value={overviewSearch}
                onChange={(e) => setOverviewSearch(e.target.value)}
              />
              {overviewSearch && <button className="inv-search-clear" onClick={() => setOverviewSearch("")}><i className="pi pi-times" /></button>}
            </div>
            <div className="inv-filters">
              <div className="inv-filter-group">
                <label>Category</label>
                <select value={overviewCat} onChange={(e) => setOverviewCat(e.target.value)} className="inv-select">{INV_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
              </div>
              <div className="inv-filter-group">
                <label>Warehouse</label>
                <select value={overviewWh} onChange={(e) => setOverviewWh(e.target.value)} className="inv-select">{WAREHOUSES.map((w) => <option key={w}>{w}</option>)}</select>
              </div>
              <div className="inv-filter-group">
                <label>Status</label>
                <select value={overviewStat} onChange={(e) => setOverviewStat(e.target.value)} className="inv-select">
                  {["All", "Healthy", "Low", "Critical", "Out of Stock"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button className="admin-action-btn" onClick={() => setActiveTab("stock-in")}>
              <i className="pi pi-plus mr-2" />New Stock Entry
            </button>
          </div>
        )}

        {/* History Toolbar inside Sticky Header */}
        {activeTab === "history" && (
          <div className="widget-card inv-toolbar">
            <div className="inv-search-wrap">
              <i className="pi pi-search inv-search-icon" />
              <input
                type="text"
                className="inv-search-input"
                placeholder="Search by SKU, product, or reason…"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
              {historySearch && <button className="inv-search-clear" onClick={() => setHistorySearch("")}><i className="pi pi-times" /></button>}
            </div>
            <div className="inv-filters">
              <div className="inv-filter-group">
                <label>Transaction Type</label>
                <select value={historyTxn} onChange={(e) => setHistoryTxn(e.target.value)} className="inv-select">
                  {TRANSACTION_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button className="admin-action-btn inv-action-sm" style={{ padding: "10px 16px" }}>
              <i className="pi pi-download mr-2" />Export CSV
            </button>
          </div>
        )}

        {/* Alerts Toolbar inside Sticky Header */}
        {activeTab === "alerts" && (
          <div className="widget-card inv-toolbar" style={{ justifyContent: "flex-end" }}>
            <button className="admin-action-btn inv-action-sm" style={{ padding: "10px 16px" }}>
              <i className="pi pi-download mr-2" />Export Alert Report
            </button>
          </div>
        )}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "overview"  && (
        <StockOverview
          inventory={inventory}
          summary={summary}
          search={overviewSearch}
          setSearch={setOverviewSearch}
          catFilter={overviewCat}
          setCat={setOverviewCat}
          whFilter={overviewWh}
          setWh={setOverviewWh}
          statFilter={overviewStat}
          setStat={setOverviewStat}
        />
      )}
      {activeTab === "stock-in"  && <StockInForm    inventory={inventory} onStockIn={handleStockIn} />}
      {activeTab === "stock-out" && <StockOutForm   inventory={inventory} onStockOut={handleStockOut} />}
      {activeTab === "alerts"    && <LowStockAlerts inventory={inventory} />}
      {activeTab === "history"   && (
        <InventoryHistory
          history={history}
          search={historySearch}
          setSearch={setHistorySearch}
          txnFilter={historyTxn}
          setTxnFilter={setHistoryTxn}
        />
      )}
    </div>
  );
};

export default InventoryView;
