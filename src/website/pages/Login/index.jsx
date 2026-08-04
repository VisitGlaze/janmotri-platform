import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import { useLanguage } from "../../../shared/LanguageContext";
import { useAuthStore } from "../../../shared/useAuthStore";
import authBgImg from "../../../assets/images/Sign-In-Form-Desktop-Layout-Option 3.png";
import "./Login.scss";

// Inline SVG for Indian Flag
const IndiaFlagSVG = () => (
  <svg viewBox="0 0 900 600" className="flag-icon" style={{ width: "22px", height: "15px", display: "inline-block" }}>
    <rect width="900" height="200" fill="#FF9933" />
    <rect y="200" width="900" height="200" fill="#FFFFFF" />
    <rect y="400" width="900" height="200" fill="#138808" />
    <circle cx="450" cy="300" r="80" fill="none" stroke="#000080" strokeWidth="10" />
    <circle cx="450" cy="300" r="15" fill="#000080" />
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x2 = 450 + 80 * Math.sin(angle);
      const y2 = 300 - 80 * Math.cos(angle);
      return <line key={i} x1="450" y1="300" x2={x2} y2={y2} stroke="#000080" strokeWidth="4" />;
    })}
  </svg>
);

// Inline SVG for USA Flag
const UsaFlagSVG = () => (
  <svg viewBox="0 0 7410 3900" className="flag-icon" style={{ width: "22px", height: "15px", display: "inline-block" }}>
    <rect width="7410" height="3900" fill="#B22234" />
    <path d="M0 300h7410M0 900h7410M0 1500h7410M0 2100h7410M0 2700h7410M0 3300h7410" stroke="#FFFFFF" strokeWidth="300" />
    <rect width="2964" height="2100" fill="#3C3B6E" />
    <circle cx="500" cy="500" r="40" fill="#FFFFFF" />
    <circle cx="1000" cy="500" r="40" fill="#FFFFFF" />
    <circle cx="1500" cy="500" r="40" fill="#FFFFFF" />
    <circle cx="2000" cy="500" r="40" fill="#FFFFFF" />
    <circle cx="2500" cy="500" r="40" fill="#FFFFFF" />
    <circle cx="750" cy="1000" r="40" fill="#FFFFFF" />
    <circle cx="1250" cy="1000" r="40" fill="#FFFFFF" />
    <circle cx="1750" cy="1000" r="40" fill="#FFFFFF" />
    <circle cx="2250" cy="1000" r="40" fill="#FFFFFF" />
    <circle cx="500" cy="1500" r="40" fill="#FFFFFF" />
    <circle cx="1000" cy="1500" r="40" fill="#FFFFFF" />
    <circle cx="1500" cy="1500" r="40" fill="#FFFFFF" />
    <circle cx="2000" cy="1500" r="40" fill="#FFFFFF" />
    <circle cx="2500" cy="1500" r="40" fill="#FFFFFF" />
  </svg>
);

const Login = () => {
  const { t, getImage, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Auth state from global store
  const { isLoggedIn, loginUser } = useAuthStore();

  // Redirect users already authenticated
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Form states
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [flagDropdownOpen, setFlagDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+91",
    name: "India",
    flag: "IN"
  });

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFlagDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Countdown timer for resending OTP (30s as requested)
  useEffect(() => {
    let interval = null;
    if (isTimerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, countdown]);

  const startResendTimer = () => {
    setCountdown(30);
    setIsTimerActive(true);
  };

  const handleGetOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 8) {
      setStep(2);
      startResendTimer();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      const fullMobile = `${selectedCountry.code} ${phoneNumber}`;
      setLanguage("en");
      loginUser(fullMobile);
      navigate("/");
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input box if filled
    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Navigate backwards on Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const countries = [
    { code: "+91", name: "India", flag: "IN" },
    { code: "+1", name: "USA", flag: "US" }
  ];

  const logo = getImage("logo");

  return (
    <>
      <Navbar />
      <main
        className="login-page-container"
        style={{ backgroundImage: `url("${authBgImg}")` }}
      >
        <div className="login-page-overlay" />

        {/* Dynamic Entry Form Box (Glassmorphic) */}
        <div className="login-content-wrapper">
          <div className="glass-login-card">
            <img src={logo} alt="Janmotri Logo" className="login-card-logo" />

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step-mobile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <h1 className="login-card-title">
                    {t("login.welcomeBackHeading", "Welcome Back")}
                  </h1>
                  <p className="login-card-desc">
                    {t("login.welcomeBackDesc", "Sign in to access your Janmotri Groundnut Oil account")}
                  </p>

                  <form onSubmit={handleGetOtp}>
                    <div className="login-form-group">
                      <label className="login-input-label">
                        {t("login.mobileLabel", "Mobile Number")}
                      </label>
                      <div className="phone-input-wrapper">
                        <div
                          className="flag-dropdown"
                          ref={dropdownRef}
                          onClick={() => setFlagDropdownOpen(!flagDropdownOpen)}
                          style={{ position: "relative" }}
                        >
                          {selectedCountry.flag === "IN" ? <IndiaFlagSVG /> : <UsaFlagSVG />}
                          <span style={{ fontSize: "14px", fontWeight: "700", marginLeft: "4px" }}>
                            {selectedCountry.code}
                          </span>
                          <i className="pi pi-chevron-down flag-arrow"></i>

                          {flagDropdownOpen && (
                            <div className="flag-dropdown-menu">
                              {countries.map((c) => (
                                <div
                                  key={c.code}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCountry(c);
                                    setFlagDropdownOpen(false);
                                  }}
                                  className={`flag-dropdown-item ${selectedCountry.code === c.code ? "active" : ""}`}
                                >
                                  {c.flag === "IN" ? <IndiaFlagSVG /> : <UsaFlagSVG />}
                                  <span>
                                    {c.name} ({c.code})
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setPhoneNumber(val.slice(0, 10));
                          }}
                          placeholder={selectedCountry.code === "+91" ? "00000 00000" : "(555) 000-0000"}
                          className="phone-raw-input"
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="login-cta-btn" disabled={phoneNumber.length !== 10}>
                      <span>{t("login.sendOtp", "Send OTP")}</span>
                      <i className="pi pi-arrow-right"></i>
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="step-otp"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <h1 className="login-card-title">
                    {t("login.titleOtp", "OTP Verification")}
                  </h1>
                  <p className="otp-description">
                    {t("login.otpSentText", "We have sent a 4-digit code to your registered mobile number.")}
                  </p>

                  <form onSubmit={handleVerifyOtp}>
                    <div className="otp-inputs-grid-wrapper">
                      <div className="otp-inputs-grid">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={otpRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="otp-box-input"
                            maxLength={1}
                            required
                          />
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="login-cta-btn">
                      <span>{t("login.verify", "Verify")}</span>
                    </button>

                    <div className="timer-container">
                      {countdown > 0 ? (
                        <>
                          <i className="pi pi-refresh" style={{ animation: "spin 2s linear infinite", fontSize: "12px" }}></i>
                          <span>Resend OTP ({countdown}s)</span>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="resend-btn"
                          onClick={() => {
                            startResendTimer();
                          }}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
