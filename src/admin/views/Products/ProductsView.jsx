import React, { useState, useMemo, useRef } from "react";
import { initialProducts, CATEGORIES, STATUS_OPTIONS } from "./productsData";
import { useMediaStore } from "../../../shared/useMediaStore";
import AppButton from "../../../shared/components/ui/AppButton";
import AppInput from "../../../shared/components/ui/AppInput";
import AppTextarea from "../../../shared/components/ui/AppTextarea";
import AppSelect from "../../../shared/components/ui/AppSelect";
import AppModal from "../../../shared/components/ui/AppModal";
import "./ProductsView.scss";
import axios from "axios";
import { useEffect } from "react";

const ITEMS_PER_PAGE = 8;

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    Active: "pbadge-green",
    Inactive: "pbadge-gray",
    Draft: "pbadge-blue",
    "Out of Stock": "pbadge-red",
  };
  return <span className={`p-status-badge ${map[status] || "pbadge-gray"}`}>{status}</span>;
};

// ─────────────────────────────────────────────
// Confirm Delete Modal
// ─────────────────────────────────────────────
const ConfirmModal = ({ product, onConfirm, onCancel }) => (
  <AppModal
    visible={!!product}
    onHide={onCancel}
    maskClassName="pm-modal-overlay"
    className="pm-modal"
  >
    <div className="pm-modal-icon">
      <i className="pi pi-trash" />
    </div>
    <h3>Delete Product?</h3>
    <p>
      Are you sure you want to delete <strong>{product?.name}</strong>? This
      action cannot be undone.
    </p>
    <div className="pm-modal-actions">
      <AppButton className="pm-btn pm-btn-ghost" onClick={onCancel}>
        Cancel
      </AppButton>
      <AppButton className="pm-btn pm-btn-danger" onClick={onConfirm}>
        <i className="pi pi-trash mr-2" /> Delete
      </AppButton>
    </div>
  </AppModal>
);

