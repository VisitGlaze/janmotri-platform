import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

import logoImg from "../../assets/images/logo.png";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: "pi-home", end: true },
  { name: "Orders", path: "/admin/orders", icon: "pi-shopping-cart" },
  { name: "Products", path: "/admin/products", icon: "pi-box" },
  { name: "Inventory", path: "/admin/inventory", icon: "pi-database" },
  { name: "Batch Management", path: "/admin/batches", icon: "pi-list" },
  { name: "Pay Later", path: "/admin/pay-later", icon: "pi-credit-card" },
  { name: "Customers", path: "/admin/customers", icon: "pi-users" },
  { name: "Reviews", path: "/admin/reviews", icon: "pi-star" },
  { name: "Contact Messages", path: "/admin/messages", icon: "pi-envelope" },
  { name: "Media Library", path: "/admin/media", icon: "pi-images" },
  { name: "Content", path: "/admin/content", icon: "pi-file-edit" },
  { name: "Reports", path: "/admin/reports", icon: "pi-chart-bar" },
  { name: "Notifications", path: "/admin/notifications", icon: "pi-bell" },
  { name: "Settings", path: "/admin/settings", icon: "pi-cog" }
];

const Sidebar = ({ collapsed, mobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileOpen && (
        <div className="admin-sidebar-overlay" onClick={onCloseMobile}></div>
      )}

      <aside className={`admin-sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}>
        {/* Brand Logo Header */}
        <div className="sidebar-brand-header">
          <div className="brand-logo-wrap">
            <img src={logoImg} alt="Janmotri Logo" className="sidebar-brand-logo" />
            {!collapsed && <span className="brand-text">Admin</span>}
          </div>
        </div>

        {/* Scrollable Navigation Menu List */}
        <nav className="sidebar-nav-menu">
          <ul className="sidebar-menu-list">
            {menuItems.map((item, idx) => (
              <li key={idx} className="menu-list-item">
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? "is-active" : ""}`}
                  title={collapsed ? item.name : ""}
                >
                  <i className={`pi ${item.icon} nav-icon`}></i>
                  {!collapsed && <span className="nav-label">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer branding */}
        {!collapsed && (
          <div className="sidebar-footer">
            <p className="copyright-text">Janmotri Oil v1.0.0</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
