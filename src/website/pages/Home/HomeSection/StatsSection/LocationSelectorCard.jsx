import { useLanguage } from "../../../../../shared/LanguageContext";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import "./LocationSelectorCard.scss";

const CARD_DATA = {
  gu: {
    title: "ડિલિવરી ઉપલબ્ધ વિસ્તારો",
    state: "ગુજરાત",
    supportingText: "ગુજરાતમાં ડિલિવરી ઉપલબ્ધ છે",
    cities: ["વડોદરા", "આણંદ", "સુરત", "વાપી", "ભાવનગર", "અમદાવાદ", "નડિયાદ"],
  },
  en: {
    title: "Delivery Available Areas",
    state: "Gujarat",
    supportingText: "Delivery is available in Gujarat",
    cities: ["Vadodara", "Anand", "Surat", "Vapi", "Bhavnagar", "Ahmedabad", "Nadiad"],
  },
  hi: {
    title: "डिलीवरी उपलब्ध क्षेत्र",
    state: "गुजरात",
    supportingText: "गुजरात में डिलीवरी उपलब्ध है",
    cities: ["वडोदरा", "आणंद", "सूरत", "वापी", "भावनगर", "अहमदाबाद", "नडियाद"],
  },
};

export default function LocationSelectorCard() {
  const { language } = useLanguage();
  const langKey = language === "hi" ? "hi" : language === "en" ? "en" : "gu";
  const content = CARD_DATA[langKey];

  return (
    <div className="delivery-card">
      {/* Top Header Row with Location Pin Icon & Title */}
      <div className="delivery-card__header">
        <div className="delivery-card__icon-badge">
          <FiMapPin className="delivery-card__pin-icon" />
        </div>
        <h3 className="delivery-card__title">{content.title}</h3>
      </div>

      {/* Primary State Section */}
      <div className="delivery-card__state-block">
        <div className="delivery-card__state-row">
          <span className="delivery-card__state-name">{content.state}</span>
          <span className="delivery-card__active-badge">
            <span className="delivery-card__live-dot" />
            Active Area
          </span>
        </div>
        <p className="delivery-card__supporting-text">{content.supportingText}</p>
      </div>

      {/* Compact City Chips/Pills Grid */}
      <div className="delivery-card__cities-grid">
        {content.cities.map((city, idx) => (
          <div key={idx} className="delivery-card__city-chip">
            <FiCheckCircle className="delivery-card__chip-icon" />
            <span className="delivery-card__chip-text">{city}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
