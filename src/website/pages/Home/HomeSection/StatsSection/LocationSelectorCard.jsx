import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../../../shared/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiChevronDown,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiTruck,
} from "react-icons/fi";
import "./LocationSelectorCard.scss";

// Extensible state & city dataset (future-ready for easy addition of new states/cities)
const LOCATION_DATA = [
  {
    id: "gujarat",
    name: {
      gu: "ગુજરાત",
      hi: "गुजरात",
      en: "Gujarat",
    },
    cities: [
      { id: "ahmedabad", name: { gu: "અમદાવાદ", hi: "अहमदाबाद", en: "Ahmedabad" }, available: true },
      { id: "surat", name: { gu: "સુરત", hi: "सूरत", en: "Surat" }, available: true },
      { id: "vadodara", name: { gu: "વડોદરા", hi: "वडोदरा", en: "Vadodara" }, available: true },
      { id: "anand", name: { gu: "આનંદ", hi: "आनंद", en: "Anand" }, available: true },
      { id: "nadiad", name: { gu: "નડિયાદ", hi: "नडियाद", en: "Nadiad" }, available: true },
      { id: "bhavnagar", name: { gu: "ભાવનગર", hi: "भावनगर", en: "Bhavnagar" }, available: true },
      { id: "tapi", name: { gu: "તાપી", hi: "तापी", en: "Tapi" }, available: true },
    ],
  },
];

const UI_TEXT = {
  headerTitle: {
    gu: "વિતરણ સ્થાન પસંદ કરો",
    hi: "वितरण स्थान चुनें",
    en: "Select Delivery Location",
  },
  headerSubtitle: {
    gu: "તમારા વિસ્તારમાં ઉપલબ્ધ સેવાઓ ચકાસો",
    hi: "अपने क्षेत्र में उपलब्ध सेवाओं की जांच करें",
    en: "Check service availability in your area",
  },
  stateLabel: {
    gu: "રાજ્ય",
    hi: "राज्य",
    en: "State",
  },
  statePlaceholder: {
    gu: "રાજ્ય પસંદ કરો",
    hi: "राज्य चुनें",
    en: "Select State",
  },
  cityLabel: {
    gu: "શહેર",
    hi: "शहर",
    en: "City",
  },
  cityPlaceholder: {
    gu: "શહેર પસંદ કરો",
    hi: "शहर चुनें",
    en: "Select City",
  },
  searchPlaceholder: {
    gu: "શહેર શોધો...",
    hi: "शहर खोजें...",
    en: "Search city...",
  },
  selectedHeader: {
    gu: "પસંદ કરેલ સ્થાન",
    hi: "चयनित स्थान",
    en: "Selected Location",
  },
  deliveryAvailable: {
    gu: "આ શહેરમાં હોમ ડિલિવરી ઉપલબ્ધ છે.",
    hi: "इस शहर में होम डिलीवरी उपलब्ध है।",
    en: "Home delivery available in this city.",
  },
  deliveryUnavailable: {
    gu: "હાલમાં આ વિસ્તારમાં સેવા ઉપલબ્ધ નથી.",
    hi: "हाल में इस क्षेत्र में सेवा उपलब्ध नहीं है।",
    en: "Service currently unavailable in this area.",
  },
  noCityFound: {
    gu: "કોઈ શહેર મળ્યું નથી",
    hi: "कोई शहर नहीं मिला",
    en: "No city found",
  },
};

