import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../../shared/useAuthStore";
import logoImg from "../../../assets/images/logo.png";
import "./AdminLogin.scss";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuthStore();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          email: email.trim(),
          password,
        }
      );

      if (res.data.success) {
        loginAdmin(res.data.token, res.data.admin);
        navigate("/admin");
      } else {
        setErrorMsg(res.data.message || "Login failed.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong. Please check your connection.";
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card animate-fade-in">
        <div className="admin-login-header">
          <img src={logoImg} alt="Janmotri Logo" className="admin-logo" />
          <h1>Admin Portal</h1>
          <p>Access the Janmotri Groundnut Oil control panel</p>
        </div>

        {errorMsg && (
          <div className="admin-error-banner">
            <i className="pi pi-exclamation-triangle"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email">Email Address</label>
            <div className="admin-input-wrap">
              <i className="pi pi-envelope"></i>
              <input
                type="email"
                id="admin-email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <i className="pi pi-lock"></i>
              <input
                type="password"
                id="admin-password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="admin-forgot-btn"
              onClick={() => alert("Please contact system administrator to reset password.")}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="pi pi-spin pi-spinner mr-2"></i>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {<div className="admin-credentials-tip">
          <i className="pi pi-info-circle"></i>
          <div>
            <strong>Super Admin Credentials:</strong>
            <p>Email: <code>admin@janmotri.com</code></p>
            <p>Password: <code>Glazevision@2026</code></p>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default AdminLogin;