// ─────────────────────────────────────────────
// All Products List View
// ─────────────────────────────────────────────
const AllProducts = ({ products, onAdd, onEdit, onDelete, onToggleStatus }) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [confirmProduct, setConfirmProduct] = useState(null);

  // ── Filtering & Sorting ──
  const filtered = useMemo(() => {
    let data = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "All")
      data = data.filter((p) => p.category === categoryFilter);
    if (statusFilter !== "All")
      data = data.filter((p) => p.status === statusFilter);

    data.sort((a, b) => {
      let aVal = a[sortCol];
      let bVal = b[sortCol];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [products, search, categoryFilter, statusFilter, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  };

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCategory = (e) => { setCategoryFilter(e.value); setPage(1); };
  const handleStatus = (e) => { setStatusFilter(e.value); setPage(1); };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <i className="pi pi-sort sort-icon muted" />;
    return sortDir === "asc"
      ? <i className="pi pi-sort-up sort-icon active" />
      : <i className="pi pi-sort-down sort-icon active" />;
  };

  // Summary counts
  const activeCount = products.filter((p) => p.status === "Active").length;
  const draftCount = products.filter((p) => p.status === "Draft").length;
  const ooStockCount = products.filter((p) => p.status === "Out of Stock").length;

  return (
    <div className="pm-all-products">
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products Catalogue</h1>
          <p className="admin-page-subtitle">
            Manage all Janmotri Oil products, pricing, descriptions, and stock status.
          </p>
        </div>
      </div>

      {/* ── Summary Stat Strip ── */}
      <div className="pm-stat-strip">
        <div className="pm-stat-item">
          <span className="pm-stat-num">{products.length}</span>
          <span className="pm-stat-label">Total Products</span>
        </div>
        <div className="pm-stat-divider" />
        <div className="pm-stat-item">
          <span className="pm-stat-num green">{activeCount}</span>
          <span className="pm-stat-label">Active</span>
        </div>
        <div className="pm-stat-divider" />
        <div className="pm-stat-item">
          <span className="pm-stat-num blue">{draftCount}</span>
          <span className="pm-stat-label">Draft</span>
        </div>
        <div className="pm-stat-divider" />
        <div className="pm-stat-item">
          <span className="pm-stat-num red">{ooStockCount}</span>
          <span className="pm-stat-label">Out of Stock</span>
        </div>
        <div className="pm-stat-divider" />
        <div className="pm-stat-item">
          <span className="pm-stat-num">{filtered.length}</span>
          <span className="pm-stat-label">Showing</span>
        </div>
      </div>

      {/* Sticky Action Header */}
      <div className="admin-sticky-action-bar">
        {/* ── Search + Filters Toolbar ── */}
        <div className="widget-card pm-toolbar">
          <div className="pm-search-wrap">
            <i className="pi pi-search pm-search-icon" />
            <AppInput
              type="text"
              className="pm-search-input"
              placeholder="Search by name, SKU, or category…"
              value={search}
              onChange={handleSearch}
            />
            {search && (
              <AppButton className="pm-search-clear" onClick={() => { setSearch(""); setPage(1); }}>
                <i className="pi pi-times" />
              </AppButton>
            )}
          </div>
          <div className="pm-filters-wrap">
            <div className="pm-filter-group">
              <label>Category</label>
              <AppSelect
                value={categoryFilter}
                onChange={handleCategory}
                options={CATEGORIES}
                className="pm-select"
              />
            </div>
            <div className="pm-filter-group">
              <label>Status</label>
              <AppSelect
                value={statusFilter}
                onChange={handleStatus}
                options={STATUS_OPTIONS}
                className="pm-select"
              />
            </div>
            {(search || categoryFilter !== "All" || statusFilter !== "All") && (
              <AppButton
                className="pm-btn pm-btn-ghost pm-clear-filters"
                onClick={() => { setSearch(""); setCategoryFilter("All"); setStatusFilter("All"); setPage(1); }}
              >
                <i className="pi pi-filter-slash mr-2" /> Clear
              </AppButton>
            )}
          </div>
          <AppButton className="admin-action-btn" onClick={onAdd}>
            <i className="pi pi-plus mr-2" /> Add New Product
          </AppButton>
        </div>
      </div>

      {/* ── Enterprise Table ── */}
      <div className="widget-card pm-table-card">
        {paginated.length === 0 ? (
          <div className="pm-empty-state">
            <i className="pi pi-box pm-empty-icon" />
            <p>No products found matching your search or filters.</p>
            <AppButton className="pm-btn pm-btn-ghost" onClick={() => { setSearch(""); setCategoryFilter("All"); setStatusFilter("All"); }}>
              Clear Filters
            </AppButton>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="pm-table">
              <thead>
                <tr>
                  <th className="th-img">Image</th>
                  <th className="th-sortable" onClick={() => handleSort("name")}>
                    Product <SortIcon col="name" />
                  </th>
                  <th className="th-sortable" onClick={() => handleSort("sku")}>
                    SKU <SortIcon col="sku" />
                  </th>
                  <th className="th-sortable" onClick={() => handleSort("category")}>
                    Category <SortIcon col="category" />
                  </th>
                  <th className="th-sortable" onClick={() => handleSort("price")}>
                    Price <SortIcon col="price" />
                  </th>
                  <th className="th-sortable" onClick={() => handleSort("mrp")}>
                    MRP <SortIcon col="mrp" />
                  </th>
                  <th className="th-sortable" onClick={() => handleSort("stock")}>
                    Stock <SortIcon col="stock" />
                  </th>
                  <th className="th-sortable" onClick={() => handleSort("status")}>
                    Status <SortIcon col="status" />
                  </th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => {
                  const discount =
                    product.mrp && product.mrp > product.price
                      ? Math.round(
                        ((product.mrp - product.price) /
                          product.mrp) *
                        100
                      )
                      : 0;
                  return (
                    <tr key={product._id} className="pm-table-row">
                      {/* Image */}
                      <td className="td-img">
                        <div className="pm-thumb">
                          <img
                            src={product.images?.[0] || ""}
                            alt={product.name}
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        </div>
                      </td>

                      {/* Product Info */}
                      <td className="td-product">
                        <div className="pm-product-info">
                          <span className="pm-product-name">{product.name}</span>
                          <span className="pm-product-desc">
                            {(product.shortDescription || product.description || "")
                              .slice(0, 70)}
                          </span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td>
                        <span className="pm-sku-tag">{product.sku || "-"}</span>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="pm-category-tag">{product.category || "-"}</span>
                      </td>

                      {/* Price */}
                      <td>
                        <div className="pm-price-block">
                          <span className="pm-price">₹{product.price.toLocaleString("en-IN")}</span>
                          {discount > 0 && (
                            <span className="pm-discount">{discount}% off</span>
                          )}
                        </div>
                      </td>

                      {/* MRP */}
                      <td>
                        <span className="pm-mrp">₹{(product.mrp || product.price).toLocaleString("en-IN")}</span>
                      </td>

                      {/* Stock */}
                      <td>
                        <span className={`pm-stock-num ${product.stock <= 0 ? "stock-zero" : product.stock <= 10 ? "stock-low" : "stock-ok"}`}>
                          {product.stock}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td>
                        <StatusBadge status={product.status} />
                      </td>

                      {/* Actions */}
                      <td className="td-actions">
                        <div className="pm-action-btns">
                          <AppButton
                            className="pm-icon-btn btn-edit"
                            title="Edit Product"
                            onClick={() => onEdit(product)}
                          >
                            <i className="pi pi-pencil" />
                          </AppButton>
                          <AppButton
                            className="pm-icon-btn btn-toggle"
                            title={product.status === "Active" ? "Deactivate" : "Activate"}
                            onClick={() => onToggleStatus(product._id)}
                          >
                            <i className={`pi ${product.status === "Active" ? "pi-eye-slash" : "pi-eye"}`} />
                          </AppButton>
                          <AppButton
                            className="pm-icon-btn btn-delete"
                            title="Delete Product"
                            onClick={() => setConfirmProduct(product)}
                          >
                            <i className="pi pi-trash" />
                          </AppButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Footer ── */}
        {filtered.length > ITEMS_PER_PAGE && (
          <div className="pm-pagination">
            <span className="pm-pagination-info">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} products
            </span>
            <div className="pm-pagination-controls">
              <AppButton
                className="pm-page-btn"
                disabled={page === 1}
                onClick={() => setPage(1)}
                title="First"
              >
                <i className="pi pi-angle-double-left" />
              </AppButton>
              <AppButton
                className="pm-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                title="Previous"
              >
                <i className="pi pi-angle-left" />
              </AppButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="pm-page-ellipsis">…</span>
                  ) : (
                    <AppButton
                      key={p}
                      className={`pm-page-btn pm-page-num ${page === p ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </AppButton>
                  )
                )}
              <AppButton
                className="pm-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                title="Next"
              >
                <i className="pi pi-angle-right" />
              </AppButton>
              <AppButton
                className="pm-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
                title="Last"
              >
                <i className="pi pi-angle-double-right" />
              </AppButton>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmProduct && (
        <ConfirmModal
          product={confirmProduct}
          onConfirm={() => {
            onDelete(confirmProduct._id);
            setConfirmProduct(null);
          }}
          onCancel={() => setConfirmProduct(null)}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Product Form — Add / Edit
// ─────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  sku: "",
  category: "Retail Pack",
  price: "",
  mrp: "",
  shortDescription: "",
  fullDescription: "",
  images: [],
  status: "Draft",
  stock: "",
};

const ProductForm = ({ mode, product, onSave, onCancel }) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(isEdit ? { ...product } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState(isEdit ? [...(product.images || [])] : []);
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  // Media picker modal states
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const mediaItems = useMediaStore((state) => state.mediaItems);
  const productMedia = useMemo(() => {
    return mediaItems.filter(item => item.category === "Products");
  }, [mediaItems]);

  const selectLibraryImage = (imageUrl) => {
    if (imagePreviews.length >= 6) return;
    setImagePreviews((prev) => [...prev, imageUrl]);
    setShowMediaPicker(false);
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.sku.trim()) e.sku = "SKU is required.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = "Enter a valid selling price.";
    if (!form.mrp || isNaN(form.mrp) || Number(form.mrp) <= 0)
      e.mrp = "Enter a valid MRP.";
    if (Number(form.price) > Number(form.mrp))
      e.price = "Selling price cannot exceed MRP.";
    if (!form.shortDescription.trim()) e.shortDescription = "Short description is required.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock) || 0,
      images: imagePreviews,
      id: isEdit ? product._id : `PRD-${String(Date.now()).slice(-4)}`,
      sku: form.sku.toUpperCase(),
      updatedAt: new Date().toISOString().slice(0, 10),
      createdAt: isEdit ? product.createdAt : new Date().toISOString().slice(0, 10),
    };
    onSave(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFiles = async (files) => {
    for (const file of files) {
      const formData = new FormData();

      formData.append("image", file);

      const res = await axios.post(
        "http://localhost:5000/api/upload/product-image",
        formData
      );

      const imageUrl =
        "http://localhost:5000" +
        res.data.image;

      setImagePreviews((prev) => [
        ...prev,
        imageUrl,
      ]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const discount = form.price && form.mrp && Number(form.mrp) > 0
    ? Math.max(0, Math.round(((Number(form.mrp) - Number(form.price)) / Number(form.mrp)) * 100))
    : 0;

  return (
    <div className="pm-form-root">
      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <AppButton className="pm-back-btn" onClick={onCancel}>
            <i className="pi pi-arrow-left" /> Back to Products
          </AppButton>
          <h1 className="admin-page-title pm-mt-8">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="admin-page-subtitle">
            {isEdit
              ? `Editing: ${product.name}`
              : "Fill in the details below to create a new product listing."}
          </p>
        </div>
        <div className="pm-header-actions">
          <AppButton className="pm-btn pm-btn-ghost" onClick={onCancel}>
            Discard
          </AppButton>
          <AppButton
            className={`admin-action-btn ${saved ? "btn-saved" : ""}`}
            onClick={handleSubmit}
          >
            <i className={`pi ${saved ? "pi-check" : "pi-save"} mr-2`} />
            {saved ? "Saved!" : isEdit ? "Update Product" : "Save Product"}
          </AppButton>
        </div>
      </div>

      <form className="pm-form-grid" onSubmit={handleSubmit} noValidate>
        {/* ── Left Column: Main Info ── */}
        <div className="pm-form-col-main">

          {/* Basic Info Card */}
          <div className="widget-card pm-form-card">
            <div className="pm-form-card-header">
              <i className="pi pi-info-circle" />
              <span>Basic Information</span>
            </div>
            <div className="pm-form-fields">
              {/* Product Name */}
              <div className={`pm-field ${errors.name ? "field-error" : ""}`}>
                <label>Product Name <span className="req">*</span></label>
                <AppInput
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Janmotri Groundnut Oil — 1L Bottle"
                  className="pm-input"
                />
                {errors.name && <span className="pm-error-msg">{errors.name}</span>}
              </div>

              {/* SKU + Category */}
              <div className="pm-field-row">
                <div className={`pm-field ${errors.sku ? "field-error" : ""}`}>
                  <label>SKU <span className="req">*</span></label>
                  <AppInput
                    type="text"
                    value={form.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="e.g. JMT-001-1LB"
                    className="pm-input pm-input-mono"
                  />
                  {errors.sku && <span className="pm-error-msg">{errors.sku}</span>}
                </div>
                <div className="pm-field">
                  <label>Category <span className="req">*</span></label>
                  <AppSelect
                    value={form.category}
                    onChange={(e) => handleChange("category", e.value)}
                    options={CATEGORIES.filter((c) => c !== "All")}
                    className="pm-input pm-select-field"
                  />
                </div>
              </div>

              {/* Price + MRP */}
              <div className="pm-field-row">
                <div className={`pm-field ${errors.price ? "field-error" : ""}`}>
                  <label>Selling Price (₹) <span className="req">*</span></label>
                  <div className="pm-input-prefix-wrap">
                    <span className="pm-input-prefix">₹</span>
                    <AppInput
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      placeholder="0.00"
                      className="pm-input pm-input-with-prefix"
                    />
                  </div>
                  {errors.price && <span className="pm-error-msg">{errors.price}</span>}
                </div>
                <div className={`pm-field ${errors.mrp ? "field-error" : ""}`}>
                  <label>MRP (₹) <span className="req">*</span></label>
                  <div className="pm-input-prefix-wrap">
                    <span className="pm-input-prefix">₹</span>
                    <AppInput
                      type="number"
                      min="0"
                      value={form.mrp}
                      onChange={(e) => handleChange("mrp", e.target.value)}
                      placeholder="0.00"
                      className="pm-input pm-input-with-prefix"
                    />
                  </div>
                  {errors.mrp && <span className="pm-error-msg">{errors.mrp}</span>}
                </div>
                <div className="pm-field">
                  <label>Stock Qty</label>
                  <AppInput
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    placeholder="0"
                    className="pm-input"
                  />
                </div>
              </div>

              {/* Discount Preview */}
              {discount > 0 && (
                <div className="pm-discount-preview">
                  <i className="pi pi-tag" />
                  Customer saves <strong>₹{(Number(form.mrp) - Number(form.price)).toLocaleString("en-IN")}</strong> ({discount}% off MRP)
                </div>
              )}

              {/* Short Description */}
              <div className={`pm-field ${errors.shortDescription ? "field-error" : ""}`}>
                <label>
                  Short Description <span className="req">*</span>
                  <span className="pm-char-count">{form.shortDescription.length}/160</span>
                </label>
                <AppTextarea
                  rows={3}
                  value={form.shortDescription}
                  onChange={(e) => handleChange("shortDescription", e.target.value)}
                  maxLength={160}
                  placeholder="A brief product summary shown in cards and search results…"
                  className="pm-input pm-textarea"
                />
                {errors.shortDescription && (
                  <span className="pm-error-msg">{errors.shortDescription}</span>
                )}
              </div>

              {/* Full Description */}
              <div className="pm-field">
                <label>
                  Full Description
                  <span className="pm-char-count">{form.fullDescription.length} chars</span>
                </label>
                <AppTextarea
                  rows={7}
                  value={form.fullDescription}
                  onChange={(e) => handleChange("fullDescription", e.target.value)}
                  placeholder="Detailed product description shown on the product detail page…"
                  className="pm-input pm-textarea"
                />
              </div>
            </div>
          </div>
          {/* Image Upload Card */}
          <div className="widget-card pm-form-card">
            <div className="pm-form-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="pi pi-images" />
                <span>Product Images</span>
                <span className="pm-form-card-hint">{imagePreviews.length} / 6 images</span>
              </div>
              {imagePreviews.length < 6 && (
                <AppButton
                  type="button"
                  className="pm-btn pm-btn-ghost pm-btn-sm"
                  onClick={() => setShowMediaPicker(true)}
                  style={{ padding: '4px 8px', fontSize: '0.75rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <i className="pi pi-plus" /> Choose from Library
                </AppButton>
              )}
            </div>

            {/* Drop Zone */}
            {imagePreviews.length < 6 && (
              <div
                className={`pm-dropzone ${dragging ? "dragging" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <i className="pi pi-cloud-upload pm-drop-icon" />
                <p className="pm-drop-title">
                  {dragging ? "Drop images here" : "Drag & drop images or click to browse"}
                </p>
                <p className="pm-drop-hint">PNG, JPG, WEBP up to 5MB each · Max 6 images</p>
              </div>
            )}

            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="pm-image-grid">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className={`pm-image-item ${idx === 0 ? "is-primary" : ""}`}>
                    <img src={src} alt={`Preview ${idx + 1}`} />
                    {idx === 0 && <span className="pm-primary-badge">Primary</span>}
                    <AppButton
                      type="button"
                      className="pm-image-remove"
                      onClick={() => removeImage(idx)}
                    >
                      <i className="pi pi-times" />
                    </AppButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Status & Meta ── */}
        <div className="pm-form-col-side">
          {/* Status Card */}
          <div className="widget-card pm-form-card">
            <div className="pm-form-card-header">
              <i className="pi pi-sliders-h" />
              <span>Product Status</span>
            </div>
            <div className="pm-form-fields">
              <div className="pm-field">
                <label>Publish Status</label>
                <div className="pm-status-options">
                  {["Active", "Inactive", "Draft", "Out of Stock"].map((s) => (
                    <label key={s} className={`pm-status-radio ${form.status === s ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={form.status === s}
                        onChange={() => handleChange("status", s)}
                      />
                      <StatusBadge status={s} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Meta Card */}
          <div className="widget-card pm-form-card">
            <div className="pm-form-card-header">
              <i className="pi pi-list" />
              <span>Product Summary</span>
            </div>
            <div className="pm-summary-list">
              <div className="pm-summary-row">
                <span className="pm-summary-label">Name</span>
                <span className="pm-summary-val">{form.name || "—"}</span>
              </div>
              <div className="pm-summary-row">
                <span className="pm-summary-label">SKU</span>
                <span className="pm-summary-val pm-mono">{form.sku || "—"}</span>
              </div>
              <div className="pm-summary-row">
                <span className="pm-summary-label">Category</span>
                <span className="pm-summary-val">{form.category}</span>
              </div>
              <div className="pm-summary-row">
                <span className="pm-summary-label">Price</span>
                <span className="pm-summary-val pm-bold">
                  {form.price ? `₹${Number(form.price).toLocaleString("en-IN")}` : "—"}
                </span>
              </div>
              <div className="pm-summary-row">
                <span className="pm-summary-label">MRP</span>
                <span className="pm-summary-val">
                  {form.mrp ? `₹${Number(form.mrp).toLocaleString("en-IN")}` : "—"}
                </span>
              </div>
              {discount > 0 && (
                <div className="pm-summary-row">
                  <span className="pm-summary-label">Discount</span>
                  <span className="pm-summary-val green">{discount}% off</span>
                </div>
              )}
              <div className="pm-summary-row">
                <span className="pm-summary-label">Stock</span>
                <span className={`pm-summary-val ${form.stock <= 0 ? "red" : form.stock <= 10 ? "amber" : "green"}`}>
                  {form.stock !== "" ? form.stock : "—"}
                </span>
              </div>
              <div className="pm-summary-row">
                <span className="pm-summary-label">Images</span>
                <span className="pm-summary-val">{imagePreviews.length} uploaded</span>
              </div>
              <div className="pm-summary-row">
                <span className="pm-summary-label">Status</span>
                <span className="pm-summary-val"><StatusBadge status={form.status} /></span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <AppButton
            type="button"
            className={`admin-action-btn pm-save-side-btn ${saved ? "btn-saved" : ""}`}
            onClick={handleSubmit}
          >
            <i className={`pi ${saved ? "pi-check" : "pi-save"} mr-2`} />
            {saved ? "Saved!" : isEdit ? "Update Product" : "Save Product"}
          </AppButton>

          {isEdit && (
            <div className="pm-meta-dates">
              <div className="pm-meta-row">
                <i className="pi pi-calendar" />
                <span>Created: {product.createdAt}</span>
              </div>
              <div className="pm-meta-row">
                <i className="pi pi-clock" />
                <span>Last Updated: {product.updatedAt}</span>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Media Picker Modal */}
      <AppModal
        visible={showMediaPicker}
        onHide={() => setShowMediaPicker(false)}
        maskClassName="pm-modal-overlay"
        className="pm-modal"
        style={{ maxWidth: '650px', width: '90%', padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.05rem', fontWeight: 800 }}>
            <i className="pi pi-images" /> Choose Product Image from Library
          </h3>
          <AppButton
            type="button"
            onClick={() => setShowMediaPicker(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#94a3b8' }}
          >
            <i className="pi pi-times" />
          </AppButton>
        </div>

        {productMedia.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '24px', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>
            No product images found in the Media Library. Please upload files under the "Products" category.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '14px', maxHeight: '350px', overflowY: 'auto', padding: '4px' }}>
            {productMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => selectLibraryImage(item.imageUrl)}
                style={{
                  border: '1.5px solid rgba(0,0,0,0.06)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8fafc',
                  padding: '8px',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d32f2f'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
          <AppButton
            type="button"
            className="pm-btn pm-btn-ghost"
            onClick={() => setShowMediaPicker(false)}
          >
            Cancel
          </AppButton>
        </div>
      </AppModal>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Products View — State-based Router
// ─────────────────────────────────────────────
const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [editProduct, setEditProduct] = useState(null);

  const handleAdd = () => { setView("add"); setEditProduct(null); };
  const handleEdit = (product) => { setEditProduct(product); setView("edit"); };
  const handleCancel = () => { setView("list"); setEditProduct(null); };

  const handleSave = async (payload) => {
    try {
      const token =
        localStorage.getItem("token");

      if (view === "edit") {
        await axios.put(
          `http://localhost:5000/api/products/${payload._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      fetchProducts();

      setView("list");
      setEditProduct(null);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProducts();

    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = p.status === "Active" ? "Inactive" : "Active";
        return { ...p, status: next, updatedAt: new Date().toISOString().slice(0, 10) };
      })
    );
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-view-container pm-view-root">
      {view === "list" && (
        <AllProducts
          products={products}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}
      {view === "add" && (
        <ProductForm mode="add" product={null} onSave={handleSave} onCancel={handleCancel} />
      )}
      {view === "edit" && editProduct && (
        <ProductForm mode="edit" product={editProduct} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default ProductsView;
