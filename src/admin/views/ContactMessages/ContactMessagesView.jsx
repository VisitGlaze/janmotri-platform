import React, { useState, useMemo } from "react";
import { useAdminStore } from "../../../shared/useAdminStore";
import "./ContactMessagesView.scss";

// Status Badge Component
const MessageStatusBadge = ({ status }) => {
  const map = {
    New: "pbadge-red",
    Read: "pbadge-blue",
    Replied: "pbadge-green",
    Archived: "pbadge-gray"
  };
  return <span className={`p-status-badge ${map[status] || "pbadge-gray"}`}>{status}</span>;
};

const ContactMessagesView = () => {
  // Store collections & actions
  const messages = useAdminStore((state) => state.messages);
  const markMessageAsRead = useAdminStore((state) => state.markMessageAsRead);
  const markMessageAsUnread = useAdminStore((state) => state.markMessageAsUnread);
  const replyToMessage = useAdminStore((state) => state.replyToMessage);
  const archiveMessage = useAdminStore((state) => state.archiveMessage);
  const deleteMessage = useAdminStore((state) => state.deleteMessage);
  const bulkUpdateMessagesStatus = useAdminStore((state) => state.bulkUpdateMessagesStatus);
  const bulkDeleteMessages = useAdminStore((state) => state.bulkDeleteMessages);

  // States
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: messages.length,
      new: messages.filter((m) => m.status === "New").length,
      read: messages.filter((m) => m.status === "Read").length,
      replied: messages.filter((m) => m.status === "Replied").length,
      archived: messages.filter((m) => m.status === "Archived").length
    };
  }, [messages]);

  // Filtering & Sorting
  const filteredMessages = useMemo(() => {
    let list = [...messages];

    // Tab Filter
    if (activeTab !== "All") {
      list = list.filter((m) => m.status === activeTab);
    }

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.customerName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.mobile.includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
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
  }, [messages, search, activeTab, sortCol, sortDir]);

  // Handle Sort
  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
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
  const handleRowClick = (e, msg) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "I" ||
      e.target.closest("button") ||
      e.target.closest(".messages-checkbox")
    ) {
      return;
    }
    handleViewMessage(msg);
  };

  // Row Selection logic
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredMessages.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const allSelected =
    filteredMessages.length > 0 && selectedIds.length === filteredMessages.length;

  // Single Actions
  const handleViewMessage = (msg) => {
    setSelectedMsg(msg);
    if (msg.status === "New") {
      markMessageAsRead(msg.id);
    }
    setShowReplyForm(false);
    setReplyText("");
  };

  const handleToggleReadStatus = (msg) => {
    if (msg.status === "New") {
      markMessageAsRead(msg.id);
      if (selectedMsg && selectedMsg.id === msg.id) {
        setSelectedMsg((prev) => ({ ...prev, status: "Read" }));
      }
    } else {
      markMessageAsUnread(msg.id);
      if (selectedMsg && selectedMsg.id === msg.id) {
        setSelectedMsg((prev) => ({ ...prev, status: "New" }));
      }
    }
  };

  const handleArchive = (id) => {
    archiveMessage(id);
    if (selectedMsg && selectedMsg.id === id) {
      setSelectedMsg((prev) => ({ ...prev, status: "Archived" }));
    }
  };

  const handleDelete = (id) => {
    deleteMessage(id);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    if (selectedMsg && selectedMsg.id === id) {
      setSelectedMsg(null);
    }
    setConfirmDeleteId(null);
  };

  // Submit Reply
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    replyToMessage(selectedMsg.id, replyText.trim());
    setSelectedMsg((prev) => ({
      ...prev,
      status: "Replied",
      replyText: replyText.trim()
    }));
    setReplyText("");
    setShowReplyForm(false);
  };

  // Bulk Actions
  const handleBulkStatus = (status) => {
    bulkUpdateMessagesStatus(selectedIds, status);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) {
      bulkDeleteMessages(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="admin-view-container messages-view-root">
      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Messages</h1>
          <p className="admin-page-subtitle">
            View, track, and reply to client inquiries, dealership proposals, and support questions.
          </p>
        </div>
      </div>

      {/* Sticky Action Header */}
      <div className="admin-sticky-action-bar">
        {/* ── Tabs Navigation ── */}
        <div className="messages-tabs-nav" style={{ margin: 0 }}>
          {[
            { key: "All", label: "All Inbox", count: stats.total },
            { key: "New", label: "New Inquiries", count: stats.new },
            { key: "Read", label: "Read Messages", count: stats.read },
            { key: "Replied", label: "Replied", count: stats.replied },
            { key: "Archived", label: "Archived", count: stats.archived }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`messages-tab-btn ${activeTab === tab.key ? "is-active" : ""}`}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedIds([]);
              }}
            >
              <span>{tab.label}</span>
              <span className="messages-tab-badge">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── Toolbar: Search ── */}
        <div className="widget-card messages-toolbar">
          <div className="messages-search-wrap">
            <i className="pi pi-search messages-search-icon" />
            <input
              type="text"
              className="messages-search-input"
              placeholder="Search by sender, email, mobile, subject, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="messages-search-clear" onClick={() => setSearch("")}>
                <i className="pi pi-times" />
              </button>
            )}
          </div>
          <span className="messages-showing-lbl">
            Showing <strong>{filteredMessages.length}</strong> of {messages.length} inquiries
          </span>
        </div>

        {/* ── Bulk Actions Block ── */}
        {selectedIds.length > 0 && (
          <div className="messages-bulk-actions" style={{ margin: 0 }}>
            <div className="bulk-selection-info">
              <i className="pi pi-check-square" />
              <span>{selectedIds.length} message(s) selected</span>
            </div>
            <div className="bulk-buttons">
              <button className="bulk-btn mark-read" onClick={() => handleBulkStatus("Read")}>
                <i className="pi pi-envelope-open mr-1" /> Mark Read
              </button>
              <button className="bulk-btn mark-unread" onClick={() => handleBulkStatus("New")}>
                <i className="pi pi-envelope mr-1" /> Mark Unread
              </button>
              <button className="bulk-btn archive" onClick={() => handleBulkStatus("Archived")}>
                <i className="pi pi-paperclip mr-1" /> Archive
              </button>
              <button className="bulk-btn delete" onClick={handleBulkDelete}>
                <i className="pi pi-trash mr-1" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Messages Directory Table ── */}
      <div className="widget-card messages-table-card">
        <div className="messages-table-header">
          <h3 className="messages-table-title">
            <i className="pi pi-envelope mr-2 text-red" />
            {activeTab === "All" ? "All Inbox" : `${activeTab} Inquiries`}
          </h3>
        </div>

        <div className="widget-body table-responsive">
          {filteredMessages.length === 0 ? (
            <div className="messages-empty-state">
              <i className="pi pi-envelope-open messages-empty-icon" />
              <h3>No contact messages available</h3>
              <p>No messages found in this folder filter.</p>
            </div>
          ) : (
            <table className="admin-table messages-table">
              <thead>
                <tr>
                  <th style={{ width: "40px", paddingRight: "0" }}>
                    <input
                      type="checkbox"
                      className="messages-checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("id")}>
                    Message ID <SortIcon col="id" />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("customerName")}>
                    Sender <SortIcon col="customerName" />
                  </th>
                  <th>Contact Information</th>
                  <th>Subject Line</th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("date")}>
                    Received Date <SortIcon col="date" />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                    Status <SortIcon col="status" />
                  </th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((m) => {
                  const isChecked = selectedIds.includes(m.id);
                  const isUnread = m.status === "New";
                  return (
                    <tr
                      key={m.id}
                      className={`${isChecked ? "selected-row" : ""} ${
                        isUnread ? "unread-message-row" : ""
                      }`}
                      onClick={(e) => handleRowClick(e, m)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ paddingRight: "0" }}>
                        <input
                          type="checkbox"
                          className="messages-checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectRow(m.id)}
                        />
                      </td>
                      <td>
                        <span className="messages-id-tag">{m.id}</span>
                      </td>
                      <td>
                        <strong className="messages-sender-name">{m.customerName}</strong>
                        {isUnread && <span className="new-badge-dot" />}
                      </td>
                      <td>
                        <div className="messages-contact-cell">
                          <span className="mobile-txt">{m.mobile}</span>
                          <span className="email-txt">{m.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="messages-subject" title={m.subject}>
                          {m.subject.length > 40 ? `${m.subject.slice(0, 40)}...` : m.subject}
                        </span>
                      </td>
                      <td>{m.date}</td>
                      <td>
                        <MessageStatusBadge status={m.status} />
                      </td>
                      <td className="text-right">
                        <button
                          className="table-row-action"
                          title="Open Message"
                          onClick={() => handleViewMessage(m)}
                        >
                          <i className="pi pi-envelope-open" />
                        </button>
                        <button
                          className="table-row-action"
                          title={isUnread ? "Mark as Read" : "Mark as Unread"}
                          onClick={() => handleToggleReadStatus(m)}
                        >
                          <i className={`pi ${isUnread ? "pi-eye" : "pi-eye-slash"}`} />
                        </button>
                        {m.status !== "Archived" && (
                          <button
                            className="table-row-action"
                            title="Archive Message"
                            onClick={() => handleArchive(m.id)}
                          >
                            <i className="pi pi-paperclip" />
                          </button>
                        )}
                        <button
                          className="table-row-action text-danger"
                          title="Delete Message"
                          onClick={() => setConfirmDeleteId(m.id)}
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

      {/* ── Message Details Drawer ── */}
      {selectedMsg && (
        <div className="messages-drawer-overlay" onClick={() => setSelectedMsg(null)}>
          <div className="messages-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="messages-drawer-hdr">
              <div>
                <h2>Message Details</h2>
                <span className="messages-drawer-sub">ID: {selectedMsg.id}</span>
              </div>
              <button className="messages-drawer-close" onClick={() => setSelectedMsg(null)}>
                <i className="pi pi-times" />
              </button>
            </div>

            <div className="messages-drawer-body">
              {/* Sender Details */}
              <div className="messages-drawer-section">
                <h3>Sender Information</h3>
                <div className="messages-meta-card">
                  <div className="meta-row">
                    <span>Sender Name</span>
                    <strong>{selectedMsg.customerName}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Mobile Number</span>
                    <strong>{selectedMsg.mobile}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Email Address</span>
                    <strong>{selectedMsg.email}</strong>
                  </div>
                </div>
              </div>

              {/* Message Header details */}
              <div className="messages-drawer-section">
                <h3>Inquiry Metadata</h3>
                <div className="messages-meta-card">
                  <div className="meta-row">
                    <span>Subject Header</span>
                    <strong style={{ textAlign: "right" }}>{selectedMsg.subject}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Received Date</span>
                    <strong>{selectedMsg.date}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Current Status</span>
                    <MessageStatusBadge status={selectedMsg.status} />
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="messages-drawer-section">
                <h3>Message Content</h3>
                <div className="messages-body-card">
                  <p className="full-message-body">{selectedMsg.message}</p>
                </div>
              </div>

              {/* Reply Log history */}
              {selectedMsg.replyText && (
                <div className="messages-drawer-section">
                  <h3>Admin Response History</h3>
                  <div className="messages-reply-history-card">
                    <div className="history-hdr">
                      <span><i className="pi pi-user mr-1" /> Admin Agent</span>
                      <span>Replied Date: Just Now</span>
                    </div>
                    <p className="reply-content-txt">{selectedMsg.replyText}</p>
                  </div>
                </div>
              )}

              {/* Quick Moderator actions */}
              <div className="messages-drawer-section">
                <h3>Quick Controls</h3>
                <div className="messages-drawer-actions">
                  <button
                    className="drawer-action-btn toggle-read"
                    onClick={() => handleToggleReadStatus(selectedMsg)}
                  >
                    <i className={`pi ${selectedMsg.status === "New" ? "pi-eye" : "pi-eye-slash"} mr-2`} />
                    {selectedMsg.status === "New" ? "Mark as Read" : "Mark as Unread"}
                  </button>
                  {selectedMsg.status !== "Archived" && (
                    <button
                      className="drawer-action-btn archive"
                      onClick={() => handleArchive(selectedMsg.id)}
                    >
                      <i className="pi pi-paperclip mr-2" /> Archive Inbox
                    </button>
                  )}
                  {!selectedMsg.replyText && (
                    <button
                      className={`drawer-action-btn reply ${showReplyForm ? "active" : ""}`}
                      onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                      <i className="pi pi-reply mr-2" /> Reply Message
                    </button>
                  )}
                  <button
                    className="drawer-action-btn delete"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this message?")) {
                        handleDelete(selectedMsg.id);
                      }
                    }}
                  >
                    <i className="pi pi-trash mr-2" /> Delete Message
                  </button>
                </div>
              </div>

              {/* Reply Form Block inside drawer */}
              {showReplyForm && (
                <div className="messages-reply-form-section">
                  <h3>Compose Response</h3>
                  <form onSubmit={handleSendReply} className="reply-form">
                    <textarea
                      placeholder="Write your email/SMS response here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      className="reply-textarea"
                    />
                    <div className="reply-form-btns">
                      <button
                        type="button"
                        className="reply-btn-cancel"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyText("");
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="reply-btn-submit">
                        <i className="pi pi-send mr-2" /> Send Response
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Single Delete Modal ── */}
      {confirmDeleteId && (
        <div className="messages-modal-overlay">
          <div className="messages-modal">
            <div className="messages-modal-icon">
              <i className="pi pi-exclamation-triangle" />
            </div>
            <h3>Delete Message?</h3>
            <p>
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="messages-modal-actions">
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

export default ContactMessagesView;
