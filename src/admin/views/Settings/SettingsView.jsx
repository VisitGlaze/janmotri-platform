import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAdminStore } from "../../../shared/useAdminStore";
import { useAuthStore } from "../../../shared/useAuthStore";
import "./SettingsView.scss";

const SettingsView = () => {
  const companyDetails = useAdminStore((state) => state.companyDetails);
  const updateCompanyDetails = useAdminStore((state) => state.updateCompanyDetails);

  const { adminProfile, adminToken, updateLocalAdminProfile, logoutAdmin } = useAuthStore();

  // Profile Form States
  const [adminName, setAdminName] = useState(adminProfile?.name || "");
  const [adminEmail, setAdminEmail] = useState(adminProfile?.email || "");
  const [profileSavedMsg, setProfileSavedMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  useEffect(() => {
    if (adminProfile) {
      setAdminName(adminProfile.name || "");
      setAdminEmail(adminProfile.email || "");
    }
  }, [adminProfile]);

  // Company Details Form States
  const [brandName, setBrandName] = useState(companyDetails.brandName);
  const [supportEmail, setSupportEmail] = useState(companyDetails.email);
  const [supportPhone, setSupportPhone] = useState(companyDetails.phone);
  const [companyAddress, setCompanyAddress] = useState(companyDetails.address);
  const [gstin, setGstin] = useState(companyDetails.gstin);
  const [companySavedMsg, setCompanySavedMsg] = useState("");

  // Change Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  // Handlers
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSavedMsg("");
    setProfileErr("");

    try {
      const res = await axios.put("/api/admin/profile", {
        name: adminName,
        email: adminEmail,
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.data.success) {
        updateLocalAdminProfile(res.data.admin);
        setProfileSavedMsg("Admin profile updated successfully!");
        setTimeout(() => setProfileSavedMsg(""), 3000);
      }
    } catch (err) {
      setProfileErr(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    updateCompanyDetails({
      brandName,
      email: supportEmail,
      phone: supportPhone,
      address: companyAddress,
      gstin: gstin.toUpperCase()
    });
    setCompanySavedMsg("Company details saved successfully!");
    setTimeout(() => setCompanySavedMsg(""), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordErr("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordErr("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErr("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordErr("New password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await axios.post("/api/admin/change-password", {
        currentPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.data.success) {
        setPasswordMsg("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordMsg(""), 3000);
      }
    } catch (err) {
      setPasswordErr(err.response?.data?.message || "Failed to change password.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout from the Janmotri Admin Panel?")) {
      logoutAdmin();
      window.location.href = "#/admin/login";
    }
  };

  return (
    <div className="admin-view-container settings-root">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">General Settings</h1>
          <p className="admin-page-subtitle">Configure administrative users, company invoice headers, and change profile access credentials.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Left Column: Profile & Company Details */}
        <div className="settings-col">
          {/* Admin Profile Details */}
          <div className="widget-card settings-card">
            <div className="settings-card-hdr">
              <i className="pi pi-user" />
              <span>Admin Profile Details</span>
            </div>
            <form onSubmit={handleProfileSubmit} className="settings-form">
              <div className="form-group">
                <label>Admin Name</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Login Email Address</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>
              {profileSavedMsg && <span className="save-success-msg"><i className="pi pi-check-circle mr-1" />{profileSavedMsg}</span>}
              {profileErr && <span className="save-error-msg"><i className="pi pi-exclamation-triangle mr-1" />{profileErr}</span>}
              <button type="submit" className="settings-submit-btn">
                <i className="pi pi-save mr-2" /> Save Profile
              </button>
            </form>
          </div>

          {/* Company details */}
          <div className="widget-card settings-card">
            <div className="settings-card-hdr">
              <i className="pi pi-briefcase" />
              <span>Company &amp; Invoice Settings</span>
            </div>
            <form onSubmit={handleCompanySubmit} className="settings-form">
              <div className="form-group">
                <label>Store Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Support Email Address</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Support Phone Number</label>
                <input
                  type="text"
                  required
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Physical Address (Invoice Header)</label>
                <textarea
                  required
                  rows="3"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="settings-textarea"
                />
              </div>
              <div className="form-group">
                <label>GSTIN Number</label>
                <input
                  type="text"
                  required
                  style={{ textTransform: "uppercase" }}
                  placeholder="e.g. 24AAAAC1234A1Z1"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </div>
              {companySavedMsg && <span className="save-success-msg"><i className="pi pi-check-circle mr-1" />{companySavedMsg}</span>}
              <button type="submit" className="settings-submit-btn">
                <i className="pi pi-save mr-2" /> Save Company Details
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Password & Logout */}
        <div className="settings-col">
          {/* Change Password */}
          <div className="widget-card settings-card">
            <div className="settings-card-hdr">
              <i className="pi pi-lock" />
              <span>Change Password</span>
            </div>
            <form onSubmit={handlePasswordSubmit} className="settings-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {passwordMsg && <span className="save-success-msg"><i className="pi pi-check-circle mr-1" />{passwordMsg}</span>}
              {passwordErr && <span className="save-error-msg"><i className="pi pi-exclamation-triangle mr-1" />{passwordErr}</span>}
              <button type="submit" className="settings-submit-btn">
                <i className="pi pi-key mr-2" /> Change Password
              </button>
            </form>
          </div>

          {/* Logout card */}
          <div className="widget-card settings-card logout-card">
            <div className="settings-card-hdr">
              <i className="pi pi-sign-out text-danger" />
              <span>Session Management</span>
            </div>
            <div className="logout-body">
              <p>Exit the administration console. Unsaved configuration changes in other modules will remain saved in local Zustand state cache.</p>
              <button type="button" className="settings-logout-btn" onClick={handleLogout}>
                <i className="pi pi-sign-out mr-2" /> Logout Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
