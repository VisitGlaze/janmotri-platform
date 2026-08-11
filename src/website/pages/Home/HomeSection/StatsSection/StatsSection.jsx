import { useLanguage } from "../../../../../shared/LanguageContext";
import {
  FiCreditCard,
  FiTruck,
  FiUsers,
  FiMapPin,
  FiTrendingUp,
} from "react-icons/fi";
import "./StatsSection.scss";

const StatsSection = () => {
  const { t } = useLanguage();

  // Helper resolver to check both root "dashboard.*" and nested "home.dashboard.*" key paths
  const tr = (path, fallback) => {
    const direct = t(`dashboard.${path}`);
    if (direct && direct !== `dashboard.${path}`) return direct;

    const nested = t(`home.dashboard.${path}`);
    if (nested && nested !== `home.dashboard.${path}`) return nested;

    return fallback;
  };

  const rawCities = tr("deliveryAreas.cities", [
    "Vadodara",
    "Anand",
    "Surat",
    "Vapi",
    "Bhavnagar",
    "Ahmedabad",
    "Nadiad",
  ]);

  const safeCities = Array.isArray(rawCities)
    ? rawCities
    : ["Vadodara", "Anand", "Surat", "Vapi", "Bhavnagar", "Ahmedabad", "Nadiad"];

  return (
    <section className="stats-section">
      <div className="stats-container">

        {/* ── TOP SECTION (2-Column: ~66% Left Primary Card + ~34% Right Stacked Cards) ── */}
        <div className="stats-top-grid">

          {/* LEFT: Large Primary Total Sales Card */}
          <div className="stats-card stats-card--sales">
            <div className="stats-card__header">
              <div className="stats-card__icon-badge">
                <FiCreditCard className="stats-icon" />
              </div>
              <span className="stats-card__title">
                {tr("totalSales.title", "Total Sales")}
              </span>
            </div>
            <div className="stats-card__body">
              <h2 className="stats-card__number stats-card__number--hero">
                {tr("totalSales.value", "1,00,000+")}
              </h2>
              <p className="stats-card__desc">
                {tr(
                  "totalSales.description",
                  "Total sales generated through our trusted customers worldwide."
                )}
              </p>
            </div>
          </div>

          {/* RIGHT: Two Equal-Height Vertically Stacked Cards */}
          <div className="stats-top-stack">

            {/* Card 1: Deliveries */}
            <div className="stats-card stats-card--stacked">
              <div className="stats-card__header">
                <div className="stats-card__icon-badge">
                  <FiTruck className="stats-icon" />
                </div>
                <span className="stats-card__title">
                  {tr("delivery.title", "Deliveries")}
                </span>
              </div>
              <div className="stats-card__body">
                <h3 className="stats-card__number">
                  {tr("delivery.value", "52,000+")}
                </h3>
                <p className="stats-card__desc">
                  {tr("delivery.description", "Successfully delivered orders.")}
                </p>
              </div>
            </div>

            {/* Card 2: Happy Customers */}
            <div className="stats-card stats-card--stacked">
              <div className="stats-card__header">
                <div className="stats-card__icon-badge">
                  <FiUsers className="stats-icon" />
                </div>
                <span className="stats-card__title">
                  {tr("happyCustomers.title", "Happy Customers")}
                </span>
              </div>
              <div className="stats-card__body">
                <h3 className="stats-card__number">
                  {tr("happyCustomers.value", "48,000+")}
                </h3>
                <p className="stats-card__desc">
                  {tr("happyCustomers.description", "Our trusted and satisfied customers.")}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── BOTTOM SECTION (3 Equal-Height, Equal-Width Cards in 1 Row) ── */}
        <div className="stats-bottom-grid">

          {/* Bottom Card 1: Delivery Available Areas (Simplified without check icons & without Active badge) */}
          <div className="stats-card stats-card--bottom">
            <div className="stats-card__header">
              <div className="stats-card__icon-badge">
                <FiMapPin className="stats-icon" />
              </div>
              <div>
                <h3 className="stats-card__title">
                  {tr("deliveryAreas.title", "Delivery Available Areas")}
                </h3>
                <span className="stats-card__state-label">
                  {tr("deliveryAreas.state", "Gujarat")}
                </span>
              </div>
            </div>
            <p className="stats-card__desc stats-card__desc--state">
              {tr("deliveryAreas.availableText", "Delivery is available in Gujarat")}
            </p>
            {/* Clean location chips WITHOUT individual check icons */}
            <div className="stats-card__chips-row">
              {safeCities.map((city, idx) => (
                <span key={idx} className="stats-city-chip">
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Card 2: Distribution Centers */}
          <div className="stats-card stats-card--bottom">
            <div className="stats-card__header">
              <div className="stats-card__icon-badge">
                <FiMapPin className="stats-icon" />
              </div>
              <span className="stats-card__title">
                {tr("distributionCenters.title", "Distribution Centers")}
              </span>
            </div>
            <div className="stats-card__body">
              <h3 className="stats-card__number">
                {tr("distributionCenters.value", "200+")}
              </h3>
              <p className="stats-card__desc">
                {tr(
                  "distributionCenters.description",
                  "Our service centers near you."
                )}
              </p>
            </div>
          </div>

          {/* Bottom Card 3: Growing Business */}
          <div className="stats-card stats-card--bottom">
            <div className="stats-card__header">
              <div className="stats-card__icon-badge">
                <FiTrendingUp className="stats-icon" />
              </div>
              <span className="stats-card__title">
                {tr("growingBusiness.title", "Growing Business")}
              </span>
            </div>
            <div className="stats-card__body">
              <h3 className="stats-card__number">
                {tr("growingBusiness.value", "50,000+")}
              </h3>
              <p className="stats-card__desc">
                {tr(
                  "growingBusiness.description",
                  "Growing business and orders every day."
                )}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default StatsSection;