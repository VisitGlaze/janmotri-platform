import React, { useState, useMemo } from "react";
import { useAdminStore } from "../../../shared/useAdminStore";
import "./ReviewsView.scss";

// Status Badge Component
const ReviewStatusBadge = ({ status }) => {
  const map = {
    Approved: "pbadge-green",
    Pending: "pbadge-amber",
    Rejected: "pbadge-red",
    Hidden: "pbadge-gray"
  };
  return <span className={`p-status-badge ${map[status] || "pbadge-gray"}`}>{status}</span>;
};

// Star Rating Component
const StarRating = ({ rating, max = 5 }) => {
  return (
    <div className="reviews-star-rating">
      {Array.from({ length: max }).map((_, idx) => (
        <i
          key={idx}
          className={`pi ${idx < rating ? "pi-star-fill" : "pi-star"} star-icon`}
        />
      ))}
    </div>
  );
};

const ReviewsView = () => {
  // Store collections & actions
  const reviews = useAdminStore((state) => state.reviews);
  const approveReview = useAdminStore((state) => state.approveReview);
  const rejectReview = useAdminStore((state) => state.rejectReview);
  const hideReview = useAdminStore((state) => state.hideReview);
  const deleteReview = useAdminStore((state) => state.deleteReview);
  const bulkUpdateReviewsStatus = useAdminStore((state) => state.bulkUpdateReviewsStatus);
  const bulkDeleteReviews = useAdminStore((state) => state.bulkDeleteReviews);

  // States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: reviews.length,
      pending: reviews.filter((r) => r.status === "Pending").length,
      approved: reviews.filter((r) => r.status === "Approved").length,
      rejected: reviews.filter((r) => r.status === "Rejected").length,
      hidden: reviews.filter((r) => r.status === "Hidden").length
    };
  }, [reviews]);

  // Filtering & Sorting
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    // Status filter
    if (statusFilter !== "All") {
      list = list.filter((r) => r.status === statusFilter);
    }

    // Rating filter
    if (ratingFilter !== "All") {
      list = list.filter((r) => r.rating === Number(ratingFilter));
    }

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.message.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      let aVal = a[sortCol];
      let bVal = b[sortCol];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [reviews, search, statusFilter, ratingFilter, sortCol, sortDir]);

  // Handle Sort
  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc"); // Default to desc (most recent first)
    }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <i className="pi pi-sort sort-icon muted" />;
    return sortDir === "asc" ? (
      <i className="pi pi-sort-up sort-icon active" />
    ) : (
      <i className="pi pi-sort-down sort-icon active" />
    );
  };

  // Row Click logic (opens details drawer)
  const handleRowClick = (e, review) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "I" ||
      e.target.closest("button") ||
      e.target.closest(".reviews-checkbox")
    ) {
      return;
    }
    setSelectedReview(review);
  };

  // Row Selection logic
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredReviews.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const allSelected =
    filteredReviews.length > 0 && selectedIds.length === filteredReviews.length;

  // Single Actions
  const handleApprove = (id) => {
    approveReview(id);
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => ({ ...prev, status: "Approved" }));
    }
  };

  const handleReject = (id) => {
    rejectReview(id);
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => ({ ...prev, status: "Rejected" }));
    }
  };

  const handleHide = (id) => {
    hideReview(id);
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => ({ ...prev, status: "Hidden" }));
    }
  };

  const handleDelete = (id) => {
    deleteReview(id);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview(null);
    }
    setConfirmDeleteId(null);
  };

  // Bulk Actions
  const handleBulkStatus = (status) => {
    bulkUpdateReviewsStatus(selectedIds, status);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} reviews?`)) {
      bulkDeleteReviews(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setRatingFilter("All");
  };

  return (
    <div className="admin-view-container reviews-view-root">
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reviews & Testimonials</h1>
          <p className="admin-page-subtitle">
            Moderate customer ratings, product feedback, and testimonials for Janmotri Oil packages.
          </p>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="reviews-stat-strip">
        <div className="reviews-stat-item">
          <span className="reviews-stat-num">{stats.total}</span>
          <span className="reviews-stat-label">Total Reviews</span>
        </div>
        <div className="reviews-stat-divider" />
        <div className="reviews-stat-item">
          <span className="reviews-stat-num amber">{stats.pending}</span>
          <span className="reviews-stat-label">Pending</span>
        </div>
        <div className="reviews-stat-divider" />
        <div className="reviews-stat-item">
          <span className="reviews-stat-num green">{stats.approved}</span>
          <span className="reviews-stat-label">Approved</span>
        </div>
        <div className="reviews-stat-divider" />
        <div className="reviews-stat-item">
          <span className="reviews-stat-num red">{stats.rejected}</span>
          <span className="reviews-stat-label">Rejected</span>
        </div>
        <div className="reviews-stat-divider" />
        <div className="reviews-stat-item">
          <span className="reviews-stat-num gray">{stats.hidden}</span>
          <span className="reviews-stat-label">Hidden</span>
        </div>
      </div>

      {/* Sticky Action Header */}
      <div className="admin-sticky-action-bar">
        {/* ── Toolbar: Search & Filters ── */}
        <div className="widget-card reviews-toolbar">
          <div className="reviews-search-wrap">
            <i className="pi pi-search reviews-search-icon" />
            <input
              type="text"
              className="reviews-search-input"
              placeholder="Search by name, product, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="reviews-search-clear" onClick={() => setSearch("")}>
                <i className="pi pi-times" />
              </button>
            )}
          </div>
          <div className="reviews-filters-wrap">
            <div className="reviews-filter-group">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="reviews-select"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
            <div className="reviews-filter-group">
              <label>Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="reviews-select"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            {(search || statusFilter !== "All" || ratingFilter !== "All") && (
              <button
                className="admin-action-btn reviews-clear-btn"
                onClick={handleClearFilters}
              >
                <i className="pi pi-filter-slash mr-2" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Bulk Actions Block ── */}
        {selectedIds.length > 0 && (
          <div className="reviews-bulk-actions" style={{ margin: 0 }}>
            <div className="bulk-selection-info">
              <i className="pi pi-check-square" />
              <span>{selectedIds.length} review(s) selected</span>
            </div>
            <div className="bulk-buttons">
              <button className="bulk-btn approve" onClick={() => handleBulkStatus("Approved")}>
                <i className="pi pi-check mr-1" /> Approve
              </button>
              <button className="bulk-btn reject" onClick={() => handleBulkStatus("Rejected")}>
                <i className="pi pi-ban mr-1" /> Reject
              </button>
              <button className="bulk-btn hide" onClick={() => handleBulkStatus("Hidden")}>
                <i className="pi pi-eye-slash mr-1" /> Hide
              </button>
              <button className="bulk-btn delete" onClick={handleBulkDelete}>
                <i className="pi pi-trash mr-1" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Reviews Directory Table ── */}
      <div className="widget-card reviews-table-card">
        <div className="reviews-table-header">
          <h3 className="reviews-table-title">
            <i className="pi pi-star mr-2 text-red" />
            Reviews Directory
          </h3>
          <span className="reviews-showing-lbl">
            Showing <strong>{filteredReviews.length}</strong> of {reviews.length} entries
          </span>
        </div>

        <div className="widget-body table-responsive">
          {filteredReviews.length === 0 ? (
            <div className="reviews-empty-state">
              <i className="pi pi-star-slash reviews-empty-icon" />
              <h3>No reviews available</h3>
              <p>No reviews found matching your search term and filters.</p>
              {(search || statusFilter !== "All" || ratingFilter !== "All") && (
                <button className="admin-action-btn mt-3" onClick={handleClearFilters}>
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <table className="admin-table reviews-table">
              <thead>
                <tr>
                  <th style={{ width: "40px", paddingRight: "0" }}>
                    <input
                      type="checkbox"
                      className="reviews-checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("id")}>
                    Review ID <SortIcon col="id" />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("customerName")}>
                    Customer Name <SortIcon col="customerName" />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("productName")}>
                    Product Name <SortIcon col="productName" />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("rating")}>
                    Rating <SortIcon col="rating" />
                  </th>
                  <th>Review Message</th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("date")}>
                    Submitted Date <SortIcon col="date" />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                    Status <SortIcon col="status" />
                  </th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((r) => {
                  const isChecked = selectedIds.includes(r.id);
                  return (
                    <tr
                      key={r.id}
                      className={isChecked ? "selected-row" : ""}
                      onClick={(e) => handleRowClick(e, r)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ paddingRight: "0" }}>
                        <input
                          type="checkbox"
                          className="reviews-checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectRow(r.id)}
                        />
                      </td>
                      <td>
                        <span className="reviews-id-tag">{r.id}</span>
                      </td>
                      <td>
                        <strong className="reviews-customer-name">{r.customerName}</strong>
                      </td>
                      <td>{r.productName}</td>
                      <td>
                        <StarRating rating={r.rating} />
                      </td>
                      <td>
                        <span className="reviews-msg-snippet" title={r.message}>
                          {r.message.length > 55 ? `${r.message.slice(0, 55)}...` : r.message}
                        </span>
                      </td>
                      <td>{r.date}</td>
                      <td>
                        <ReviewStatusBadge status={r.status} />
                      </td>
                      <td className="text-right">
                        <button
                          className="table-row-action"
                          title="View Details"
                          onClick={() => setSelectedReview(r)}
                        >
                          <i className="pi pi-eye" />
                        </button>
                        {r.status !== "Approved" && (
                          <button
                            className="table-row-action text-green"
                            title="Approve Review"
                            onClick={() => handleApprove(r.id)}
                          >
                            <i className="pi pi-check" />
                          </button>
                        )}
                        {r.status !== "Rejected" && (
                          <button
                            className="table-row-action text-danger"
                            title="Reject Review"
                            onClick={() => handleReject(r.id)}
                          >
                            <i className="pi pi-ban" />
                          </button>
                        )}
                        <button
                          className="table-row-action text-danger"
                          title="Delete Review"
                          onClick={() => setConfirmDeleteId(r.id)}
                        >
                          <i className="pi pi-trash" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Review Details Drawer ── */}
      {selectedReview && (
        <div className="reviews-drawer-overlay" onClick={() => setSelectedReview(null)}>
          <div className="reviews-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="reviews-drawer-hdr">
              <div>
                <h2>Review Details</h2>
                <span className="reviews-drawer-sub">ID: {selectedReview.id}</span>
              </div>
              <button className="reviews-drawer-close" onClick={() => setSelectedReview(null)}>
                <i className="pi pi-times" />
              </button>
            </div>

            <div className="reviews-drawer-body">
              {/* Customer Info Section */}
              <div className="reviews-drawer-section">
                <h3>Customer Information</h3>
                <div className="reviews-meta-card">
                  <div className="meta-row">
                    <span>Customer Name</span>
                    <strong>{selectedReview.customerName}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Email / Phone</span>
                    <strong>Verified Customer</strong>
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="reviews-drawer-section">
                <h3>Product Information</h3>
                <div className="reviews-meta-card">
                  <div className="meta-row">
                    <span>Target Product</span>
                    <strong>{selectedReview.productName}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Date Submitted</span>
                    <strong>{selectedReview.date}</strong>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="reviews-drawer-section">
                <h3>Rating Score</h3>
                <div className="reviews-meta-card text-center rating-score-card">
                  <div className="big-rating-number">{selectedReview.rating}</div>
                  <StarRating rating={selectedReview.rating} />
                  <span className="rating-desc">Out of 5 Stars</span>
                </div>
              </div>

              {/* Review Text Section */}
              <div className="reviews-drawer-section">
                <h3>Review Message</h3>
                <div className="reviews-meta-card review-message-card">
                  <p className="full-review-message">{selectedReview.message}</p>
                </div>
              </div>

              {/* Review Status Section */}
              <div className="reviews-drawer-section">
                <h3>Current Status</h3>
                <div className="reviews-meta-card">
                  <div className="meta-row">
                    <span>Moderation Status</span>
                    <ReviewStatusBadge status={selectedReview.status} />
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="reviews-drawer-section">
                <h3>Moderator Actions</h3>
                <div className="reviews-drawer-actions">
                  {selectedReview.status !== "Approved" && (
                    <button
                      className="drawer-action-btn approve"
                      onClick={() => handleApprove(selectedReview.id)}
                    >
                      <i className="pi pi-check mr-2" /> Approve
                    </button>
                  )}
                  {selectedReview.status !== "Rejected" && (
                    <button
                      className="drawer-action-btn reject"
                      onClick={() => handleReject(selectedReview.id)}
                    >
                      <i className="pi pi-ban mr-2" /> Reject
                    </button>
                  )}
                  {selectedReview.status !== "Hidden" && (
                    <button
                      className="drawer-action-btn hide"
                      onClick={() => handleHide(selectedReview.id)}
                    >
                      <i className="pi pi-eye-slash mr-2" /> Hide
                    </button>
                  )}
                  <button
                    className="drawer-action-btn delete"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this review?")) {
                        handleDelete(selectedReview.id);
                      }
                    }}
                  >
                    <i className="pi pi-trash mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Single Delete Modal ── */}
      {confirmDeleteId && (
        <div className="reviews-modal-overlay">
          <div className="reviews-modal">
            <div className="reviews-modal-icon">
              <i className="pi pi-exclamation-triangle" />
            </div>
            <h3>Delete Review?</h3>
            <p>
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="reviews-modal-actions">
              <button className="modal-btn cancel" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={() => handleDelete(confirmDeleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsView;
