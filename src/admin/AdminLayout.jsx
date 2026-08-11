import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./views/Dashboard/DashboardView";
import ProductsView from "./views/Products/ProductsView";
import InventoryView from "./views/Inventory/InventoryView";
import BatchManagementView from "./views/BatchManagement/BatchManagementView";
import OrdersView from "./views/Orders/OrdersView";
import PayLaterView from "./views/PayLater/PayLaterView";
import CustomersView from "./views/Customers/CustomersView";
import ReportsView from "./views/Reports/ReportsView";
import ReviewsView from "./views/Reviews/ReviewsView";
import ContactMessagesView from "./views/ContactMessages/ContactMessagesView";
import ContentView from "./views/Content/ContentView";
import SettingsView from "./views/Settings/SettingsView";
import {
  NotificationsView,
  AdminUsersView
} from "./views/Placeholders";
import MediaLibraryView from "./views/MediaLibrary/MediaLibraryView";
import AdminLogin from "./views/Login/AdminLogin";
import logoImg from "../assets/images/logo.png";
import { useAuthStore } from "../shared/useAuthStore";
import "./AdminLayout.scss";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const location = useLocation();
  const { isAdminLoggedIn, fetchAdminProfile } = useAuthStore();
  const isLoginPage = location.pathname === "/admin/login" || location.pathname === "/admin/login/";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminProfile();
    }
  }, [isAdminLoggedIn, fetchAdminProfile]);

  // Redirect and view isolation gating
  if (isLoginPage) {
    if (isAdminLoggedIn) {
      return <Navigate to="/admin" replace />;
    }
    return (
      <Routes>
        <Route path="login" element={<AdminLogin />} />
      </Routes>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isMobile) {
    return (
      <div className="admin-mobile-gate">
        <div className="gate-card">
          <img src={logoImg} alt="Janmotri Logo" className="gate-logo" />
          <h2>Access Restricted</h2>
          <p>Janmotri Admin Dashboard is available only on Desktop, Laptop and Tablet devices. Please use a larger screen to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-layout-frame ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar navigation drawer */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main viewport block */}
      <div className="admin-viewport">
        {/* Top bar control nav */}
        <Header
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
        />

        {/* Scrollable Content Pane */}
        <main className="admin-content-pane">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="products" element={<ProductsView />} />
            <Route path="inventory" element={<InventoryView />} />
            <Route path="batches" element={<BatchManagementView />} />
            <Route path="pay-later" element={<PayLaterView />} />
            <Route path="customers" element={<CustomersView />} />
            <Route path="reviews" element={<ReviewsView />} />
            <Route path="messages" element={<ContactMessagesView />} />
            <Route path="media" element={<MediaLibraryView />} />
            <Route path="content" element={<ContentView />} />
            <Route path="reports" element={<ReportsView />} />
            <Route path="notifications" element={<NotificationsView />} />
            <Route path="settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
