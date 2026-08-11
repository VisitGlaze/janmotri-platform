import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAdminStore } from "../../shared/useAdminStore";
import { useAuthStore } from "../../shared/useAuthStore";
import "./Header.scss";

// Route name mapping for breadcrumbs
const routeNames = {
  admin: "Admin",
  orders: "Orders Management",
  products: "Products Catalog",
  inventory: "Inventory Tracking",
  batches: "Batch Management",
  "pay-later": "Pay Later Accounts",
  customers: "Customers Base",
  reviews: "Reviews & Testimonials",
  messages: "Contact Messages",
  media: "Media Library",
  content: "Content Editor",
  reports: "Reports & Analytics",
  notifications: "Notifications Center",
  settings: "System Settings"
};

const Header = ({ collapsed, onToggleSidebar, onToggleMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { logoutAdmin, adminProfile } = useAuthStore();

  // Fetch reviews & messages from useAdminStore for dynamic badge counts
  const reviews = useAdminStore((state) => state.reviews);
  const messages = useAdminStore((state) => state.messages);

  const pendingReviews = reviews.filter((r) => r.status === "Pending");
  const newMessages = messages.filter((m) => m.status === "New");
  const totalUnread = pendingReviews.length + newMessages.length;

  // Combine notifications
  const alertsList = [
    ...newMessages.map((m) => ({
      id: m.id,
      text: `New Inquiry: ${m.subject}`,
      time: m.date,
      icon: "pi-envelope",
      colorClass: "text-blue",
      link: "/admin/messages"
    })),
    ...pendingReviews.map((r) => ({
      id: r.id,
      text: `Pending Review: ${r.customerName} (${r.rating}★)`,
      time: r.date,
      icon: "pi-star",
      colorClass: "text-amber",
      link: "/admin/reviews"
    }))
  ];

  // Parse path segments to generate dynamic breadcrumbs
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <header className="admin-header">
      {/* Left side actions: Sidebar toggle + Breadcrumbs */}
      <div className="header-left-pane">
        {/* Toggle Sidebar controls (Desktop) */}
        <button className="sidebar-toggle-btn desktop-only" onClick={onToggleSidebar}>
          <i className={`pi ${collapsed ? "pi-align-left" : "pi-align-right"}`}></i>
        </button>

        {/* Toggle Sidebar controls (Mobile) */}
        <button className="sidebar-toggle-btn mobile-only" onClick={onToggleMobile}>
          <i className="pi pi-bars"></i>
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="admin-breadcrumbs">
          {pathSegments.map((segment, idx) => {
            const url = `/${pathSegments.slice(0, idx + 1).join("/")}`;
            const isLast = idx === pathSegments.length - 1;
            const displayName = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="breadcrumb-divider">/</span>}
                {isLast ? (
                  <span className="breadcrumb-item active">{displayName}</span>
                ) : (
                  <Link to={url} className="breadcrumb-item link">{displayName}</Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Right side actions: Search, Alerts, Profile info */}
      <div className="header-right-pane">
        {/* Search Bar mockup */}
        <div className="header-search-bar">
          <i className="pi pi-search search-icon"></i>
          <input type="text" placeholder="Global search..." className="search-input" />
        </div>

        {/* Alert Notifications icon */}
        <div className="header-action-dropdown">
          <button className="header-icon-btn" onClick={() => setNotificationOpen(!notificationOpen)}>
            <i className="pi pi-bell"></i>
            {totalUnread > 0 && <span className="notification-badge">{totalUnread}</span>}
          </button>

          {notificationOpen && (
            <>
              <div className="dropdown-overlay-backer" onClick={() => setNotificationOpen(false)}></div>
              <div className="header-dropdown-menu notification-menu">
                <div className="dropdown-menu-header">
                  <h4>Alerts Center</h4>
                  <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>{totalUnread} Action Items</span>
                </div>
                <ul className="dropdown-list">
                  {alertsList.length === 0 ? (
                    <li className="dropdown-list-item" style={{ justifyContent: "center", color: "#94a3b8", padding: "16px 0", fontSize: "0.82rem" }}>
                      No new alerts
                    </li>
                  ) : (
                    alertsList.map((alert) => (
                      <li key={alert.id} className="dropdown-list-item unread">
                        <Link to={alert.link} style={{ display: "flex", width: "100%", textDecoration: "none", color: "inherit" }} onClick={() => setNotificationOpen(false)}>
                          <i className={`pi ${alert.icon} ${alert.colorClass} mr-3`} style={{ marginTop: "3px" }}></i>
                          <div>
                            <p className="item-text" style={{ fontSize: "0.82rem", margin: 0, fontWeight: 600 }}>{alert.text}</p>
                            <span className="item-time" style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{alert.time}</span>
                          </div>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar click dropdown */}
        <div className="header-action-dropdown">
          <div className="user-profile-widget" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="user-avatar">
              <i className="pi pi-user"></i>
            </div>
            <div className="user-info desktop-only">
              <span className="user-name">{adminProfile?.name || "Janmotri Admin"}</span>
              <span className="user-role">Super Admin</span>
            </div>
            <i className="pi pi-chevron-down ml-2 arrow-icon"></i>
          </div>

          {profileOpen && (
            <>
              <div className="dropdown-overlay-backer" onClick={() => setProfileOpen(false)}></div>
              <div className="header-dropdown-menu profile-menu">
                <div className="dropdown-menu-header user-header">
                  <div className="user-avatar-large">
                    <i className="pi pi-user"></i>
                  </div>
                  <h4>{adminProfile?.name || "Janmotri Admin"}</h4>
                  <p>{adminProfile?.email || "admin@janmotrioil.com"}</p>
                </div>
                <ul className="dropdown-list">
                  <li className="dropdown-list-item">
                    <Link to="/admin/settings" onClick={() => setProfileOpen(false)} className="dropdown-link-item">
                      <i className="pi pi-cog mr-3"></i> Profile Settings
                    </Link>
                  </li>
                  <li className="dropdown-list-item">
                    <a href="#/profile" onClick={() => setProfileOpen(false)} className="dropdown-link-item">
                      <i className="pi pi-home mr-3"></i> Visit Main Website
                    </a>
                  </li>
                  <li className="dropdown-divider-line"></li>
                  <li className="dropdown-list-item text-danger">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logoutAdmin();
                        navigate("/");
                      }}
                      className="dropdown-link-item text-danger"
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                        padding: 0,
                        cursor: "pointer",
                        font: "inherit",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <i className="pi pi-sign-out mr-3"></i> Logout Account
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