export default function LocationSelectorCard() {
  const { language } = useLanguage();
  const langKey = language === "hi" ? "hi" : language === "en" ? "en" : "gu";

  const [selectedState, setSelectedState] = useState(LOCATION_DATA[0]); // Gujarat pre-selected for best UX
  const [selectedCity, setSelectedCity] = useState(null);

  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const stateMenuRef = useRef(null);
  const cityMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdowns on outside click or Esc key press
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stateMenuRef.current && !stateMenuRef.current.contains(e.target)) {
        setIsStateOpen(false);
      }
      if (cityMenuRef.current && !cityMenuRef.current.contains(e.target)) {
        setIsCityOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsStateOpen(false);
        setIsCityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-focus search input when city dropdown opens
  useEffect(() => {
    if (isCityOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isCityOpen]);

  const handleStateSelect = (stateObj) => {
    setSelectedState(stateObj);
    setSelectedCity(null);
    setIsStateOpen(false);
    setSearchQuery("");
  };

  const handleCitySelect = (cityObj) => {
    setSelectedCity(cityObj);
    setIsCityOpen(false);
    setSearchQuery("");
  };

  // Filter cities by search query
  const filteredCities = (selectedState?.cities || []).filter((city) => {
    const cityName = city.name[langKey] || city.name.gu;
    return cityName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="loc-selector-card">
      {/* Background Decorative Accent */}
      <div className="loc-card-glow" aria-hidden="true" />

      {/* Card Header */}
      <div className="loc-card-header">
        <div className="loc-header-badge">
          <FiMapPin className="loc-pin-icon" />
        </div>
        <div>
          <h3 className="loc-header-title">
            {UI_TEXT.headerTitle[langKey]}
          </h3>
          <p className="loc-header-subtitle">
            {UI_TEXT.headerSubtitle[langKey]}
          </p>
        </div>
      </div>

      {/* Dropdown Controls Container */}
      <div className="loc-controls-grid">
        {/* STATE DROPDOWN */}
        <div className="loc-field-group" ref={stateMenuRef}>
          <label className="loc-field-label">
            {UI_TEXT.stateLabel[langKey]}
          </label>
          <button
            type="button"
            className={`loc-dropdown-btn ${isStateOpen ? "loc-dropdown-btn--active" : ""}`}
            onClick={() => {
              setIsStateOpen(!isStateOpen);
              setIsCityOpen(false);
            }}
            aria-expanded={isStateOpen}
            aria-haspopup="listbox"
          >
            <span className="loc-dropdown-val">
              {selectedState ? (selectedState.name[langKey] || selectedState.name.gu) : UI_TEXT.statePlaceholder[langKey]}
            </span>
            <FiChevronDown className={`loc-chevron ${isStateOpen ? "loc-chevron--open" : ""}`} />
          </button>

          <AnimatePresence>
            {isStateOpen && (
              <motion.ul
                className="loc-dropdown-menu"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                role="listbox"
              >
                {LOCATION_DATA.map((st) => (
                  <li
                    key={st.id}
                    className={`loc-menu-item ${selectedState?.id === st.id ? "loc-menu-item--selected" : ""}`}
                    onClick={() => handleStateSelect(st)}
                    role="option"
                    aria-selected={selectedState?.id === st.id}
                  >
                    <span>{st.name[langKey] || st.name.gu}</span>
                    {selectedState?.id === st.id && <FiCheckCircle className="loc-check-icon" />}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* CITY DROPDOWN (Disabled until State is selected) */}
        <div className="loc-field-group" ref={cityMenuRef}>
          <label className="loc-field-label">
            {UI_TEXT.cityLabel[langKey]}
          </label>
          <button
            type="button"
            className={`loc-dropdown-btn ${!selectedState ? "loc-dropdown-btn--disabled" : ""} ${isCityOpen ? "loc-dropdown-btn--active" : ""}`}
            disabled={!selectedState}
            onClick={() => {
              if (selectedState) {
                setIsCityOpen(!isCityOpen);
                setIsStateOpen(false);
              }
            }}
            aria-expanded={isCityOpen}
            aria-haspopup="listbox"
          >
            <span className={`loc-dropdown-val ${!selectedCity ? "loc-dropdown-val--placeholder" : ""}`}>
              {selectedCity ? (selectedCity.name[langKey] || selectedCity.name.gu) : UI_TEXT.cityPlaceholder[langKey]}
            </span>
            <FiChevronDown className={`loc-chevron ${isCityOpen ? "loc-chevron--open" : ""}`} />
          </button>

          <AnimatePresence>
            {isCityOpen && selectedState && (
              <motion.div
                className="loc-dropdown-menu loc-dropdown-menu--searchable"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Search Box inside City Dropdown */}
                <div className="loc-search-box">
                  <FiSearch className="loc-search-icon" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="loc-search-input"
                    placeholder={UI_TEXT.searchPlaceholder[langKey]}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="loc-search-clear"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <FiX />
                    </button>
                  )}
                </div>

                {/* Cities List */}
                <ul className="loc-cities-list" role="listbox">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((ct) => (
                      <li
                        key={ct.id}
                        className={`loc-menu-item ${selectedCity?.id === ct.id ? "loc-menu-item--selected" : ""}`}
                        onClick={() => handleCitySelect(ct)}
                        role="option"
                        aria-selected={selectedCity?.id === ct.id}
                      >
                        <span>{ct.name[langKey] || ct.name.gu}</span>
                        {selectedCity?.id === ct.id && <FiCheckCircle className="loc-check-icon" />}
                      </li>
                    ))
                  ) : (
                    <li className="loc-no-results">
                      {UI_TEXT.noCityFound[langKey]}
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SELECTED LOCATION INFO CARD */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            className="loc-result-card"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="loc-result-header">
              <span className="loc-result-pin">
                <FiMapPin />
              </span>
              <div>
                <span className="loc-result-eyebrow">{UI_TEXT.selectedHeader[langKey]}</span>
                <h4 className="loc-result-place">
                  {(selectedState?.name[langKey] || selectedState?.name.gu)}, {(selectedCity.name[langKey] || selectedCity.name.gu)}
                </h4>
              </div>
            </div>

            {selectedCity.available ? (
              <div className="loc-status-pill loc-status-pill--success">
                <FiTruck className="loc-status-icon" />
                <span>{UI_TEXT.deliveryAvailable[langKey]}</span>
              </div>
            ) : (
              <div className="loc-status-pill loc-status-pill--warning">
                <FiAlertCircle className="loc-status-icon" />
                <span>{UI_TEXT.deliveryUnavailable[langKey]}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
