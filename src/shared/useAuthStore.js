import { create } from "zustand";
import axios from "axios";

// Helper to parse JSON safely
const parseJSON = (item) => {
  try {
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  // Customer authentication state (Persisted in localStorage)
  isLoggedIn: localStorage.getItem("janmotri_user_session") === "true",
  userMobile: localStorage.getItem("janmotri_user_mobile") || "",

  // Admin authentication state (Persisted in sessionStorage for security)
  isAdminLoggedIn: sessionStorage.getItem("janmotri_admin_session") === "true" && !!sessionStorage.getItem("janmotri_admin_token"),
  adminToken: sessionStorage.getItem("janmotri_admin_token") || null,
  adminProfile: parseJSON(sessionStorage.getItem("janmotri_admin_profile")),

  loginUser: (mobile) => {
    localStorage.setItem("janmotri_user_session", "true");
    localStorage.setItem("janmotri_user_mobile", mobile);
    localStorage.setItem("janmotri_lang", "en");
    set({ isLoggedIn: true, userMobile: mobile });
  },

  logoutUser: () => {
    localStorage.removeItem("janmotri_user_session");
    localStorage.removeItem("janmotri_user_mobile");
    set({ isLoggedIn: false, userMobile: "" });
  },

  loginAdmin: (token, admin) => {
    sessionStorage.setItem("janmotri_admin_session", "true");
    sessionStorage.setItem("janmotri_admin_token", token);
    sessionStorage.setItem("janmotri_admin_profile", JSON.stringify(admin));
    set({ isAdminLoggedIn: true, adminToken: token, adminProfile: admin });
  },

  logoutAdmin: () => {
    sessionStorage.removeItem("janmotri_admin_session");
    sessionStorage.removeItem("janmotri_admin_token");
    sessionStorage.removeItem("janmotri_admin_profile");
    set({ isAdminLoggedIn: false, adminToken: null, adminProfile: null });
  },

  // Fetch/Sync admin profile from backend
  fetchAdminProfile: async () => {
    const { adminToken } = get();
    if (!adminToken) return;

    try {
      const res = await axios.get("/api/admin/profile", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.data.success) {
        const profile = res.data.admin;
        sessionStorage.setItem("janmotri_admin_profile", JSON.stringify(profile));
        set({ adminProfile: profile });
      }
    } catch (err) {
      // If token is invalid or expired, log out automatically
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        get().logoutAdmin();
      }
    }
  },

  // Helper to update local profile state (e.g. after editing profile or changing password)
  updateLocalAdminProfile: (updatedProfile) => {
    const currentProfile = get().adminProfile || {};
    const newProfile = { ...currentProfile, ...updatedProfile };
    sessionStorage.setItem("janmotri_admin_profile", JSON.stringify(newProfile));
    set({ adminProfile: newProfile });
  }
}));
