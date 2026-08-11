import React, { useState, useMemo, useEffect } from "react";
import { useAdminStore } from "../../../shared/useAdminStore";
import {
  getBatchStatus,
  getDaysToExpiry,
  generateBatchNumber,
  BATCH_PRODUCTS,
  BATCH_CATEGORIES,
  BATCH_STATUSES,
  BATCH_PRODUCTS_FILTER,
} from "./batchData";
import "./BatchManagementView.scss";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const BatchStatusBadge = ({ batch }) => {
  const status = getBatchStatus(batch);
  const map = {
    Active:          "bm-badge-green",
    "Expiring Soon": "bm-badge-amber",
    Expired:         "bm-badge-red",
    "Fully Sold":    "bm-badge-blue",
    Recalled:        "bm-badge-dark",
  };
  return <span className={`bm-status-badge ${map[status] || "bm-badge-gray"}`}>{status}</span>;
};

const LabBadge = ({ status }) => (
  <span className={`bm-lab-badge ${status === "Passed" ? "lab-pass" : "lab-fail"}`}>
    <i className={`pi ${status === "Passed" ? "pi-check-circle" : "pi-times-circle"}`} /> {status}
  </span>
);

const SellThroughBar = ({ produced, sold }) => {
  const pct = produced > 0 ? Math.min(100, Math.round((sold / produced) * 100)) : 0;
  const color = pct >= 95 ? "#16a34a" : pct >= 70 ? "#f59e0b" : "#3b82f6";
  return (
    <div className="bm-sell-bar-wrap">
      <div className="bm-sell-bar-track">
        <div className="bm-sell-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="bm-sell-bar-pct">{pct}%</span>
    </div>
  );
};

const ExpiryCountdown = ({ expiryDate }) => {
  const days = getDaysToExpiry(expiryDate);
  if (days <= 0)   return <span className="bm-expiry-days expired">Expired {Math.abs(days)}d ago</span>;
  if (days <= 30)  return <span className="bm-expiry-days soon">{days}d left</span>;
  return <span className="bm-expiry-days safe">{days}d left</span>;
};

// ─────────────────────────────────────────────
// KPI Widget
// ─────────────────────────────────────────────
const Kpi = ({ label, value, sub, icon, color }) => (
  <div className="bm-kpi-card">
    <div className={`bm-kpi-icon ${color}`}><i className={`pi ${icon}`} /></div>
    <div className="bm-kpi-body">
      <span className="bm-kpi-label">{label}</span>
      <span className="bm-kpi-value">{value}</span>
      {sub && <span className="bm-kpi-sub">{sub}</span>}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Shared Batches Table
// ─────────────────────────────────────────────
const BatchesTable = ({ batches, title, onView, onEdit, onRecall, search, setSearch, catFilter, setCat, prodFilter, setProd }) => {
  const [sortCol, setSortCol] = useState("batchNo");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage]       = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setPage(1);
  }, [search, catFilter, prodFilter]);

  const filtered = useMemo(() => {
    let d = [...batches];
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((b) => b.batchNo.toLowerCase().includes(q) || b.product.toLowerCase().includes(q) || b.supervisor.toLowerCase().includes(q));
    }
    if (catFilter !== "All") d = d.filter((b) => b.category === catFilter);
    if (prodFilter !== "All") d = d.filter((b) => b.product === prodFilter);
    d.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
    });
    return d;
  }, [batches, search, catFilter, prodFilter, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ col }) =>
    sortCol !== col ? <i className="pi pi-sort bm-sort muted" /> :
    sortDir === "asc" ? <i className="pi pi-sort-up bm-sort active" /> :
    <i className="pi pi-sort-down bm-sort active" />;

  return (
    <div className="bm-section">
      {/* Table Card */}
      <div className="widget-card bm-table-card">
        <div className="bm-table-hdr">
          <span className="bm-table-title">
            {title} <span className="bm-count-chip">{filtered.length}</span>
          </span>
        </div>

        {paginated.length === 0 ? (
          <div className="bm-empty">
            <i className="pi pi-list" /><p>No batches match your filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="bm-table">
              <thead>
                <tr>
                  <th className="th-s th-sort" onClick={() => handleSort("batchNo")}>Batch No <SortIcon col="batchNo" /></th>
                  <th className="th-m th-sort" onClick={() => handleSort("product")}>Product <SortIcon col="product" /></th>
                  <th>Category</th>
                  <th className="th-sort" onClick={() => handleSort("mfgDate")}>Mfg Date <SortIcon col="mfgDate" /></th>
                  <th className="th-sort" onClick={() => handleSort("expiryDate")}>Expiry Date <SortIcon col="expiryDate" /></th>
                  <th>Expiry Status</th>
                  <th className="th-num th-sort" onClick={() => handleSort("producedQty")}>Produced <SortIcon col="producedQty" /></th>
                  <th className="th-num th-sort" onClick={() => handleSort("soldQty")}>Sold <SortIcon col="soldQty" /></th>
                  <th className="th-num th-sort" onClick={() => handleSort("availableQty")}>Available <SortIcon col="availableQty" /></th>
                  <th>Sell-Through</th>
                  <th>Lab Test</th>
                  <th>Status</th>
                  <th>Supervisor</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((batch) => {
                  const status = getBatchStatus(batch);
                  return (
                    <tr key={batch.id} className={`bm-row ${status === "Recalled" ? "row-recalled" : status === "Expired" ? "row-expired" : status === "Expiring Soon" ? "row-expiring" : ""}`}>
                      <td>
                        <span className="bm-batch-no">{batch.batchNo}</span>
                      </td>
                      <td className="td-product">
                        <div className="bm-product-cell">
                          <span className="bm-product-name">{batch.product}</span>
                          <span className="bm-warehouse"><i className="pi pi-map-marker" />{batch.warehouse}</span>
                        </div>
                      </td>
                      <td><span className="bm-cat-tag">{batch.category}</span></td>
                      <td><span className="bm-date">{batch.mfgDate}</span></td>
                      <td><span className={`bm-date ${getDaysToExpiry(batch.expiryDate) <= 30 ? "date-warn" : ""}`}>{batch.expiryDate}</span></td>
                      <td><ExpiryCountdown expiryDate={batch.expiryDate} /></td>
                      <td className="td-num"><span className="bm-qty">{batch.producedQty.toLocaleString("en-IN")}</span></td>
                      <td className="td-num"><span className="bm-qty qty-sold">{batch.soldQty.toLocaleString("en-IN")}</span></td>
                      <td className="td-num"><span className={`bm-qty ${batch.availableQty <= 0 ? "qty-zero" : "qty-avail"}`}>{batch.availableQty.toLocaleString("en-IN")}</span></td>
                      <td><SellThroughBar produced={batch.producedQty} sold={batch.soldQty} /></td>
                      <td><LabBadge status={batch.labTestStatus} /></td>
                      <td><BatchStatusBadge batch={batch} /></td>
                      <td><span className="bm-supervisor"><i className="pi pi-user" />{batch.supervisor}</span></td>
                      <td>
                        <div className="bm-actions">
                          <button className="bm-icon-btn btn-view" title="View Details" onClick={() => onView(batch)}>
                            <i className="pi pi-eye" />
                          </button>
                          <button className="bm-icon-btn btn-edit" title="Edit Batch" onClick={() => onEdit(batch)}>
                            <i className="pi pi-pencil" />
                          </button>
                          {status !== "Recalled" && (
                            <button className="bm-icon-btn btn-recall" title="Recall Batch" onClick={() => onRecall(batch.id)}>
                              <i className="pi pi-ban" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bm-pagination">
            <span className="bm-pg-info">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} batches</span>
            <div className="bm-pg-controls">
              <button className="bm-pg-btn" disabled={page === 1} onClick={() => setPage(1)}><i className="pi pi-angle-double-left" /></button>
              <button className="bm-pg-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><i className="pi pi-angle-left" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`bm-pg-btn bm-pg-num ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="bm-pg-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}><i className="pi pi-angle-right" /></button>
              <button className="bm-pg-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}><i className="pi pi-angle-double-right" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Batch Detail Modal
// ─────────────────────────────────────────────
const BatchDetailModal = ({ batch, onClose }) => {
  const status = getBatchStatus(batch);
  const days   = getDaysToExpiry(batch.expiryDate);
  const sellPct = batch.producedQty > 0 ? Math.round((batch.soldQty / batch.producedQty) * 100) : 0;
  return (
    <div className="bm-modal-overlay" onClick={onClose}>
      <div className="bm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bm-modal-hdr">
          <div>
            <h2>{batch.batchNo}</h2>
            <p>{batch.product}</p>
          </div>
          <div className="bm-modal-hdr-right">
            <BatchStatusBadge batch={batch} />
            <button className="bm-modal-close" onClick={onClose}><i className="pi pi-times" /></button>
          </div>
        </div>
        <div className="bm-modal-body">
          <div className="bm-modal-grid">
            <div className="bm-modal-section">
              <h4>Batch Info</h4>
              <div className="bm-detail-rows">
                <div className="bm-detail-row"><span>Batch Number</span><strong>{batch.batchNo}</strong></div>
                <div className="bm-detail-row"><span>Product</span><strong>{batch.product}</strong></div>
                <div className="bm-detail-row"><span>Category</span><strong>{batch.category}</strong></div>
                <div className="bm-detail-row"><span>Warehouse</span><strong>{batch.warehouse}</strong></div>
                <div className="bm-detail-row"><span>Supervisor</span><strong>{batch.supervisor}</strong></div>
                <div className="bm-detail-row"><span>Lab Test</span><LabBadge status={batch.labTestStatus} /></div>
              </div>
            </div>
            <div className="bm-modal-section">
              <h4>Dates</h4>
              <div className="bm-detail-rows">
                <div className="bm-detail-row"><span>Manufacturing Date</span><strong>{batch.mfgDate}</strong></div>
                <div className="bm-detail-row"><span>Expiry Date</span><strong>{batch.expiryDate}</strong></div>
                <div className="bm-detail-row"><span>Days to Expiry</span><ExpiryCountdown expiryDate={batch.expiryDate} /></div>
              </div>
            </div>
            <div className="bm-modal-section">
              <h4>Quantity</h4>
              <div className="bm-detail-rows">
                <div className="bm-detail-row"><span>Produced Qty</span><strong>{batch.producedQty.toLocaleString("en-IN")}</strong></div>
                <div className="bm-detail-row"><span>Sold Qty</span><strong className="text-blue">{batch.soldQty.toLocaleString("en-IN")}</strong></div>
                <div className="bm-detail-row"><span>Available Qty</span><strong className={batch.availableQty <= 0 ? "text-red" : "text-green"}>{batch.availableQty.toLocaleString("en-IN")}</strong></div>
                <div className="bm-detail-row"><span>Sell-Through</span><strong>{sellPct}%</strong></div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <SellThroughBar produced={batch.producedQty} sold={batch.soldQty} />
              </div>
            </div>
          </div>
          {batch.notes && (
            <div className="bm-modal-notes">
              <h4><i className="pi pi-comment" /> Notes</h4>
              <p>{batch.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: Create Batch Form
// ─────────────────────────────────────────────
const WAREHOUSES = ["Rajkot Main", "Ahmedabad Hub", "Surat Depot"];
const SUPERVISORS = ["Bhavesh Shah", "Kiran Patel", "Dinesh Mehta", "Priya Nair", "Admin User"];

const CreateBatch = ({ batches, onSave }) => {
  const autoNum = generateBatchNumber(batches);
  const today   = new Date().toISOString().slice(0, 10);
  const nextYear = `${new Date().getFullYear() + 1}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  const [form, setForm] = useState({
    batchNo: autoNum,
    product: BATCH_PRODUCTS[0],
    category: "Retail Pack",
    mfgDate: today,
    expiryDate: nextYear,
    producedQty: "",
    soldQty: "0",
    warehouse: "Rajkot Main",
    supervisor: "Bhavesh Shah",
    labTestStatus: "Passed",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved]   = useState(false);

  const set = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.batchNo.trim())    e.batchNo    = "Batch number is required.";
    if (!form.product)           e.product    = "Select a product.";
    if (!form.mfgDate)           e.mfgDate    = "Manufacturing date required.";
    if (!form.expiryDate)        e.expiryDate = "Expiry date required.";
    if (form.expiryDate <= form.mfgDate) e.expiryDate = "Expiry must be after manufacturing date.";
    if (!form.producedQty || Number(form.producedQty) <= 0) e.producedQty = "Enter produced quantity.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const sold = Number(form.soldQty) || 0;
    const prod = Number(form.producedQty);
    onSave({
      ...form,
      id: `B${Date.now()}`,
      producedQty: prod,
      soldQty: sold,
      availableQty: prod - sold,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      const newNum = generateBatchNumber([...batches, form]);
      setForm({ batchNo: newNum, product: BATCH_PRODUCTS[0], category: "Retail Pack", mfgDate: today, expiryDate: nextYear, producedQty: "", soldQty: "0", warehouse: "Rajkot Main", supervisor: "Bhavesh Shah", labTestStatus: "Passed", notes: "" });
    }, 1800);
  };

  const regenerate = () => set("batchNo", generateBatchNumber(batches));

  const preview = {
    avail: (Number(form.producedQty) || 0) - (Number(form.soldQty) || 0),
    sellPct: form.producedQty > 0 ? Math.round(((Number(form.soldQty) || 0) / Number(form.producedQty)) * 100) : 0,
  };

  return (
    <div className="bm-section bm-create-layout">
      {/* Main Form */}
      <div className="widget-card bm-form-card">
        <div className="bm-form-hdr">
          <i className="pi pi-plus-circle" /><span>Create New Batch</span>
        </div>
        <form className="bm-form-fields" onSubmit={handleSubmit} noValidate>
          {/* Batch Number — auto generated */}
          <div className={`bm-field ${errors.batchNo ? "field-err" : ""}`}>
            <label>Batch Number <span className="req">*</span>
              <span className="bm-auto-tag">Auto Generated</span>
            </label>
            <div className="bm-batch-no-wrap">
              <input
                type="text"
                value={form.batchNo}
                onChange={(e) => set("batchNo", e.target.value.toUpperCase())}
                className="bm-input bm-mono"
                placeholder="JMO-2026-001"
              />
              <button type="button" className="bm-regen-btn" onClick={regenerate} title="Re-generate">
                <i className="pi pi-refresh" />
              </button>
            </div>
            {errors.batchNo && <span className="bm-err">{errors.batchNo}</span>}
            <span className="bm-hint">Format: JMO-YYYY-NNN · Click refresh to auto-generate</span>
          </div>

          {/* Product + Category */}
          <div className="bm-field-row">
            <div className={`bm-field ${errors.product ? "field-err" : ""}`}>
              <label>Product <span className="req">*</span></label>
              <select value={form.product} onChange={(e) => set("product", e.target.value)} className="bm-input bm-select-field">
                {BATCH_PRODUCTS.map((p) => <option key={p}>{p}</option>)}
              </select>
              {errors.product && <span className="bm-err">{errors.product}</span>}
            </div>
            <div className="bm-field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="bm-input bm-select-field">
                {["Retail Pack", "Bulk Pack", "Institutional", "Gift Pack"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="bm-field-row">
            <div className={`bm-field ${errors.mfgDate ? "field-err" : ""}`}>
              <label>Manufacturing Date <span className="req">*</span></label>
              <input type="date" value={form.mfgDate} onChange={(e) => set("mfgDate", e.target.value)} className="bm-input" />
              {errors.mfgDate && <span className="bm-err">{errors.mfgDate}</span>}
            </div>
            <div className={`bm-field ${errors.expiryDate ? "field-err" : ""}`}>
              <label>Expiry Date <span className="req">*</span></label>
              <input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} className="bm-input" />
              {errors.expiryDate && <span className="bm-err">{errors.expiryDate}</span>}
              {form.mfgDate && form.expiryDate && !errors.expiryDate && (
                <span className="bm-hint text-green">{getDaysToExpiry(form.expiryDate)} days shelf life</span>
              )}
            </div>
          </div>

          {/* Quantities */}
          <div className="bm-field-row three-col">
            <div className={`bm-field ${errors.producedQty ? "field-err" : ""}`}>
              <label>Produced Qty <span className="req">*</span></label>
              <input type="number" min="1" value={form.producedQty} onChange={(e) => set("producedQty", e.target.value)} placeholder="0" className="bm-input" />
              {errors.producedQty && <span className="bm-err">{errors.producedQty}</span>}
            </div>
            <div className="bm-field">
              <label>Sold Qty</label>
              <input type="number" min="0" max={form.producedQty} value={form.soldQty} onChange={(e) => set("soldQty", e.target.value)} placeholder="0" className="bm-input" />
            </div>
            <div className="bm-field">
              <label>Available Qty <span className="bm-calculated">(auto)</span></label>
              <div className={`bm-calculated-val ${preview.avail < 0 ? "calc-neg" : ""}`}>{form.producedQty ? Math.max(0, preview.avail) : "—"}</div>
            </div>
          </div>

          {/* Warehouse + Supervisor + Lab */}
          <div className="bm-field-row three-col">
            <div className="bm-field">
              <label>Warehouse</label>
              <select value={form.warehouse} onChange={(e) => set("warehouse", e.target.value)} className="bm-input bm-select-field">
                {WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div className="bm-field">
              <label>Supervisor</label>
              <select value={form.supervisor} onChange={(e) => set("supervisor", e.target.value)} className="bm-input bm-select-field">
                {SUPERVISORS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="bm-field">
              <label>Lab Test Status</label>
              <select value={form.labTestStatus} onChange={(e) => set("labTestStatus", e.target.value)} className="bm-input bm-select-field">
                <option>Passed</option>
                <option>Failed</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="bm-field">
            <label>Notes / Remarks</label>
            <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Batch quality observations, supplier details, special handling…" className="bm-input bm-textarea" />
          </div>

          <button type="submit" className={`admin-action-btn bm-submit-btn ${saved ? "btn-done" : ""}`}>
            <i className={`pi ${saved ? "pi-check" : "pi-plus-circle"} mr-2`} />
            {saved ? "Batch Created!" : "Create Batch"}
          </button>
        </form>
      </div>

      {/* Live Preview Sidebar */}
      <div className="bm-create-side">
        <div className="widget-card bm-preview-card">
          <div className="bm-form-hdr bm-form-hdr-sm">
            <i className="pi pi-id-card" /><span>Batch Preview</span>
          </div>
          <div className="bm-preview-list">
            <div className="bm-preview-row"><span>Batch No</span><strong className="bm-mono">{form.batchNo || "—"}</strong></div>
            <div className="bm-preview-row"><span>Product</span><strong>{form.product}</strong></div>
            <div className="bm-preview-row"><span>Category</span><strong>{form.category}</strong></div>
            <div className="bm-preview-row"><span>Mfg Date</span><strong>{form.mfgDate || "—"}</strong></div>
            <div className="bm-preview-row"><span>Expiry Date</span><strong>{form.expiryDate || "—"}</strong></div>
            <div className="bm-preview-row"><span>Produced</span><strong>{form.producedQty ? Number(form.producedQty).toLocaleString("en-IN") : "—"}</strong></div>
            <div className="bm-preview-row"><span>Sold</span><strong>{form.soldQty ? Number(form.soldQty).toLocaleString("en-IN") : "0"}</strong></div>
            <div className="bm-preview-row">
              <span>Available</span>
              <strong className={preview.avail < 0 ? "text-red" : "text-green"}>{form.producedQty ? Math.max(0, preview.avail).toLocaleString("en-IN") : "—"}</strong>
            </div>
            <div className="bm-preview-row"><span>Warehouse</span><strong>{form.warehouse}</strong></div>
            <div className="bm-preview-row"><span>Supervisor</span><strong>{form.supervisor}</strong></div>
            <div className="bm-preview-row"><span>Lab Test</span><LabBadge status={form.labTestStatus} /></div>
          </div>
        </div>

        <div className="widget-card bm-preview-card">
          <div className="bm-form-hdr bm-form-hdr-sm">
            <i className="pi pi-info-circle" /><span>Guidelines</span>
          </div>
          <ul className="bm-guide-list">
            <li><i className="pi pi-check-circle text-green" />Batch number auto-follows JMO-YYYY-NNN format</li>
            <li><i className="pi pi-check-circle text-green" />Lab test must pass before batch is activated</li>
            <li><i className="pi pi-check-circle text-green" />Expiry = Mfg Date + 12 months (standard)</li>
            <li><i className="pi pi-check-circle text-green" />Available Qty is auto-calculated</li>
            <li><i className="pi pi-check-circle text-green" />Batches expiring within 30 days get alert badge</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TAB: Batch Reports
// ─────────────────────────────────────────────
const BatchReports = ({ batches }) => {
  const today = new Date();

  const stats = useMemo(() => {
    const total       = batches.length;
    const active      = batches.filter((b) => getBatchStatus(b) === "Active").length;
    const expiringSoon= batches.filter((b) => getBatchStatus(b) === "Expiring Soon").length;
    const expired     = batches.filter((b) => getBatchStatus(b) === "Expired").length;
    const recalled    = batches.filter((b) => getBatchStatus(b) === "Recalled").length;
    const fullySold   = batches.filter((b) => getBatchStatus(b) === "Fully Sold").length;
    const totalProduced = batches.reduce((s, b) => s + b.producedQty, 0);
    const totalSold     = batches.reduce((s, b) => s + b.soldQty, 0);
    const totalAvail    = batches.reduce((s, b) => s + b.availableQty, 0);
    const avgSellThru   = totalProduced > 0 ? Math.round((totalSold / totalProduced) * 100) : 0;
    return { total, active, expiringSoon, expired, recalled, fullySold, totalProduced, totalSold, totalAvail, avgSellThru };
  }, [batches]);

  // Product-wise aggregation
  const byProduct = useMemo(() => {
    const map = {};
    batches.forEach((b) => {
      if (!map[b.product]) map[b.product] = { product: b.product, batches: 0, produced: 0, sold: 0, available: 0 };
      map[b.product].batches++;
      map[b.product].produced   += b.producedQty;
      map[b.product].sold       += b.soldQty;
      map[b.product].available  += b.availableQty;
    });
    return Object.values(map).sort((a, b) => b.produced - a.produced);
  }, [batches]);

  return (
    <div className="bm-section">
      {/* Summary KPI Row */}
      <div className="bm-report-kpi-grid">
        <Kpi label="Total Batches"      value={stats.total}               icon="pi-list"                  color="kpi-blue"  sub="All time" />
        <Kpi label="Active Batches"     value={stats.active}              icon="pi-check-circle"           color="kpi-green" sub="Currently live" />
        <Kpi label="Expiring Soon"      value={stats.expiringSoon}        icon="pi-exclamation-triangle"   color="kpi-amber" sub="Within 30 days" />
        <Kpi label="Expired Batches"    value={stats.expired}             icon="pi-times-circle"           color="kpi-red"   sub="Past expiry" />
        <Kpi label="Recalled Batches"   value={stats.recalled}            icon="pi-ban"                    color="kpi-dark"  sub="Quality failure" />
        <Kpi label="Fully Sold"         value={stats.fullySold}           icon="pi-check"                  color="kpi-blue"  sub="Zero stock" />
      </div>

      {/* Volume Stats */}
      <div className="bm-volume-cards">
        <div className="widget-card bm-volume-card">
          <div className="bm-vol-icon kpi-blue"><i className="pi pi-box" /></div>
          <span className="bm-vol-label">Total Produced</span>
          <span className="bm-vol-value">{stats.totalProduced.toLocaleString("en-IN")}</span>
          <span className="bm-vol-sub">units across all batches</span>
        </div>
        <div className="widget-card bm-volume-card">
          <div className="bm-vol-icon kpi-green"><i className="pi pi-arrow-right" /></div>
          <span className="bm-vol-label">Total Sold</span>
          <span className="bm-vol-value">{stats.totalSold.toLocaleString("en-IN")}</span>
          <span className="bm-vol-sub">units dispatched</span>
        </div>
        <div className="widget-card bm-volume-card">
          <div className="bm-vol-icon kpi-amber"><i className="pi pi-warehouse" /></div>
          <span className="bm-vol-label">Total Available</span>
          <span className="bm-vol-value">{stats.totalAvail.toLocaleString("en-IN")}</span>
          <span className="bm-vol-sub">units in stock</span>
        </div>
        <div className="widget-card bm-volume-card">
          <div className="bm-vol-icon kpi-gold"><i className="pi pi-percentage" /></div>
          <span className="bm-vol-label">Avg Sell-Through</span>
          <span className="bm-vol-value">{stats.avgSellThru}%</span>
          <span className="bm-vol-sub">across all batches</span>
        </div>
      </div>

      {/* Product-wise table */}
      <div className="widget-card bm-table-card">
        <div className="bm-table-hdr">
          <span className="bm-table-title">Product-wise Batch Performance</span>
        </div>
        <div className="table-responsive">
          <table className="bm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="th-num">Batches</th>
                <th className="th-num">Total Produced</th>
                <th className="th-num">Total Sold</th>
                <th className="th-num">Available</th>
                <th>Sell-Through</th>
              </tr>
            </thead>
            <tbody>
              {byProduct.map((row, idx) => (
                <tr key={row.product} className="bm-row">
                  <td><span className="bm-rank">{idx + 1}</span></td>
                  <td className="td-product"><span className="bm-product-name">{row.product}</span></td>
                  <td className="td-num"><span className="bm-qty">{row.batches}</span></td>
                  <td className="td-num"><span className="bm-qty">{row.produced.toLocaleString("en-IN")}</span></td>
                  <td className="td-num"><span className="bm-qty qty-sold">{row.sold.toLocaleString("en-IN")}</span></td>
                  <td className="td-num"><span className={`bm-qty ${row.available <= 0 ? "qty-zero" : "qty-avail"}`}>{row.available.toLocaleString("en-IN")}</span></td>
                  <td style={{ minWidth: "160px" }}><SellThroughBar produced={row.produced} sold={row.sold} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Batch Management View
// ─────────────────────────────────────────────
const TABS = [
  { key: "create",   label: "Create Batch",      icon: "pi-plus-circle" },
  { key: "all",      label: "All Batches",        icon: "pi-list" },
  { key: "active",   label: "Active Batches",     icon: "pi-check-circle" },
  { key: "expired",  label: "Expired Batches",    icon: "pi-times-circle" },
  { key: "reports",  label: "Batch Reports",      icon: "pi-chart-bar" },
];

const BatchManagementView = () => {
  const batches = useAdminStore((state) => state.batches);
  const addBatch = useAdminStore((state) => state.addBatch);
  const recallBatch = useAdminStore((state) => state.recallBatch);
  const updateBatch = useAdminStore((state) => state.updateBatch);

  const [activeTab, setTab]     = useState("all");
  const [viewBatch, setViewBatch] = useState(null);
  const [editBatch, setEditBatch] = useState(null);

  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("All");
  const [prodFilter, setProd] = useState("All");

  const expiringSoonCount = batches.filter((b) => getBatchStatus(b) === "Expiring Soon").length;
  const expiredCount      = batches.filter((b) => getBatchStatus(b) === "Expired").length;

  const allBatches      = batches;
  const activeBatches   = batches.filter((b) => ["Active", "Expiring Soon", "Fully Sold"].includes(getBatchStatus(b)));
  const expiredBatches  = batches.filter((b) => ["Expired", "Recalled"].includes(getBatchStatus(b)));

  const handleSave = (newBatch) => {
    if (editBatch) {
      updateBatch(editBatch.id, newBatch);
      setEditBatch(null);
    } else {
      addBatch(newBatch);
    }
    setTimeout(() => setTab("all"), 200);
  };

  const handleRecall = (id) => {
    recallBatch(id);
  };

  const handleEdit = (batch) => {
    setEditBatch(batch);
    setTab("create");
  };

  return (
    <div className="admin-view-container bm-root">
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Batch Management</h1>
          <p className="admin-page-subtitle">Track oil production batches, monitor expiry dates, and manage quality compliance.</p>
        </div>
      </div>

      {/* Sticky Action Header */}
      <div className="admin-sticky-action-bar">
        {/* ── Tab Nav ── */}
        <div className="bm-tabs-nav" style={{ margin: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`bm-tab-btn ${activeTab === tab.key ? "is-active" : ""}`}
              onClick={() => setTab(tab.key)}
            >
              <i className={`pi ${tab.icon}`} />
              <span>{tab.label}</span>
              {tab.key === "expired" && expiredCount > 0 && <span className="bm-tab-badge">{expiredCount}</span>}
              {tab.key === "active"  && expiringSoonCount > 0 && <span className="bm-tab-badge amber">{expiringSoonCount}</span>}
            </button>
          ))}
        </div>

        {/* Toolbar (Only for list tabs) */}
        {(activeTab === "all" || activeTab === "active" || activeTab === "expired") && (
          <div className="widget-card bm-toolbar">
            <div className="bm-search-wrap">
              <i className="pi pi-search bm-search-icon" />
              <input
                type="text"
                className="bm-search-input"
                placeholder="Search batch no., product, supervisor…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <button className="bm-search-clear" onClick={() => setSearch("")}><i className="pi pi-times" /></button>}
            </div>
            <div className="bm-filters">
              <div className="bm-filter-group">
                <label>Category</label>
                <select value={catFilter} onChange={(e) => setCat(e.target.value)} className="bm-select">
                  {BATCH_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="bm-filter-group">
                <label>Product</label>
                <select value={prodFilter} onChange={(e) => setProd(e.target.value)} className="bm-select">
                  {BATCH_PRODUCTS_FILTER.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <button className="admin-action-btn" onClick={() => setTab("create")} style={{ marginLeft: "12px" }}>
                <i className="pi pi-plus mr-2" />New Batch
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Tab Content ── */}
      <div className="bm-tab-content">
        {activeTab === "create"  && <CreateBatch batches={batches} onSave={handleSave} />}
        {activeTab === "all"     && <BatchesTable batches={allBatches}     title="All Batches"     onView={setViewBatch} onEdit={handleEdit} onRecall={handleRecall} search={search} setSearch={setSearch} catFilter={catFilter} setCat={setCat} prodFilter={prodFilter} setProd={setProd} />}
        {activeTab === "active"  && <BatchesTable batches={activeBatches}  title="Active Batches"  onView={setViewBatch} onEdit={handleEdit} onRecall={handleRecall} search={search} setSearch={setSearch} catFilter={catFilter} setCat={setCat} prodFilter={prodFilter} setProd={setProd} />}
        {activeTab === "expired" && <BatchesTable batches={expiredBatches} title="Expired & Recalled Batches" onView={setViewBatch} onEdit={handleEdit} onRecall={handleRecall} search={search} setSearch={setSearch} catFilter={catFilter} setCat={setCat} prodFilter={prodFilter} setProd={setProd} />}
        {activeTab === "reports" && <BatchReports batches={batches} />}
      </div>

      {/* Detail Modal */}
      {viewBatch && <BatchDetailModal batch={viewBatch} onClose={() => setViewBatch(null)} />}
    </div>
  );
};

export default BatchManagementView;
